export type HttpClient<T = BaseObject<any>> = (
  opts?: Partial<Options<T>>,
) => HttpClientObject;

export type Res<T> = readonly [Error, null] | readonly [null, T];
export interface HttpClientObject {
  pipe(...pipes: Pipe[]): HttpClientObject;
  get<T = any>(
    url?: string,
    params?: BaseObject<string | number>,
  ): Promise<Res<T>>;
  post<T = any>(url?: string, body?: BaseObject): Promise<Res<T>>;
  patch<T = any>(url?: string, body?: BaseObject): Promise<Res<T>>;
  put<T = any>(url?: string, body?: BaseObject): Promise<Res<T>>;
  delete<T = any>(
    url?: string,
    params?: BaseObject<string | number>,
  ): Promise<Res<T>>;
  run<T = any>(): Promise<Res<T>>;
}

export interface Options<T = BaseObject<any>> {
  url: string;
  middlewares: Pipe<T>[];
  responseType: 'json' | 'blob' | 'text' | 'arrayBuffer' | 'formData' | 'clone';
  /**
   * This is automatically inferred from responseType now
   *
   * @deprecated
   */
  json?: boolean;
  headers: Record<string, string>;
  params: URLSearchParams;
  preResolvers: ((res: Response, value: T) => unknown)[];
  resolvers: ResponsePiper<T>[];
  catchers: ErrorPiper[];
  fetchOptions: RequestInit;
}

export type ResponsePiper<YourResponse = any, HttpResponse = any> = (
  res: HttpResponse,
) => YourResponse;
export type ErrorPiper<HttpError = Error, YourError = Error> = (
  err: HttpError,
) => YourError;
export type Pipe<T = BaseObject> = (options: Options<T>) => Options<T>;
export type Piper<T = any> = (params: T) => Pipe;
export type ArgumentlessPiper = () => Pipe;
export type BaseObject<T = string> = Record<string, T>;
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
