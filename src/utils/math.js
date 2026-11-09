export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const randomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

export function moveTowards(current, target, maxDelta) {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
}
