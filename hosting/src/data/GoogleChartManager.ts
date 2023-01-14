import {GooglePieChartOptions} from '../models/google-charts';

declare const google: any;

/**
 * The `GoogleChartManager` manages the rendering of charts through Google's
 * chart library.
 */
export class GoogleChartManager {
  /** A flag indicating if the core chart library has been loaded. */
  private static isLibraryLoaded = false;

  /** Callbacks to execute once the core chart library is loaded. */
  private static callbacks: (() => void)[] = [];

  /**
   * Draws a Pie Chart in the specified container and calls the callback on
   * completion.
   * @param container the pie chart container element.
   * @param data the data to draw.
   * @param options the pie chart options.
   * @param callback the completion callback.
   */
  public static drawPieChart(
    container: HTMLElement,
    data: [string, any][],
    options: GooglePieChartOptions = {},
    callback?: (chart: any) => void
  ): void {
    GoogleChartManager.load(() => {
      const chart = new google.visualization.PieChart(container);
      chart.draw(google.visualization.arrayToDataTable(data), options);
      if (callback) callback(chart);
    });
  }

  /**
   * Loads the core chart library, if it hasn't been loaded yet.
   * @param onLoad a callback to be called after the library is loaded.
   */
  public static load(onLoad?: () => void): void {
    if (GoogleChartManager.isLibraryLoaded) {
      if (onLoad) onLoad();
      return;
    }
    google.charts.load('current', {packages: ['corechart']});
    if (onLoad) GoogleChartManager.callbacks.push(onLoad);
    google.charts.setOnLoadCallback(GoogleChartManager.onLoad);
  }

  /**
   * Gets the load status for the core chart library.
   * @returns true if the core chart library is loaded.
   */
  public static isLoaded(): boolean {
    return GoogleChartManager.isLibraryLoaded;
  }

  /**
   * Invoked after the core chart library is loaded, this function handles some
   * internal state updates.
   */
  private static onLoad(): void {
    GoogleChartManager.isLibraryLoaded = true;
    const callbacks = GoogleChartManager.callbacks;
    GoogleChartManager.callbacks = [];
    callbacks.forEach((callback) => callback());
  }
}
