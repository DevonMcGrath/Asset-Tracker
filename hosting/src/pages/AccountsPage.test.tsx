import React from 'react';
import {screen} from '@testing-library/react';
import {AccountsPage} from './AccountsPage';
import {mockProfile, testForCorePageElements} from '../testing-utils';

describe('AccountsPage component', () => {
  test('renders an accounts page', () => {
    const profile = mockProfile(0);
    testForCorePageElements(
      <AccountsPage profile={profile}></AccountsPage>,
      AccountsPage.PAGE_ID
    );
  });
});
