import {
  Options,
  Pipe,
  AnyObject,
  HttpClient,
  HttpClientObject,
} from './types';
import { cloneOptions } from './utils/cloneOptions';
import { method, appendUrl, appendBody, params } from './operators';

function makeFinalCall<T>(options: Options): Promise<T> {
  const {
    url,
    json,
    headers,
    fetchOptions,
    responseType,
    catcher,
    resolver,
    preResolve,
  } = options.middlewares.reduce(
    (opts, middleware) => middleware(opts),
    options,
  );

  if (json) headers['Content-Type'] = 'application/json';

  const params = decodeURI(options.params.toString());
  const finalUrl = url + (params ? `?${params}` : '');

  return fetch(finalUrl, { ...fetchOptions, headers })
    .then((r) => {
      if (preResolve) preResolve(r);
      return r[responseType]();
    })
    .then(resolver)
    .catch(catcher);
}

export const http: HttpClient = (userOpts = {}) => {
  const mergedOptions: Options = {
    url: '',
    json: true,
    headers: {},
    middlewares: [],
    fetchOptions: {},
    responseType: 'json',
    params: new URLSearchParams(),
    catcher: (err) => err,
    resolver: (res) => res,
    preResolve: (res) => res,
    ...userOpts,
  };

  const res: Record<string, any> = {
    pipe(...pipes: Pipe[]) {
      return http(
        pipes.reduce<Options>(
          (options, pipe) => pipe(options),
          cloneOptions(mergedOptions),
        ),
      );
    },
    run() {
      return makeFinalCall(cloneOptions(mergedOptions));
    },
  };

  for (const httpVerb of ['POST', 'PATCH', 'PUT'] as const) {
    res[httpVerb.toLowerCase()] = (url = '', body: AnyObject<any>) =>
      http(cloneOptions(mergedOptions))
        .pipe(method(httpVerb), appendUrl(url), appendBody(body))
        .run();
  }

  for (const httpVerb of ['GET', 'DELETE'] as const) {
    res[httpVerb.toLowerCase()] = (url = '', query = {}) =>
      http(cloneOptions(mergedOptions))
        .pipe(method(httpVerb), appendUrl(url), params(query))
        .run();
  }

  return res as HttpClientObject;
};

export * from './operators';
