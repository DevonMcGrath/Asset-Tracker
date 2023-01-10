import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  CollectionReference,
  DocumentData,
  DocumentReference,
  updateDoc,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import {Account, AssetTrackerProfile, Transaction} from '../models/profile';
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
   * Creates a Firestore document reference to an account with a specific ID.
   * @param id the account ID.
   * @returns the document reference to the specified account.
   * @see {@link DataManager.doc}
   */
  public getAccountDoc(id: string): DocumentReference<DocumentData> {
    return this.doc([DataManager.ACCOUNTS_COLLECTION, id]);
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
    profile.accounts = {};

    // Get account info
    const accountsColRef = this.collection([DataManager.ACCOUNTS_COLLECTION]);
    const qForAccounts = query(accountsColRef);
    const querySnapshot = await getDocs(qForAccounts);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Account;
      data.id = doc.id;
      convertTimestamps(data);
      DataManager.sortTransactions(data.transactions);
      profile.accounts[data.id] = data;
    });

    return profile;
  }

  /**
   * Adds a new account to the user's profile, then updates the provided
   * profile and account in place.
   * @param profile the profile to update with the new account.
   * @param account the default account info.
   * @returns the created account.
   */
  public async addAccount(
    profile: AssetTrackerProfile,
    account: Account
  ): Promise<Account> {
    // Build the data
    const accountsColRef = this.collection([DataManager.ACCOUNTS_COLLECTION]);
    DataManager.sortTransactions(account.transactions);
    const data: any = {
      ...account,
      created: serverTimestamp(),
      updated: serverTimestamp()
    };
    delete data.id;

    // Add the document
    const doc = await addDoc(accountsColRef, data);

    // Update the objects in place
    account.id = doc.id;
    account.created = new Date();
    account.updated = new Date(account.created.valueOf());
    profile.accounts[account.id] = account;

    return account;
  }

  /**
   * Updates all account properties (excluding `transactions` and `created`) on
   * the Firestore document. Sets the `updated` date on success.
   * @param account the updated account.
   * @throws an error if (1) the account has no ID, (2) the user is not logged
   * in, or (3) there is a server-side Firestore error.
   */
  public async updateAccountInfo(account: Account): Promise<void> {
    if (!account.id) {
      throw new Error('The account has no ID.');
    }

    // Update the core elements
    const data = {
      updated: serverTimestamp(),
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      institution: account.institution,
      currency: account.currency
    };
    await updateDoc(this.getAccountDoc(account.id), data);
    account.updated = new Date();
  }

  /**
   * Updates the transactions and updated timestamp on the Firestore document.
   * Sets the `updated` date on success.
   * @param account the account with the updated transactions.
   * @throws an error if (1) the account has no ID, (2) the user is not logged
   * in, or (3) there is a server-side Firestore error.
   */
  public async updateAccountTransactions(account: Account): Promise<void> {
    if (!account.id) {
      throw new Error('The account has no ID.');
    }

    // Update the document in Firestore
    const data = {
      updated: serverTimestamp(),
      transactions: DataManager.sortTransactions(account.transactions)
    };
    await updateDoc(this.getAccountDoc(account.id), data);
    account.updated = new Date();
  }

  /**
   * Deletes an account from the user's profile, then updates the provided
   * profile in place.
   * @param profile the profile to remove the aacount from.
   * @param account the account to delete.
   */
  public async deleteAccount(profile: AssetTrackerProfile, account: Account) {
    if (!account.id) {
      throw new Error('The account has no ID.');
    }

    // Delete the account
    await deleteDoc(this.getAccountDoc(account.id));
    delete profile.accounts[account.id];
  }

  /**
   * Creates an exact copy of a transaction.
   * @param transaction the transaction to clone.
   * @returns a cloned version of the transaction.
   */
  public static cloneTransaction(transaction: Transaction): Transaction {
    return {
      timestamp: new Date(transaction.timestamp.valueOf()),
      updated: new Date(transaction.updated.valueOf()),
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      assetName: transaction.assetName,
      assetQuantity: transaction.assetQuantity,
      note: transaction.note
    };
  }

  /**
   * Creates an exact copy, deep-clone of an account.
   * @param account the account to clone.
   * @returns a cloned version of the account.
   */
  public static cloneAccount(account: Account): Account {
    return {
      created: new Date(account.created.valueOf()),
      updated: new Date(account.updated.valueOf()),
      id: account.id,
      currency: account.currency,
      institution: account.institution,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      transactions: account.transactions.map(DataManager.cloneTransaction)
    };
  }

  /**
   * Sorts an array of transaction, in place.
   * @param transactions the transactions to sort.
   * @returns the sorted array of transactions.
   */
  public static sortTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      const at = a.timestamp.valueOf();
      const bt = b.timestamp.valueOf();
      if (at !== bt) return at < bt ? 1 : -1;
      return a.updated.valueOf() < b.updated.valueOf() ? 1 : -1;
    });
  }
}

/**
 * The main data manager for the app.
 */
export const dataManager = new DataManager(app);
