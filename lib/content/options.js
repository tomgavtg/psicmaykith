export const EMPTY_OPTIONS = Object.freeze([]);

export function safeOptions(value) {
  return Array.isArray(value) ? value : EMPTY_OPTIONS;
}
