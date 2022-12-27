import React from 'react';
import {initializeApp} from 'firebase/app';
import {signOut} from 'firebase/auth';
import {FIREBASE_CONFIG} from '../firebase-config';
import {app, AppManager} from './AppManager';

describe('AppManager class', () => {
  test('initializes with default firebase config', () => {
    expect(app.getApp().options.appId).toEqual(FIREBASE_CONFIG.appId);
    expect(app.getAuth().app.options.appId).toEqual(FIREBASE_CONFIG.appId);
    expect(app.getFirestore().app.options.appId).toEqual(FIREBASE_CONFIG.appId);
  });

  test('does not initialize with invalid firebase config', () => {
    function createInvalid() {
      new AppManager({});
    }
    expect(createInvalid).toThrowError();
  });

  test('is logged out', () => {
    const app = new AppManager();
    app.setOnAuthReady(); // ensure this works
    app.setOnAuthReady((_, user) => {
      expect(user).toBeNull();
      expect(app.getIsAuthReady()).toBeTruthy();
      expect(app.isLoggedIn()).toBeFalsy();
      expect(app.getUID()).toEqual('');
    });
  });

  test('signs out', async () => {
    const app = new AppManager();
    await app.logout();
    expect(signOut).toBeCalled();
  });

  test('adds size query string to google picture', () => {
    const pic = 'https://googleusercontent.com/test/profile.png';
    expect(AppManager.addSizeToGoogleProfilePic(pic)).toMatch(/\?sz=\d+$/);
  });

  test('does not add size query string to a non-google picture', () => {
    const pic = 'https://somewebsite.com/test/profile.png';
    expect(AppManager.addSizeToGoogleProfilePic(pic)).not.toMatch(/\?sz=\d+$/);
  });
});
