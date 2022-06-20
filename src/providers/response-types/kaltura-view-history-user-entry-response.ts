import {KalturaViewHistoryUserEntry, KalturaViewHistoryUserEntryArgs} from './kaltura-view-history-user-entry';
const {BaseServiceResult} = KalturaPlayer.providers.ResponseTypes;

export class KalturaViewHistoryUserEntryListResponse extends BaseServiceResult {
  totalCount?: number;
  data: Array<KalturaViewHistoryUserEntry> = [];

  constructor(responseObj: any) {
    super(responseObj);
    if (!this.hasError) {
      this.totalCount = responseObj.totalCount;
      if (this.totalCount! > 0) {
        this.data = [];
        responseObj.objects.map((viewHistory: KalturaViewHistoryUserEntryArgs) => this.data.push(new KalturaViewHistoryUserEntry(viewHistory)));
      }
    }
  }
}
