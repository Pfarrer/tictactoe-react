export function requireValidType<T>(value: string, validValues: readonly T[]): T {
  if (validValues.indexOf(value as T) !== -1) return value as T;
  else throw new Error(`Invalid value "${value}, expected one of ${validValues}"`);
}
