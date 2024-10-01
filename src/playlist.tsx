import {h} from 'preact';
// @ts-expect-error Module '"@playkit-js/kaltura-player-js"' has no exported member 'core'
import {ui, core} from '@playkit-js/kaltura-player-js';
import {OnClickEvent} from '@playkit-js/common/dist/hoc/a11y-wrapper';
import {UpperBarManager, SidePanelsManager} from '@playkit-js/ui-managers';
import {PlaylistConfig, PluginPositions, PluginStates} from './types';
import {PluginButton} from './components/plugin-button';
import {PlaylistWrapper} from './components/playlist-wrapper';
import {DataManager} from './data-manager';
import {icons} from './components/icons';
import {pluginName} from './index';
import {PlaylistEvents} from './events/events';

const {SidePanelModes, SidePanelPositions, ReservedPresetNames} = ui;
const {PLAYER_SIZE} = ui.Components;

export class Playlist extends KalturaPlayer.core.BasePlugin {
  private _player: KalturaPlayerTypes.Player;
  private _playlistPanel = -1;
  private _playlistIcon = -1;
  private _loaded = false;
  private _pluginState: PluginStates | null = null;
  private _dataManager: DataManager;
  private _offlineSlateActive = false;
  private pluginMode: PluginPositions | null = null;
  private _activePresetName = '';
  private _unsubscribeStore: Function = () => {};
  private _triggeredByKeyboard = false;
  private _pluginButtonRef: HTMLButtonElement | null = null;

  static defaultConfig: PlaylistConfig = {
    position: SidePanelPositions.RIGHT,
    expandMode: SidePanelModes.ALONGSIDE,
    expandOnFirstPlay: true,
    playNextOnError: true
  };

  constructor(name: string, player: KalturaPlayerTypes.Player, config: PlaylistConfig) {
    super(name, player, config);
    this._player = player;
    this._dataManager = new DataManager(this._player, this.logger);
    // subscribe on store changes
    this._unsubscribeStore = this.uiStore?.subscribe(() => {
      const {shell} = this.uiStore.getState();
      if (shell.playerClasses.includes('has-live-plugin-overlay') && !this._offlineSlateActive) {
        this._offlineSlateActive = true;
        this._activatePlugin();
      }
      if (this._activePresetName !== '' && this._activePresetName !== shell.activePresetName) {
        this._activePresetName = shell.activePresetName;
        // when switching from non-broadcasting live to VOD we need to toggle the plugin since the live plugin disables it
        this._deactivatePlugin();
        this._activatePlugin();
      } else if (this._activePresetName === '') {
        this._activePresetName = shell.activePresetName;
      }
      this._addSidePanel();
    });
    if (this.config.playNextOnError) {
      this.eventManager.listen(this.player, core.EventType.ERROR, this._handleError);
    }
  }

  get uiStore() {
    return this._player.ui.store;
  }

  get sidePanelsManager() {
    return this.player.getService('sidePanelsManager') as SidePanelsManager | undefined;
  }

  get upperBarManager() {
    return this.player.getService('upperBarManager') as UpperBarManager | undefined;
  }

  loadMedia(): void {
    this._offlineSlateActive = false;
    if (!this._isPlaylistValid()) {
      return;
    }

    this._loaded = true;
    this._addSidePanel();
    // add plugin button
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._playlistIcon = this.upperBarManager!.add({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ariaLabel: 'Playlist',
      displayName: 'Playlist',
      svgIcon: {path: icons.PLUGIN_ICON},
      onClick: this._handleClickOnPluginIcon,
      component: () => {
        return <PluginButton isActive={this._isPluginActive()} setRef={this._setPluginButtonRef} />;
      }
    }) as number;

    if ((this.config.expandOnFirstPlay && !this._pluginState) || this._pluginState === PluginStates.OPENED) {
      this._activatePlugin(true);
    }
  }

