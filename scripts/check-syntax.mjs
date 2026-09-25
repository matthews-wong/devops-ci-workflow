#!/usr/bin/env node
// Syntax-checks every .js file under src/ and test/ via `node --check`.
//
// A hardcoded file list in package.json's lint script silently stops
// checking new files the moment someone adds one and forgets to update it.
// Globbing the directories closes that gap without adding a dependency.
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function findJsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return findJsFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
  });
}

function main() {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const files = ['src', 'test']
    .map((dir) => path.join(root, dir))
    .flatMap(findJsFiles)
    .sort();

  if (files.length === 0) {
    throw new Error('check-syntax: found no .js files under src/ or test/');
  }

  for (const file of files) {
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
    console.log(`ok ${path.relative(root, file)}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
