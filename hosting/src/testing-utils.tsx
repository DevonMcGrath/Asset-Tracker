import React from 'react';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {
  Account,
  AccountSubtype,
  AccountType,
  AssetTrackerProfile,
  Transaction,
  TransactionType
} from './models/profile';

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
 * Selects an option from an array of options using `Math.random()`.
 * @param options the options to select from.
 * @returns one randomly selected option.
 */
export function selectOne<T>(options: T[]): T {
  return options[Math.round(Math.random() * options.length)];
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
export function generateFirestoreID(length: number = 20): string {
  const validChars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return generateID(validChars, length);
}

/**
 * Generates a random transaction for an account.
 * @param accountType the type of account the transaction is for.
 * @param accountCurrency the currency of the account.
 * @returns a randomly generated transaction based on the account type and
 * currency.
 */
export function generateTransaction(
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
export function generateAccount(transactions: number): Account {
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
    id: generateFirestoreID(28),
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
    account.transactions.push(generateTransaction(type, account.currency));
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
export function generateProfile(
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
    id: generateFirestoreID(),
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
      const account = generateAccount(Math.round(Math.random() * transactions));
      profile.accounts[account.id] = account;
    }
  }

  return profile;
}
