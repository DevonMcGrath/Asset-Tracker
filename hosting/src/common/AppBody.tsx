import React from 'react';

export class AppBody extends React.Component<
  {
    noMaxWidth?: boolean;
    className?: string;
    children?: any;
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
    return <main className={c}>{this.props.children}</main>;
  }
}
