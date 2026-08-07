import { test } from 'node:test';
import assert from 'node:assert/strict';

import { add, greet } from '../src/helpers.js';

test('add sums numbers', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
});

test('greet handles a name', () => {
  assert.equal(greet('Ada'), 'Hello, Ada!');
});

test('greet defaults without a name', () => {
  assert.equal(greet(''), 'Hello, world!');
  assert.equal(greet(undefined), 'Hello, world!');
});