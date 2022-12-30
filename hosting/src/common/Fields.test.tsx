import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {DropDown, Input} from './Fields';

describe('Input component', () => {
  test('creates an input with the specified attributes', () => {
    const attributes = {
      id: 'this-is-a-test-id',
      className: 'this-is-a-test-class and-another-one',
      type: 'text',
      value: 'Hello world!!!',
      placeholder: 'This is a placeholder.',
      maxLength: 20,
      autoComplete: 'none'
    };
    const {container} = render(<Input {...attributes} />);
    const input = container.firstChild;
    expect(input).toHaveClass(attributes.className);
    expect(input).toHaveAttribute('id', attributes.id);
    expect(input).toHaveAttribute('type', attributes.type);
    expect(input).toHaveAttribute('value', attributes.value);
    expect(input).toHaveAttribute('placeholder', attributes.placeholder);
    expect(input).toHaveAttribute('maxlength', '' + attributes.maxLength);
    expect(input).toHaveAttribute('autocomplete', attributes.autoComplete);
  });

  test('calls the event handlers', () => {
    const mockChangeCallback = jest.fn();
    const mockBlurCallback = jest.fn();
    const {container} = render(
      <Input onChange={mockChangeCallback} onBlur={mockBlurCallback} />
    );
    const elem = container.firstChild;
    if (!elem) {
      return fail('No element found.');
    }
    fireEvent.change(elem, {target: {value: '123'}});
    fireEvent.blur(elem);
    expect(mockChangeCallback).toBeCalledTimes(1);
    expect(mockBlurCallback).toBeCalledTimes(1);
  });
});

describe('DropDown component', () => {
  test('creates a drop down with the specified attributes', () => {
    const attributes = {
      options: ['Hello world!!!', 'Option 2'],
      id: 'this-is-a-test-id',
      className: 'this-is-a-test-class and-another-one',
      placeholder: 'This is a placeholder.',
      autoComplete: 'none'
    };
    const {container} = render(<DropDown {...attributes} />);
    const input = container.firstChild;
    expect(input).toHaveClass(attributes.className);
    expect(input).toHaveAttribute('id', attributes.id);
    expect(input).toHaveAttribute('placeholder', attributes.placeholder);
    expect(input).toHaveAttribute('autocomplete', attributes.autoComplete);
  });

  test('calls the event handlers', () => {
    const mockChangeCallback = jest.fn();
    const mockBlurCallback = jest.fn();
    const {container} = render(
      <DropDown
        options={['']}
        onChange={mockChangeCallback}
        onBlur={mockBlurCallback}
      />
    );
    const elem = container.firstChild;
    if (!elem) {
      return fail('No element found.');
    }
    fireEvent.change(elem, {target: {value: ''}});
    fireEvent.blur(elem);
    expect(mockChangeCallback).toBeCalledTimes(1);
    expect(mockBlurCallback).toBeCalledTimes(1);
  });

  test('formats values', () => {
    const testText = 'Hello world! Test Value.';
    const {container} = render(
      <DropDown
        options={['']}
        formatOption={() => {
          return {id: '', text: testText};
        }}
      />
    );
    const opt = container.getElementsByTagName('option').item(0);
    expect(opt?.textContent).toEqual(testText);
  });
});
