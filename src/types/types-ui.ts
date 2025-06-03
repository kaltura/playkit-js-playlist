import {KalturaViewHistoryUserEntry, KalturaBaseEntry} from '../providers';
import {KalturaMultiLingualData} from '../providers/response-types/kaltura-multi-lingual-data';

export type OnClick = (e: KeyboardEvent | MouseEvent, byKeyboard?: boolean) => void;

export enum PluginPositions {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum PluginStates {
  OPENED = 'opened',
  CLOSED = 'closed'
}

export interface PlaylistExtraData {
  viewHistory?: Record<string, KalturaViewHistoryUserEntry>;
  baseEntry?: Record<string, KalturaBaseEntry>;
  multiLingual?: Record<string, KalturaMultiLingualData>;
}
