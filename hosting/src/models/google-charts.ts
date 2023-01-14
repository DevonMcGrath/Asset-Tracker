/**
 * An interface to represent the configuration options available for a
 * Pie Chart rendered using Google's chart library.
 * {@link https://developers.google.com/chart/interactive/docs/gallery/piechart#configuration-options}
 */
export interface GooglePieChartOptions {
  backgroundColor?: GoogleChartColour;
  chartArea?: null | {
    backgroundColor?: GoogleChartColour;
    left?: string | number;
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    width?: string | number;
    height?: string | number;
  };
  colors?: string[];
  enableInteractivity?: boolean;
  fontSize?: number;
  fontName?: string;
  forceIFrame?: boolean;
  height?: number;
  is3D?: boolean;
  legend?: null | {
    alignment?: 'start' | 'center' | 'end';
    position?: 'bottom' | 'labeled' | 'left' | 'none' | 'right' | 'top';
    maxLines?: number;
    textStyle?: GoogleChartTextStyle;
  };
  pieHole?: number;
  pieSliceBorderColor?: string;
  pieSliceText?: string;
  pieSliceTextStyle?: GoogleChartTextStyle;
  pieStartAngle?: number;
  reverseCategories?: boolean;
  pieResidueSliceColor?: string;
  pieResidueSliceLabel?: string;
  slices?: {[index: number]: GoogleChartSliceConfig} | GoogleChartSliceConfig[];
  sliceVisibilityThreshold?: number;
  title?: string;
  titleTextStyle?: GoogleChartTextStyle;
  tooltip?: null | {
    ignoreBounds?: boolean;
    isHtml?: boolean;
    showColorCode?: boolean;
    text?: 'both' | 'value' | 'percentage';
    textStyle?: GoogleChartTextStyle;
  };
  trigger?: 'focus' | 'none' | 'selection';
  width?: number;
}

export type GoogleChartColour =
  | string
  | {
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
    };

export type GoogleChartTextStyle = {
  color?: string;
  fontName?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
};

export type GoogleChartSliceConfig = {
  color?: string;
  offset?: number;
  textStyle?: GoogleChartTextStyle;
};
