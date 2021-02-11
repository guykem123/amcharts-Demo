import { SerieMetadata } from './SerieMetadata';
import { LegendPosition } from '@amcharts/amcharts4/charts';

interface ISingleData {
    [id: string]: any;
}

export class XYChartsDisplayData {
    data: ISingleData[];
    metadata: {
        categoryAxisKey: string;
        seriesMetadata: SerieMetadata[];
    };
    showLegend: boolean = true;
    legendPosition: LegendPosition = 'bottom';
    xAxisShowGrid: boolean = true;
    showCursor: boolean = true;
    xAxisGridDashed: boolean = false; // if the grid line should be dashed
    xAxisShowLabels: boolean = true;
    xAxisLineShow: boolean = true;
    yAxisShowLabels: boolean = true;
    showTooltip: boolean = true;
    yAxisShowGrid: boolean = true;
    yAxisGridDashed: boolean = false; // if the grid line should be dashed
    isStacked: boolean = false;
    showSerieLabel: boolean = false;
    strictMinMax: boolean = false;
    cellStartLocation: number; // num between 0 - 1
    cellEndLocation: number; // num between 0 - 1
    lineStrokeWidth: number = 1;
  isCategoryTypeDate: boolean;
    constructor() {
        this.metadata = {
            categoryAxisKey: undefined,
            seriesMetadata: []
        };
        this.cellStartLocation = 0;
        this.cellEndLocation = 1;
    }
}
