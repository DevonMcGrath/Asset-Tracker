import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {AssetTrackerProfile} from '../models/profile';
import {Page} from './Page';

export class AccountsPage extends React.Component<
  {profile: AssetTrackerProfile},
  {}
> {
  public static readonly PAGE_ID = 'accounts';

  render(): React.ReactNode {
    return (
      <Page id={AccountsPage.PAGE_ID}>
        <AppHeader title='Accounts' />
        <AppBody>
          <p>Hi, you are logged in to the accounts page.</p>
        </AppBody>
      </Page>
    );
  }
}
