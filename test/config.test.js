import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const nvmrcVersion = readFileSync(path.join(root, '.nvmrc'), 'utf8').trim();
const workflow = readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');
const minNode = Number(pkg.engines.node.replace('>=', ''));

test('.nvmrc satisfies the engines.node minimum in package.json', () => {
  const pinnedNode = Number(nvmrcVersion);
  assert.ok(
    pinnedNode >= minNode,
    `.nvmrc pins Node ${pinnedNode}, below the engines.node minimum of ${minNode}`
  );
});

test('the CI test matrix stays at or above the engines.node minimum', () => {
  const [, matrixList] = workflow.match(/node-version:\s*\[([^\]]+)\]/) ?? [];
  assert.ok(matrixList, 'expected a node-version matrix array in ci.yml');
  const matrixVersions = matrixList.split(',').map((v) => Number(v.trim()));
  for (const version of matrixVersions) {
    assert.ok(
      version >= minNode,
      `ci.yml tests Node ${version}, below the engines.node minimum of ${minNode}`
    );
  }
});

test('the CI test matrix covers the version pinned in .nvmrc', () => {
  const [, matrixList] = workflow.match(/node-version:\s*\[([^\]]+)\]/) ?? [];
  const matrixVersions = matrixList.split(',').map((v) => v.trim());
  assert.ok(
    matrixVersions.includes(nvmrcVersion),
    `ci.yml's node-version matrix [${matrixVersions.join(', ')}] does not include the .nvmrc pin (${nvmrcVersion})`
  );
});
