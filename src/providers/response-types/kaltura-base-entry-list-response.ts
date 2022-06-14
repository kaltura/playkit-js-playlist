import {KalturaBaseEntryArgs, KalturaBaseEntry} from './kaltura-base-entry';
const {BaseServiceResult} = KalturaPlayer.providers.ResponseTypes;

export class KalturaBaseEntryListResponse extends BaseServiceResult {
  totalCount?: number;
  data: Array<KalturaBaseEntry> = [];

  constructor(responseObj: any) {
    super(responseObj);
    if (!this.hasError) {
      this.totalCount = responseObj.totalCount;
      if (this.totalCount! > 0) {
        this.data = [];
        responseObj.objects.map((baseEntry: KalturaBaseEntryArgs) => this.data.push(new KalturaBaseEntry(baseEntry)));
      }
    }
  }
}
