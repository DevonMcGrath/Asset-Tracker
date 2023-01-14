import React from 'react';
import {GoogleChartManager} from '../data/GoogleChartManager';
import {GooglePieChartOptions} from '../models/google-charts';

import './PieChart.css';

export class PieChart extends React.Component<
  {
    id?: string;
    className?: string;
    categoriesLabel: string;
    valuesLabel: string;
    data: {category: string; value: any}[];
    options?: GooglePieChartOptions;
    children?: any;
  },
  {}
> {
  private containerRef = React.createRef<HTMLDivElement>();

  componentDidMount(): void {
    const data = [[this.props.categoriesLabel, this.props.valuesLabel]].concat(
      this.props.data.map((row) => {
        return [row.category, row.value];
      })
    ) as [string, any][];
    const container = this.containerRef.current;
    if (!container) return;
    GoogleChartManager.drawPieChart(container, data, this.props.options);
  }

  render(): React.ReactNode {
    let c = 'pie-chart';
    if (this.props.className) c += ' ' + this.props.className;
    return (
      <div id={this.props.id} className={c} ref={this.containerRef}>
        {this.props.children}
      </div>
    );
  }
}
