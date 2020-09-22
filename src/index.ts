import {
  Options,
  Pipe,
  AnyObject,
  HttpClient,
  HttpClientObject,
} from "./types";
import { cloneOptions } from "./utils/cloneOptions";
import { method, appendUrl, appendBody, params } from "./operators";

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
    .then((r) => {
      if (finalOpts.preResolve) finalOpts.preResolve(r);
      return r[finalOpts.responseType]();
    })
    .then((r) => finalOpts.resolver(r))
    .catch((err) => finalOpts.catcher(err));
}

export const http: HttpClient = (userOpts = {}) => {
  const mergedOptions: Options = {
    url: "",
    middlewares: [],
    responseType: "json",
    json: true,
    headers: {},
    params: new URLSearchParams(),
    preResolve: (res) => res,
    resolver: (res) => res,
    catcher: (err) => err,
    fetchOptions: {},
    ...userOpts,
  };

  const res: Record<string, any> = {
    pipe(...pipes: Pipe[]) {
      return http(
        pipes.reduce<Options>(
          (options, pipe) => pipe(options),
          cloneOptions(mergedOptions)
        )
      );
    },
    run() {
      return makeFinalCall(cloneOptions(mergedOptions));
    },
  };

  for (const httpVerb of ["POST", "PATCH", "PUT"] as const) {
    res[httpVerb.toLowerCase()] = (url = "", body: AnyObject<any>) =>
      http(cloneOptions(mergedOptions))
        .pipe(method(httpVerb), appendUrl(url), appendBody(body))
        .run();
  }

  for (const httpVerb of ["GET", "DELETE"] as const) {
    res[httpVerb.toLowerCase()] = (url = "", query = {}) =>
      http(cloneOptions(mergedOptions))
        .pipe(method(httpVerb), appendUrl(url), params(query))
        .run();
  }

  return res as HttpClientObject;
};

export * from "./operators";
