import {render} from '@testing-library/react';
import {
  changeField,
  click,
  expectToHaveLinks,
  fakeAuth,
  findOptionValue,
  mockProfile,
  testForCorePageElements,
  wrapInRouter
} from '../testing-utils';
import {AddTransactionPage} from './AddTransactionPage';
import {app} from '../data/AppManager';
import {Account, Transaction, TransactionType} from '../models/profile';
import {
  formatAccountTitle,
  formatAsDollarValue,
  formatDate
} from '../data/common-helpers';

type FieldID =
  | 'add-tr-account'
  | 'add-tr-date'
  | 'add-tr-date-other'
  | 'add-tr-type'
  | 'add-tr-amount'
  | 'add-tr-asset'
  | 'add-tr-quantity'
  | 'add-tr-currency';

type TransactionUpdates = {
  [field in keyof Transaction]?: any;
};

let allUpdates: TransactionUpdates = {};
beforeEach(() => {
  allUpdates = {};
});

/**
 * Updates a field value.
 * @param id the ID of the field to update.
 * @param value the new value.
 */
async function updateField(id: FieldID, value: string | null) {
  expect(await changeField(id, value || '')).toBeTruthy();
}

function setupAccount(account: Account): Account {
  account.name = 'TEST ACCOUNT FOR ADD TRANSACTION ' + account.id;
  account.transactions = [];
  return account;
}

/**
 * Sets the account to add the transaction to.
 * @param account the account for the transaction.
 */
async function setAccount(account: Account) {
  const accountIndex = findOptionValue(
    document.getElementById('add-tr-account'),
    (_, text) => text === formatAccountTitle(account),
    true
  );
  expect(accountIndex).not.toBeNull();
  await updateField('add-tr-account', accountIndex);
}

/**
 * Sets the date of the transaction.
 * @param date the new date.
 */
async function setTransactionDate(date: 'today' | 'yesterday' | string) {
  // Determine the preselected date
  let dateIndex = '2';
  let timestamp = date;
  if (date === 'today') {
    dateIndex = '0';
    timestamp = formatDate(new Date());
  } else if (date === 'yesterday') {
    dateIndex = '1';
    timestamp = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  }

  // Fire events
  await updateField('add-tr-date', dateIndex);
  if (dateIndex === '2') {
    await updateField('add-tr-date-other', date);
  }
  allUpdates.timestamp = new Date(timestamp + ' 12:00');
}

/**
 * Sets the transaction type field.
 * @param type the new transaction type.
 */
async function setTransactionType(type: TransactionType) {
  let typeIndex = findOptionValue(
    document.getElementById('add-tr-type'),
    (_, text) => text.toLowerCase() === type,
    true
  );
  expect(typeIndex).not.toBeNull();
  await updateField('add-tr-type', typeIndex);
  allUpdates.type = type;
}

/**
 * Sets the transaction amount.
 * @param amount the new transaction amount.
 */
async function setAmount(amount: number) {
  await updateField('add-tr-amount', formatAsDollarValue(amount));
  allUpdates.amount = amount;
}

/**
 * Sets the transaction asset.
 * @param assetName the new asset name.
 */
async function setAsset(assetName: string) {
  await updateField('add-tr-asset', assetName);
  allUpdates.assetName = assetName;
}

/**
 * Sets the transaction quantity.
 * @param quantity the number of assets that were affected.
 */
async function setAssetQuantity(quantity: number) {
  await updateField('add-tr-quantity', quantity.toString());
  allUpdates.assetQuantity = quantity;
}

/**
 * Sets the currency that the transaction took place in.
 * @param currency the transaction currency.
 */
async function setCurrency(currency: string) {
  await updateField('add-tr-currency', currency);
  allUpdates.currency = currency;
}

/**
 * Clicks the add transaction button.
 */
async function addTransaction() {
  expect(
    await click(document.getElementsByClassName('add-tr-add-btn').item(0))
  ).toBeTruthy();
}

function expectValidTransaction(transaction: Transaction) {
  for (const field in allUpdates) {
    const index = field as keyof Transaction;
    const actual = transaction[index];
    const expected = allUpdates[index];
    if (typeof actual === 'number') {
      expect(actual).toBeCloseTo(expected);
    } else {
      expect(actual).toEqual(expected);
    }
  }
}

// TESTS /////

