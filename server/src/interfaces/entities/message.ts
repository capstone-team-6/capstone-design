export enum Event {
  POSITION = 'position',
  NOTICE = 'notice',
}

type DefineMessage<T extends Record<Event, any>> = T;

export type Message = DefineMessage<{
  [Event.POSITION]: {
    buildingId: string;
    markerId: string;
  };
  [Event.NOTICE]: {};
}>;

export type ClientMessage = {
  [key in Event]: Message[key] & { from: { uid: string } };
};
