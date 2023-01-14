// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {FirebaseApp, FirebaseOptions} from 'firebase/app';
import {Auth} from 'firebase/auth';
import {
  Firestore,
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot
} from 'firebase/firestore';
import {FIREBASE_CONFIG} from './firebase-config';
import {mockFirestore, mockFirestoreID} from './testing-utils';

declare global {
  var google: any;
}

// Google Charts
global.google = {
  charts: {
    load: jest.fn(),
    setOnLoadCallback: (callback: any) => {
      if (typeof callback === 'function') callback();
    }
  },
  visualization: {
    PieChart: class {
      draw = jest.fn();
    },
    arrayToDataTable: jest.fn()
  }
};

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

// Set up before each test
beforeEach(() => {
  // Reset firestore data
  mockFirestore.reset();
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

// Mocks a document based on a path
function mockDocument(
  firestore: Firestore,
  path: string[]
): DocumentReference<DocumentData> | null {
  if (!path.length) return null;

  // Get basic document details
  const pathCopy = path.concat([]);
  const fullPathAsString = pathCopy.join('/');
  const id = pathCopy.splice(pathCopy.length - 1, 1)[0];

  // Create the full object
  const result: DocumentReference<DocumentData> = {
    path: fullPathAsString,
    id,
    type: 'document',
    firestore,
    parent: mockCollection(firestore, pathCopy),
    converter: {
      fromFirestore: jest.fn(),
      toFirestore: jest.fn()
    },
    withConverter: jest.fn()
  };

  return result;
}

// Mocks a collection based on a path
function mockCollection(
  firestore: Firestore,
  path: string[]
): CollectionReference<DocumentData> {
  // Get basic collection details
  const pathCopy = path.concat([]);
  const fullPathAsString = pathCopy.join('/');
  const id = pathCopy.splice(pathCopy.length - 1, 1)[0];

  // Create the full object
  const result: CollectionReference<DocumentData> = {
    path: fullPathAsString,
    id,
    type: 'collection',
    firestore,
    parent: mockDocument(firestore, pathCopy),
    converter: {
      fromFirestore: jest.fn(),
      toFirestore: jest.fn()
    },
    withConverter: jest.fn()
  };

  return result;
}
jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');

  return {
    __esModule: true,
    ...originalModule,
    getFirestore: () => {
      const app = mockDefaultApp();
      return {
        app: app,
        name: app.name,
        type: 'firestore',
        toJSON: () => {
          return {};
        }
      } as Firestore;
    },

    doc: (firestore: Firestore, path: string, ...pathSegments: string[]) => {
      const fullPath = [path].concat(pathSegments);
      return mockDocument(firestore, fullPath);
    },

    collection: (
      firestore: Firestore,
      path: string,
      ...pathSegments: string[]
    ) => {
      const fullPath = [path].concat(pathSegments);
      return mockCollection(firestore, fullPath);
    },

    addDoc: <T>(reference: CollectionReference<T>, data: any) => {
      if (!data || typeof data !== 'object') data = {};
      const id = mockFirestoreID();
      const result = {
        firestore: {
          app: mockDefaultApp(),
          toJSON: () => {
            return {};
          },
          type: 'firestore'
        },
        id: id,
        path: reference.path + '/' + id,
        type: 'document',
        converter: {
          fromFirestore: jest.fn(),
          toFirestore: jest.fn()
        },
        withConverter: jest.fn(),
        parent: reference
      };

      mockFirestore.data[result.path] = data;

      return (<unknown>result) as DocumentReference<T>;
    },

    setDoc: <T>(reference: DocumentReference<T>, data: any) => {
      if (!data || typeof data !== 'object') data = {};
      mockFirestore.set(reference, data);
    },

    updateDoc: <T>(reference: DocumentReference<T>, data: any) => {
      if (!data || typeof data !== 'object') return;
      let doc = mockFirestore.get(reference);
      if (!doc) throw new Error(`The path ${reference.path} does not exist.`);
      for (const field in data) {
        doc[field] = data[field];
      }
    },

    getDoc: <T>(reference: DocumentReference<T>) => {
      const result: DocumentSnapshot<T> = {
        metadata: {
          hasPendingWrites: false,
          fromCache: false,
          isEqual: () => false
        },
        data: () => {
          const doc = mockFirestore.get(reference);
          return doc ? (doc as T) : undefined;
        },
        exists: () => {
          return mockFirestore.get(reference) !== undefined;
        },
        get: () => {},
        id: reference.id,
        ref: reference
      };

      return result;
    },

    getDocs: <T>(query: Query<T>) => {
      const result: QuerySnapshot<T> = {
        docChanges: () => [],
        docs: [],
        empty: true,
        forEach: () => {},
        metadata: {
          fromCache: false,
          hasPendingWrites: false,
          isEqual: () => false
        },
        query,
        size: 0
      };
      return result;
    },

    deleteDoc: async (reference: DocumentReference<unknown>) => {
      mockFirestore.set(reference, undefined);
    },

    serverTimestamp: () => new Date()
  };
});
