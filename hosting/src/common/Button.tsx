import React from 'react';
import {Link} from 'react-router-dom';

import './Button.css';
import {Icon} from './Icon';

export class Button extends React.Component<
  {
    className?: string;
    children?: any;
    icon?: string;
    type?: 'primary' | 'secondary' | 'tertiary' | 'icon';
    title?: string;
    disabled?: boolean;
    link?: string;
    onClick?: (e: any, btn: Button) => void;
  },
  {}
> {
  private icon?;

  private buttonClass;

  constructor(props: any) {
    super(props);

    this.buttonClass = 'btn';

    // Create the icon
    if (this.props.icon) {
      this.icon = <Icon>{this.props.icon}</Icon>;
    }

    // Add type specific class
    const ptype = (this.props.type || '').toLowerCase();
    let type = ' btn-primary';
    if (['secondary', 'tertiary', 'icon'].indexOf(ptype) >= 0) {
      type = ' btn-' + ptype;
    }
    this.buttonClass += type;
    if (this.props.className) {
      this.buttonClass += ' ' + this.props.className;
    }

    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(e: any) {
    const onClick = this.props.onClick;
    if (onClick) {
      onClick(e, this);
    }
  }

  render() {
    const content = (
      <>
        {this.icon || null}
        {this.props.children}
      </>
    );

    // Enabled link
    if (!this.props.disabled && this.props.link) {
      return (
        <Link
          to={this.props.link}
          className={this.buttonClass}
          title={this.props.title}
          aria-label={this.props.title}
        >
          {content}
        </Link>
      );
    }

    // Regular button (or disabled link)
    return (
      <button
        className={this.buttonClass}
        onClick={this.handleClick}
        disabled={this.props.disabled}
        title={this.props.title}
        aria-label={this.props.title}
      >
        {content}
      </button>
    );
  }
}
