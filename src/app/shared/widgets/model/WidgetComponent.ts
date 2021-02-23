import { EventEmitter } from '@angular/core';
import { XYChartsDisplayData } from '../../chart/models/XYChartsDisplayData';

export interface WidgetComponent {
    resetWidgetData: () => void;
    control: any,
    metadata: any,
    XYChartData?: XYChartsDisplayData,//only on insight
    showTotal?: boolean,//only on insight
    chartId?: string;//only on insight
    dimensionFilterChanged?: EventEmitter<any>,//only on insight
    chartDataDisplayInit?: EventEmitter<any>,//only on insight
}