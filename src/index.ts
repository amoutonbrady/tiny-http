function makeFinalCall<T>(options: Options): Promise<T> {
  const finalOpts = options.middlewares.reduce(
    (opts, middleware) => middleware(opts),
    options
  );
  if (options.json) {
    finalOpts.headers["Content-Type"] = "application/json";
  }
  const params = decodeURI(options.params.toString());
  const url = finalOpts.url + (params ? `?${params}` : "");

  return fetch(url, {
    ...finalOpts.fetchOptions,
    headers: finalOpts.headers,
  })
    .then((r) => r[finalOpts.responseType]())
    .then((r) => finalOpts.resolver(r))
    .catch((err) => finalOpts.catcher(err));
}

export const url: Piper<string> = (url) => (opts) => ({ ...opts, url });
export const appendUrl: Piper<string> = (url) => (opts) => ({
  ...opts,
  url: opts.url + url,
});
export const appendBody: Piper<AnyObject> = (body) => (opts) => ({
  ...opts,
  fetchOptions: { ...opts.fetchOptions, body: JSON.stringify(body) },
});
export const headers: Piper<AnyObject> = (headers) => (opts) => ({
  ...opts,
  headers,
});
export const params: Piper<AnyObject<any>> = (params) => (opts) => {
  if (!params) return opts;
  for (const [key, value] of Object.entries(params)) {
    opts.params.append(key, JSON.stringify(value));
  }
  return opts;
};
export const middleware: Piper<Pipe> = (pipe) => (opts) => pipe(opts);
export const resolve: Piper<ResponsePiper> = (resolver) => (opts) => ({
  ...opts,
  resolver,
});
export const error: Piper<ErrorPiper> = (catcher) => (opts) => ({
  ...opts,
  catcher,
});
export const json: ArgumentlessPiper = () => (opts) => ({
  ...opts,
  response: "json",
  json: true,
});
export const method: Piper<Method> = (type) => (opts) => ({
  ...opts,
  fetchOptions: { ...opts.fetchOptions, method: type },
});

const cloneOptions = (opts: Options) => {
  return Object.entries(opts).reduce<any>((cloned, [key, value]) => {
    cloned[key] =
      value instanceof URLSearchParams ? new URLSearchParams(value) : value;
    return cloned;
  }, {});
};

export const http: HttpClient = (userOpts = {}) => {
  const mergedOptions: Options = {
    url: "",
    middlewares: [],
    responseType: "json",
    json: true,
    headers: {},
    params: new URLSearchParams(),
    resolver: (res) => res,
    catcher: (err) => err,
    fetchOptions: {},
    ...userOpts,
  };

  return {
    pipe(...pipes) {
      return http(
        pipes.reduce<Options>(
          (options, pipe) => pipe(options),
          cloneOptions(mergedOptions)
        )
      );
    },
    get(url = "", query = {}) {
      return http(cloneOptions(mergedOptions))
        .pipe(method("GET"), appendUrl(url), params(query))
        .run();
    },
    post(url = "", body: AnyObject) {
      return http(cloneOptions(mergedOptions))
        .pipe(method("POST"), appendUrl(url), appendBody(body))
        .run();
    },
    run() {
      return makeFinalCall(cloneOptions(mergedOptions));
    },
  };
};

export type HttpClient = (opts?: Partial<Options>) => HttpClientObject;
export interface HttpClientObject {
  pipe(...pipes: Pipe[]): HttpClientObject;
  get<T = any>(url?: string, params?: AnyObject<any>): Promise<T>;
  post<T = any>(url?: string, body?: AnyObject): Promise<T>;
  run<T>(): Promise<T>;
}

export interface Options {
  url: string;
  middlewares: Pipe[];
  responseType: "json" | "blob" | "text" | "arrayBuffer" | "formData" | "clone";
  json: boolean;
  headers: Record<string, string>;
  params: URLSearchParams;
  resolver: ResponsePiper;
  catcher: ErrorPiper;
  fetchOptions: RequestInit;
}

export type ResponsePiper<HttpResponse = any, YourResponse = any> = (
  res: HttpResponse
) => YourResponse;
export type ErrorPiper<HttpError = Error, YourError = Error> = (
  err: HttpError
) => YourError;
export type Pipe = (options: Options) => Options;
export type Piper<T = any> = (params: T) => Pipe;
export type ArgumentlessPiper = () => Pipe;
export type AnyObject<T = string> = Record<string, T>;
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
