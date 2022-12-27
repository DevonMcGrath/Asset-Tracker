import React from 'react';
import {render, screen} from '@testing-library/react';
import {AppBody} from './AppBody';

describe('AppBody component', () => {
  test('renders app body', () => {
    const {container} = render(<AppBody />);
    expect(container.firstChild).toHaveClass('app-body');
    expect(container.firstChild).toHaveClass('container-max-width');
    expect(container.firstChild?.nodeName).toEqual('MAIN');
  });

  test('renders children', () => {
    render(
      <AppBody>
        <p>Hello world test</p>
      </AppBody>
    );
    const helloWorldElem = screen.getByText('Hello world test');
    expect(helloWorldElem).toBeInTheDocument();
  });

  test('renders with no max width class', () => {
    const {container} = render(<AppBody noMaxWidth />);
    expect(container.firstChild).not.toHaveClass('container-max-width');
  });

  test('renders with custom class name', () => {
    const testClass = 'test-class-name-123';
    const {container} = render(<AppBody className={testClass} />);
    expect(container.firstChild).toHaveClass(testClass);
  });
});
