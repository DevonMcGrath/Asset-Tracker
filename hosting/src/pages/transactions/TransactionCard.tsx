import React from 'react';
import {Button} from '../../common/Button';
import {Icon} from '../../common/Icon';
import {formatAsDollarValue, formatAsFloat} from '../../data/common-helpers';
import {Transaction, TransactionType} from '../../models/profile';

import './TransactionCard.css';

export class TransactionCard extends React.Component<
  {
    transaction: Transaction;
    onDelete?: (transaction: Transaction) => void;
  },
  {}
> {
  constructor(props: any) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  render(): React.ReactNode {
    const t = this.props.transaction;
    return (
      <div className='transaction-card'>
        <div className='transaction-info'>
          {TransactionCard.getIcon(t.type)}
          {t.type.toUpperCase() +
            ' of ' +
            formatAsDollarValue(Math.abs(t.amount)) +
            ' ' +
            t.currency +
            ' on ' +
            t.timestamp.toLocaleDateString() +
            this.getAdditionalDetails()}
        </div>
        <Button
          icon='clear'
          type='icon'
          title='Delete this transaction (cannot be undone).'
          className='transaction-card-delete-btn'
          onClick={this.handleDelete}
        />
      </div>
    );
  }

  private getAdditionalDetails(): string {
    // No extra details for deposits, withdrawals, cash transactions
    const t = this.props.transaction;
    if (
      t.type === 'deposit' ||
      t.type === 'withdrawal' ||
      t.assetName === '_CASH'
    ) {
      return '';
    }

    return ' (' + formatAsFloat(t.assetQuantity, 3) + ' x ' + t.assetName + ')';
  }

  private handleDelete() {
    if (!this.props.onDelete) return;
    this.props.onDelete(this.props.transaction);
  }

  public static getIcon(type: TransactionType): JSX.Element {
    switch (type) {
      case 'deposit':
        return <Icon>login</Icon>;
      case 'withdrawal':
        return <Icon>logout</Icon>;
      case 'purchase':
        return <Icon>shopping_cart</Icon>;
      default:
        return <Icon>sell</Icon>;
    }
  }
}
