import React from 'react';
import {render, screen} from '@testing-library/react';
import {ErrorPage} from './ErrorPage';
import {testForCorePageElements, wrapInRouter} from '../testing-utils';

describe('ErrorPage component', () => {
  test('renders an error page', () => {
    testForCorePageElements(<ErrorPage></ErrorPage>, ErrorPage.PAGE_ID);
    expect(screen.getByText(/^Error$/)).toBeInTheDocument();
    expect(screen.getByText(ErrorPage.DEFAULT_ERROR)).toBeInTheDocument();
  });

  test('renders a custom error and title', () => {
    // Render the page
    const errorTitle = 'Error: Test Error Page';
    const error = 'This is a test error message.';
    const errorElemText = 'More custom error text.';
    render(
      wrapInRouter(
        <ErrorPage title={errorTitle} error={error}>
          <p>{errorElemText}</p>
        </ErrorPage>
      )
    );

    // Check all the text
    expect(screen.getByText(errorTitle)).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByText(errorElemText)).toBeInTheDocument();
  });
});
