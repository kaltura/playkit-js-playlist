export interface MultiLingualName {
  language: string;
  value: string;
}

export interface KalturaMultiLingualArgs {
  id: string;
  name: Array<MultiLingualName> | string;
}

export class KalturaMultiLingualData {
  id: string;
  names: Array<MultiLingualName> | string;

  constructor(multiLingual: KalturaMultiLingualArgs) {
    this.id = multiLingual.id;
    this.names = multiLingual.name;
  }
}