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

/** Constrain a number to the inclusive [min, max] range. */
export function clamp(value, min, max) {
  if (min > max) {
    throw new RangeError(`clamp: min (${min}) must not exceed max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}

/** Return a new array with duplicate values removed, preserving order. */
export function unique(values) {
  return [...new Set(values)];
}

/** Split an array into chunks of at most `size` elements, preserving order. */
export function chunk(values, size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(`chunk: size (${size}) must be a positive integer`);
  }
  const chunks = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
}

/**
 * Call `fn` and retry on rejection up to `retries` additional times, waiting
 * `delayMs` between attempts. Rejects with the last error once attempts run out.
 */
export async function retry(fn, { retries = 3, delayMs = 0 } = {}) {
  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError(`retry: retries (${retries}) must be a non-negative integer`);
  }
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}