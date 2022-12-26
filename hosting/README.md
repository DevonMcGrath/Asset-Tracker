# Asset Tracker (Frontend)

This is the root directory for the frontend of the Asset Tracker web app. It is built with React (TypeScript), and hosted via Firebase Hosting (see `.firebaserc` and `firebase.json`).

## Setup

If you are setting up this project to run on your own Firebase project, you will need to do the following after creating the Firebase project:

1. In the `.firebaserc` file:
   1. Update the value of `projects.default` to your Project ID
1. In the `firebase.json` file:
   1. If you have only one site associated with your project: remove the `hosting.site` value. Otherwise, update the `hosting.site` value to the Hosting site ID.
1. In the `package.json` file:
   1. If you have only one site associated with your project: remove `:dm-asset-tracker` from the end of `scripts.deploy`. Otherwise, update `dm-asset-tracker` at the end of the `scripts.deploy` value to your Hosting site ID.

After updating the above files, you will need to create the below files with your Firebase Project Config:

### App `firebase-config.ts` File

1. Create a file named `firebase-config.ts` under `src/`
1. Export `const FIREBASE_CONFIG` as the configuration, e.g:

```typescript
export const FIREBASE_CONFIG = {
  apiKey: 'string',
  authDomain: 'string',
  projectId: 'string',
  storageBucket: 'string',
  messagingSenderId: 'string',
  appId: 'string',
  measurementId: 'string'
};
```

### Public `firebase-config.js` File

1. Create a file named `firebase-config.js` under `public/js/`
1. Create a `var FIREBASE_CONFIG` as the configuration, e.g:

```javascript
var FIREBASE_CONFIG = {
  apiKey: 'string',
  authDomain: 'string',
  projectId: 'string',
  storageBucket: 'string',
  messagingSenderId: 'string',
  appId: 'string',
  measurementId: 'string'
};
```

### Deploying

After completing all above set up steps, you can deploy everything to your Firebase Hosting site by:

1. In the terminal/command prompt, navigate to the current directory (`hosting`)
1. Run `npm run deploy`
