export enum Event {
  POSITION = 'position',
  NOTIFICATION = 'notification',
}

export enum NotificationLevel {
  CLEAR,
  NOTICE,
  WARNING,
  EMERGENCY,
}

type DefineMessage<T extends Record<Event, any>> = T;

export type Message = DefineMessage<{
  [Event.POSITION]: {
    buildingId: string;
    markerId: string;
  };
  [Event.NOTIFICATION]: {
    target: string;
    level: NotificationLevel;
  };
}>;
