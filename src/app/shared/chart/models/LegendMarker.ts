import { XYSeries } from "@amcharts/amcharts4/charts";

export class LegendMarker {
    color: string;
    serie: XYSeries;
    name: string;
    isLast?: boolean;
}