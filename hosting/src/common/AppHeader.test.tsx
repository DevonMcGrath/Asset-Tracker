import React from 'react';
import {render, screen} from '@testing-library/react';
import {User} from 'firebase/auth';
import {AppHeader} from './AppHeader';
import {Settings} from '../settings';
import {app} from '../data/AppManager';
import {wrapInRouter} from '../testing-utils';

describe('AppHeader component', () => {
  test('renders app header', () => {
    const {container} = render(wrapInRouter(<AppHeader />));
    expect(container.firstChild).toHaveClass('app-header-container');
    expect(container.firstChild?.nodeName).toEqual('HEADER');
  });

  test('renders links to home', () => {
    const {container} = render(wrapInRouter(<AppHeader />));

    // Convert the links to an array
    const links = container.getElementsByTagName('a');
    const n = links.length;
    expect(n).toBeGreaterThanOrEqual(1);
    const linkRefs = [];
    for (let i = 0; i < n; i++) {
      linkRefs.push(links.item(i)?.getAttribute('href'));
    }

    // Check for link to home page
    expect(linkRefs).toContain('/');
  });

  test('renders default title', () => {
    render(wrapInRouter(<AppHeader />));
    const titleElem = screen.getByText(Settings.APP_NAME);
    expect(titleElem).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    const testTitle = 'Test Title 123';
    render(wrapInRouter(<AppHeader title={testTitle} />));
    const titleElem = screen.getByText(testTitle);
    expect(titleElem).toBeInTheDocument();
  });

  test('renders user name', () => {
    // Create a mock implementation for the user
    const name = 'ALICE TEST';
    const spy = jest.spyOn(app, 'getUser').mockImplementation(() => {
      return {
        displayName: name
      } as User;
    });

    // Check that the name is rendered
    render(wrapInRouter(<AppHeader />));
    const nameElem = screen.getByText(name);
    expect(nameElem).toBeInTheDocument();

    spy.mockRestore();
  });

  test('renders user email, when no display name is available', () => {
    // Create a mock implementation for the user
    const email = 'alice.test@example.com';
    const spy = jest.spyOn(app, 'getUser').mockImplementation(() => {
      return {
        email
      } as User;
    });

    // Check that the name is rendered
    render(wrapInRouter(<AppHeader />));
    const nameElem = screen.getByText(email);
    expect(nameElem).toBeInTheDocument();

    spy.mockRestore();
  });

  test('logs out after clicking logout button', () => {
    // Render
    const spy = jest.spyOn(app, 'logout');
    const {container} = render(wrapInRouter(<AppHeader />));

    // Find and click the button
    const logoutBtns = container.getElementsByClassName('app-logout-btn');
    expect(logoutBtns.length).toEqual(1);
    const btn = logoutBtns.item(0);
    btn?.dispatchEvent(new MouseEvent('click', {bubbles: true}));

    expect(spy).toBeCalled();
  });
});
