import { Options, Pipe, HttpClient, HttpClientObject } from './types';
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
    params,
  } = options.middlewares.reduce<Options<T>>(
    (opts, middleware) => middleware(opts),
    options,
  );

  if (responseType === 'json') headers['Content-Type'] = 'application/json';

  const finalUrl = new URL(url);
  params.forEach((value, key) => finalUrl.searchParams.set(key, value));

  return (fetchInstance as typeof fetch)(finalUrl.toString(), {
    ...fetchOptions,
    headers,
  })
    .then(async (response) => {
      const value = await response[responseType]();

      // HACK: This should most likely not be a reduce
      preResolvers.reduce(
        ({ response, value }, preResolver) => {
          preResolver(response, value);
          return { response, value };
        },
        { response, value },
      );

      return value;
    })
    .then(
      (response) =>
        [
          null,
          resolvers.reduce(
            (finalResponse, resolver) => resolver(finalResponse),
            response,
          ),
        ] as const,
    )
    .catch(
      (error) =>
        [
          catchers.reduce((finalError, catcher) => catcher(finalError), error),
          null,
        ] as const,
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

  const httpClientObject: Record<string, any> = {
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

    httpClientObject[httpVerb.toLowerCase()] = (
      url = '',
      bodyOrParams = i > 1 ? undefined : {},
    ) =>
      http(cloneOptions(mergedOptions))
        .pipe(method(httpVerb), appendUrl(url), bodyHandler(bodyOrParams!))
        .run();
  }

  return httpClientObject as HttpClientObject;
};

export * from './operators';
export * from './types';
