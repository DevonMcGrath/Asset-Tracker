import React from 'react';
import {Settings} from '../settings';
import {fakeAuth} from '../testing-utils';
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
});
