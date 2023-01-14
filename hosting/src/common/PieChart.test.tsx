import {render} from '@testing-library/react';
import {GoogleChartManager} from '../data/GoogleChartManager';
import {PieChart} from './PieChart';

describe('PieChart component', () => {
  test('renders a pie chart', () => {
    const spy = jest.spyOn(GoogleChartManager, 'drawPieChart');
    render(
      <PieChart
        categoriesLabel='test'
        valuesLabel='values'
        data={[{category: 'Test Category', value: 123}]}
      />
    );
    expect(spy).toBeCalledTimes(1);
    spy.mockRestore();
  });

  test('renders a pie chart with custom ID and class', () => {
    const testID = 'pie-chart-567890';
    const testClass = 'test-pie-chart-class-name-123';
    const {container} = render(
      <PieChart
        id={testID}
        className={testClass}
        categoriesLabel='test'
        valuesLabel='values'
        data={[{category: 'Test Category', value: 123}]}
      />
    );
    expect(container.firstChild).toHaveAttribute('id', testID);
    expect(container.firstChild).toHaveClass(testClass);
  });
});
