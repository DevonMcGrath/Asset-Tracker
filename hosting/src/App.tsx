import React from 'react';
import './App.css';
import {app, AppManager} from './data/AppManager';

class App extends React.Component<
  {},
  {
    isAuthReady: boolean;
    isReady: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAuthReady: false,
      isReady: false
    };
  }

  componentDidMount(): void {
    app.setOnAuthReady((_, user) => {
      // User not logged in
      if (!app.isLoggedIn()) {
        AppManager.redirectToSignIn();
      }

      this.setState({isAuthReady: true, isReady: app.isLoggedIn()});
    });
  }

  render(): JSX.Element {
    let content = <></>;
    if (this.state.isReady) {
      content = <>Hi, you are logged in.</>;
    } else if (this.state.isAuthReady) {
      content = <>Hi, you are not logged in.</>;
    } else {
      content = <>Loading...</>;
    }
    return <div className='app-container'>{content}</div>;
  }
}

export default App;
