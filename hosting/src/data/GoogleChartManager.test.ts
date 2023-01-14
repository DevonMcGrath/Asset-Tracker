import {GoogleChartManager} from './GoogleChartManager';

describe('GoogleChartManager class', () => {
  test('loads the core chart library', () => {
    // Load first time
    const callback = jest.fn();
    expect(GoogleChartManager.isLoaded()).toBeFalsy();
    GoogleChartManager.load(callback);
    expect(callback).toBeCalledTimes(1);
    expect(GoogleChartManager.isLoaded()).toBeTruthy();

    // Load again
    GoogleChartManager.load(callback);
    expect(callback).toBeCalledTimes(2);
    expect(GoogleChartManager.isLoaded()).toBeTruthy();
  });

  test('loads the core chart library with no callback', () => {
    GoogleChartManager.load();
    expect(GoogleChartManager.isLoaded()).toBeTruthy();
  });

  test('draws a pie chart', () => {
    GoogleChartManager.drawPieChart(document.body, [], {}, (chart) => {
      expect(chart.draw).toBeCalledTimes(1);
    });
  });
});
