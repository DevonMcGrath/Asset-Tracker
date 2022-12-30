import React from 'react';
import {Button} from '../../common/Button';
import {ButtonGroup} from '../../common/ButtonGroup';
import {DropDown, Input} from '../../common/Fields';
import {getByProperty} from '../../data/common-helpers';
import {DataManager} from '../../data/DataManager';
import {Account, AccountSubtype, AccountType} from '../../models/profile';

export class AccountInfo extends React.Component<
  {
    account: Account;
    onUpdate?: (account: Account) => Promise<void>;
    editingDisabled?: boolean;
  },
  {updatedAccount: Account; isUpdateDisabled: boolean; cancelled: number}
> {
  constructor(props: any) {
    super(props);
    this.state = {
      updatedAccount: DataManager.cloneAccount(this.props.account),
      isUpdateDisabled: false,
      cancelled: 0
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleInstitutionChange = this.handleInstitutionChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubtypeChange = this.handleSubtypeChange.bind(this);
  }

  render(): React.ReactNode {
    const a = this.state.updatedAccount;
    const isDisabled = this.props.editingDisabled;

    // Determine the account (sub)types
    const accountTypes = AccountInfo.getAccountTypeOptions();
    const accountType = getByProperty(
      accountTypes,
      'type',
      a.type,
      0,
      accountTypes[0]
    )?.value;
    const accountSubtypes = AccountInfo.getAccountSubtypeOptions(a.type);
    const accountSubtype = getByProperty(
      accountSubtypes,
      'type',
      a.subtype,
      0,
      accountSubtypes[0]
    )?.value;

    // Function to format account type and subtype options
    function formatTypeOption(opt: any) {
      return {id: opt.type, text: opt.name};
    }

    return (
      <div key={this.state.cancelled}>
        <div className='m-m fieldset'>
          <div className='field large'>
            <label htmlFor='account-name'>Account Name:</label>
            <Input
              id='account-name'
              className='input'
              onChange={this.handleNameChange}
              value={a.name}
              disabled={isDisabled}
              maxLength={512}
            />
          </div>
        </div>
        <div className='m-m fieldset'>
          <div className='field large'>
            <label htmlFor='account-institution'>Institution:</label>
            <Input
              id='account-institution'
              className='input'
              onChange={this.handleInstitutionChange}
              value={a.institution}
              disabled={isDisabled}
              maxLength={512}
            />
          </div>
        </div>
        <div className='m-m fieldset'>
          <div className='field small'>
            <label htmlFor='account-type'>Account Type:</label>
            <DropDown
              id='account-type'
              className='input'
              options={accountTypes}
              formatOption={formatTypeOption}
              onChange={this.handleTypeChange}
              value={accountType}
              disabled={isDisabled}
            />
          </div>
          <div className='field medium'>
            <label htmlFor='account-subtype'>Account Subtype:</label>
            <DropDown
              id='account-subtype'
              className='input'
              options={accountSubtypes}
              formatOption={formatTypeOption}
              onChange={this.handleSubtypeChange}
              value={accountSubtype}
              disabled={isDisabled}
            />
          </div>
          <div className='field small'>
            <label htmlFor='account-currency'>Currency:</label>
            <Input
              id='account-currency'
              className='input'
              onChange={this.handleCurrencyChange}
              value={a.currency}
              disabled={isDisabled}
              maxLength={16}
            />
          </div>
        </div>
        {!isDisabled ? (
          <ButtonGroup>
            <Button
              className='account-info-update-btn'
              onClick={this.handleUpdate}
              title='Save the changes made to account info.'
              disabled={this.state.isUpdateDisabled}
            >
              Update
            </Button>
            <Button
              className='account-info-cancel-btn'
              type='secondary'
              onClick={this.handleCancel}
              title='Reset the changes made to the account info.'
            >
              Cancel Changes
            </Button>
          </ButtonGroup>
        ) : null}
      </div>
    );
  }

  private async handleUpdate() {
    if (!this.props.onUpdate) return;
    this.setState({isUpdateDisabled: true});
    await this.props.onUpdate(this.state.updatedAccount);
    this.setState({isUpdateDisabled: false});
  }

  private handleCancel() {
    this.setState({
      updatedAccount: DataManager.cloneAccount(this.props.account),
      cancelled: Date.now()
    });
  }

  private handleNameChange(value: string) {
    this.setState((s) => {
      s.updatedAccount.name = value;
      s.updatedAccount.updated = new Date();
      return s;
    });
  }

  private handleInstitutionChange(value: string) {
    this.setState((s) => {
      s.updatedAccount.institution = value;
      s.updatedAccount.updated = new Date();
      return s;
    });
  }

  private handleCurrencyChange(value: string) {
    this.setState((s) => {
      s.updatedAccount.currency = value;
      s.updatedAccount.updated = new Date();
      return s;
    });
  }

  private handleTypeChange(
    value: {
      name: string;
      type: AccountType;
    } | null
  ): void {
    if (!value) return;
    this.setState((s) => {
      const type = value.type;
      if (type !== s.updatedAccount.type) {
        s.updatedAccount.subtype =
          AccountInfo.getAccountSubtypeOptions(type)[0].type;
      }
      s.updatedAccount.type = value.type;
      s.updatedAccount.updated = new Date();
      return s;
    });
  }

  private handleSubtypeChange(
    value: {
      name: string;
      type: AccountSubtype;
    } | null
  ): void {
    if (!value) return;
    this.setState((s) => {
      s.updatedAccount.subtype = value.type;
      s.updatedAccount.updated = new Date();
      return s;
    });
  }

  /**
   * Gets the list of possible account types and associated display names.
   * @returns a list of account types/display names.
   */
  public static getAccountTypeOptions(): {name: string; type: AccountType}[] {
    return [
      {name: 'Bank', type: 'bank'},
      {name: 'Investment', type: 'investment'},
      {name: 'Other', type: 'other'}
    ];
  }

  /**
   * Gets the list of possible account subtypes and associated display names
   * based on a type of account.
   * @param type the type of account.
   * @returns a list of account subtypes/display names, based on the account
   * type.
   */
  public static getAccountSubtypeOptions(
    type: AccountType
  ): {name: string; type: AccountSubtype}[] {
    const otherOpt = {name: 'Other', type: 'other' as AccountSubtype};
    if (type === 'other') {
      return [otherOpt];
    } else if (type === 'bank') {
      return [
        {name: 'Chequing', type: 'chequing'},
        {name: 'Savings', type: 'savings'},
        otherOpt
      ];
    }
    return [
      {name: 'Non-Registered', type: 'non-reg'},
      {name: 'TFSA', type: 'TFSA'},
      {name: 'RRSP', type: 'RRSP'},
      otherOpt
    ];
  }
}
