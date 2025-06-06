import {KalturaViewHistoryUserEntry, KalturaBaseEntry, PlaylistLoader} from './providers';
import {PlaylistExtraData} from './types';
import {KalturaPlayer} from '@playkit-js/kaltura-player-js'
import {KalturaMultiLingualData} from './providers/response-types/kaltura-multi-lingual-data';

export class DataManager {
  private _playlistData: PlaylistExtraData | null = null;
  private _playlistExtraDataIsFetching = false;
  private _makePlaylistExtraDataResolvePromise = () => {
    return new Promise<PlaylistExtraData>(res => {
      this._playlistExtraDataResolvePromise = res;
    });
  };
  private _playlistExtraDataResolvePromise = (data: PlaylistExtraData) => {};
  private _playlistExtraDataPromise = this._makePlaylistExtraDataResolvePromise();

  constructor(private _player: KalturaPlayer, private _logger: KalturaPlayerTypes.Logger) {}

  public getPlaylistData = () => {
    this._fetchPlaylistData();
    return this._playlistExtraDataPromise;
  };

  private _fetchPlaylistData = () => {
    if (this._playlistData || this._playlistExtraDataIsFetching) {
      return;
    }
    const playlistItems = this._player.playlist.items;
    this._playlistExtraDataIsFetching = true;
    return this._player.provider
    // @ts-expect-error - Type 'typeof PlaylistLoader' is missing the following properties from type 'ILoader': requests, response, isValid
      .doRequest([{loader: PlaylistLoader, params: {playlistItems}}])
      .then((data: Map<string, any>) => {
        if (data && data.has(PlaylistLoader.id)) {
          const playlistLoader = data.get(PlaylistLoader.id);
          const viewHistory: Array<KalturaViewHistoryUserEntry> = playlistLoader?.response?.viewHistory;
          const baseEntry: Array<KalturaBaseEntry> = playlistLoader?.response?.baseEntry;
          const multiLingual: Array<KalturaMultiLingualData> = playlistLoader?.response?.multiLingualData;
          if (!this._playlistData) {
            this._playlistData = {};
          }
          if (viewHistory) {
            this._playlistData.viewHistory = viewHistory.reduce((acc, cur) => {
              return {...acc, [cur.entryId]: cur};
            }, {});
          }
          if (baseEntry) {
            this._playlistData.baseEntry = baseEntry.reduce((acc, cur) => {
              return {...acc, [cur.id]: cur};
            }, {});
          }
          if (multiLingual) {
            this._playlistData.multiLingual = multiLingual.reduce((acc, cur) => {
              return {...acc, [cur.id]: cur};
            }, {});
          }
          this._playlistExtraDataResolvePromise(this._playlistData);
        }
      })
      .catch((e: any) => {
        this._logger.warn(e);
      })
      .finally(() => {
        this._playlistExtraDataIsFetching = false;
      });
  };

  public destroy = () => {
    this._playlistData = null;
    this._playlistExtraDataPromise = this._makePlaylistExtraDataResolvePromise();
  };
}
