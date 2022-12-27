// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {FirebaseApp, FirebaseOptions} from 'firebase/app';
import {Auth} from 'firebase/auth';
import {Firestore} from 'firebase/firestore';
import {FIREBASE_CONFIG} from './firebase-config';

const locationMock: {[key: string]: any} = {
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn()
};
for (const prop in window.location) {
  const v = (<any>window.location)[prop];
  if (locationMock[prop] === undefined) {
    locationMock[prop] = v;
  }
}
Object.defineProperty(window, 'location', {
  value: locationMock
});

function mockDefaultApp(): FirebaseApp {
  return {
    name: '[DEFAULT]',
    options: FIREBASE_CONFIG,
    automaticDataCollectionEnabled: false
  } as FirebaseApp;
}

jest.mock('firebase/app', () => {
  const originalModule = jest.requireActual('firebase/app');
  return {
    __esModule: true,
    ...originalModule,
    initializeApp: (options: FirebaseOptions, name?: string | undefined) => {
      if (!options.apiKey || !options.appId || !options.authDomain) {
        throw new Error('Invalid config.');
      }
      return {
        name: name || '[DEFAULT]',
        options,
        automaticDataCollectionEnabled: false
      } as FirebaseApp;
    }
  };
});

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');

  return {
    __esModule: true,
    ...originalModule,
    getAuth: () => {
      const app = mockDefaultApp();
      return {
        app: app,
        name: app.name
      } as Auth;
    },
    onAuthStateChanged: (
      auth: Auth,
      nextOrObserver: any,
      error?: any,
      completed?: any
    ) => {
      if (typeof nextOrObserver === 'function') {
        nextOrObserver(null);
      }
    },
    signOut: jest.fn(() => {})
  };
});

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');

  return {
    __esModule: true,
    ...originalModule,
    getFirestore: jest.fn(() => {
      const app = mockDefaultApp();
      return {
        app: app,
        name: app.name,
        type: 'firestore',
        toJSON: () => {
          return {};
        }
      } as Firestore;
    })
  };
});
