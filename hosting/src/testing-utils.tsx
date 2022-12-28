import React from 'react';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {User, IdTokenResult} from 'firebase/auth';
import {
  Account,
  AccountSubtype,
  AccountType,
  AssetTrackerProfile,
  Transaction,
  TransactionType
} from './models/profile';
import {AppManager} from './data/AppManager';

/**
 * The `FirestoreStorageMock` class contains a simple storage mechanism to
 * store Firestore Documents, with the ability to reset the storage.
 */
export class FirestoreStorageMock {
  /**
   * The data stored in the Firestore mock database.
   */
  public data: {[path: string]: any} = {};

  /**
   * Removes all data from the mock Firestore database.
   */
  public reset() {
    this.data = {};
  }
}

/**
 * The mock Firestore database storage for testing.
 */
export const mockFirestore = new FirestoreStorageMock();

/**
 * Wraps content that may need to be rendered as a descendant of a router.
 * @param content the content that may need to be in a router.
 * @returns the content, wrapped in a {@link BrowserRouter}.
 */
export function wrapInRouter(content: any): JSX.Element {
  return <BrowserRouter>{content}</BrowserRouter>;
}

/**
 * Tests that a page renders with the header and body of the page.
 * @param page the page element to check.
 * @returns the container element of the rendered page.
 */
export function testForCorePageElements(page: JSX.Element): HTMLElement {
  const {container} = render(wrapInRouter(page));
  expect(container.getElementsByClassName('app-header').length).toEqual(1);
  expect(container.getElementsByClassName('app-body').length).toEqual(1);
  return container;
}

/**
 * Creates a fake user and makes the app manager act as if that user was logged
 * in to the app.
 * @param app the app manager that determines if the user is authenticated.
 * @param callback the callback to perform tests in.
 */
export async function fakeAuth(
  app: AppManager,
  callback: (user: User) => Promise<void>
): Promise<void> {
  const user = mockUser();

  // Create the mock return values
  const isLoggedInSpy = jest.spyOn(app, 'isLoggedIn').mockImplementation(() => {
    return true;
  });
  const getIsAuthReadySpy = jest
    .spyOn(app, 'getIsAuthReady')
    .mockImplementation(() => {
      return true;
    });
  const getUserSpy = jest.spyOn(app, 'getUser').mockReturnValue(user);
  const getUIDSpy = jest.spyOn(app, 'getUID').mockImplementation(() => {
    return user.uid;
  });

  // Run the code in between
  await callback(user);

  // Restore everything
  isLoggedInSpy.mockRestore();
  getIsAuthReadySpy.mockRestore();
  getUserSpy.mockRestore();
  getUIDSpy.mockRestore();
}

/**
 * Selects an option from an array of options using `Math.random()`.
 * @param options the options to select from.
 * @returns one randomly selected option.
 */
export function selectOne<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generates a random ID.
 * @param chars the characters that can be used in the ID.
 * @param length the length of the ID to generate.
 * @returns an ID that contains only characters from the list of characters
 * provided, with the specified length.
 */
export function generateID(chars: string, length: number) {
  const totalChars = chars.length;
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.round(Math.random() * totalChars));
  }
  return id;
}

/**
 * Generates a random Firestore ID. Document IDs are typically 20 charcaters,
 * while user IDs are typically 28.
 * @param length the length of the Firestore ID to generate.
 * @returns the randomly generated Firestore ID.
 */
export function mockFirestoreID(length: number = 20): string {
  const validChars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return generateID(validChars, length);
}

/**
 * Creates a random Firebase app user who is signed-in.
 * @returns a user with a randomly generated ID.
 */
export function mockUser(): User {
  const user: User = {
    uid: mockFirestoreID(28),
    displayName: selectOne(['Alice Xu', 'John Smith', 'Olivia Johnson']),
    email: selectOne([
      'email1@example.com',
      'email56@example.com',
      'email117@example.com'
    ]),
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    phoneNumber: null,
    photoURL: null,
    providerData: [],
    providerId: '123',
    refreshToken: '123',
    tenantId: 'abc',
    delete: async () => {},
    getIdToken: async () => {
      return 'abc';
    },
    getIdTokenResult: async () => {
      return {} as IdTokenResult;
    },
    reload: async () => {},
    toJSON: () => {
      return {};
    }
  };
  return user;
}

/**
 * Generates a random transaction for an account.
 * @param accountType the type of account the transaction is for.
 * @param accountCurrency the currency of the account.
 * @returns a randomly generated transaction based on the account type and
 * currency.
 */
