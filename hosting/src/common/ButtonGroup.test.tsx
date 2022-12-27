import React from 'react';
import {render, screen} from '@testing-library/react';
import {ButtonGroup} from './ButtonGroup';
import {Button} from './Button';

describe('ButtonGroup component', () => {
  test('renders a button group', () => {
    const btnName = 'Test Button Name';
    const {container} = render(
      <ButtonGroup>
        <Button>{btnName}</Button>
      </ButtonGroup>
    );
    expect(container.firstChild).toHaveClass('btn-group');
    expect(screen.getByText(btnName)).toBeInTheDocument();
  });

  test('renders with custom class name', () => {
    const testClass = 'test-class-name-123';
    const {container} = render(
      <ButtonGroup className={testClass}></ButtonGroup>
    );
    expect(container.firstChild).toHaveClass(testClass);
  });
});
