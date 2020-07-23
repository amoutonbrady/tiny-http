# tiny-http

<p align="center">
    <a href="https://bundlephobia.com/result?p=@amoutonbrady/tiny-http">
      <img src="https://badgen.net/bundlephobia/min/@amoutonbrady/tiny-http" />
    </a>
    <a href="https://www.pika.dev/npm/@amoutonbrady/tiny-http">
      <img src="https://badgen.net/npm/v/@amoutonbrady/tiny-http" />
    </a>
</p>

A tiny client side HTTP client, light and extensible

✔ Extensible, everything is pretty much a middleware
✔ Light, no dependencies
✔ Tailored, tree shakeable, use only what you need
✔ TS ready, written 100% in Typescript

## Installation

`npm install @amoutonbrady/tiny-http`

## Usage

```ts
import { http, url, headers, params, middleware, resolve, json, error } from "@amoutonbrady/tiny-http";

const client = http().pipe(
  url("http://localhost"),
  headers({ "Content-Type": "application/json" }),
  params({ test: "trololol" }),
  middleware((opts) => opts),
  resolve(console.log),
  json(),
  error(console.error)
);

const res = await client.get<string>("/test");
```
