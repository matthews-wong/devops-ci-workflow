import { test } from 'node:test';
import assert from 'node:assert/strict';

import { add, greet } from '../src/helpers.js';

test('add sums numbers', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1), 0);
});

test('add handles zero and large operands', () => {
  assert.equal(add(0, 0), 0);
  assert.equal(add(0, 42), 42);
  assert.equal(add(1_000_000, 2_500_000), 3_500_000);
});

test('add preserves negative results', () => {
  assert.equal(add(-3, -7), -10);
});

test('greet handles a name', () => {
  assert.equal(greet('Ada'), 'Hello, Ada!');
});

test('greet keeps names with spaces intact', () => {
  assert.equal(greet('Grace Hopper'), 'Hello, Grace Hopper!');
});

test('greet defaults without a name', () => {
  assert.equal(greet(''), 'Hello, world!');
  assert.equal(greet(undefined), 'Hello, world!');
});