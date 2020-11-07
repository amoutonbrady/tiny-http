# tiny-http

<p>
    <a href="https://bundlephobia.com/result?p=@amoutonbrady/tiny-http">
      <img src="https://badgen.net/bundlephobia/min/@amoutonbrady/tiny-http" />
    </a>
    <a href="https://www.pika.dev/npm/@amoutonbrady/tiny-http">
      <img src="https://badgen.net/npm/v/@amoutonbrady/tiny-http" />
    </a>
</p>

A tiny client side HTTP client, light and extensible

- ✔ Extensible, everything is pretty much a middleware
- ✔ Light, no dependencies
- ✔ Tailored, tree shakeable, use only what you need
- ✔ TS ready, written 100% in Typescript

## Installation

`npm install @amoutonbrady/tiny-http`

### Options

```ts
type Pipe = (options: Options) => Options;
type ResponsePiper<T1 = any, T2 = any> = (res: T1) => T2;
type ErrorPiper<T1 = Error, T1 = Error> = (err: T1) => T2;

interface Options {
  url: string;
  middlewares: Pipe[];
  responseType: 'json' | 'blob' | 'text' | 'arrayBuffer' | 'formData' | 'clone';
  json: boolean;
  headers: Record<string, string>;
  params: URLSearchParams;
  resolver: ResponsePiper;
  catcher: ErrorPiper;
  fetchOptions: RequestInit;
}
```

You can feed these options to a brand new `http()` call:

```ts
const client = http({
  url: "http://localhost",
  headers: {
    "Content-Type": "application/json",
  },
  ...
})

const res = await client.get<string>("/test");
```

or/and pipe the client to modify them as you please

```ts
import {
  http,
  url,
  headers,
  params,
  middleware,
  resolve,
  json,
  error,
} from '@amoutonbrady/tiny-http';

const client = http().pipe(
  url('http://localhost', true), // Replace the URL, the second parameter is to replace or append
  headers({ 'Content-Type': 'application/json' }),
  params({ test: 'trololol' }),
  middleware((opts) => opts), // Pretty much useless as you can just do (opts) => opts
  json(), // sets responseType to `json` and json to true
  resolve((res) => res), // Ran after the responseType is resolved fetch(url).then(r => r.json()).r(myResolver)
  error((err) => err),
);

const res = await client.get<string>('/test');
```
