import React from 'react';

export class Page extends React.Component<{id: string; children?: any}, {}> {
  render(): React.ReactNode {
    return (
      <div className='app-page' data-page={this.props.id}>
        {this.props.children}
      </div>
    );
  }
}
