export interface MultiLingualData {
  language: string;
  value: string;
}

export interface KalturaMultiLingualArgs {
  id: string;
  name: Array<MultiLingualData> | string;
}

export class KalturaMultiLingualData {
  id: string;
  name: Array<MultiLingualData> | string;

  constructor(multiLingual: KalturaMultiLingualArgs) {
    this.id = multiLingual.id;
    this.name = multiLingual.name;
  }
}