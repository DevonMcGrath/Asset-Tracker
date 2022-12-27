import React from 'react';
import {Link} from 'react-router-dom';
import {app} from '../data/AppManager';
import {Settings} from '../settings';

import './AppHeader.css';

export class AppHeader extends React.Component<{title?: string}, {}> {
  render(): React.ReactNode {
    const user = app.getUser();
    let username: string = '(Not Logged In)';
    if (user) {
      username = user.displayName || user.email || '';
    }
    return (
      <header className='app-header-container'>
        <div className='app-header flex-container'>
          <div className='flex-container'>
            <Link
              to='/'
              className='app-header-link'
              title='Return to home page'
              aria-label='Return to home page'
            >
              <img
                className='app-header-logo'
                src='/img/logo192-inverted.png'
                alt='Asset Tracker Logo'
              />
            </Link>
            <h1 className='app-header-title'>
              {this.props.title || Settings.APP_NAME}
            </h1>
          </div>
          <Link
            to='/profile'
            className='flex-container app-header-profile-btn'
            title='View profile'
            aria-label='View profile'
          >
            <span className='app-header-name'>{username}</span>
            <img
              className='app-header-profile-img'
              src={app.getProfilePic()}
              alt='Profile pciture'
            />
          </Link>
        </div>
      </header>
    );
  }
}
