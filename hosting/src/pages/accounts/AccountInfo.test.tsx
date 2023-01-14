import {act, fireEvent, render} from '@testing-library/react';
import {AccountInfo} from './AccountInfo';
import {click, mockAccount} from '../../testing-utils';
import {Account, AccountType} from '../../models/profile';

// ================================= HELPERS =================================

const testAccount = mockAccount(20);
const updateBtnClass = 'account-info-update-btn';
const cancelBtnClass = 'account-info-cancel-btn';

interface AccountInfoUpdate {
  field: keyof Account;
  value: string;
  dropDownValue?: string;
}
interface AccountInfoUpdates {
  [id: string]: AccountInfoUpdate;
}

/**
 * Ensures that all account info fields exist and any additional checks.
 * @param additionalChecks additional, per-field checks.
 */
function expectAllFields(
  additionalChecks?: (field: HTMLElement, id: string) => void
) {
  // Ensure all fields exist
  const fields = [
    'account-name',
    'account-institution',
    'account-type',
    'account-subtype',
    'account-currency'
  ];
  fields.forEach((field) => {
    const fieldElem = document.getElementById(field);
    expect(fieldElem).not.toBeNull();
    if (additionalChecks && fieldElem) {
      additionalChecks(fieldElem, field);
    }
  });
}

/**
 * Gets a set of account updates to apply to account info.
 * @param additionalUpdates any additional account info updates.
 * @returns all the account info updates.
 */
function getAccountInfoUpdates(
  additionalUpdates?: AccountInfoUpdates
): AccountInfoUpdates {
  const toUpdate: AccountInfoUpdates = {
    'account-name': {
      field: 'name',
      value: 'New Account Test Name'
    },
    'account-institution': {
      field: 'institution',
      value: 'New FI Test Name'
    },
    'account-type': {
      field: 'type',
      value: 'investment',
      dropDownValue: '1'
    },
    'account-subtype': {
      field: 'subtype',
      value: 'TFSA',
      dropDownValue: '1'
    },
    'account-currency': {
      field: 'currency',
      value: 'CAD TEST'
    }
  };
  if (!additionalUpdates) {
    return toUpdate;
  }
  return {
    ...toUpdate,
    ...additionalUpdates
  };
}

/**
 * Modifies fields with updates through DOM change events.
 * @param updates the updates to apply.
 */
async function modifyAccountInfo(updates: AccountInfoUpdates): Promise<void> {
  await act(async () => {
    expectAllFields((field, id) => {
      const update = updates[id];
      if (!update) return; // no update for this field
      const value =
        update.dropDownValue !== undefined
          ? update.dropDownValue
          : update.value;
      fireEvent.change(field, {target: {value}});
    });
    await new Promise(process.nextTick);
  });
}

/**
 * Gets a function that can validate account updates `onUpdate`.
 * @param updates the updates to check.
 * @param original the original account information.
 * @returns a function to check updates when the `onUpdate` callback is called
 * on an `AccountInfo` component instance.
 */
function getAccountInfoUpdatesChecker(
  updates: AccountInfoUpdates,
  original: Account
) {
  return async (account: Account) => {
    Object.keys(updates).forEach((id) => {
      const update = updates[id];
      expect(account[update.field]).toEqual(update.value);
    });
    expect(account === original).toBeFalsy();
  };
}

/**
 * Dispatches a click event to the specified button.
 * @param container the container to search for the button in.
 * @param buttonClass the class the button has.
 */
async function clickButton(container: HTMLElement, buttonClass: string) {
  await click(container.getElementsByClassName(buttonClass).item(0));
}

// ================================== TESTS ==================================
describe('AccountInfo component', () => {
  test('creates an account info form', () => {
    const {container} = render(<AccountInfo account={testAccount} />);

    // Ensure all fields are enabled
    expectAllFields((field) => {
      expect(field).not.toBeDisabled();
    });

    // Ensure the buttons exist too
    const buttons = [updateBtnClass, cancelBtnClass];
    buttons.forEach((button) => {
      expect(container.getElementsByClassName(button).length).toEqual(1);
    });
  });

  test('creates a disabled account info form', () => {
    const {container} = render(
      <AccountInfo account={testAccount} editingDisabled />
    );

    // Ensure all fields are enabled
    expectAllFields((field) => {
      expect(field).toBeDisabled();
    });

    // Ensure the buttons exist too
    const buttons = [updateBtnClass, cancelBtnClass];
    buttons.forEach((button) => {
      expect(container.getElementsByClassName(button).length).toEqual(0);
    });
  });

  test('allows updating account info', async () => {
    // Render and modify the account info
    const account = mockAccount(0);
    account.type = 'bank';
    account.subtype = 'chequing';
    const updates = getAccountInfoUpdates();
    const {container} = render(
      <AccountInfo
        account={account}
        onUpdate={getAccountInfoUpdatesChecker(updates, account)}
      />
    );
    await modifyAccountInfo(updates);

    await clickButton(container, updateBtnClass);
  });

  test('cancels account info updates', async () => {
    // Create a basic account
    const account = mockAccount(0);
    account.type = 'bank';
    account.subtype = 'chequing';

    async function checkAccount(modifiedAccount: Account) {
      expect(modifiedAccount).toEqual(account);
      expect(modifiedAccount === account).toBeFalsy();
    }

    // Render and modify the account info
    const updates = getAccountInfoUpdates({
      'account-type': {
        field: 'type',
        value: 'other',
        dropDownValue: '2'
      }
    });
    const {container} = render(
      <AccountInfo account={account} onUpdate={checkAccount} />
    );
    await modifyAccountInfo(updates);

    // Cancel the changes then check the result
    await clickButton(container, cancelBtnClass);
    await clickButton(container, updateBtnClass);
  });

  test('resets account subtype when the type is changed', async () => {
    // Create a basic account
    const account = mockAccount(0);
    account.type = 'investment';
    account.subtype = 'other';
    const newType: AccountType = 'bank';

    async function checkAccount(modifiedAccount: Account) {
      expect(modifiedAccount.subtype).toEqual(
        AccountInfo.getAccountSubtypeOptions(newType)[0].type
      );
    }

    // Render and modify the account info
    const updates: AccountInfoUpdates = {
      'account-type': {
        field: 'type',
        value: newType,
        dropDownValue: '0'
      }
    };
    const {container} = render(
      <AccountInfo account={account} onUpdate={checkAccount} />
    );
    await modifyAccountInfo(updates);
    await clickButton(container, updateBtnClass);
  });

  test('does not reset account subtype when the type is not changed', async () => {
    // Create a basic account
    const account = mockAccount(0);
    account.type = 'investment';
    account.subtype = 'other';

    async function checkAccount(modifiedAccount: Account) {
      expect(modifiedAccount.subtype).toEqual(account.subtype);
    }

    // Render and modify the account info
    const updates: AccountInfoUpdates = {
      'account-type': {
        field: 'type',
        value: 'investment',
        dropDownValue: '1'
      }
    };
    const {container} = render(
      <AccountInfo account={account} onUpdate={checkAccount} />
    );
    await modifyAccountInfo(updates);
    await clickButton(container, updateBtnClass);
  });
});
