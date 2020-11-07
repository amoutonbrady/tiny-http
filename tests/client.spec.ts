import { http, url, json, resolve } from '..';
import { suite } from 'uvu';
import { ok, type } from 'uvu/assert';
import fetch from 'node-fetch';
// @ts-ignore
globalThis.fetch = fetch;

const client = suite('client');

client('should be able to get an answer with pipe config', async () => {
  const client = http().pipe(url('https://jsonplaceholder.typicode.com/'), json());

  const todos = await client.get('todos');

  ok(Array.isArray(todos));
});

client('should be able to get answer with options config', async () => {
  const client = http({
    url: 'https://jsonplaceholder.typicode.com/',
    responseType: 'json',
  });

  const todos = await client.get('todos');

  ok(Array.isArray(todos));
});

client('should be able to set query parameters', async () => {
  const userId = '1';

  const client = http().pipe(url('https://jsonplaceholder.typicode.com/posts'), json());

  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const posts = await client.get<Post[]>('', { userId });

  ok(posts.every((post) => post.userId === +userId));
});

client('should be able to transform the response', async () => {
  const userId = '1';
  const response = 'TROLL';

  const client = http().pipe(
    url('https://jsonplaceholder.typicode.com/posts'),
    json(),
    resolve(() => response),
  );

  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const posts = await client.get<string>('', { userId });

  ok(posts === response);
});

client('create a ressource with post', async () => {
  const client = http({
    json: true,
    responseType: 'json',
    url: 'https://jsonplaceholder.typicode.com/',
  });

  const res = await client.post('posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  type(res, 'object');
  ok('body' in res);
});

client('update a ressource with put and patch', async () => {
  const client = http({
    json: true,
    responseType: 'json',
    url: 'https://jsonplaceholder.typicode.com/',
  });

  const res = await client.put('posts/1', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  type(res, 'object');
  ok('body' in res);

  const res2 = await client.patch('posts/1', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  type(res2, 'object');
  ok('body' in res2);
});

client('delete a ressource with delete', async () => {
  http({
    json: true,
    responseType: 'json',
    url: 'https://jsonplaceholder.typicode.com/',
    preResolve: (res) => ok(res.status === 200),
  }).delete('posts/1');
});

client.run();
