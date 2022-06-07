import {h} from 'preact';
import {PlaylistConfig, PluginPositions} from './types';
import {PluginButton} from './components/plugin-button';
import {PlaylistWrapper} from './components/playlist-wrapper';

// @ts-ignore
const {SidePanelModes, SidePanelPositions, ReservedPresetNames} = KalturaPlayer.ui;

export class Playlist extends KalturaPlayer.core.BasePlugin {
  private _player: KalturaPlayerTypes.Player;
  private _playlistPanel = null;

  static defaultConfig: PlaylistConfig = {
    position: SidePanelPositions.RIGHT,
    expandMode: SidePanelModes.OVER,
    expandOnFirstPlay: true
  };

  constructor(name: string, player: KalturaPlayerTypes.Player, config: PlaylistConfig) {
    super(name, player, config);
    this._player = player;
  }

  loadMedia(): void {
    const sidePanelsManager: any = this.player.getService('sidePanelsManager');
    if (!sidePanelsManager) {
      this.logger.warn('sidePanelsManager service is not registered');
      return;
    }
    const pluginMode: PluginPositions = [SidePanelPositions.RIGHT, SidePanelPositions.LEFT].includes(this.config.position)
      ? PluginPositions.VERTICAL
      : PluginPositions.HORIZONTAL;
    this._playlistPanel = sidePanelsManager.addItem({
      label: 'Playlist',
      panelComponent: () => {
        return (
          <PlaylistWrapper
            onClose={() => {
              sidePanelsManager.deactivateItem(this._playlistPanel);
            }}
            player={this._player}
            pluginMode={pluginMode}
          />
        );
      },
      iconComponent: PluginButton,
      presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live],
      position: this.config.position,
      expandMode: this.config.expandMode
    });
    if (this.config.expandOnFirstPlay) {
      // @ts-ignore
      this.ready.then(() => {
        sidePanelsManager.activateItem(this._playlistPanel);
      });
    }
  }

  static isValid(): boolean {
    return true;
  }
  reset(): void {
    return;
  }

  destroy(): void {
    return;
  }
}
