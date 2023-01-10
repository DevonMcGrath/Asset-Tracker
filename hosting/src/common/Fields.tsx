import React from 'react';

import './Fields.css';

export class Input extends React.Component<
  {
    id?: string;
    className?: string;
    type?: string;
    value?: string;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
    autoComplete?: string;
    onChange?: (value: string, e: any) => void;
    onBlur?: (value: string, e: any) => void;
  },
  {value: string}
> {
  constructor(props: any) {
    super(props);
    this.state = {value: this.props.value || ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  private handleChange(e: any) {
    this.setState({value: e.target.value});
    if (this.props.onChange) {
      this.props.onChange(e.target.value, e);
    }
  }

  private handleBlur(e: any) {
    if (this.props.onBlur) {
      this.props.onBlur(e.target.value, e);
    }
  }

  render() {
    return (
      <input
        id={this.props.id}
        className={this.props.className}
        type={this.props.type || 'text'}
        value={this.state.value}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        maxLength={this.props.maxLength}
        autoComplete={this.props.autoComplete}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

export class DropDown<T> extends React.Component<
  {
    options: T[];
    id?: string;
    className?: string;
    value?: number | T;
    disabled?: boolean;
    placeholder?: string;
    autoComplete?: string;
    addBlankOption?: boolean;
    onChange?: (value: T | null, e: any) => void;
    onBlur?: (value: T | null, e: any) => void;
    formatOption?: (value: T, index: number) => {id: string; text: string};
  },
  {
    value: string;
  }
> {
  constructor(props: any) {
    super(props);
    let value: any = this.props.value;
    if (value !== undefined && typeof value !== 'number') {
      value = this.props.options.indexOf(value);
    }
    if (
      typeof value === 'number' &&
      value >= 0 &&
      value < this.props.options.length &&
      !isNaN(value)
    ) {
      value = '' + value;
    } else {
      value = '';
    }
    this.state = {
      value
    };

    this.renderOption = this.renderOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  private getValue(value: string): T | null {
    if (!value) return null;
    const opts = this.props.options;
    const idx = parseInt(value);
    return opts[idx];
  }

  private handleChange(e: any) {
    this.setState({value: e.target.value});
    if (this.props.onChange) {
      this.props.onChange(this.getValue(e.target.value), e);
    }
  }

  private handleBlur(e: any) {
    if (this.props.onBlur) {
      this.props.onBlur(this.getValue(e.target.value), e);
    }
  }

  render() {
    return (
      <select
        id={this.props.id}
        className={this.props.className}
        placeholder={this.props.placeholder}
        autoComplete={this.props.autoComplete}
        value={this.state.value}
        disabled={this.props.disabled}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      >
        {this.props.addBlankOption ? <option value=''></option> : null}
        {this.props.options.map(this.renderOption)}
      </select>
    );
  }

  private renderOption(opt: T, index: number): JSX.Element {
    // We have a formatting function
    const value = '' + index;
    if (this.props.formatOption) {
      const formattedResult = this.props.formatOption(opt, index);
      return (
        <option key={formattedResult.id} value={value}>
          {formattedResult.text}
        </option>
      );
    }

    // Manually format
    let id = value,
      text = '' + opt;
    if (['string', 'number', 'boolean'].indexOf(typeof opt) >= 0) {
      id = '' + opt;
    }

    return (
      <option key={id} value={value}>
        {text}
      </option>
    );
  }
}

export interface OptionWithID {
  id: string;
  name: string;
}