  private _addSidePanel() {
    if (!this._loaded) {
      return;
    }

    const pluginMode =
      [SidePanelPositions.RIGHT, SidePanelPositions.LEFT].includes(this.config.position) ||
      [PLAYER_SIZE?.SMALL, PLAYER_SIZE?.EXTRA_SMALL, PLAYER_SIZE?.TINY].includes(this._player.ui.store.getState().shell.playerSize)
        ? PluginPositions.VERTICAL
        : PluginPositions.HORIZONTAL;

    if (this.pluginMode === pluginMode) {
      return;
    }
    this.pluginMode = pluginMode;
    const isPluginActive = this._isPluginActive();

    this._playlistPanel = this.sidePanelsManager!.add({
      label: 'Playlist',
      panelComponent: () => {
        return (
          <PlaylistWrapper
            eventManager={this.eventManager}
            onClose={this._handleClose}
            player={this._player}
            pluginMode={pluginMode}
            playlistData={this._dataManager.getPlaylistData()}
            toggledByKeyboard={this._triggeredByKeyboard}
          />
        );
      },
      presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live, ReservedPresetNames.Ads],
      position: this.config.position,
      expandMode: this.config.expandMode === SidePanelModes.ALONGSIDE ? SidePanelModes.ALONGSIDE : SidePanelModes.OVER
    }) as number;

    if (isPluginActive) {
      this._activatePlugin(true);
    }
  }

  private _setPluginButtonRef = (ref: HTMLButtonElement) => {
    this._pluginButtonRef = ref;
  };

  private _handleClickOnPluginIcon = (e?: OnClickEvent, byKeyboard?: boolean) => {
    if (this._isPluginActive()) {
      this._deactivatePlugin();
    } else {
      this._triggeredByKeyboard = Boolean(byKeyboard);
      this._activatePlugin();
    }
  };

  private _isPlaylistValid = () => {
    if (!this.sidePanelsManager || !this.upperBarManager) {
      this.logger.warn('sidePanelsManager or upperBarManager service not registered');
      return false;
    }
    if (Math.max(this._playlistPanel, this._playlistIcon) > 0) {
      this.logger.warn('playlist plugin already initialized');
      return false;
    }
    if (!this._player.playlist?.items?.length) {
      this.logger.warn("playlist doesn't have playlist items");
      return false;
    }
    return true;
  };

  private _isPluginActive = () => {
    return this.sidePanelsManager!.isItemActive(this._playlistPanel);
  };

  private _handleClose = (e: OnClickEvent, byKeyboard: boolean) => {
    if (byKeyboard) {
      this._pluginButtonRef?.focus();
    }
    this._deactivatePlugin();
  };

  private _activatePlugin = (isFirstOpen = false) => {
    this.ready.then(() => {
      this.sidePanelsManager?.activateItem(this._playlistPanel);
      this._pluginState === PluginStates.OPENED;
      this.upperBarManager?.update(this._playlistIcon);
      this.dispatchEvent(PlaylistEvents.PLAYLIST_OPEN, {position: this.config.position, auto: isFirstOpen});
    });
  };

  private _deactivatePlugin = () => {
    this.ready.then(() => {
      this._triggeredByKeyboard = false;
      this.sidePanelsManager?.deactivateItem(this._playlistPanel);
      this._pluginState = PluginStates.CLOSED;
      this.upperBarManager?.update(this._playlistIcon);
      this.dispatchEvent(PlaylistEvents.PLAYLIST_CLOSE, {position: this.config.position});
    });
  };

  private _handleError = () => {
    this.player.playlist?.playNext();
  };

  static isValid(): boolean {
    return true;
  }

  reset(): void {}

  destroy(): void {
    this.eventManager.removeAll();
    this._playlistPanel = -1;
    this._playlistIcon = -1;
    this._loaded = false;
    this._pluginButtonRef = null;
    this._pluginState = null;
    this._triggeredByKeyboard = false;
    this._unsubscribeStore();
    this._dataManager.destroy();
  }
}
