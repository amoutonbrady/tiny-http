import { http, url, json, params, resolve } from "..";
import { suite } from "uvu";
import { ok } from "assert";
import fetch from "node-fetch";
globalThis.fetch = fetch;

const client = suite("client");

client("should be able to get an answer with pipe config", async () => {
  const client = http().pipe(
    url("https://jsonplaceholder.typicode.com/"),
    json()
  );

  const todos = await client.get("todos");

  ok(Array.isArray(todos));
});

client("should be able to get answer with options config", async () => {
  const client = http({
    url: "https://jsonplaceholder.typicode.com/",
    responseType: "json",
  });

  const todos = await client.get("todos");

  ok(Array.isArray(todos));
});

client("should be able to set query parameters", async () => {
  const userId = "1";

  const client = http().pipe(
    url("https://jsonplaceholder.typicode.com/posts"),
    json()
  );

  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const posts = await client.get<Post[]>("", { userId });

  ok(posts.every((post) => post.userId === +userId));
});

client("should be able to transform the response", async () => {
  const userId = "1";
  const response = "TROLL";

  const client = http().pipe(
    url("https://jsonplaceholder.typicode.com/posts"),
    json(),
    resolve(() => response)
  );

  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const posts = await client.get<string>("", { userId });

  ok(posts === response);
});

client.run();
