import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {ButtonGroup} from '../common/ButtonGroup';
import {DropDown, Input} from '../common/Fields';
import {
  formatAccountTitle,
  formatAsDollarValue,
  formatDate
} from '../data/common-helpers';
import {dataManager} from '../data/DataManager';
import {
  Account,
  AssetTrackerProfile,
  Transaction,
  TransactionType
} from '../models/profile';
import {Page} from './Page';

type TransactionDate = 'today' | 'yesterday' | 'other';

export class AddTransactionPage extends React.Component<
  {profile: AssetTrackerProfile; accountID?: string},
  {
    accountID?: string;
    date: TransactionDate;
    otherDateValue?: string;
    type?: TransactionType;
    assetName?: string;
    assetQuantity?: number;
    amount: number;
    currency?: string;
  }
> {
  public static readonly PAGE_ID = 'add-transaction';

  constructor(props: any) {
    super(props);

    const accountID = this.props.accountID;
    const account = accountID
      ? this.props.profile.accounts[accountID]
      : undefined;

    this.state = {
      accountID: account ? accountID : undefined,
      date: 'today',
      amount: 0,
      assetQuantity: 1,
      currency: account?.currency
    };

    this.handleUpdateAccount = this.handleUpdateAccount.bind(this);
    this.handleUpdateDate = this.handleUpdateDate.bind(this);
    this.handleUpdateOtherDate = this.handleUpdateOtherDate.bind(this);
    this.handleUpdateType = this.handleUpdateType.bind(this);
    this.handleUpdateAmount = this.handleUpdateAmount.bind(this);
    this.handleUpdateAsset = this.handleUpdateAsset.bind(this);
    this.handleUpdateQuantity = this.handleUpdateQuantity.bind(this);
    this.handleUpdateCurrency = this.handleUpdateCurrency.bind(this);
    this.handleBlurAmount = this.handleBlurAmount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(): React.ReactNode {
    const accountID = this.props.accountID;
    const selectedAccountID = this.state.accountID;
    const account = selectedAccountID
      ? this.props.profile.accounts[selectedAccountID]
      : undefined;
    const wasAccountPreSelected = account && accountID;

    const accounts = Object.keys(this.props.profile.accounts)
      .map((id) => {
        return this.props.profile.accounts[id];
      })
      .sort((a, b) => {
        return a.updated.valueOf() < b.updated.valueOf() ? 1 : -1;
      });

    return (
      <Page id={AddTransactionPage.PAGE_ID}>
        <AppHeader title='Add Transaction' />
        <AppBody
          backTitle={accountID ? 'View Account' : 'Dashboard'}
          backTitleLink={accountID ? '/accounts/' + accountID : '/'}
        >
          <div className='fieldset m-bottom-l'>
            <div className='field large'>
              <label htmlFor='add-tr-account'>Account:</label>
              {wasAccountPreSelected ? (
                <Input
                  id='add-tr-account'
                  className='input'
                  value={formatAccountTitle(account)}
                  disabled
                />
              ) : (
                <DropDown
                  addBlankOption
                  id='add-tr-account'
                  className='input'
                  options={accounts}
                  formatOption={(a) => ({
                    id: a.id,
                    text: formatAccountTitle(a)
                  })}
                  value={account}
                  onChange={this.handleUpdateAccount}
                />
              )}
            </div>
          </div>
          {account ? (
            this.renderTransactionBuilderForAccount(account)
          ) : (
            <p>Please select an account.</p>
          )}
          <ButtonGroup className='m-l'>
            <Button
              icon='add'
              className='add-tr-add-btn'
              onClick={this.handleSubmit}
            >
              Add Transaction
            </Button>
          </ButtonGroup>
        </AppBody>
      </Page>
    );
  }

  renderTransactionBuilderForAccount(account: Account): JSX.Element {
    const dates: TransactionDate[] = ['today', 'yesterday', 'other'];
    const type = account.type;
    const types: TransactionType[] =
      type === 'investment'
        ? ['purchase', 'sale', 'dividend', 'deposit', 'withdrawal']
        : ['purchase', 'interest', 'deposit', 'withdrawal'];
    return (
      <>
        <div className='fieldset m-l'>
          <div className='field medium'>
            <label htmlFor='add-tr-date'>Transaction Date:</label>
            <DropDown
              id='add-tr-date'
              className='input'
              options={dates}
              value={this.state.date}
              formatOption={this.formatDateOption}
              onChange={this.handleUpdateDate}
            />
          </div>
          {this.state.date === 'other' && (
            <div className='field medium'>
              <label htmlFor='add-tr-date-other'>Other Date:</label>
              <Input
                id='add-tr-date-other'
                className='input'
                type='date'
                onChange={this.handleUpdateOtherDate}
              />
            </div>
          )}
        </div>
        <div className='fieldset m-l'>
          <div className='field medium'>
            <label htmlFor='add-tr-type'>Transaction Type:</label>
            <DropDown
              addBlankOption
              id='add-tr-type'
              className='input'
              options={types}
              value={this.state.type}
              formatOption={(v) => ({id: v, text: v.toUpperCase()})}
              onChange={this.handleUpdateType}
            />
          </div>
        </div>
        {this.state.type &&
          this.renderTransactionBuilderForType(account, this.state.type)}
      </>
    );
  }

  renderTransactionBuilderForType(
    account: Account,
    type: TransactionType
  ): JSX.Element {
    // Field to get the transaction amount
    const totalField = (
      <div className='fieldset m-l'>
        <div className='field medium'>
          <label htmlFor='add-tr-amount'>Transaction Amount:</label>
          <Input
            id='add-tr-amount'
            className='input'
            value={formatAsDollarValue(this.state.amount)}
            onChange={this.handleUpdateAmount}
            onBlur={this.handleBlurAmount}
          />
        </div>
      </div>
    );

    // Basic transactions
    if (type === 'deposit' || type === 'withdrawal' || type === 'interest') {
      return totalField;
    }

    // Construct basic fields
    const assetInput = (
      <Input
        id='add-tr-asset'
        className='input'
        value={this.state.assetName}
        onChange={this.handleUpdateAsset}
      />
    );
    const quantityField = (
      <div className='field small'>
        <label htmlFor='add-tr-quantity'>Quantity:</label>
        <Input
          id='add-tr-quantity'
          className='input'
          type='number'
          value={'' + this.state.assetQuantity}
          onChange={this.handleUpdateQuantity}
        />
      </div>
    );
    const currencyField = (
      <div className='field small'>
        <label htmlFor='add-tr-currency'>Currency:</label>
        <Input
          id='add-tr-currency'
          className='input'
          value={this.state.currency}
          onChange={this.handleUpdateCurrency}
        />
      </div>
    );

    // Purchase on a bank account
    if (type === 'purchase' && account.type === 'bank') {
      return (
        <>
          {totalField}
          <div className='fieldset m-l'>
            <div className='field large'>
              <label htmlFor='add-tr-asset'>Item Purchased:</label>
              {assetInput}
            </div>
            {quantityField}
          </div>
        </>
      );
    }

    return (
      <>
        {totalField}
        <div className='fieldset m-l'>
          <div className='field large'>
            <label htmlFor='add-tr-asset'>Asset:</label>
            {assetInput}
          </div>
          {quantityField}
          {currencyField}
        </div>
      </>
    );
  }

  private formatDateOption(date: TransactionDate): {id: string; text: string} {
    let text = 'Other';
    if (date === 'today') {
      text = 'Today (' + formatDate(new Date()) + ')';
    } else if (date === 'yesterday') {
      text =
        'Yesterday (' +
        formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)) +
        ')';
    }

    return {id: date, text};
  }

  private handleUpdateAccount(account: Account | null) {
    this.setState({accountID: account?.id, currency: account?.currency});
  }

  private handleUpdateDate(date: TransactionDate | null) {
    this.setState({date: date ? date : 'today'});
  }

  private handleUpdateOtherDate(value: string) {
    this.setState({otherDateValue: value});
  }

  private handleUpdateType(type: TransactionType | null) {
    this.setState((s) => {
      let assetName = s.assetName;
      if (type) {
        if (
          type === 'deposit' ||
          type === 'withdrawal' ||
          type === 'interest'
        ) {
          assetName = '_CASH';
        } else if (assetName === '_CASH') {
          assetName = '';
        }
      }
      return {type: type ? type : undefined, assetName};
    });
  }

  private handleUpdateAmount(amount: string) {
    this.setState({amount: Math.max(this.convertAmount(amount), 0)});
  }

  private handleBlurAmount(amount: string, e: any) {
    e.target.value = formatAsDollarValue(this.convertAmount(amount));
  }

  private handleUpdateAsset(assetName: string) {
    this.setState({assetName});
  }

  private handleUpdateQuantity(quantity: string) {
    this.setState({assetQuantity: this.convertAmount(quantity)});
  }

  private handleUpdateCurrency(currency: string) {
    this.setState({currency});
  }

  private async handleSubmit() {
    const s = this.state;
    if (!s.accountID) {
      // TODO
      return;
    }
    if (!s.type) {
      // TODO
      return;
    }
    if (
      s.date === 'other' &&
      (!s.otherDateValue || !new Date(s.otherDateValue)).valueOf()
    ) {
      // TODO
      return;
    }

    // Determine the timestamp
    let timestamp: Date = new Date();
    if (s.date === 'today') {
      timestamp = new Date(formatDate(new Date()) + ' 12:00');
    } else if (s.date === 'yesterday') {
      timestamp = new Date(
        formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)) + ' 12:00'
      );
    } else {
      timestamp = new Date((s.otherDateValue || '') + ' 12:00');
    }

    // Create the transaction
    const transaction: Transaction = {
      timestamp,
      updated: new Date(),
      type: s.type,
      assetName: s.assetName || '',
      assetQuantity: s.assetQuantity || 1,
      amount: s.amount,
      currency: s.currency || ''
    };

    // Add the transaction to the account
    const account = this.props.profile.accounts[s.accountID];
    account.transactions.push(transaction);

    // Save the transactions
    try {
      await dataManager.updateAccountTransactions(account);
      const accountID = this.props.accountID;
      let returnURL = '/';
      if (accountID) {
        returnURL = '/accounts/' + accountID;
      }
      window.location.assign(returnURL);
    } catch (e) {
      // TODO
    }
  }

  private convertAmount(amount: string): number {
    return parseFloat(amount.replace(/[\$\s,]/g, '')) || 0;
  }
}
