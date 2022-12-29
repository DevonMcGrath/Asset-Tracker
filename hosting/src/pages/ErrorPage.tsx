import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Page} from './Page';

export class ErrorPage extends React.Component<
  {title?: string; error?: string; children?: any},
  {}
> {
  public static readonly PAGE_ID = 'error';

  public static readonly DEFAULT_ERROR = 'An unknown error occurred.';

  render(): React.ReactNode {
    return (
      <Page id={ErrorPage.PAGE_ID}>
        <AppHeader title={this.props.title || 'Error'} />
        <AppBody>
          <p>{this.props.error || ErrorPage.DEFAULT_ERROR}</p>
          {this.props.children}
        </AppBody>
      </Page>
    );
  }
}
