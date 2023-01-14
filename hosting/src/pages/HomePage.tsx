import React from 'react';
import {Link} from 'react-router-dom';
import {Page} from './Page';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {Account, AssetTrackerProfile} from '../models/profile';

import './HomePage.css';
import {AccountSummary} from './accounts/AccountSummary';

export class HomePage extends React.Component<
  {profile: AssetTrackerProfile},
  {}
> {
  public static readonly PAGE_ID = 'home';

  render(): React.ReactNode {
    const accounts: Account[] = Object.keys(this.props.profile.accounts)
      .map((id) => this.props.profile.accounts[id])
      .sort((a, b) => (a.updated.valueOf() < b.updated.valueOf() ? 1 : -1));

    return (
      <Page id={HomePage.PAGE_ID}>
        <AppHeader />
        <AppBody>
          <div className='flex-container m-bottom-l'>
            <Button
              link='/transactions/create'
              icon='add'
              title='Add new transactions'
            >
              Add Transactions
            </Button>
            <Link className='accounts-link main-link' to='/accounts'>
              Accounts
            </Link>
          </div>
          {accounts.length ? (
            accounts.map((a) => {
              return <AccountSummary key={a.id} account={a} />;
            })
          ) : (
            <p>You haven't added any accounts.</p>
          )}
        </AppBody>
      </Page>
    );
  }
}
