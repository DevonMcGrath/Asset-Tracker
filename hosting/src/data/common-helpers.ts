import {Account} from '../models/profile';

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
 * Formats a number based on an English locale, i.e. a comma for the thousands
 * separator and a period before any decimal portion of the number.
 * @param v the number to format.
 * @returns a number formatted in the English locale.
 */
function toENLocaleNumber(v: number): string {
  const numParts = ('' + v).split('.');
  const intPart = numParts[0];

  // Add a thousands separator
  let formattedIntPart = '';
  const n = intPart.length;
  for (let i = 0; i < n; i += 3) {
    const start = n - i - 3;
    formattedIntPart =
      intPart.substring(start, start + 3) + ',' + formattedIntPart;
  }
  formattedIntPart = formattedIntPart.replace(/(^,|,$)/g, '');

  if (numParts.length > 1) {
    return formattedIntPart + '.' + numParts[1];
  }
  return formattedIntPart;
}

/**
 * Formats a number with a specific number of decimal places.
 * @param v the number to format.
 * @param decimalPlaces the number of decimal places to include.
 * @returns the number, formatted to the specified number of decimal places.
 */
export function formatAsFloat(v: number, decimalPlaces: number = 3): string {
  if (isNaN(v)) return 'NaN';
  if (decimalPlaces < 1) return toENLocaleNumber(Math.round(v));
  let decimalPart = '' + Math.round((v % 1) * Math.pow(10, decimalPlaces));
  while (decimalPart.length < decimalPlaces) {
    decimalPart = '0' + decimalPart;
  }
  return toENLocaleNumber(Math.floor(v)) + '.' + decimalPart;
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

/**
 * Formats the day, month, and year portion of a date.
 * @param date the date to format.
 * @returns the formatted date in ISO format (yyyy-mm-dd).
 */
export function formatDate(date: Date) {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2)
  );
}

/**
 * Gets a standard title for an account.
 * @param account the account to create a title for.
 * @returns the title.
 */
export function formatAccountTitle(account: Account): string {
  let title = account.name || 'Account ' + account.id;
  if (account.currency) {
    title += ' (' + account.currency + ')';
  }
  if (account.institution) {
    title = account.institution + ': ' + title;
  }
  return title;
}
