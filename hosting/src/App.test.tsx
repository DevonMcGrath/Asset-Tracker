import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import {AppManager} from './data/AppManager';

describe('App component', () => {
  test('renders app container', () => {
    const {container} = render(<App />);
    expect(container.firstChild).toHaveClass('app-container');
  });

  test('redirects to log in page when logged out', () => {
    const spy = jest.spyOn(AppManager, 'redirectToSignIn');
    render(<App />);
    expect(spy).toBeCalled();
  });
});
