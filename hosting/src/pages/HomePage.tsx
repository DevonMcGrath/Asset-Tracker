import React from 'react';
import {Link} from 'react-router-dom';
import {Page} from './Page';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {ButtonGroup} from '../common/ButtonGroup';
import {AssetTrackerProfile} from '../models/profile';

import './HomePage.css';

export class HomePage extends React.Component<
  {profile: AssetTrackerProfile},
  {}
> {
  public static readonly PAGE_ID = 'home';

  render(): React.ReactNode {
    return (
      <Page id={HomePage.PAGE_ID}>
        <AppHeader />
        <AppBody>
          <div className='flex-container'>
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
          <p>Hi, you are logged in to the home page.</p>
        </AppBody>
      </Page>
    );
  }
}
