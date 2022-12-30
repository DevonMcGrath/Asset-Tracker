import React from 'react';
import {Link} from 'react-router-dom';
import {Account} from '../../models/profile';

import './AccountCard.css';

export class AccountCard extends React.Component<{account: Account}, {}> {
  render(): React.ReactNode {
    const a = this.props.account;
    let title = a.name || 'Account ' + a.id;
    if (a.currency) {
      title += ' (' + a.currency + ')';
    }
    if (a.institution) {
      title = a.institution + ': ' + title;
    }
    return (
      <Link
        className='account-card'
        to={`/accounts/${a.id}`}
        title='View account details'
      >
        <b>{title}</b> | Transactions: {a.transactions.length}
      </Link>
    );
  }
}
