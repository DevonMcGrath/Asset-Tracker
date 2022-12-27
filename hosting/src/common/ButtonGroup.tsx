import React from 'react';
import './ButtonGroup.css';

export class ButtonGroup extends React.Component<
  {children?: any; className?: string},
  {}
> {
  render() {
    let c = 'btn-group';
    if (this.props.className) {
      c += ' ' + this.props.className;
    }
    return <div className={c}>{this.props.children}</div>;
  }
}
