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

/**
 * Formats a number with a specific number of decimal places.
 * @param v the number to format.
 * @param decimalPlaces the number of decimal places to include.
 * @returns the number, formatted to the specified number of decimal places.
 */
export function formatAsFloat(v: number, decimalPlaces: number = 3): string {
  if (isNaN(v)) return 'NaN';
  if (decimalPlaces < 1) return Math.round(v).toLocaleString();
  let decimalPart = '' + Math.round((v % 1) * Math.pow(10, decimalPlaces));
  while (decimalPart.length < decimalPlaces) {
    decimalPart = '0' + decimalPart;
  }
  return Math.floor(v).toLocaleString() + '.' + decimalPart;
}

/**
 * Formats a dollar amount.
 * @param amount the dollar amount to format.
 * @returns the amount, formatted in dollars.
 */
export function formatAsDollarValue(amount: number): string {
  const prefix = amount < 0 ? '-$' : '$';
  return prefix + formatAsFloat(Math.abs(amount), 2);
}
