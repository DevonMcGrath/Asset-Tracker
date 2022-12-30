import {AccountPage} from './AccountPage';
import {
  click,
  fakeAuth,
  mockFirestore,
  mockProfile,
  testForCorePageElements
} from '../testing-utils';
import {ErrorPage} from './ErrorPage';
import {act, prettyDOM, render} from '@testing-library/react';
import {app} from '../data/AppManager';
import {dataManager} from '../data/DataManager';

describe('AccountPage component', () => {
  test('renders an account page', () => {
    const profile = mockProfile(1);
    const accountID = Object.keys(profile.accounts)[0];
    testForCorePageElements(
      <AccountPage profile={profile} id={accountID} />,
      AccountPage.PAGE_ID
    );
  });

  test('renders an error page when an invalid account ID is passed', () => {
    const profile = mockProfile(1);
    testForCorePageElements(
      <AccountPage profile={profile} id={''} />,
      ErrorPage.PAGE_ID
    );
  });

  test('updates an account', async () => {
    await fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      const account = profile.accounts[accountID];
      mockFirestore.set(dataManager.getAccountDoc(accountID), account);
      const originalUpdated = account.updated.valueOf();

      // Render the page
      const container = testForCorePageElements(
        <AccountPage profile={profile} id={accountID} />,
        AccountPage.PAGE_ID
      );

      // Find the update button and click it
      const btns = container.getElementsByClassName('account-info-update-btn');
      await click(btns.item(0));
      expect(account.updated.valueOf()).not.toEqual(originalUpdated);
    });
  });

  test('deletes an account', async () => {
    await fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      const account = profile.accounts[accountID];
      const accountDocRef = dataManager.getAccountDoc(accountID);
      mockFirestore.set(accountDocRef, account);
      expect(mockFirestore.get(accountDocRef)).toStrictEqual(account);

      // Render the page
      const container = testForCorePageElements(
        <AccountPage profile={profile} id={accountID} />,
        AccountPage.PAGE_ID
      );

      // Find the delete button and click it
      const btns = container.getElementsByClassName('account-delete-btn');
      await click(btns.item(0));
      expect(mockFirestore.get(accountDocRef)).not.toBeDefined();
      expect(window.location.replace).toBeCalledTimes(1);
    });
  });
});
