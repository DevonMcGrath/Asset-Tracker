# Asset Tracker (Firestore settings)

This is the root directory for the Firestore database rules and indices.

## Setup

If you are setting up this project to run on your own Firebase project, you will need to do the following after creating the Firebase project (and creating a Firestore database):

1. In the `.firebaserc` file:
   1. Update the value of `projects.default` to your Project ID
1. On the Firebase Console, create a new collection called `demos` with a document `asset-tracker`