export function mockTransaction(
  accountType: AccountType,
  accountCurrency: string
): Transaction {
  const timestamp = new Date(
    Date.now() - Math.round(2 + Math.random() * 2) * 24 * 60 * 60 * 1000
  );
  const amount = 10 + Math.round(Math.random() * 10000 * 100) / 100.0;

  // Banking transaction
  if (accountType !== 'investment') {
    const type = selectOne([
      'deposit',
      'withdrawal',
      'purchase'
    ] as TransactionType[]);
    return {
      timestamp,
      type,
      amount,
      currency: accountCurrency,
      assetName: '_CASH',
      assetQuantity: amount
    } as Transaction;
  }

  // Determine type and asset for the investment transaction
  const type = selectOne([
    'deposit',
    'withdrawal',
    'purchase',
    'sale'
  ] as TransactionType[]);
  let asset = '_CASH';
  if (type === 'purchase' || type === 'sale') {
    asset = [
      generateID('ABCDEFGHIJKLMNOPQRSTUVWXYZ', selectOne([3, 4])),
      '_MIXED'
    ][selectOne([0, 0, 0, 0, 1])];
  }
  let quantity = amount;
  if (asset !== '_CASH' && asset !== '_MIXED') {
    quantity = Math.round(1 + Math.random() * (amount + 100));
  }

  // Build the transaction
  let transaction: Transaction = {
    timestamp,
    type,
    currency: selectOne([
      accountCurrency,
      accountCurrency,
      accountCurrency,
      accountCurrency === 'CAD' ? 'USD' : 'CAD'
    ]),
    amount,
    assetName: asset,
    assetQuantity: quantity
  };

  return transaction;
}

/**
 * Generates an account.
 * @param transactions the number of transactions the account should have.
 * @returns the randomly generated account with the specified number of
 * transactions.
 */
export function mockAccount(transactions: number): Account {
  // Determine account type/subtype
  const type: AccountType = selectOne([
    'bank',
    'investment',
    'other'
  ] as AccountType[]);
  let subtype: AccountSubtype = 'other';
  if (type === 'bank') {
    subtype = selectOne(['chequing', 'savings'] as AccountSubtype[]);
  } else if (type === 'investment') {
    subtype = selectOne(['non-reg', 'TFSA', 'RRSP'] as AccountSubtype[]);
  }

  // Create basic account
  let account: Account = {
    created: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    id: mockFirestoreID(28),
    name: selectOne(['Account 1', 'Account 2', 'Account 3']),
    institution: selectOne([
      'BMO',
      'RBC',
      'TD',
      'Scotia',
      'CIBC',
      'Wealthsimple'
    ]),
    type: type,
    subtype: subtype,
    currency: selectOne(['CAD', 'USD']),
    transactions: []
  };

  // Add the transactions
  for (let i = 0; i < transactions; i++) {
    account.transactions.push(mockTransaction(type, account.currency));
  }
  account.transactions = account.transactions.sort((a, b) =>
    a.timestamp.valueOf() < b.timestamp.valueOf() ? -1 : 1
  );

  return account;
}

/**
 * Generates a profile with specific numbers of accounts and transactions.
 * @param accounts the number of accounts or the array of accounts the profile
 * should contain.
 * @param transactions the number of transactions each account should have
 * (only applies when the `accounts` is a number).
 * @returns the randomly generated profile.
 */
export function mockProfile(
  accounts: number | Account[],
  transactions: number = 100
): AssetTrackerProfile {
  // Potential owners of the profile
  let owners: {name: string; email: string; photoURL?: string}[] = [
    {
      name: 'Alice Xu',
      email: 'alice.xu@example.com'
    },
    {
      name: 'John Smith',
      email: 'john.smith@example2.com',
      photoURL: 'https://example2.com/john.smith/profile.png'
    }
  ];

  // Base profile
  let profile: AssetTrackerProfile = {
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    id: mockFirestoreID(),
    owner: selectOne(owners)
  };

  // Array of accounts
  if (Array.isArray(accounts) && accounts.length > 0) {
    profile.accounts = {};
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      profile.accounts[account.id] = account;
    }
  }

  // Number of accounts
  else if (typeof accounts === 'number' && accounts > 0) {
    profile.accounts = {};
    for (let i = 0; i < accounts; i++) {
      const account = mockAccount(Math.round(Math.random() * transactions));
      profile.accounts[account.id] = account;
    }
  }

  return profile;
}
