import React from 'react';
import {Link} from 'react-router-dom';
import {formatAccountTitle} from '../../data/common-helpers';
import {Account} from '../../models/profile';

import './AccountCard.css';

export class AccountCard extends React.Component<{account: Account}, {}> {
  render(): React.ReactNode {
    const a = this.props.account;
    return (
      <Link
        className='account-card'
        to={`/accounts/${a.id}`}
        title='View account details'
      >
        <b>{formatAccountTitle(a)}</b>
        {' | Transactions: ' + a.transactions.length}
      </Link>
    );
  }
}
