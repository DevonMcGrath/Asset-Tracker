import {render} from '@testing-library/react';
import {TransactionCard} from './TransactionCard';
import {TransactionType} from '../../models/profile';
import {click, mockTransaction} from '../../testing-utils';

const deleteTransactionBtnClass = 'transaction-card-delete-btn';

describe('TransactionCard component', () => {
  test('renders a transaction', async () => {
    const transaction = mockTransaction('investment', 'CAD');
    const {container} = render(<TransactionCard transaction={transaction} />);
    expect(container.firstChild).toHaveClass('transaction-card');
    const btns = container.getElementsByClassName(deleteTransactionBtnClass);
    expect(btns.length).toEqual(1);
    await click(btns.item(0));
  });

  test('calls the onDelete callback when the delete icon is clicked', async () => {
    // Render a transaction
    const transaction = mockTransaction('investment', 'CAD');
    const mockCallback = jest.fn((trToDelete) => {
      expect(trToDelete).toStrictEqual(transaction);
    });
    const {container} = render(
      <TransactionCard transaction={transaction} onDelete={mockCallback} />
    );

    // Find and trigger the delete button
    const btns = container.getElementsByClassName(deleteTransactionBtnClass);
    expect(btns.length).toEqual(1);
    await click(btns.item(0));
    expect(mockCallback).toBeCalledTimes(1);
  });

  test('renders an icon for each transaction type', () => {
    const types: TransactionType[] = [
      'deposit',
      'withdrawal',
      'purchase',
      'sale'
    ];
    types.forEach((type) => {
      const {container} = render(TransactionCard.getIcon(type));
      expect(container.firstChild).toHaveClass('icon');
    });
  });
});