describe('AddTransactionPage component', () => {
  test('renders an add transaction page', () => {
    const profile = mockProfile(1);
    const container = testForCorePageElements(
      <AddTransactionPage profile={profile} />,
      AddTransactionPage.PAGE_ID
    );
    expectToHaveLinks(container, ['/']);
  });

  test('renders an add transaction page for an account', () => {
    const profile = mockProfile(1);
    const accountID = Object.keys(profile.accounts)[0];
    const container = testForCorePageElements(
      <AddTransactionPage profile={profile} accountID={accountID} />,
      AddTransactionPage.PAGE_ID
    );
    expectToHaveLinks(container, ['/accounts/' + accountID]);
  });

  test('allows building a cash transaction', async () => {
    await fakeAuth(app, async () => {
      // Create the mock data
      const profile = mockProfile(3);
      const accountID = Object.keys(profile.accounts)[0];
      const account = setupAccount(profile.accounts[accountID]);
      account.type = 'bank';
      account.subtype = 'savings';

      render(wrapInRouter(<AddTransactionPage profile={profile} />));

      // Build the transaction
      await setAccount(account);
      await setTransactionDate('2023-01-17');
      await setTransactionType('interest');
      await setAmount(123456.78);

      // Add the transaction
      await addTransaction();

      // Check the result
      expect(account.transactions.length).toEqual(1);
      const transaction = account.transactions[0];
      expectValidTransaction(transaction);
    });
  });

  test('allows building a bank purchase transaction', async () => {
    await fakeAuth(app, async () => {
      // Create the mock data
      const profile = mockProfile(3);
      const accountID = Object.keys(profile.accounts)[0];
      const account = setupAccount(profile.accounts[accountID]);
      account.type = 'bank';
      account.subtype = 'savings';

      render(wrapInRouter(<AddTransactionPage profile={profile} />));

      // Build the transaction
      await setAccount(account);
      await setTransactionDate('yesterday');
      await setTransactionType('purchase');
      await setAmount(117.3);
      await setAsset('TEST ITEM');
      await setAssetQuantity(20);

      // Add the transaction
      await addTransaction();

      // Check the result
      expect(account.transactions.length).toEqual(1);
      const transaction = account.transactions[0];
      expectValidTransaction(transaction);
    });
  });

  test('allows building an investment purchase transaction', async () => {
    await fakeAuth(app, async () => {
      // Create the mock data
      const profile = mockProfile(3);
      const accountID = Object.keys(profile.accounts)[0];
      const account = setupAccount(profile.accounts[accountID]);
      account.type = 'investment';
      account.subtype = 'non-reg';

      render(wrapInRouter(<AddTransactionPage profile={profile} />));

      // Build the transaction
      await setAccount(account);
      await setTransactionDate('today');
      await setTransactionType('purchase');
      await setAmount(117.3);
      await setAsset('ZCN');
      await setAssetQuantity(4);
      await setCurrency('TEST CURRENCY');

      // Add the transaction
      await addTransaction();

      // Check the result
      expect(account.transactions.length).toEqual(1);
      const transaction = account.transactions[0];
      expectValidTransaction(transaction);
    });
  });

  test('fails to add a transaction with no account', async () => {
    await fakeAuth(app, async () => {
      // Create the mock data
      const profile = mockProfile(3);
      const accountID = Object.keys(profile.accounts)[0];
      const account = setupAccount(profile.accounts[accountID]);
      account.type = 'bank';
      account.subtype = 'savings';

      render(wrapInRouter(<AddTransactionPage profile={profile} />));

      // Try to add the transaction
      await addTransaction();

      // Check the result
      expect(account.transactions.length).toEqual(0);
    });
  });

  test('fails to add a transaction with no type', async () => {
    await fakeAuth(app, async () => {
      // Create the mock data
      const profile = mockProfile(3);
      const accountID = Object.keys(profile.accounts)[0];
      const account = setupAccount(profile.accounts[accountID]);
      account.type = 'bank';
      account.subtype = 'savings';

      render(wrapInRouter(<AddTransactionPage profile={profile} />));

      await setAccount(account);

      // Try to add the transaction
      await addTransaction();

      // Check the result
      expect(account.transactions.length).toEqual(0);
    });
  });

  test('fails to add a transaction with no date', async () => {
    await fakeAuth(app, async () => {
      // Create the mock data
      const profile = mockProfile(3);
      const accountID = Object.keys(profile.accounts)[0];
      const account = setupAccount(profile.accounts[accountID]);
      account.type = 'investment';
      account.subtype = 'non-reg';

      render(wrapInRouter(<AddTransactionPage profile={profile} />));

      await setAccount(account);
      await setTransactionType('sale');
      await setTransactionDate('');

      // Try to add the transaction
      await addTransaction();

      // Check the result
      expect(account.transactions.length).toEqual(0);
    });
  });
});
