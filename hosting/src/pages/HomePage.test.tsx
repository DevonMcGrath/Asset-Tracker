import {render, screen} from '@testing-library/react';
import {HomePage} from './HomePage';
import {
  mockProfile,
  testForCorePageElements,
  wrapInRouter
} from '../testing-utils';

describe('HomePage component', () => {
  test('renders a home page', () => {
    const profile = mockProfile(0);
    testForCorePageElements(<HomePage profile={profile} />, HomePage.PAGE_ID);
  });

  test('renders a home page with multiple account summaries', () => {
    const numberOfAccounts = 10;
    const profile = mockProfile(numberOfAccounts);
    testForCorePageElements(<HomePage profile={profile} />, HomePage.PAGE_ID);
    expect(document.getElementsByClassName('account-summary').length).toEqual(
      numberOfAccounts
    );
  });
});
