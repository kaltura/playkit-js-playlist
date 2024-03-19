/// <reference path="./global.d.ts" />

import {Playlist} from './playlist';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Playlist as Plugin};
export {VERSION, NAME};
export {PlaylistEvents} from './events/events'
export const pluginName: string = 'playlist';
KalturaPlayer.core.registerPlugin(pluginName, Playlist);
