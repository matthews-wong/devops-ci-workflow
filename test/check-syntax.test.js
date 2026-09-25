import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { findJsFiles } from '../scripts/check-syntax.mjs';

test('findJsFiles discovers a new file without any list to update', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-syntax-'));
  try {
    writeFileSync(path.join(dir, 'new-module.js'), 'export const x = 1;\n');
    assert.deepEqual(findJsFiles(dir), [path.join(dir, 'new-module.js')]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('findJsFiles recurses into subdirectories and ignores non-.js files', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-syntax-'));
  try {
    mkdirSync(path.join(dir, 'nested'));
    writeFileSync(path.join(dir, 'nested', 'inner.js'), 'export const y = 1;\n');
    writeFileSync(path.join(dir, 'README.md'), '# not js\n');
    assert.deepEqual(findJsFiles(dir), [path.join(dir, 'nested', 'inner.js')]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('findJsFiles returns an empty array for a directory with no .js files', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-syntax-'));
  try {
    assert.deepEqual(findJsFiles(dir), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
