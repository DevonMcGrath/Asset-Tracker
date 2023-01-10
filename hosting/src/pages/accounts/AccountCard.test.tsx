import {render} from '@testing-library/react';
import {mockAccount, wrapInRouter} from '../../testing-utils';
import {AccountCard} from './AccountCard';

describe('AccountCard component', () => {
  test('renders an account card', () => {
    const account = mockAccount(10);
    const {container} = render(wrapInRouter(<AccountCard account={account} />));
    const card = container.firstChild;
    expect(card).toHaveClass('account-card');
    expect(card).toHaveAttribute('href', `/accounts/${account.id}`);
  });
});
