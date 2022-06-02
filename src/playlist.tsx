import {h} from 'preact';
// @ts-ignore
import {PlaylistConfig} from './types';
import {PluginButton} from './components/plugin-button';
import {PlaylistWrapper} from './components/playlist-wrapper';

// @ts-ignore
const {BasePlugin, registerPlugin, ui} = KalturaPlayer;
// @ts-ignore
const {SidePanelModes, SidePanelPositions, ReservedPresetNames} = ui;

export class Playlist extends KalturaPlayer.core.BasePlugin {
  private _player: KalturaPlayerTypes.Player;
  private _playlistPanel = null;

  static defaultConfig: PlaylistConfig = {};

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
    this._playlistPanel = sidePanelsManager.addItem({
      label: 'Playlist',
      panelComponent: () => {
        return (
          <PlaylistWrapper
            onClose={() => {
              sidePanelsManager.deactivateItem(this._playlistPanel);
            }}
            // @ts-ignore
            player={this._player}
          />
        );
      },
      iconComponent: PluginButton,
      presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live],
      position: SidePanelPositions.RIGHT,
      expandMode: SidePanelModes.OVER
    });
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
