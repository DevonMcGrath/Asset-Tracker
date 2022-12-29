import React from 'react';
import {render, screen} from '@testing-library/react';
import {AuthenticatedLayout} from './AuthenticatedLayout';
import {
  fakeAuth,
  mockProfile,
  testForCorePageElements,
  wrapInRouter
} from '../testing-utils';
import {app} from '../data/AppManager';
import {ErrorPage} from './ErrorPage';

/**
 * Checks that the rendered content does not contain an error page.
 */
function expectNoErrorPage(container: HTMLElement) {
  const pages = container.getElementsByClassName('app-page');
  expect(pages.length).toBeLessThanOrEqual(1);
  if (pages.length) {
    expect(pages.item(0)).not.toHaveAttribute('data-page', ErrorPage.PAGE_ID);
  }
}

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
    fakeAuth(app, async () => {
      // Render
      const profile = mockProfile(1);
      const {container} = render(
        wrapInRouter(
          <AuthenticatedLayout profile={profile}></AuthenticatedLayout>
        )
      );

      // Ensure the error page isn't rendered
      expectNoErrorPage(container);
    });
  });

  test('renders a profile when there are no accounts', () => {
    fakeAuth(app, async () => {
      // Render
      const profile = mockProfile(0);
      const {container} = render(
        wrapInRouter(
          <AuthenticatedLayout profile={profile}></AuthenticatedLayout>
        )
      );

      // Ensure the error page isn't rendered
      expectNoErrorPage(container);
    });
  });
});
