export type Admin = {
  id: string;
  buildings: string[];
};

export type User = {
  id: string;
  name: string;
  type: 'guardian' | 'child';
  group: string[];
};
