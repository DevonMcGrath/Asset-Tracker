import {render, screen} from '@testing-library/react';
import {Page} from './Page';

describe('Page component', () => {
  test('renders a page', () => {
    const testID = 'test-id-123';
    const testText = 'This should get rendered.';
    const {container} = render(
      <Page id={testID}>
        <p>{testText}</p>
      </Page>
    );
    const elem = container.firstChild;
    expect(elem).toHaveClass('app-page');
    expect(elem).toHaveAttribute('data-page', testID);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
