import {render, screen} from '@testing-library/react';
import {Icon} from './Icon';

describe('Icon component', () => {
  test('renders an icon', () => {
    const iconName = 'test_icon_name';
    const {container} = render(<Icon>{iconName}</Icon>);
    const icon = container.firstChild;
    expect(icon).toHaveClass('icon');
    expect(icon).toHaveClass('material-icons');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText(iconName)).toBeInTheDocument();
  });

  test('renders a medium icon', () => {
    const {container} = render(<Icon size='m'>icon_name</Icon>);
    const icon = container.firstChild;
    expect(icon).toHaveClass('m');
  });

  test('renders a large icon', () => {
    const {container} = render(<Icon size='l'>icon_name</Icon>);
    const icon = container.firstChild;
    expect(icon).toHaveClass('l');
  });
});
