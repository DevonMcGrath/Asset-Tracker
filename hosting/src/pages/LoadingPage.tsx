import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';

/**
 * The `LoadingPage` component represents a simple loading screen.
 */
export class LoadingPage extends React.Component<{}, {}> {
  render(): React.ReactNode {
    return (
      <>
        <AppHeader title='Loading' />
        <AppBody>
          <p>Loading...</p>
        </AppBody>
      </>
    );
  }
}
