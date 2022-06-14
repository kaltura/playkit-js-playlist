export enum ViewHistory {
  PLAYBACK_COMPLETE = 'viewHistory.PLAYBACK_COMPLETE',
  PLAYBACK_STARTED = 'viewHistory.PLAYBACK_STARTED',
  VIEWED = 'viewHistory.VIEWED'
}

export enum Status {
  QUIZ_SUBMITTED = 'quiz.3',
  ACTIVE = 1,
  DELETED = 2
}

export enum Type {
  QUIZ = 'quiz.QUIZ',
  REGISTRATION = 'registration.REGISTRATION',
  VIEW_HISTORY = 'viewHistory.VIEW_HISTORY',
  WATCH_LATER = 'watchLater.WATCH_LATER'
}

export interface KalturaViewHistoryUserEntryArgs {
  createdAt: number;
  entryId: string;
  extendedStatus: ViewHistory;
  id: number;
  lastTimeReached: number;
  lastUpdateTime: number;
  objectType: 'KalturaViewHistoryUserEntry';
  partnerId: number;
  playbackContext: string;
  status: Status;
  type: Type;
  updatedAt: number;
  userId: string;
}

export class KalturaViewHistoryUserEntry {
  entryId: string;
  extendedStatus: ViewHistory;
  id: number;
  lastTimeReached: number;
  objectType: 'KalturaViewHistoryUserEntry';
  status: Status;
  type: Type;

  constructor(viewHistory: KalturaViewHistoryUserEntryArgs) {
    this.entryId = viewHistory.entryId;
    this.extendedStatus = viewHistory.extendedStatus;
    this.id = viewHistory.id;
    this.lastTimeReached = viewHistory.lastTimeReached;
    this.objectType = viewHistory.objectType;
    this.status = viewHistory.status;
    this.type = viewHistory.type;
  }
}
