import {render, screen} from '@testing-library/react';
import {mockAccount} from '../../testing-utils';
import {AccountSummary} from './AccountSummary';

describe('AccountSummary component', () => {
  test('renders an account summary', () => {
    const transactionCount = 2000;
    const account = mockAccount(transactionCount);
    render(<AccountSummary account={account} />);
    expect(screen.queryByText('' + transactionCount)).toBeInTheDocument();
  });

  test('renders an account summary using a transaction filter', () => {
    const transactionCount = 2000;
    const limit = 1000;
    const account = mockAccount(transactionCount);
    render(
      <AccountSummary
        account={account}
        filter={(_, _1, index) => index < limit}
      />
    );
    expect(screen.queryByText('' + limit)).toBeInTheDocument();
  });
});
