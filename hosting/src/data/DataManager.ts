import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  onSnapshot,
  Firestore,
  CollectionReference,
  DocumentData,
  DocumentReference,
  updateDoc,
  Unsubscribe,
  DocumentSnapshot,
  orderBy,
  QuerySnapshot,
  addDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import {Account, AssetTrackerProfile} from '../models/profile';
import {Settings} from '../settings';
import {app, AppManager} from './AppManager';
import {convertTimestamps} from './firebase-helpers';

/**
 * The `DataManager` class provides a way to interface with the Asset Tracker
 * Profile stored in Firestore.
 */
export class DataManager {
  /**
   * The subcollection under a profile document which contains the accounts.
   */
  public static readonly ACCOUNTS_COLLECTION = 'accounts';

  constructor(public app: AppManager) {}

  /**
   * Gets the full path to a document or (sub)collection in Firestore.
   * @param pathSegments the optional array of path segments to append to the
   * base path.
   * @returns an array of path segments, including the base path to the current
   * user's profile.
   */
  private getFullPath(pathSegments?: string[]): string[] {
    // Ensure the user is logged in
    if (!this.app.isLoggedIn()) {
      throw new Error('The user is not logged in.');
    }

    // Determine the base path
    let prefix = Settings.FIRESTORE_BASE_PATH;
    if (prefix && prefix.slice(-1) !== '/') {
      prefix += '/';
    }
    prefix += 'profiles/' + this.app.getUID();

    return prefix.split('/').concat(pathSegments || []);
  }

  /**
   * Gets a subcollection relative to the user's profile document.
   * @param pathSegments the path segments to the subcollection.
   * @returns the reference to the subcollection in the user's profile.
   * @see {@link DataManager.doc}
   */
  public collection(pathSegments: string[]): CollectionReference<DocumentData> {
    const path = this.getFullPath(pathSegments);
    const firstSegment = path[0];
    path.splice(0, 1);
    return collection(this.app.getFirestore(), firstSegment, ...path);
  }

  /**
   * Gets a document relative to the user's profile document. If no path
   * segments are provided, the reference to the user's profile is returned.
   * @param pathSegments the path segments to the document.
   * @returns the reference to a document in the user's profile (or the profile
   * itself).
   * @see {@link DataManager.collection}
   */
  public doc(pathSegments?: string[]): DocumentReference<DocumentData> {
    const path = this.getFullPath(pathSegments);
    const firstSegment = path[0];
    path.splice(0, 1);
    return doc(this.app.getFirestore(), firstSegment, ...path);
  }

  /**
   * Creates a new Asset Tracker profile for the current user, if one does not
   * already exist.
   * @returns the profile document, not including account or other information.
   */
  public async createProfile(): Promise<AssetTrackerProfile> {
    const profileDocRef = this.doc();
    const profileDoc = await getDoc(profileDocRef);

    // The document already exists
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      convertTimestamps(profile);
      return profile as AssetTrackerProfile;
    }

    // Create the profile
    const user = this.app.getUser();
    let profileData: any = {
      created: serverTimestamp(),
      updated: serverTimestamp(),
      id: this.app.getUID(),
      owner: {
        name: user?.displayName || '',
        email: user?.email || ''
      }
    };
    if (user?.photoURL) {
      profileData.owner.photoURL = user.photoURL;
    }
    await setDoc(profileDocRef, profileData);
    profileData.created = new Date();
    profileData.updated = profileData.created;

    return profileData as AssetTrackerProfile;
  }

  /**
   * Gets all Firestore documents and sub-documents for the current user's
   * profile.
   * @returns all the profile data associated with the logged in user.
   * @throws an error if the profile does not exist.
   */
  public async getFullProfile(): Promise<AssetTrackerProfile> {
    const profileDocRef = this.doc();
    const profileDoc = await getDoc(profileDocRef);

    // The document does not exist
    if (!profileDoc.exists()) {
      throw new Error('No profile found for current user.');
    }

    // Base profile data
    let profile = profileDoc.data() as AssetTrackerProfile;
    convertTimestamps(profile);

    // Get account info
    const accountsColRef = this.collection([DataManager.ACCOUNTS_COLLECTION]);
    const qForAccounts = query(accountsColRef);
    const querySnapshot = await getDocs(qForAccounts);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Account;
      data.id = doc.id;
      convertTimestamps(data);
      if (!profile.accounts) {
        profile.accounts = {};
      }
      profile.accounts[data.id] = data;
    });

    return profile;
  }
}

/**
 * The main data manager for the app.
 */
export const dataManager = new DataManager(app);
