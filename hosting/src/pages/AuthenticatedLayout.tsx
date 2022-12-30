import React from 'react';
import {Route, Routes, Link} from 'react-router-dom';
import {app} from '../data/AppManager';
import {AssetTrackerProfile} from '../models/profile';
import {AccountPage} from './AccountPage';
import {AccountsPage} from './AccountsPage';
import {ErrorPage} from './ErrorPage';
import {HomePage} from './HomePage';

export class AuthenticatedLayout extends React.Component<
  {
    profile: AssetTrackerProfile;
  },
  {}
> {
  /**
   * The error page title shown if this layout is used when the user is not
   * logged in.
   */
  public static readonly NOT_LOGGED_IN_ERROR_TITLE = 'Error: Not Logged In';

  /**
   * The error page error message shown if this layout is used when the user
   * is notlogged in.
   */
  public static readonly NOT_LOGGED_IN_ERROR =
    'You must log in to use this app.';

  /**
   * The error page title shown when the user has navigated to an invalid URL.
   */
  public static readonly NOT_FOUND_ERROR_TITLE = '404 Page Not Found';

  /**
   * The error page message shown when the user has navigated to an invalid URL.
   */
  public static readonly NOT_FOUND_ERROR =
    'The page you are looking for does not exist.';

  constructor(props: any) {
    super(props);
    this.rerender = this.rerender.bind(this);
  }

  render(): React.ReactNode {
    if (!app.isLoggedIn()) {
      return AuthenticatedLayout.getNotLoggedInPage();
    }
    return this.getRoutes();
  }

  /**
   * Creates a {@link Routes} element with a list of routes the user can
   * navigate to, based on the profile.
   * @returns an element with all the routes for the app.
   */
  private getRoutes(): JSX.Element {
    const profile = this.props.profile;
    return (
      <Routes>
        <Route path='/' element={<HomePage profile={profile} />} />
        <Route
          path='/accounts'
          element={<AccountsPage profile={profile} rerender={this.rerender} />}
        />
        {Object.keys(profile.accounts).map((accountID) => {
          return (
            <Route
              key={accountID}
              path={'/accounts/' + accountID}
              element={<AccountPage profile={profile} id={accountID} />}
            />
          );
        })}
        <Route path='*' element={AuthenticatedLayout.get404Page()} />
      </Routes>
    );
  }

  private rerender() {
    this.forceUpdate();
  }

  public static getNotLoggedInPage(): JSX.Element {
    return (
      <ErrorPage
        title={AuthenticatedLayout.NOT_LOGGED_IN_ERROR_TITLE}
        error={AuthenticatedLayout.NOT_LOGGED_IN_ERROR}
      ></ErrorPage>
    );
  }

  public static get404Page(): JSX.Element {
    return (
      <ErrorPage
        title='404 Page Not Found'
        error='The page you are looking for does not exist.'
      >
        <p>
          <Link to='/'>Return to Home Page</Link>
        </p>
      </ErrorPage>
    );
  }
}
