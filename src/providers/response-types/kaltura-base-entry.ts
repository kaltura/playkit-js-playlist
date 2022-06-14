enum ObjectType {
  KalturaBaseEntry = 'KalturaBaseEntry',
  KalturaDataEntry = 'KalturaDataEntry',
  KalturaDocumentEntry = 'KalturaDocumentEntry',
  KalturaPlayableEntry = 'KalturaPlayableEntry',
  KalturaPlaylist = 'KalturaPlaylist',
  KalturaMediaEntry = 'KalturaMediaEntry',
  KalturaMixEntry = 'KalturaMixEntry',
  KalturaExternalMediaEntry = 'KalturaExternalMediaEntry',
  KalturaLiveChannel = 'KalturaLiveChannel',
  KalturaLiveStreamEntry = 'KalturaLiveStreamEntry',
  KalturaLiveStreamAdminEntry = 'KalturaLiveStreamAdminEntry'
}

export enum Capabilities {
  Quiz = 'quiz.quiz',
  None = ''
}

export interface KalturaBaseEntryArgs {
  id: string;
  categories: string;
  adminTags: string;
  capabilities: Capabilities;
  objectType: ObjectType;
}

export class KalturaBaseEntry {
  id: string;
  capabilities: Capabilities;
  objectType: ObjectType;

  constructor(baseEntry: KalturaBaseEntryArgs) {
    this.id = baseEntry.id;
    this.capabilities = baseEntry.capabilities;
    this.objectType = baseEntry.objectType;
  }
}
