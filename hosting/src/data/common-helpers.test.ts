import React from 'react';
import {getByProperty} from './common-helpers';

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
