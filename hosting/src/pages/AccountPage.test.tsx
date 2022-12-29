import React from 'react';
import {screen} from '@testing-library/react';
import {AccountPage} from './AccountPage';
import {mockProfile, testForCorePageElements} from '../testing-utils';

describe('AccountPage component', () => {
  test('renders an account page', () => {
    const profile = mockProfile(1);
    const accountID = Object.keys(profile)[0];
    testForCorePageElements(
      <AccountPage profile={profile} id={accountID}></AccountPage>,
      AccountPage.PAGE_ID
    );
  });
});
