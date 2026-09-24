import { test } from 'node:test';
import assert from 'node:assert/strict';

import { add, chunk, clamp, greet, unique } from '../src/helpers.js';

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

test('clamp passes through in-range values', () => {
  assert.equal(clamp(5, 0, 10), 5);
});

test('clamp caps values outside the range', () => {
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
});

test('clamp rejects an inverted range', () => {
  assert.throws(() => clamp(5, 10, 0), RangeError);
});

test('unique drops duplicate values', () => {
  assert.deepEqual(unique([1, 2, 2, 3, 1]), [1, 2, 3]);
});

test('unique preserves first-seen order', () => {
  assert.deepEqual(unique(['b', 'a', 'b', 'c']), ['b', 'a', 'c']);
});

test('unique returns an empty array for an empty input', () => {
  assert.deepEqual(unique([]), []);
});

test('chunk splits evenly divisible arrays', () => {
  assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
});

test('chunk keeps a shorter final chunk for a remainder', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test('chunk returns an empty array for an empty input', () => {
  assert.deepEqual(chunk([], 3), []);
});

test('chunk rejects a non-positive size', () => {
  assert.throws(() => chunk([1, 2], 0), RangeError);
  assert.throws(() => chunk([1, 2], -1), RangeError);
});

test('chunk rejects a non-integer size', () => {
  assert.throws(() => chunk([1, 2], 1.5), RangeError);
});