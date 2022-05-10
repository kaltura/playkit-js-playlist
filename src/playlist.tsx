import {h} from 'preact';
// @ts-ignore
import {core} from 'kaltura-player-js';
import {PlaylistConfig} from './types';

export class Playlist extends KalturaPlayer.core.BasePlugin {
  private _player: KalturaPlayerTypes.Player;

  static defaultConfig: PlaylistConfig = {};

  constructor(name: string, player: KalturaPlayerTypes.Player, config: PlaylistConfig) {
    super(name, player, config);
    this._player = player;
  }

  loadMedia(): void {
    return;
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
