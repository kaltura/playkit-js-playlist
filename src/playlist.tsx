import {h} from 'preact';
import {ui} from 'kaltura-player-js';
import {PlaylistConfig, PluginPositions, PluginStates} from './types';
import {PluginButton} from './components/plugin-button';
import {PlaylistWrapper} from './components/playlist-wrapper';
import {DataManager} from './data-manager';

const {SidePanelModes, SidePanelPositions, ReservedPresetNames} = ui;
const LIVE_PLUGIN_CLASSNAME = 'has-live-plugin-overlay';

export class Playlist extends KalturaPlayer.core.BasePlugin {
  private _player: KalturaPlayerTypes.Player;
  private _playlistPanel = null;
  private _pluginState: PluginStates | null = null;
  private _dataManager: DataManager;
  private _offlineSlateActive = false;
  private _unsubscribeStore: Function = () => {};

  static defaultConfig: PlaylistConfig = {
    position: SidePanelPositions.RIGHT,
    expandMode: SidePanelModes.ALONGSIDE,
    expandOnFirstPlay: true
  };

  constructor(name: string, player: KalturaPlayerTypes.Player, config: PlaylistConfig) {
    super(name, player, config);
    this._player = player;
    this._dataManager = new DataManager(this._player, this.logger);
    // subscribe on store changes
    this._unsubscribeStore = this._player.ui.store?.subscribe(() => {
      const state = this._player.ui.store.getState();
      if (this.hasPlaylist && state.shell.playerClasses.includes(LIVE_PLUGIN_CLASSNAME) && !this._offlineSlateActive) {
        this._offlineSlateActive = true;
        // deactivate all plugins
        // TODO: consider close plugins from Live repo;
        // TODO: open plugins (if expandOfFirstPlay set to true) only after this._player.ready() instead of this.ready (changes for all plugin repos);
        this.sidePanelsManager?.componentsRegistry?.forEach((plugin: {isActive: boolean}, key: number) => {
          if (plugin.isActive) {
            this.sidePanelsManager.deactivateItem(key);
          }
        });
        this._activetePlugin();
      }
    });
  }

  get sidePanelsManager() {
    return this.player.getService('sidePanelsManager') as any;
  }

  get hasPlaylist() {
    return this._player.playlist?.items?.length > 0;
  }

  loadMedia(): void {
    this._offlineSlateActive = false;
    if (!this.sidePanelsManager || this._playlistPanel || !this.hasPlaylist) {
      this.logger.warn('sidePanelsManager service is not registered or playlist empty');
      return;
    }

    const pluginMode: PluginPositions = [SidePanelPositions.RIGHT, SidePanelPositions.LEFT].includes(this.config.position)
      ? PluginPositions.VERTICAL
      : PluginPositions.HORIZONTAL;
    this._playlistPanel = this.sidePanelsManager.addItem({
      label: 'Playlist',
      panelComponent: () => {
        return (
          <PlaylistWrapper
            eventManager={this.eventManager}
            onClose={this._deactivatePlugin}
            player={this._player}
            pluginMode={pluginMode}
            playlistData={this._dataManager.getPlaylistData()}
          />
        );
      },
      iconComponent: ({isActive}: {isActive: boolean}) => {
        return (
          <PluginButton
            isActive={isActive}
            onClick={() => {
              if (this.sidePanelsManager.isItemActive(this._playlistPanel)) {
                this._pluginState = PluginStates.CLOSED;
              }
            }}
          />
        );
      },
      presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live, ReservedPresetNames.Ads],
      position: this.config.position,
      expandMode: this.config.expandMode === SidePanelModes.ALONGSIDE ? SidePanelModes.ALONGSIDE : SidePanelModes.OVER,
      onActivate: () => {
        this._pluginState = PluginStates.OPENED;
      }
    });

    if ((this.config.expandOnFirstPlay && !this._pluginState) || this._pluginState === PluginStates.OPENED) {
      this._activetePlugin();
    }
  }

  private _activetePlugin = () => {
    this.ready.then(() => {
      this.sidePanelsManager?.activateItem(this._playlistPanel);
    });
  };

  private _deactivatePlugin = () => {
    this.sidePanelsManager.deactivateItem(this._playlistPanel);
    this._pluginState = PluginStates.CLOSED;
  };

  static isValid(): boolean {
    return true;
  }

  reset(): void {}

  destroy(): void {
    this.eventManager.removeAll();
    this._playlistPanel = null;
    this._pluginState = null;
    this._unsubscribeStore();
    this._dataManager.destroy();
  }
}
