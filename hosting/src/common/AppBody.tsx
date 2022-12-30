import React from 'react';
import {Link} from 'react-router-dom';

import './AppBody.css';
import {Icon} from './Icon';

export class AppBody extends React.Component<
  {
    noMaxWidth?: boolean;
    className?: string;
    children?: any;
    backTitle?: string;
    backTitleLink?: string;
  },
  {}
> {
  render(): React.ReactNode {
    let c = 'app-body m-top-m m-bottom-l';
    if (!this.props.noMaxWidth) {
      c += ' container-max-width';
    }
    if (this.props.className) {
      c += ' ' + this.props.className;
    }
    let title = null;
    if (this.props.backTitle && this.props.backTitleLink) {
      title = (
        <Link
          className='app-body-back-title main-link'
          to={this.props.backTitleLink}
        >
          <Icon>arrow_back_ios</Icon>
          {this.props.backTitle}
        </Link>
      );
    }
    return (
      <main className={c}>
        {title}
        {this.props.children}
      </main>
    );
  }
}
