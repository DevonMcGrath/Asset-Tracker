import {render, screen} from '@testing-library/react';
import {Account} from '../../models/profile';
import {mockAccount, wrapInRouter} from '../../testing-utils';
import {AccountCard} from './AccountCard';

function expectCorrectTitle(account: Account) {
  // Render the card
  const {container} = render(wrapInRouter(<AccountCard account={account} />));

  // Check the title
  const title = container.firstChild?.textContent || '';
  if (account.name) {
    expect(title).toContain(account.name);
  } else {
    expect(title).toContain(`Account ${account.id}`);
  }
  if (account.institution) {
    expect(title).toContain(account.institution);
  }
  if (account.currency) {
    expect(title).toContain(account.currency);
  }
  expect(title).toMatch(
    new RegExp(`Transactions:\\s+${account.transactions.length}`)
  );
}

describe('AccountCard component', () => {
  test('renders an account card', () => {
    const account = mockAccount(10);
    const {container} = render(wrapInRouter(<AccountCard account={account} />));
    const card = container.firstChild;
    expect(card).toHaveClass('account-card');
    expect(card).toHaveAttribute('href', `/accounts/${account.id}`);
    expectCorrectTitle(account);
  });

  test('renders with the proper title elements', () => {
    const account = mockAccount(0);
    account.name = 'TEST ACCOUNT';
    account.institution = 'FAKE FI NAME';
    account.currency = 'CAD TEST';
    expectCorrectTitle(account);
    account.currency = '';
    expectCorrectTitle(account);
    account.institution = '';
    expectCorrectTitle(account);
    account.name = '';
    expectCorrectTitle(account);
  });
});
