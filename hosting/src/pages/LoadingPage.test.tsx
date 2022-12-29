import React from 'react';
import {screen} from '@testing-library/react';
import {LoadingPage} from './LoadingPage';
import {testForCorePageElements} from '../testing-utils';

describe('LoadingPage component', () => {
  test('renders a loading page', () => {
    testForCorePageElements(<LoadingPage></LoadingPage>, LoadingPage.PAGE_ID);
    expect(screen.getByText(/^Loading$/)).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
