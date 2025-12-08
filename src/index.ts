/// <reference path="./global.d.ts" />

import {Playlist} from './playlist';
import {registerPlugin} from '@playkit-js/kaltura-player-js';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Playlist as Plugin};
export {VERSION, NAME};
export {PlaylistEvents} from './events/events'
export const pluginName: string = 'playlist';
registerPlugin(pluginName, Playlist);
