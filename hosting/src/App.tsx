import React from 'react';
import './App.css';
import {app, AppManager} from './data/AppManager';
import {dataManager} from './data/DataManager';
import {AssetTrackerProfile} from './models/profile';
import {AuthenticatedLayout} from './pages/AuthenticatedLayout';
import {ErrorPage} from './pages/ErrorPage';
import {LoadingPage} from './pages/LoadingPage';

class App extends React.Component<
  {},
  {
    isAuthReady: boolean;
    isDataReady: boolean;
    isReady: boolean;
    profile: AssetTrackerProfile | null;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAuthReady: false,
      isDataReady: false,
      isReady: false,
      profile: null
    };
  }

  componentDidMount(): void {
    app.setOnAuthReady(async (_, user) => {
      // User not logged in
      if (!app.isLoggedIn()) {
        AppManager.redirectToSignIn();
        return;
      }

      // Get the profile
      let profile: AssetTrackerProfile | null = null;
      try {
        profile = await this.loadProfile();
      } catch (e) {
        console.error('Failed to get profile', e);
      }

      this.setState({isAuthReady: true, isReady: app.isLoggedIn(), profile});
    });
  }

  render(): React.ReactNode {
    let content = <></>;
    if (this.state.isReady && this.state.profile) {
      content = <AuthenticatedLayout profile={this.state.profile} />;
    } else if (this.state.isReady) {
      content = (
        <ErrorPage
          title='Error: Unable to Create Profile'
          error='We were not able to create a profile for you.'
        />
      );
    } else if (this.state.isAuthReady) {
      content = AuthenticatedLayout.getNotLoggedInPage();
    } else {
      content = <LoadingPage />;
    }
    return <div className='app-container'>{content}</div>;
  }

  private async loadProfile(): Promise<AssetTrackerProfile> {
    try {
      // If the profile exists
      return await dataManager.getFullProfile();
    } catch (e) {
      // Profile may not exist, try to create it
      await dataManager.createProfile();

      // Return the newly created profile
      return await dataManager.getFullProfile();
    }
  }
}

export default App;
