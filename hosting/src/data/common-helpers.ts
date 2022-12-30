/**
 * Finds a value in an array by property value.
 * @param values the records to search.
 * @param property the property to check in each record.
 * @param value the value the property value must match.
 * @param start the starting index to search the values.
 * @param defaultValue the default value that is provided if no matching
 * record is found.
 * @returns the matching record/index combo, or null if no record is found and
 * no default value is provided.
 */
export function getByProperty<T>(
  values: T[],
  property: keyof T,
  value: any,
  start: number = 0,
  defaultValue: T | null = null
): {value: T; index: number} | null {
  // Find the value, if it exists
  const n = values.length;
  for (let i = Math.max(0, start); i < n; i++) {
    const current = values[i];
    if (current[property] === value) {
      return {value: current, index: i};
    }
  }
  if (defaultValue !== null) {
    return {value: defaultValue, index: -1};
  }
  return null;
}
