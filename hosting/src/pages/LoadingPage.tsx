import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Page} from './Page';

/**
 * The `LoadingPage` component represents a simple loading screen.
 */
export class LoadingPage extends React.Component<{}, {}> {
  public static readonly PAGE_ID = 'loading';

  render(): React.ReactNode {
    return (
      <Page id={LoadingPage.PAGE_ID}>
        <AppHeader title='Loading' />
        <AppBody>
          <p>Loading...</p>
        </AppBody>
      </Page>
    );
  }
}
