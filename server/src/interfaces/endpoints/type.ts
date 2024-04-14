export type Endpoint = {
  method: 'POST' | 'PUT' | 'GET' | 'DELETE';
  body?: any;
  basePath: string;
  path: string;
  query?: string[];
  param?: string[];
  response: any;
};

export type DefineAPI<T extends Record<string, Endpoint>> = T;

export type ParamType<T extends Endpoint> = Record<T['param'][number], string>;
export type QueryType<T extends Endpoint> = Partial<
  Record<T['query'][number], string>
>;
