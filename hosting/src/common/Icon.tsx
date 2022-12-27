import React from 'react';
import './Icon.css';

export class Icon extends React.Component<{children?: any; size?: string}, {}> {
  private iconClass;

  constructor(props: any) {
    super(props);

    // Determine the icon classes
    this.iconClass = 'icon material-icons';
    const size = (this.props.size || '').toLowerCase();
    let sizeClass = '';
    if (['medium', 'm'].indexOf(size) >= 0) {
      sizeClass = ' m';
    } else if (['large', 'l'].indexOf(size) >= 0) {
      sizeClass = ' l';
    }
    this.iconClass += sizeClass;
  }

  render() {
    return (
      <span className={this.iconClass} aria-hidden='true'>
        {this.props.children}
      </span>
    );
  }
}
