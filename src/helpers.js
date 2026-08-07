/**
 * Small helper used by the CI-validation sample.
 * Kept dependency-free so the workflow can run tests with no install step.
 */

/** Add two numbers together. */
export function add(a, b) {
  return a + b;
}

/** Return the uppercase name, or a fallback when empty. */
export function greet(name) {
  return name ? `Hello, ${name}!` : 'Hello, world!';
}