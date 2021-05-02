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
    fetchInstance,
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

  return (fetchInstance as typeof fetch)(finalUrl.toString(), {
    ...fetchOptions,
    headers,
  })
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
    fetchInstance: fetch,
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

  const httpVerbs = ['GET', 'DELETE', 'POST', 'PATCH', 'PUT'] as const;

  for (let i = 0, length = httpVerbs.length; i < length; i++) {
    const httpVerb = httpVerbs[i];
    const bodyHandler = i > 1 ? appendBody : params;

    res[httpVerb.toLowerCase()] = (
      url = '',
      bodyOrParams = i > 1 ? undefined : {},
    ) =>
      http(cloneOptions(mergedOptions))
        .pipe(method(httpVerb), appendUrl(url), bodyHandler(bodyOrParams!))
        .run();
  }

  return res as HttpClientObject;
};

export * from './operators';
export * from './types';
