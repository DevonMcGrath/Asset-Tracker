import React from 'react';
import {Link} from 'react-router-dom';
import {app, AppManager} from '../data/AppManager';
import {Settings} from '../settings';

import './AppHeader.css';
import {Button} from './Button';

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
          <div
            className='flex-container app-header-profile-btn'
            title='Profile info'
            aria-label='Profile info'
            tabIndex={0}
          >
            <span className='app-header-name'>{username}</span>
            <img
              className='app-header-profile-img'
              src={app.getProfilePic()}
              alt='Profile pciture'
            />
            <div className='app-header-profile-info'>
              <Button className='app-logout-btn' onClick={this.logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  private logout() {
    app.logout();
    AppManager.redirectToSignIn();
  }
}
