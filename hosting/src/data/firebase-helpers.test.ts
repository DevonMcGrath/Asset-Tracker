import React from 'react';
import {Timestamp} from 'firebase/firestore';
import {convertTimestamps} from './firebase-helpers';

describe('firebase-helpers convertTimestamps', () => {
  test('handles non-objects', () => {
    const testVals = [null, 'hello', true, 123, undefined];
    testVals.forEach((v) => convertTimestamps(v));
  });

  test('converts timestamps', () => {
    // Create test data
    const nowInSeconds = Math.round(Date.now() / 1000);
    const nowAsTimestamp = new Timestamp(nowInSeconds, 0);
    const nowAsDate = new Date(nowInSeconds * 1000);
    const testData = {
      a: null,
      b: nowAsTimestamp,
      c: {
        a: nowAsTimestamp,
        anotherLevel: {
          a: nowAsTimestamp
        }
      },
      array: [nowAsTimestamp, 123]
    };

    // Ensure all the timestamps were converted
    convertTimestamps(testData);
    expect(testData.b).toBeInstanceOf(Date);
    expect(testData.b).toEqual(nowAsDate);
    expect(testData.c.a).toBeInstanceOf(Date);
    expect(testData.c.a).toEqual(nowAsDate);
    expect(testData.c.anotherLevel.a).toBeInstanceOf(Date);
    expect(testData.c.anotherLevel.a).toEqual(nowAsDate);
    expect(testData.array[0]).toBeInstanceOf(Date);
    expect(testData.array[0]).toEqual(nowAsDate);
  });

  test('ignores fields that start with _', () => {
    // Create test data
    const nowInSeconds = Math.round(Date.now() / 1000);
    const nowAsTimestamp = new Timestamp(nowInSeconds, 0);
    const nowAsDate = new Date(nowInSeconds * 1000);
    const testData = {
      thisShouldBeConverted: nowAsTimestamp,
      _thisShouldNot: {
        a: nowAsTimestamp
      },
      _thisAlsoShouldnt: nowAsTimestamp
    };

    // Ensure all the correct fields were converted
    convertTimestamps(testData);
    expect(testData.thisShouldBeConverted).toBeInstanceOf(Date);
    expect(testData.thisShouldBeConverted).toEqual(nowAsDate);
    expect(testData._thisShouldNot.a).toBeInstanceOf(Timestamp);
    expect(testData._thisShouldNot.a).toEqual(nowAsTimestamp);
    expect(testData._thisAlsoShouldnt).toBeInstanceOf(Timestamp);
    expect(testData._thisAlsoShouldnt).toEqual(nowAsTimestamp);
  });
});
