import {KalturaMultiLingualArgs, KalturaMultiLingualData} from './kaltura-multi-lingual-data';
const {BaseServiceResult} = KalturaPlayer.providers.ResponseTypes;

export class KalturaMultiLingualResponse extends BaseServiceResult {
  totalCount?: number;
  data: Array<KalturaMultiLingualData> = [];

  constructor(responseObj: any) {
    super(responseObj);
    if (!this.hasError) {
      this.totalCount = responseObj.totalCount;
      if (this.totalCount! > 0) {
        this.data = [];
        responseObj.objects.map((ml: KalturaMultiLingualArgs) => this.data.push(new KalturaMultiLingualData(ml)));
      }
    }
  }
}
