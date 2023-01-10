import React from 'react';
import {Account} from '../models/profile';
import {mockAccount} from '../testing-utils';
import {
  formatAccountTitle,
  formatAsDollarValue,
  formatAsFloat,
  formatDate,
  getByProperty
} from './common-helpers';

const getByPropertyData: {value: string}[] = [
  {value: 'abc'},
  {value: '123'},
  {value: 'xyz'},
  {value: '789'}
];

describe('common-helpers getByProperty', () => {
  test('handles empty arrays', () => {
    expect(getByProperty([], 'value', 'abc')).toBeNull();
  });

  test('finds an item', () => {
    const result = getByProperty(getByPropertyData, 'value', '123');
    expect(result).not.toBeNull();
    expect(result?.value.value).toEqual('123');
    expect(result?.index).toEqual(1);
  });

  test('starts searching at a specific index', () => {
    expect(getByProperty(getByPropertyData, 'value', '123', 2)).toBeNull();
  });

  test('returns null for missing item', () => {
    expect(
      getByProperty(getByPropertyData, 'value', 'no record has this value')
    ).toBeNull();
  });

  test('returns a default value for missing item', () => {
    const defaultValue = {value: 'this was not in the array'};
    const result = getByProperty(
      getByPropertyData,
      'value',
      'this also was not in the array',
      0,
      defaultValue
    );
    expect(result).not.toBeNull();
    expect(result?.value).toEqual(defaultValue);
    expect(result?.index).toEqual(-1);
  });
});

describe('common-helpers formatAsFloat', () => {
  test('formats 0 to 3 decimal places', () => {
    expect(formatAsFloat(0, 3)).toEqual('0.000');
  });

  test('formats a value with a thousands separator', () => {
    expect(formatAsFloat(1234.56, 4)).toEqual('1,234.5600');
  });

  test('formats a negative value', () => {
    expect(formatAsFloat(-1234, 0)).toEqual('-1,234');
  });

  test('formats NaN', () => {
    expect(formatAsFloat(NaN)).toEqual('NaN');
  });
});

describe('common-helpers formatAsDollarValue', () => {
  test('formats 0', () => {
    expect(formatAsDollarValue(0)).toEqual('$0.00');
  });

  test('formats a value with a thousands separator', () => {
    expect(formatAsDollarValue(1234.5678)).toEqual('$1,234.57');
  });

  test('formats a negative value', () => {
    expect(formatAsDollarValue(-1234)).toEqual('-$1,234.00');
  });

  test('formats NaN', () => {
    expect(formatAsDollarValue(NaN)).toEqual('$NaN');
  });
});

describe('common-helpers formatDate', () => {
  test('formats a date', () => {
    const date = '2023-01-17';
    expect(formatDate(new Date(date + ' 00:00'))).toEqual(date);
  });
});

describe('common-helpers formatAccountTitle', () => {
  function expectCorrectTitle(account: Account) {
    // Check the title
    const title = formatAccountTitle(account);
    if (account.name) {
      expect(title).toContain(account.name);
    } else {
      expect(title).toContain(`Account ${account.id}`);
    }
    if (account.institution) {
      expect(title).toContain(account.institution);
    }
    if (account.currency) {
      expect(title).toContain(account.currency);
    }
  }

  test('formats an account title', () => {
    const account = mockAccount(0);
    account.name = 'TEST ACCOUNT';
    account.institution = 'FAKE FI NAME';
    account.currency = 'CAD TEST';
    expectCorrectTitle(account);
    account.currency = '';
    expectCorrectTitle(account);
    account.institution = '';
    expectCorrectTitle(account);
    account.name = '';
    expectCorrectTitle(account);
  });
});
