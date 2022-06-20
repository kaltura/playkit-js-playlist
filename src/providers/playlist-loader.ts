import ILoader = KalturaPlayerTypes.ILoader;
import {KalturaViewHistoryUserEntry, KalturaViewHistoryUserEntryListResponse, KalturaBaseEntry, KalturaBaseEntryListResponse} from './response-types';
const {RequestBuilder} = KalturaPlayer.providers;

interface PlaylistLoaderParams {
  playlistItems: Array<any>; // TODO take difinition from KalturaPlayerTypes.Playlist
}

interface PlaylistResponse {
  viewHistory: Array<KalturaViewHistoryUserEntry>;
  baseEntry: Array<KalturaBaseEntry>;
}

export class PlaylistLoader implements ILoader {
  _playlistItems: Array<any> = [];
  _requests: typeof RequestBuilder[] = [];
  _response: PlaylistResponse = {
    viewHistory: [],
    baseEntry: []
  };

  static get id(): string {
    return 'playlist';
  }

  constructor({playlistItems}: PlaylistLoaderParams) {
    this._playlistItems = playlistItems;
    const headers: Map<string, string> = new Map();

    const entryIds = this._playlistItems.map(playlistItem => playlistItem.sources.id).join(',');

    // viewHistory list request
    const viewHistoryRequest = new RequestBuilder(headers);
    viewHistoryRequest.service = 'userEntry';
    viewHistoryRequest.action = 'list';
    viewHistoryRequest.params = {
      filter: {
        entryIdIn: entryIds,
        objectType: 'KalturaViewHistoryUserEntryFilter',
        userIdEqualCurrent: 1
      }
    };
    this.requests.push(viewHistoryRequest);

    // baseEntry list request
    const baseEntryRequest = new RequestBuilder(headers);
    baseEntryRequest.service = 'baseEntry';
    baseEntryRequest.action = 'list';
    baseEntryRequest.params = {
      filter: {
        idIn: entryIds,
        objectType: 'KalturaMediaEntryFilter'
      }
    };
    this.requests.push(baseEntryRequest);

    // TODO: get live schedule data
  }

  set requests(requests: any[]) {
    this._requests = requests;
  }

  get requests(): any[] {
    return this._requests;
  }

  set response(response: any) {
    const viewHistoryUserEntryListResponse = new KalturaViewHistoryUserEntryListResponse(response[0]?.data);
    if (viewHistoryUserEntryListResponse.totalCount) {
      this._response.viewHistory = viewHistoryUserEntryListResponse?.data;
    }
    const klalturaUserEntryListResponse = new KalturaBaseEntryListResponse(response[1]?.data);
    if (klalturaUserEntryListResponse.totalCount) {
      this._response.baseEntry = klalturaUserEntryListResponse?.data;
    }
  }

  get response(): any {
    return this._response;
  }

  isValid(): boolean {
    return this._playlistItems.length > 0;
  }
}
