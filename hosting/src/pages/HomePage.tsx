import React from 'react';
import {AppBody} from '../common/AppBody';
import {AppHeader} from '../common/AppHeader';
import {Button} from '../common/Button';
import {ButtonGroup} from '../common/ButtonGroup';
import {AssetTrackerProfile} from '../models/profile';
import {Page} from './Page';

export class HomePage extends React.Component<
  {profile: AssetTrackerProfile},
  {}
> {
  public static readonly PAGE_ID = 'home';

  render(): React.ReactNode {
    return (
      <Page id={HomePage.PAGE_ID}>
        <AppHeader />
        <AppBody>
          <p>Hi, you are logged in to the home page.</p>
          <ButtonGroup className='m-m'>
            <Button>Primary</Button>
            <Button type='secondary'>Secondary</Button>
            <Button type='tertiary'>Tertiary</Button>
          </ButtonGroup>
          <ButtonGroup className='m-m'>
            <Button disabled>Primary Dis.</Button>
            <Button disabled type='secondary'>
              Secondary Dis.
            </Button>
            <Button disabled type='tertiary'>
              Tertiary Dis.
            </Button>
          </ButtonGroup>
        </AppBody>
      </Page>
    );
  }
}
