import { http, url, json, resolve } from '..';
import { suite } from 'uvu';
import { instance, ok, type } from 'uvu/assert';
import nodeFetch from 'node-fetch';
// @ts-ignore
globalThis.fetch = nodeFetch;

const client = suite('client');

client('should be able to get an answer with pipe config', async () => {
  const client = http().pipe(
    url('https://jsonplaceholder.typicode.com/'),
    json(),
  );

  const [_, todos] = await client.get('todos');

  ok(Array.isArray(todos));
});

client('should be able to get answer with options config', async () => {
  const client = http({
    url: 'https://jsonplaceholder.typicode.com/',
    responseType: 'json',
  });

  const [_, todos] = await client.get('todos');

  ok(Array.isArray(todos));
});

client('should be able to set query parameters', async () => {
  const userId = '1';

  const client = http().pipe(
    url('https://jsonplaceholder.typicode.com/posts'),
    json(),
  );

  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const [_, posts] = await client.get<Post[]>('', { userId });
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

  const [_, posts] = await client.get<string>('', { userId });

  ok(posts === response);
});

client('create a ressource with post', async () => {
  const client = http({ url: 'https://jsonplaceholder.typicode.com/' });

  const [_, res] = await client.post('posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  type(res, 'object');
  ok('body' in res);
});

client('update a ressource with put and patch', async () => {
  const client = http({ url: 'https://jsonplaceholder.typicode.com/' });

  const [_, res] = await client.put('posts/1', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  type(res, 'object');
  ok('body' in res);

  const [__, res2] = await client.patch('posts/1', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  type(res2, 'object');
  ok('body' in res2);
});

client('delete a ressource with delete', () => {
  http({
    url: 'https://jsonplaceholder.typicode.com/',
    preResolvers: [(res) => ok(res.status === 200)],
  }).delete('posts/1');
});

client('delete a ressource with delete', () => {
  http({
    url: 'https://jsonplaceholder.typicode.com/',
    preResolvers: [(res) => ok(res.status === 200)],
  }).delete('posts/1');
});

client('handles errors properly', async () => {
  const [error, data] = await http({
    url: 'https://jsonplaceholder.typicode.com/',
    preResolvers: [
      (res) => {
        if (res.status === 200) throw Error('Hello');
      },
    ],
    catchers: [
      (err) => {
        ok(err.message === 'Hello');
        return err;
      },
    ],
  }).delete('posts/1');

  instance(error, Error);
  ok(data === null);
});

client('should work with a custom fetch instance', async () => {
  const client = http({
    fetchInstance: nodeFetch as unknown as typeof fetch,
  }).pipe(url('https://jsonplaceholder.typicode.com/'), json());

  const [_, todos] = await client.get('todos');

  ok(Array.isArray(todos));
});

client.run();
