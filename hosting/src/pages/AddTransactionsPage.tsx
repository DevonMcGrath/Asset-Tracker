import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {AssetTrackerProfile} from '../models/profile';
import {Page} from './Page';

export class AddTransactionsPage extends React.Component<
  {profile: AssetTrackerProfile; accountID?: string},
  {}
> {
  public static readonly PAGE_ID = 'add-transaction';

  render(): React.ReactNode {
    const accountID = this.props.accountID;
    return (
      <Page id={AddTransactionsPage.PAGE_ID}>
        <AppHeader title='Add Transactions' />
        <AppBody
          backTitle={accountID ? 'View Account' : 'Dashboard'}
          backTitleLink={accountID ? '/accounts/' + accountID : '/'}
        >
          TODO
        </AppBody>
      </Page>
    );
  }
}
