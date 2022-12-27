import React from 'react';
import {render, screen} from '@testing-library/react';
import {Button} from './Button';

describe('Button component', () => {
  test('renders a primary button', () => {
    const btnName = 'Test Button';
    const btnTitle = 'Test Button Title';
    const {container} = render(<Button title={btnTitle}>{btnName}</Button>);
    const btn = container.firstChild;
    btn?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    expect(btn).toHaveClass('btn');
    expect(btn).toHaveClass('btn-primary');
    expect(btn).toHaveAttribute('title', btnTitle);
    expect(btn).toHaveAttribute('aria-label', btnTitle);
    expect(screen.getByText(btnName)).toBeInTheDocument();
  });

  test('renders a secondary button', () => {
    const {container} = render(<Button type='secondary'></Button>);
    const btn = container.firstChild;
    expect(btn).toHaveClass('btn');
    expect(btn).toHaveClass('btn-secondary');
  });

  test('renders a tertiary button', () => {
    const {container} = render(<Button type='tertiary'></Button>);
    const btn = container.firstChild;
    expect(btn).toHaveClass('btn');
    expect(btn).toHaveClass('btn-tertiary');
  });

  test('renders an icon button', () => {
    const iconName = 'test_icon';
    const {container} = render(<Button type='icon' icon={iconName}></Button>);
    const btn = container.firstChild;
    expect(btn).toHaveClass('btn');
    expect(btn).toHaveClass('btn-icon');
    expect(container.getElementsByClassName('icon').length).toEqual(1);
    expect(screen.getByText(iconName)).toBeInTheDocument();
  });

  test('renders with custom class name', () => {
    const testClass = 'test-class-name-123';
    const {container} = render(<Button className={testClass}></Button>);
    expect(container.firstChild).toHaveClass(testClass);
  });

  test('calls a callback on click', () => {
    const mockCallback = jest.fn();
    const {container} = render(<Button onClick={mockCallback}></Button>);
    const btn = container.firstChild;
    btn?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    expect(mockCallback).toBeCalledTimes(1);
  });

  test('renders a disabled button', () => {
    const mockCallback = jest.fn();
    const {container} = render(
      <Button onClick={mockCallback} disabled></Button>
    );
    const btn = container.firstChild;
    btn?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
