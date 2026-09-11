import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const nvmrcVersion = readFileSync(path.join(root, '.nvmrc'), 'utf8').trim();

test('.nvmrc satisfies the engines.node minimum in package.json', () => {
  const minNode = Number(pkg.engines.node.replace('>=', ''));
  const pinnedNode = Number(nvmrcVersion);
  assert.ok(
    pinnedNode >= minNode,
    `.nvmrc pins Node ${pinnedNode}, below the engines.node minimum of ${minNode}`
  );
});
