import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';

export class ErrorPage extends React.Component<
  {title?: string; error?: string; children?: any},
  {}
> {
  public static readonly DEFAULT_ERROR = 'An unknown error occurred.';

  render(): React.ReactNode {
    return (
      <>
        <AppHeader title={this.props.title || 'Error'} />
        <AppBody>
          <p>{this.props.error || ErrorPage.DEFAULT_ERROR}</p>
          {this.props.children}
        </AppBody>
      </>
    );
  }
}
