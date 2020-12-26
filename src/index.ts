import {
  Options,
  Pipe,
  BaseObject,
  HttpClient,
  HttpClientObject,
} from './types';
import { cloneOptions } from './utils/cloneOptions';
import { method, appendUrl, appendBody, params } from './operators';

function makeFinalCall<T>(
  options: Options<T>,
): Promise<readonly [null, T] | readonly [Error, null]> {
  const {
    url,
    headers,
    fetchOptions,
    responseType,
    catchers,
    resolvers,
    preResolvers,
  } = options.middlewares.reduce<Options<T>>(
    (opts, middleware) => middleware(opts),
    options,
  );

  if (responseType === 'json') headers['Content-Type'] = 'application/json';

  const finalUrl = new URL(url);
  options.params.forEach((value, key) => finalUrl.searchParams.set(key, value));

  return fetch(finalUrl.toString(), { ...fetchOptions, headers })
    .then(async (r) => {
      const value = await r[responseType]();

      preResolvers.reduce(
        ({ r, value }, preResolver) => {
          preResolver(r, value);
          return { r, value };
        },
        { r, value },
      );

      return value;
    })
    .then(
      (res) =>
        [null, resolvers.reduce((r, resolver) => resolver(r), res)] as const,
    )
    .catch(
      (err) =>
        [catchers.reduce((e, catcher) => catcher(e), err), null] as const,
    );
}

export const http: HttpClient = (userOpts = {}) => {
  const mergedOptions: Options = {
    url: '',
    headers: {},
    middlewares: [],
    fetchOptions: {},
    responseType: 'json',
    params: new URLSearchParams(),
    catchers: [],
    resolvers: [],
    preResolvers: [],
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
    res[httpVerb.toLowerCase()] = (url = '', body: BaseObject<any>) =>
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
