import React from 'react';
import {
  expectToHaveLinks,
  mockProfile,
  testForCorePageElements
} from '../testing-utils';
import {AddTransactionsPage} from './AddTransactionsPage';

describe('AddTransactionPage component', () => {
  test('renders an add transactions page', () => {
    const profile = mockProfile(1);
    const container = testForCorePageElements(
      <AddTransactionsPage profile={profile} />,
      AddTransactionsPage.PAGE_ID
    );
    expectToHaveLinks(container, ['/']);
  });

  test('renders an add transactions page for an account', () => {
    const profile = mockProfile(1);
    const accountID = Object.keys(profile.accounts)[0];
    const container = testForCorePageElements(
      <AddTransactionsPage profile={profile} accountID={accountID} />,
      AddTransactionsPage.PAGE_ID
    );
    expectToHaveLinks(container, ['/accounts/' + accountID]);
  });
});
