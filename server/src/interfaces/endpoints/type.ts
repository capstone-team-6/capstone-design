export type Endpoint =
  | {
      method: 'POST' | 'PUT';
      body: any;
      path: string;
      query?: string[];
      param?: string[];
      response: any;
    }
  | {
      method: 'GET' | 'DELETE';
      path: string;
      query?: string[];
      param?: string[];
      response: any;
    };

export type DefineAPI<
  T extends { basePath: string; endpoints: Record<string, Endpoint> },
> = T;

export type ParamType<T extends Endpoint> = Record<T['param'][number], string>;
export type QueryType<T extends Endpoint> = Partial<
  Record<T['query'][number], string>
>;
