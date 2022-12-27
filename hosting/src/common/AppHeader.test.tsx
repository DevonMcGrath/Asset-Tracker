import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {render, screen} from '@testing-library/react';
import {AppHeader} from './AppHeader';
import {Settings} from '../settings';

function properRender(element: JSX.Element): JSX.Element {
  return <BrowserRouter>{element}</BrowserRouter>;
}

describe('AppHeader component', () => {
  test('renders app header', () => {
    const {container} = render(properRender(<AppHeader />));
    expect(container.firstChild).toHaveClass('app-header-container');
    expect(container.firstChild?.nodeName).toEqual('HEADER');
  });

  test('renders links to home and profile', () => {
    const {container} = render(properRender(<AppHeader />));

    // Convert the links to an array
    const links = container.getElementsByTagName('a');
    const n = links.length;
    expect(n).toBeGreaterThanOrEqual(2);
    const linkRefs = [];
    for (let i = 0; i < n; i++) {
      linkRefs.push(links.item(i)?.getAttribute('href'));
    }

    // Check that the links exist
    expect(linkRefs).toContain('/');
    expect(linkRefs).toContain('/profile');
  });

  test('renders default title', () => {
    render(properRender(<AppHeader />));
    const titleElem = screen.getByText(Settings.APP_NAME);
    expect(titleElem).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    const testTitle = 'Test Title 123';
    render(properRender(<AppHeader title={testTitle} />));
    const titleElem = screen.getByText(testTitle);
    expect(titleElem).toBeInTheDocument();
  });
});
