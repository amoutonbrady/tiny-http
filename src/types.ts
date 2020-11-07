export type HttpClient = (opts?: Partial<Options>) => HttpClientObject;
export interface HttpClientObject {
  pipe(...pipes: Pipe[]): HttpClientObject;
  get<T = any>(url?: string, params?: AnyObject<any>): Promise<T>;
  post<T = any>(url?: string, body?: AnyObject<any>): Promise<T>;
  patch<T = any>(url?: string, body?: AnyObject<any>): Promise<T>;
  put<T = any>(url?: string, body?: AnyObject<any>): Promise<T>;
  delete<T = any>(url?: string, params?: AnyObject<any>): Promise<T>;
  run<T>(): Promise<T>;
}

export interface Options {
  url: string;
  middlewares: Pipe[];
  responseType: 'json' | 'blob' | 'text' | 'arrayBuffer' | 'formData' | 'clone';
  json: boolean;
  headers: Record<string, string>;
  params: URLSearchParams;
  preResolve: (res: Response) => unknown;
  resolver: ResponsePiper;
  catcher: ErrorPiper;
  fetchOptions: RequestInit;
}

export type ResponsePiper<HttpResponse = any, YourResponse = any> = (
  res: HttpResponse,
) => YourResponse;
export type ErrorPiper<HttpError = Error, YourError = Error> = (
  err: HttpError,
) => YourError;
export type Pipe = (options: Options) => Options;
export type Piper<T = any> = (params: T) => Pipe;
export type ArgumentlessPiper = () => Pipe;
export type AnyObject<T = string> = Record<string, T>;
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
