import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const labelerConfig = readFileSync(path.join(root, '.github/labeler.yml'), 'utf8');

// Parsed with a small line scanner rather than a YAML dependency, matching
// the regex-based approach test/config.test.js already uses on ci.yml.
function extractGlobs(yaml) {
  const lines = yaml.split('\n');
  const globs = [];
  for (let i = 0; i < lines.length; i += 1) {
    const scalarMatch = lines[i].match(/any-glob-to-any-file:\s*(.+)\s*$/);
    if (scalarMatch) {
      globs.push(scalarMatch[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }
    if (/any-glob-to-any-file:\s*$/.test(lines[i])) {
      for (let j = i + 1; j < lines.length && /^\s*-\s/.test(lines[j]); j += 1) {
        globs.push(lines[j].replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, ''));
      }
    }
  }
  return globs;
}

// A glob's literal prefix before the first wildcard — the part that must
// exist on disk. A pattern with no literal prefix (e.g. "**/*.md") matches
// from the repo root and has nothing narrower to check.
function literalBase(glob) {
  const wildcardIndex = glob.indexOf('*');
  const prefix = wildcardIndex === -1 ? glob : glob.slice(0, wildcardIndex);
  return prefix.replace(/\/$/, '');
}

test('every labeler.yml glob with a literal path prefix points at something that exists', () => {
  const globs = extractGlobs(labelerConfig);
  assert.ok(globs.length > 0, 'expected at least one any-glob-to-any-file pattern in labeler.yml');

  const missing = globs
    .map((glob) => ({ glob, base: literalBase(glob) }))
    .filter(({ base }) => base.length > 0)
    .filter(({ base }) => !existsSync(path.join(root, base)));

  assert.deepEqual(
    missing,
    [],
    `labeler.yml references paths that no longer exist: ${missing.map((m) => m.glob).join(', ')}`
  );
});
