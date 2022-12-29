import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {AssetTrackerProfile} from '../models/profile';
import {Page} from './Page';

export class AccountPage extends React.Component<
  {profile: AssetTrackerProfile; id: string},
  {}
> {
  public static readonly PAGE_ID = 'account';
  render(): React.ReactNode {
    return (
      <Page id={AccountPage.PAGE_ID}>
        <AppHeader title='View Account' />
        <AppBody>
          <p>Hi, you are logged in to the accounts page.</p>
        </AppBody>
      </Page>
    );
  }
}
