import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {ButtonGroup} from '../common/ButtonGroup';
import {dataManager} from '../data/DataManager';
import {Account, AssetTrackerProfile} from '../models/profile';
import {AccountCard} from './accounts/AccountCard';
import {Page} from './Page';

export class AccountsPage extends React.Component<
  {profile: AssetTrackerProfile; rerender: () => void},
  {isCreatingAccount: boolean}
> {
  public static readonly PAGE_ID = 'accounts';

  constructor(props: any) {
    super(props);
    this.state = {
      isCreatingAccount: false
    };
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
  }

  render(): React.ReactNode {
    const accounts: Account[] = Object.keys(this.props.profile.accounts)
      .map((id) => {
        return this.props.profile.accounts[id];
      })
      .sort((a, b) => (a.updated.valueOf() > b.updated.valueOf() ? -1 : 1));
    return (
      <Page id={AccountsPage.PAGE_ID}>
        <AppHeader title='Accounts' />
        <AppBody backTitle='Dashboard' backTitleLink='/'>
          <section className='m-top-m m-bottom-l'>
            <h2>Accounts</h2>
            <ButtonGroup className='m-bottom-l'>
              <Button
                icon='add'
                disabled={this.state.isCreatingAccount}
                className='accounts-create-btn'
                onClick={this.handleCreateAccount}
              >
                Create
              </Button>
            </ButtonGroup>
            {accounts.length ? (
              accounts.map((account) => {
                return <AccountCard key={account.id} account={account} />;
              })
            ) : (
              <p>You have not added any accounts yet.</p>
            )}
          </section>
        </AppBody>
      </Page>
    );
  }

  private async handleCreateAccount() {
    this.setState({isCreatingAccount: true});
    const defaultValues: Account = {
      created: new Date(),
      updated: new Date(),
      id: '',
      name: 'New Account',
      institution: '',
      currency: 'CAD',
      type: 'other',
      subtype: 'other',
      transactions: []
    };

    // Create the account
    try {
      const newAccount = await dataManager.addAccount(
        this.props.profile,
        defaultValues
      );
      this.props.rerender();
      window.location.assign('/accounts/' + newAccount.id);
    } catch (e) {
      console.error('Failed to create account', e);
    }
    this.setState({isCreatingAccount: false});
  }
}
