import React from 'react';
import {PieChart} from '../../common/PieChart';
import {formatAccountTitle} from '../../data/common-helpers';
import {Account, Transaction} from '../../models/profile';

export class AccountSummary extends React.Component<
  {
    account: Account;
    filter?: (
      transaction: Transaction,
      account: Account,
      index: number
    ) => boolean;
  },
  {}
> {
  render(): React.ReactNode {
    const a = this.props.account;
    const title = formatAccountTitle(a);
    const transactions = this.getTransactions();
    const n = transactions.length;
    const transactionsByType: {[type: string]: number} = {};

    // Get the transaction stats
    for (let i = 0; i < n; i++) {
      const t = transactions[i];
      if (!transactionsByType[t.type]) transactionsByType[t.type] = 1;
      else transactionsByType[t.type]++;
    }
    const trByTypeData = Object.keys(transactionsByType)
      .map((type) => {
        return {category: type.toUpperCase(), value: transactionsByType[type]};
      })
      .sort((a, b) => (a.value > b.value ? -1 : 1));

    return (
      <div className='account-summary'>
        <h2>{title}</h2>
        <p>
          <b>Total Transactions:</b> {n}
        </p>
        {n && (
          <div className='flex-container'>
            <PieChart
              categoriesLabel='Type'
              valuesLabel='Total Transactions'
              data={trByTypeData}
              options={{title: 'Transactions by Type'}}
            />
          </div>
        )}
      </div>
    );
  }

  private getTransactions(): Transaction[] {
    const a = this.props.account;
    const filter = this.props.filter;
    if (!filter) return a.transactions;
    return a.transactions.filter((t, i) => filter(t, a, i));
  }
}
