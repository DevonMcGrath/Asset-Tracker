import React from 'react';
import {render, screen} from '@testing-library/react';
import {AuthenticatedLayout} from './AuthenticatedLayout';
import {
  mockProfile,
  testForCorePageElements,
  wrapInRouter
} from '../testing-utils';
import {app} from '../data/AppManager';

describe('AuthenticatedLayout component', () => {
  test('renders an error page when not logged in', () => {
    const profile = mockProfile(0);
    testForCorePageElements(
      <AuthenticatedLayout profile={profile}></AuthenticatedLayout>
    );
    expect(
      screen.getByText(AuthenticatedLayout.NOT_LOGGED_IN_ERROR_TITLE)
    ).toBeInTheDocument();
    expect(
      screen.getByText(AuthenticatedLayout.NOT_LOGGED_IN_ERROR)
    ).toBeInTheDocument();
  });

  test('does not render an error page when logged in', () => {
    // Create a mock implementation for the user
    const spy = jest.spyOn(app, 'isLoggedIn').mockImplementation(() => {
      return true;
    });

    // Render
    const profile = mockProfile(0);
    render(
      wrapInRouter(
        <AuthenticatedLayout profile={profile}></AuthenticatedLayout>
      )
    );

    // Ensure the error page isn't rendered
    function createCheck(text: string) {
      return function () {
        screen.getByText(text);
      };
    }
    expect(
      createCheck(AuthenticatedLayout.NOT_LOGGED_IN_ERROR_TITLE)
    ).toThrowError();
    expect(createCheck(AuthenticatedLayout.NOT_LOGGED_IN_ERROR)).toThrowError();

    spy.mockRestore();
  });
});
