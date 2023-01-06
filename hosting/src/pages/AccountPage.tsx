import React from 'react';
import {Link} from 'react-router-dom';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {ButtonGroup} from '../common/ButtonGroup';
import {dataManager} from '../data/DataManager';
import {Account, AssetTrackerProfile, Transaction} from '../models/profile';
import {AccountInfo} from './accounts/AccountInfo';
import {ErrorPage} from './ErrorPage';
import {Page} from './Page';
import {TransactionCard} from './transactions/TransactionCard';

export class AccountPage extends React.Component<
  {profile: AssetTrackerProfile; id: string},
  {updated: number}
> {
  public static readonly PAGE_ID = 'account';

  constructor(props: any) {
    super(props);
    this.state = {
      updated: 0
    };
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.handleUpdateAccountInfo = this.handleUpdateAccountInfo.bind(this);
    this.handleDeleteTransaction = this.handleDeleteTransaction.bind(this);
  }

  render(): React.ReactNode {
    // Ensure there is an account
    const id = this.props.id;
    const profile = this.props.profile;
    if (!id || !profile.accounts || !profile.accounts[id]) {
      return (
        <ErrorPage
          title='Account Not Found'
          error={`The account "${id}" could not be found.`}
        >
          <p>
            <Link to='/accounts'>Return to Accounts</Link>
          </p>
        </ErrorPage>
      );
    }

    const account = profile.accounts[id];

    return (
      <Page id={AccountPage.PAGE_ID}>
        <AppHeader title='View Account' />
        <AppBody
          key={this.state.updated}
          backTitle='Accounts'
          backTitleLink='/accounts'
        >
          <ButtonGroup className='m-l'>
            <Button
              icon='delete'
              title='Deletes this account; WARNING: there is no going back after deleting an account.'
              className='account-delete-btn'
              onClick={this.handleDeleteAccount}
            >
              Delete Account
            </Button>
          </ButtonGroup>
          <section className='m-top-m m-bottom-l'>
            <h2>Account Info</h2>
            <AccountInfo
              account={account}
              onUpdate={this.handleUpdateAccountInfo}
            />
          </section>
          <section className='m-top-m m-bottom-l'>
            <h2>Account Transactions</h2>
            <ButtonGroup className='m-bottom-l'>
              <Button
                link={'/transactions/create/' + id}
                icon='add'
                title='Add new transactions'
              >
                Add Transactions
              </Button>
            </ButtonGroup>
            <p className='info-text'>
              Transactions: {account.transactions.length}
            </p>
            {account.transactions.map((transaction, idx) => {
              return (
                <TransactionCard
                  key={transaction.updated.valueOf() + '-' + idx}
                  transaction={transaction}
                  onDelete={this.handleDeleteTransaction}
                />
              );
            })}
          </section>
        </AppBody>
      </Page>
    );
  }

  private async handleDeleteAccount() {
    const id = this.props.id;
    const profile = this.props.profile;
    await dataManager.deleteAccount(profile, profile.accounts[id]);
    window.location.replace('/accounts');
  }

  private async handleUpdateAccountInfo(account: Account) {
    await dataManager.updateAccountInfo(account);
    let profile = this.props.profile;
    profile.accounts[account.id] = account;
    this.setState({updated: Date.now()});
  }

  private async handleDeleteTransaction(transaction: Transaction) {
    const id = this.props.id;
    const profile = this.props.profile;
    const account = profile.accounts[id];
    account.transactions = account.transactions.filter(
      (a) => a !== transaction
    );
    await dataManager.updateAccountTransactions(account);
    this.setState({updated: Date.now()});
  }
}
