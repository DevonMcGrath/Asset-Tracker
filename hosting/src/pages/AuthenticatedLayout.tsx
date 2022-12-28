import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {ButtonGroup} from '../common/ButtonGroup';
import {app} from '../data/AppManager';
import {AssetTrackerProfile} from '../models/profile';
import {ErrorPage} from './ErrorPage';

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

  render(): React.ReactNode {
    if (!app.isLoggedIn()) {
      return AuthenticatedLayout.getNotLoggedInPage();
    }
    return (
      <>
        <AppHeader />
        <AppBody>
          <p>Hi, you are logged in.</p>
          <ButtonGroup className='m-m'>
            <Button>Primary</Button>
            <Button type='secondary'>Secondary</Button>
            <Button type='tertiary'>Tertiary</Button>
          </ButtonGroup>
          <ButtonGroup className='m-m'>
            <Button disabled>Primary Dis.</Button>
            <Button disabled type='secondary'>
              Secondary Dis.
            </Button>
            <Button disabled type='tertiary'>
              Tertiary Dis.
            </Button>
          </ButtonGroup>
        </AppBody>
      </>
    );
  }

  public static getNotLoggedInPage(): JSX.Element {
    return (
      <ErrorPage
        title={AuthenticatedLayout.NOT_LOGGED_IN_ERROR_TITLE}
        error={AuthenticatedLayout.NOT_LOGGED_IN_ERROR}
      ></ErrorPage>
    );
  }
}
