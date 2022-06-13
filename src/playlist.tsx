import {h} from 'preact';
import {PlaylistConfig, PluginPositions, PluginStates} from './types';
import {PluginButton} from './components/plugin-button';
import {PlaylistWrapper} from './components/playlist-wrapper';

// @ts-ignore
const {SidePanelModes, SidePanelPositions, ReservedPresetNames} = KalturaPlayer.ui;

export class Playlist extends KalturaPlayer.core.BasePlugin {
  private _player: KalturaPlayerTypes.Player;
  private _playlistPanel = null;
  private _pluginState: PluginStates | null = null;

  static defaultConfig: PlaylistConfig = {
    position: SidePanelPositions.RIGHT,
    expandMode: SidePanelModes.OVER,
    expandOnFirstPlay: true
  };

  constructor(name: string, player: KalturaPlayerTypes.Player, config: PlaylistConfig) {
    super(name, player, config);
    this._player = player;
  }

  get sidePanelsManager() {
    return this.player.getService('sidePanelsManager') as any;
  }

  loadMedia(): void {
    if (!this.sidePanelsManager || this._playlistPanel) {
      this.logger.warn('sidePanelsManager service is not registered');
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
            onClose={() => {
              this.sidePanelsManager.deactivateItem(this._playlistPanel);
              this._pluginState = PluginStates.CLOSED;
            }}
            player={this._player}
            pluginMode={pluginMode}
          />
        );
      },
      iconComponent: () => {
        return (
          <PluginButton
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
      expandMode: this.config.expandMode,
      onActivate: () => {
        this._pluginState = PluginStates.OPENED;
      }
    });
    if ((this.config.expandOnFirstPlay && !this._pluginState) || this._pluginState === PluginStates.OPENED) {
      // @ts-ignore
      this.ready.then(() => {
        this.sidePanelsManager.activateItem(this._playlistPanel);
      });
    }
  }

  static isValid(): boolean {
    return true;
  }
  reset(): void {
    this._playlistPanel = null;
  }

  destroy(): void {
    this._pluginState = null;
  }
}
