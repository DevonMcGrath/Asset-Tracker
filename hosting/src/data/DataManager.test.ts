import React from 'react';
import {Settings} from '../settings';
import {
  fakeAuth,
  mockAccount,
  mockFirestore,
  mockProfile,
  mockTransaction
} from '../testing-utils';
import {app} from './AppManager';
import {DataManager, dataManager} from './DataManager';

describe('DataManager class', () => {
  test('fails to create a document reference when not logged in', () => {
    function notLoggedInCheck() {
      dataManager.doc();
    }
    expect(notLoggedInCheck).toThrowError();
  });

  test('creates a profile document reference', () => {
    fakeAuth(app, async (user) => {
      const doc = dataManager.doc();
      expect(doc.path).toMatch(new RegExp(`/profiles/${user.uid}$`));
    });
  });

  test('creates an account collection reference', () => {
    fakeAuth(app, async (user) => {
      const collectionName = DataManager.ACCOUNTS_COLLECTION;
      const collection = dataManager.collection([collectionName]);
      expect(collection.path).toMatch(
        new RegExp(`/profiles/${user.uid}/${collectionName}$`)
      );
    });
  });

  test('creates an account document reference', () => {
    fakeAuth(app, async (user) => {
      const accountID = 'this-is-an-account-id';
      const doc = dataManager.getAccountDoc(accountID);
      expect(doc.path).toMatch(
        new RegExp(
          `/profiles/${user.uid}/${DataManager.ACCOUNTS_COLLECTION}/${accountID}$`
        )
      );
    });
  });

  test('handles a base firestore path not ending in /', () => {
    const base = Settings.FIRESTORE_BASE_PATH;
    Settings.FIRESTORE_BASE_PATH = 'test';
    fakeAuth(app, async () => {
      const doc = dataManager.doc();
      expect(doc.path).toMatch(/^test\/profiles\//);
    });
    Settings.FIRESTORE_BASE_PATH = base;
  });

  test('fails to get a non-existent profile', () => {
    fakeAuth(app, async () => {
      dataManager
        .getFullProfile()
        .then(() => {
          fail('No error was thrown.');
        })
        .catch(() => {});
    });
  });

  test('creates a profile', () => {
    fakeAuth(app, async (user) => {
      // Create the profile
      Object.defineProperty(user, 'photoURL', {
        value: 'test' // add a photo URL to ensure it gets added too
      });
      const profile = await dataManager.createProfile();
      expect(profile.id).toEqual(user.uid);
      expect(profile.owner.name).toEqual(user.displayName);
      expect(profile.owner.email).toEqual(user.email);
      expect(profile.owner.photoURL).toEqual(user.photoURL);

      // Get the profile from firestore
      const profileFromFirestore = await dataManager.getFullProfile();
      expect(profile.id).toEqual(profileFromFirestore.id);
    });
  });

  test('a profile cannot be recreated once it exists', () => {
    fakeAuth(app, async (user) => {
      // Create the profile
      const profile = await dataManager.createProfile();

      // Try to create again (it should be the same)
      const profile2 = await dataManager.createProfile();
      expect(profile).toEqual(profile2);
    });
  });

  test('creates an account clone', () => {
    const original = mockAccount(10);
    const clone = DataManager.cloneAccount(original);
    expect(original).toEqual(clone);
    expect(original).not.toStrictEqual(clone);
  });

  test('creates a transaction clone', () => {
    const original = mockTransaction('investment', 'CAD');
    const clone = DataManager.cloneTransaction(original);
    expect(original).toEqual(clone);
    expect(original).not.toStrictEqual(clone);
  });

  test('creates an account', () => {
    fakeAuth(app, async () => {
      // Create the account
      const profile = mockProfile(0);
      const account = await dataManager.addAccount(profile, {
        created: new Date(),
        updated: new Date(),
        id: '',
        name: 'New Account',
        institution: 'Institution Name',
        currency: 'USD',
        type: 'investment',
        subtype: 'other',
        transactions: []
      });

      // Check the results
      const savedAccount = mockFirestore.get(
        dataManager.getAccountDoc(account.id)
      );
      savedAccount.created = account.created;
      savedAccount.updated = account.updated;
      savedAccount.id = account.id;
      expect(savedAccount).toEqual(account);
      expect(profile.accounts[account.id]).toBeDefined();
      expect(profile.accounts[account.id]).toEqual(account);
    });
  });

  test('updates an account document', () => {
    fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      const account = profile.accounts[accountID];
      mockFirestore.set(dataManager.getAccountDoc(accountID), account);
      const originalUpdated = account.updated.valueOf();

      // Update the document
      await dataManager.updateAccountInfo(account);
      expect(account.updated.valueOf()).not.toEqual(originalUpdated);
    });
  });

  test('fails to update an account with no ID', () => {
    fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      let account = profile.accounts[accountID];
      mockFirestore.set(dataManager.getAccountDoc(accountID), account);
      account.id = '';

      try {
        await dataManager.updateAccountInfo(account);
        fail('The update account info call did not fail.');
      } catch (e) {}
    });
  });

  test('updates account document transactions', () => {
    fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      const account = profile.accounts[accountID];
      account.transactions = [];
      mockFirestore.set(dataManager.getAccountDoc(accountID), account);
      const originalUpdated = account.updated.valueOf();

      // Update the document
      await dataManager.updateAccountTransactions(account);
      expect(account.updated.valueOf()).not.toEqual(originalUpdated);
    });
  });

  test('fails to update account with no ID', () => {
    fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      let account = profile.accounts[accountID];
      mockFirestore.set(dataManager.getAccountDoc(accountID), account);
      account.id = '';

      try {
        await dataManager.updateAccountTransactions(account);
        fail('The update account transactions call did not fail.');
      } catch (e) {}
    });
  });

  test('deletes an account', () => {
    fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      const account = profile.accounts[accountID];
      const reference = dataManager.getAccountDoc(accountID);
      mockFirestore.set(reference, account);

      // Delete account
      expect(mockFirestore.get(reference)).toEqual(account);
      await dataManager.deleteAccount(profile, account);
      expect(mockFirestore.get(reference)).not.toBeDefined();
    });
  });

  test('fails to delete an account with no ID', () => {
    fakeAuth(app, async () => {
      // Set up the data
      const profile = mockProfile(1);
      const accountID = Object.keys(profile.accounts)[0];
      let account = profile.accounts[accountID];
      mockFirestore.set(dataManager.getAccountDoc(accountID), account);
      account.id = '';

      try {
        await dataManager.deleteAccount(profile, account);
        fail('The delete account call did not fail.');
      } catch (e) {}
    });
  });

  test('sorts an array of transactions by timestamp desc', () => {
    // Create mock data
    const updated = new Date();
    const transactionA = mockTransaction('investment', 'CAD'); // oldest
    const transactionB = mockTransaction('investment', 'CAD'); // newest
    const transactionC = mockTransaction('investment', 'CAD');
    transactionA.updated = updated;
    transactionB.updated = new Date(updated.valueOf() + 1000);
    transactionC.updated = updated;
    transactionB.timestamp = new Date(transactionA.timestamp.valueOf() + 1000);
    transactionC.timestamp = transactionB.timestamp;
    const transactions = [transactionA, transactionB, transactionC];

    // Sort and check the result
    DataManager.sortTransactions(transactions);
    expect(transactions[0]).toStrictEqual(transactionB);
    expect(transactions[1]).toStrictEqual(transactionC);
    expect(transactions[2]).toStrictEqual(transactionA);
  });
});
