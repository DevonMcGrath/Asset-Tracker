import {FirebaseApp, initializeApp} from 'firebase/app';
import {getAuth, Auth, onAuthStateChanged, signOut, User} from 'firebase/auth';
import {Functions, getFunctions} from 'firebase/functions';

import {getFirestore, Firestore} from 'firebase/firestore';
import {FIREBASE_CONFIG} from '../firebase-config';
import {Settings} from '../settings';

/**
 * Wraps a {@link FirebaseApp} object and gets the user information.
 */
export class AppManager {
  private app: FirebaseApp;

  private auth: Auth;

  private db: Firestore;

  private functions: Functions;

  private isAuthReady: boolean = false;

  private user: User | null = null;

  private onAuthReady?: (app: AppManager, user: User | null) => void;

  constructor(config?: object) {
    const c = config ? config : FIREBASE_CONFIG;
    const app = initializeApp(c);
    this.app = app;
    this.auth = getAuth(this.app);
    this.db = getFirestore();
    this.functions = getFunctions(this.app);
    onAuthStateChanged(this.auth, (user) => {
      if (!this.isAuthReady) this.isAuthReady = true;
      this.user = user;
      if (this.onAuthReady) this.onAuthReady(this, user);
    });
  }

  public getApp(): FirebaseApp {
    return this.app;
  }

  public getAuth(): Auth {
    return this.auth;
  }

  public getFirestore(): Firestore {
    return this.db;
  }

  public getFunctions(): Functions {
    return this.functions;
  }

  public getIsAuthReady(): boolean {
    return this.isAuthReady;
  }

  public getUser(): User | null {
    return this.user;
  }

  /**
   * Gets the unique user ID associated with the Firebase user.
   *
   * @returns the unique user ID or an empty string, if not logged in.
   */
  public getUID(): string {
    return this.user ? this.user.uid : '';
  }

  /**
   * Checks if the user is logged in. If this function is called before
   * Firebase auth is initialized, it will return false.
   *
   * @returns true if and only if the user is logged in.
   */
  public isLoggedIn(): boolean {
    return !!this.user;
  }

  /**
   * Logs out the current user.
   */
  public logout(): Promise<void> {
    return signOut(getAuth());
  }

  /**
   * The callback which is called once the Firebase auth is ready.
   *
   * @param onAuthReady the callback.
   */
  public setOnAuthReady(
    onAuthReady?: (app: AppManager, user: User | null) => void
  ) {
    this.onAuthReady = onAuthReady;
    if (onAuthReady && this.isAuthReady) {
      onAuthReady(this, this.user);
    }
  }

  /**
   * Gets the profile picture URL for the current user.
   *
   * @returns the profile picture URL.
   */
  public getProfilePic(): string {
    return Settings.DEFAULT_PROFILE_PICTURE;
  }

  /**
   * Adds a size parameter to any Google user photo URL if there is no query
   * string part of the photo URL.
   *
   * @param url the user's photo URL.
   * @returns the updated URL.
   */
  public static addSizeToGoogleProfilePic(url: string): string {
    if (
      url.indexOf('googleusercontent.com') !== -1 &&
      url.indexOf('?') === -1
    ) {
      return url + '?sz=150';
    }
    return url;
  }

  /**
   * Redirects the client to the login page which will redirect to the
   * current page once the user logs in successfully.
   */
  public static redirectToSignIn(): void {
    var l = window.location;
    var loginURL =
      l.protocol +
      '//' +
      l.host +
      Settings.LOGIN_URL +
      '?to=' +
      encodeURIComponent(l.pathname);
    window.location.assign(loginURL);
  }
}

/**
 * The main app manager instance.
 */
export const app = new AppManager();
