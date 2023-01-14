import {act, render} from '@testing-library/react';
import App from './App';
import {app, AppManager} from './data/AppManager';
import {fakeAuth, fakeConsole, wrapInRouter} from './testing-utils';
import {dataManager} from './data/DataManager';
import {ErrorPage} from './pages/ErrorPage';

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

  test('renders authenticated layout when logged in', async () => {
    await fakeAuth(app, async () => {
      const spy = jest.spyOn(AppManager, 'redirectToSignIn');
      let elem = wrapInRouter(<App />);
      await act(async () => {
        render(elem);
      });
      expect(spy).not.toBeCalled();
    });
  });

  test('renders an error page when a profile cannot be created', async () => {
    // Make sure a profile cannot be created
    const spy = jest
      .spyOn(dataManager, 'createProfile')
      .mockImplementation(() => {
        throw new Error('Intentional Fail');
      });

    await fakeAuth(app, async () => {
      await fakeConsole(async () => {
        // Perform the initial render
        await act(async () => {
          render(wrapInRouter(<App />));
        });

        // Check that there is an error page
        const pages = document.getElementsByClassName('app-page');
        expect(pages.length).toEqual(1);
        expect(pages.item(0)).toHaveAttribute('data-page', ErrorPage.PAGE_ID);
      });
    });

    spy.mockRestore();
  });
});
