import React from 'react';
import {act, render} from '@testing-library/react';
import App from './App';
import {app, AppManager} from './data/AppManager';
import {fakeAuth, wrapInRouter} from './testing-utils';

describe('App component', () => {
  test('renders app container', () => {
    const {container} = render(wrapInRouter(<App />));
    expect(container.firstChild).toHaveClass('app-container');
  });

  test('redirects to log in page when logged out', () => {
    const spy = jest.spyOn(AppManager, 'redirectToSignIn');
    render(wrapInRouter(<App />));
    expect(spy).toBeCalled();
  });

  test('renders authenticated layout when logged in', () => {
    fakeAuth(app, async () => {
      const spy = jest.spyOn(AppManager, 'redirectToSignIn');
      let elem = wrapInRouter(<App />);
      await act(async () => {
        render(elem);
      });
      expect(spy).not.toBeCalled();
    });
  });
});
