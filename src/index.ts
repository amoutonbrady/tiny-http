function makeFinalCall<T>(options: Options): Promise<T> {
  const finalOpts = options.middlewares.reduce(
    (opts, middleware) => middleware(opts),
    options
  );
  if (options.response === "json") {
    finalOpts.headers["Content-Type"] = "application/json";
  }
  const url = finalOpts.url + "?" + options.params.toString();

  return fetch(url, {
    ...finalOpts.fetchOptions,
    headers: finalOpts.headers,
  })
    .then((r) => {
      finalOpts.resolvers.forEach((resolver) => resolver(r));
      return r[finalOpts.response]();
    })
    .catch((err) => {
      finalOpts.catchers.forEach((catcher) => catcher(err));
    });
}

export const url: Piper<string> = (url) => (opts) =>
  url ? { ...opts, url } : opts;
export const appendUrl: Piper<string> = (url) => (opts) =>
  url
    ? {
        ...opts,
        url: opts.url + url,
      }
    : opts;
export const appendBody: Piper<BodyInit> = (body) => (opts) =>
  body
    ? {
        ...opts,
        fetchOptions: { ...opts.fetchOptions, body },
      }
    : opts;
export const headers: Piper<AnyObject> = (headers) => (opts) =>
  headers
    ? {
        ...opts,
        headers,
      }
    : opts;
export const params: Piper<AnyObject<any>> = (params) => (opts) => {
  if (!params) return opts;
  for (const [key, value] of Object.entries(params)) {
    opts.params.append(key, JSON.stringify(value));
  }
  return opts;
};
export const middleware: Piper<Pipe> = (pipe) => (opts) =>
  pipe ? pipe(opts) : opts;
export const resolve: Piper<ResponsePiper> = (resolver) => (opts) =>
  resolver
    ? {
        ...opts,
        resolvers: [...opts.resolvers, resolver],
      }
    : opts;
export const error: Piper<Function> = (catcher) => (opts) =>
  catcher
    ? {
        ...opts,
        catchers: [...opts.catchers, catcher],
      }
    : opts;
export const json: Piper = () => (opts) => ({ ...opts, response: "json" });
export const method: Piper<Method> = (type) => (opts) =>
  type
    ? {
        ...opts,
        fetchOptions: { ...opts.fetchOptions, method: type },
      }
    : opts;

export const http: HttpClient = (userOpts = {}) => {
  const mergedOptions: Options = {
    url: "",
    middlewares: [],
    response: "json",
    headers: {},
    params: new URLSearchParams(),
    resolvers: [],
    catchers: [],
    fetchOptions: {},
    ...userOpts,
  };

  return {
    pipe(...pipes) {
      return http(
        pipes.reduce<Options>((options, pipe) => pipe(options), mergedOptions)
      );
    },
    get(url = "", query) {
      return http(mergedOptions)
        .pipe(method("GET"), appendUrl(url), params(query))
        .run();
    },
    post(url = "", body) {
      return http(mergedOptions)
        .pipe(method("POST"), appendUrl(url), appendBody(body))
        .run();
    },
    run() {
      return makeFinalCall(mergedOptions);
    },
  };
};

export type HttpClient = (opts?: Partial<Options>) => HttpClientObject;
export interface HttpClientObject {
  pipe(...pipes: Pipe[]): HttpClientObject;
  get<T = any>(url?: string, params?: AnyObject<any>): Promise<T>;
  post<T = any>(url?: string, body?: BodyInit): Promise<T>;
  run<T>(): Promise<T>;
}

export interface Options {
  url: string;
  middlewares: Pipe[];
  response: "json" | "blob" | "text" | "arrayBuffer" | "formData" | "clone";
  headers: Record<string, string>;
  params: URLSearchParams;
  resolvers: ResponsePiper[];
  catchers: Function[];
  fetchOptions: RequestInit;
}

export type ResponsePiper = (res: Response) => any;
export type Pipe = (options: Options) => Options;
export type Piper<T = any> = (params?: T) => Pipe;
export type AnyObject<T = string> = Record<string, T>;
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
