import {AccountsPage} from './AccountsPage';
import {
  click,
  expectToHaveLinks,
  fakeAuth,
  fakeConsole,
  mockFirestore,
  mockProfile,
  testForCorePageElements
} from '../testing-utils';
import {AssetTrackerProfile} from '../models/profile';
import {app} from '../data/AppManager';
import {dataManager} from '../data/DataManager';

function getAccountLinks(profile: AssetTrackerProfile): string[] {
  return Object.keys(profile.accounts).map((id) => {
    return `/accounts/${id}`;
  });
}

describe('AccountsPage component', () => {
  test('renders an accounts page', () => {
    const profile = mockProfile(0);
    testForCorePageElements(
      <AccountsPage profile={profile} rerender={() => {}} />,
      AccountsPage.PAGE_ID
    );
  });

  test('links to accounts', () => {
    const profile = mockProfile(10);
    const accountLinks = getAccountLinks(profile);
    const container = testForCorePageElements(
      <AccountsPage profile={profile} rerender={() => {}} />,
      AccountsPage.PAGE_ID
    );
    expectToHaveLinks(container, accountLinks);
  });

  test('creates an account', async () => {
    await fakeAuth(app, async () => {
      // Render the initial profile with no accounts
      const profile = mockProfile(0);
      const container = testForCorePageElements(
        <AccountsPage profile={profile} rerender={() => {}} />,
        AccountsPage.PAGE_ID
      );

      // Create an account
      expect(Object.keys(profile.accounts).length).toEqual(0);
      const btns = container.getElementsByClassName('accounts-create-btn');
      await click(btns.item(0));

      // Check the new account
      const accountIDs = Object.keys(profile.accounts);
      expect(accountIDs.length).toEqual(1);
      const accountDocRef = dataManager.getAccountDoc(accountIDs[0]);
      expect(mockFirestore.get(accountDocRef)).toBeDefined();
      expect(window.location.assign).toBeCalledTimes(1);
    });
  });

  test('fails to create an account when not logged in', async () => {
    await fakeConsole(async () => {
      // Render the initial profile with no accounts
      const profile = mockProfile(0);
      const container = testForCorePageElements(
        <AccountsPage profile={profile} rerender={() => {}} />,
        AccountsPage.PAGE_ID
      );

      // Try to create an account
      expect(Object.keys(profile.accounts).length).toEqual(0);
      const btns = container.getElementsByClassName('accounts-create-btn');
      await click(btns.item(0));
      expect(Object.keys(profile.accounts).length).toEqual(0);
    });
  });
});
