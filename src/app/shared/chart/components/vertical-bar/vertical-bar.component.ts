import { Component, AfterViewInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { create, color as createColor, DateFormatter, options, string, number, useTheme, Container, percent, NumberFormatter, color, Label } from '@amcharts/amcharts4/core';
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, Legend, LabelBullet, DateAxis, XYSeries } from '@amcharts/amcharts4/charts';
import { SerieMetadata } from '../../models/SerieMetadata';
import { ChartService } from '../../services/chartService/chart.service';
import { XYChartsDisplayData } from '../../models/XYChartsDisplayData';
import { IChartComponent } from '../../models/IChartComponent';
import { AxisType } from '../../models/AxisType';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { ColorDetail } from '../../models/ColorDetail';
import { Subscription } from 'rxjs';
import { NumberFormatService } from '../../services/numberFormatService/number-format.service';
import { LegendMarker } from '../../models/LegendMarker';

@Component({
  selector: 'app-vertical-bar',
  templateUrl: './vertical-bar.component.html',
  styleUrls: ['./vertical-bar.component.css']
})
export class VerticalBarComponent implements AfterViewInit, OnDestroy, OnChanges, IChartComponent {

  @Input() chartId: string;
  @Input() chartDataDisplay: XYChartsDisplayData;
  @Input() categoryType: any;
  @Input() showChartLegendDivide: boolean;
  @Output() chartReady: EventEmitter<XYChartsDisplayData> = new EventEmitter<XYChartsDisplayData>();
  @Output() chartCategoryExpend: EventEmitter<boolean> = new EventEmitter<boolean>();
  chart: XYChart;
  isCategoryDate: boolean;
  types: { [key: string]: AxisType; };
  chosenType: AxisType;
  @Input() colors: ColorDetail[];
  isRendering: boolean = true;
  legendHeight: number;
  subscriptions: Subscription = new Subscription();
  series: LegendMarker[] = [];
  valueAxis: ValueAxis;

  constructor(
    private chartService: ChartService,
    private numberFormatService: NumberFormatService,
  ) {
    this.types = {
      dateType: { class: DateAxis, keyName: 'date', seriesKey: 'dateX', xAxisTooltip: "date.formatDate('MMM dd')" },
      categoryType: { class: CategoryAxis, keyName: 'category', seriesKey: 'categoryX', xAxisTooltip: "category" }
    };
    options.autoSetClassName = true;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart)
      this.setChart();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposeChart();
  }

  private disposeChart() {
    this.chartService.removePdfFunc(this.chartId);
    this.chart?.dispose();
    delete this.chart;
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  setChart() {
    if (this.chart) {
      this.disposeChart();
    }
    if (this.chartDataDisplay && this.chartDataDisplay.data.length) {

      this.chart = create(this.chartId, XYChart);
      this.chart.zoomOutButton.disabled = true;
      this.chart.numberFormatter.smallNumberPrefixes = [];
      this.chart.dateFormatter.dateFormat = "yyyy-MM-dd";
      this.setMoreOptionInStart();
      const categoryFirstValue = this.chartDataDisplay.data[0][this.chartDataDisplay.metadata.categoryAxisKey];
      this.chosenType = categoryFirstValue?.match(/^[0-9]+[\-.][0-9]+[\-.][0-9]+$/g) ? this.types.dateType : this.types.categoryType;
      this.chart.data = this.chartDataDisplay.data;
      this.setChartColors(this.chartDataDisplay.metadata.seriesMetadata);
      this.chartService.setToolTip(this.chartDataDisplay, this.chartDataDisplay.data,
        this.chart.colors.list, this.chartDataDisplay.metadata.seriesMetadata, this.chosenType?.class);
      this.chartService.setPdfFunc(this.chartId, this.chart);
      this.setYAxes(this.chart);
      this.setXAxes(this.chart);
      const series = this.chartDataDisplay.metadata.seriesMetadata;
      for (let i = 0; i < series.length; i++) {
        const serie = series[i];
        const serieColorHex = this.chart.colors.list[i].hex;
        this.createSeries(this.chart, serie.key, serie.title,
          serie.tooltip, this.chartDataDisplay.isStacked, serieColorHex);
      }
      this.chartService.addLegend(this.chart, this);
      this.setTotalLabelForStack();
      this.sortTheChartCategoryValues();
      this.chart.events.on('ready', (ev) => {
        this.isRendering = false;
        this.chartReady.emit(this.chartDataDisplay);
      });
    }
    else {
      setTimeout(() => {
        this.isRendering = false;
      });
    }
  }

  private sortTheChartCategoryValues() {
    this.chart.events.on('beforedatavalidated', (ev) => {// sort by date
      this.chart.data.sort((a, b) => {
        const XAxisKey = this.chartDataDisplay.metadata.categoryAxisKey;
        if (this.chosenType === this.types.dateType) {
          const dateA = (new Date(a[XAxisKey]) as any);
          const dateB = (new Date(b[XAxisKey]) as any);
          return dateA - dateB;
        }
        else if (this.categoryType != "DATE") {
          return this.chartService.sortChartCategoryByString(a, b, XAxisKey);
        }
      });
    });
  }

  /**
   * set the more option e.g. "6 More" in the start of the series
   */
  private setMoreOptionInStart() {
    this.chartDataDisplay.metadata.seriesMetadata = this.chartDataDisplay.metadata.seriesMetadata
      .filter(serie => serie.key != undefined);
    const moreOptionSeriesIndex = this.chartDataDisplay.metadata.seriesMetadata
      .findIndex(a => a.key.toString().toLowerCase().includes('more'));
    if (moreOptionSeriesIndex >= 0) {
      const moreOptionSeries = this.chartDataDisplay.metadata.seriesMetadata[moreOptionSeriesIndex];
      this.chartDataDisplay.metadata.seriesMetadata = this.chartDataDisplay.metadata.seriesMetadata.filter(a => a != moreOptionSeries);
      this.chartDataDisplay.metadata.seriesMetadata.unshift(moreOptionSeries);
    }
  }

  /**
   * set label foe stack vertical chart
   */
  private setTotalLabelForStack() {
    if (this.chartDataDisplay.showSerieLabel && this.chartDataDisplay.isStacked) {
      const totalSeries = this.chart.series.push(new ColumnSeries());
      this.chart.data.forEach(chartCategoryV => chartCategoryV.totalSeriesValues = 0);//this is for aggregate the sum of all series on one category
      totalSeries.dataFields.valueY = 'totalSeriesValues';
      totalSeries.dataFields[this.chosenType.seriesKey] = this.chartDataDisplay.metadata.categoryAxisKey;
      totalSeries.stacked = true;
      totalSeries.hiddenInLegend = true;
      totalSeries.columns.template.strokeOpacity = 0;
      this.setLabelForEachSerie(totalSeries, true);
    }
  }

  setChartColors(seriesMetadata: SerieMetadata[]) {
    this.chart.colors.list = this.chartService.getChartsColors(seriesMetadata, this.colors);
    this.colors = this.colors || this.chartService.getColors();
    this.notifyColorScheme(this.chart, seriesMetadata);
  }

  notifyColorScheme(chart: XYChart, seriesMetadata: SerieMetadata[]) {
    const newColors = [...chart.colors.list].splice(0, seriesMetadata.length);
    const colorsAndNames = [];
    const intendedColor = this.colors.find(x => x.intend);
    const defaultColor = intendedColor ? createColor(intendedColor.color).hex : undefined;
    for (let i = 0; i < newColors.length; i++) {
      const newColor = newColors[i].hex;
      let name = seriesMetadata[i].title;
      if (newColor === defaultColor) {
        name = 'default';
      }
      colorsAndNames.push({ color: newColor, name });
    }
    this.chartService.setNewColors(colorsAndNames, this.chartId);
  }

  private setXAxes(chart: XYChart) {
    let xAxis: any;
    xAxis = chart.xAxes.push(new this.chosenType.class());
    xAxis.dataFields[this.chosenType.keyName] = this.chartDataDisplay.metadata.categoryAxisKey;
    if (this.chosenType.class == DateAxis) {
      xAxis.renderer.labels.template.location = 0.5;
    } else {
      xAxis.renderer.grid.template.location = 0;
    }
    xAxis.renderer.minGridDistance = 30;
    xAxis.renderer.grid.template.disabled = !this.chartDataDisplay.xAxisShowGrid;
    xAxis.renderer.labels.template.disabled = !this.chartDataDisplay.xAxisShowLabels;
    xAxis.renderer.cellStartLocation = this.chartDataDisplay.cellStartLocation;
    xAxis.renderer.cellEndLocation = this.chartDataDisplay.cellEndLocation;
    xAxis.renderer.grid.template.strokeDasharray = this.chartDataDisplay.xAxisGridDashed ? '4,4' : '';

    this.setLabelForAxis(xAxis);
    this.setXAxisTooltipFormat(xAxis);
  }

  private setLabelForAxis(xAxis) {
    if (this.chosenType.class === DateAxis) {
      xAxis.dateFormats.setKey('month', 'yyyy MM dd');
      xAxis.dateFormats.setKey('day', 'yyyy MM dd');
      xAxis.dateFormats.setKey('year', 'yyyy MM dd');
      xAxis.dateFormats.setKey('week', 'yyyy MM dd');
    }
    const labelTemplate = xAxis.renderer.labels.template;
    xAxis.renderer.labels.template.events.on('sizechanged', (ev) => {
      const label = ev.target;
      const cellWidth = xAxis.pixelWidth / (xAxis.endIndex - xAxis.startIndex);
      if (cellWidth < 110 && this.chosenType.class == CategoryAxis) {
        labelTemplate.rotation = -70;
        labelTemplate.horizontalCenter = "right";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.maxWidth = 100;
        this.chartCategoryExpend.emit(true);
      }
      else {
        labelTemplate.rotation = 0;
        labelTemplate.horizontalCenter = "middle";
        labelTemplate.verticalCenter = "middle";
        label.maxWidth = this.getMaxXAxisWidth(label, cellWidth);
        this.chartCategoryExpend.emit(false);
      }
    });
    labelTemplate.truncate = true;
    labelTemplate.tooltipText = `{${this.chosenType.xAxisTooltip}}`;
  }

  getMaxXAxisWidth(label: any, cellWidth: any): any {
    if (label && label.text && label.text.length < 10)
      return (label.text.length) * 20;
    else
      return cellWidth + 10;
  }

  private setXAxisTooltipFormat(xAxis) {
    const formatter = new DateFormatter();
    (<DateAxis>xAxis).renderer.labels.template.adapter.add('text', (xAxisLabelText, xAxisLabel, key) => {
      if (this.chosenType.class === DateAxis) {
        const date = new Date(xAxisLabelText);
        if (date.getDate() == 1) {
          return formatter.format(xAxisLabelText, 'MMM d');
        }
        else {
          return formatter.format(xAxisLabelText, 'd');
        }
      }
      else {
        return xAxisLabelText;
      }
    });
  }

  private createSeries(chart: any, field: any, name: any, tooltip: string, stacked: boolean, serieColor) {
    const serie: ColumnSeries = chart.series.push(new ColumnSeries());
    this.series.push({ color: serieColor, serie, name, isLast: name.toLowerCase().includes("more") });
    serie.clickable = true;
    serie.hiddenState.transitionDuration = 600;
    serie.defaultState.transitionDuration = 600;
    serie.numberFormatter.numberFormat = "#";
    serie.dataFields.valueY = field;
    serie.dataFields[this.chosenType.seriesKey] = this.chartDataDisplay.metadata.categoryAxisKey;
    serie.name = name;
    if (tooltip) {//set tooltip only if exist
      serie.columns.template.tooltipHTML = `{${tooltip}}`;
    }
    serie.columns.template.tooltipPosition = 'pointer';
    serie.columns.template.maxWidth = 150;
    serie.stacked = stacked;
    if (this.chartDataDisplay.showSerieLabel && !stacked) {
      this.setLabelForEachSerie(serie, false);
    }
  }

  private setLabelForEachSerie(series: ColumnSeries, stacked: boolean) {
    const valueLabel: LabelBullet = series.bullets.push(new LabelBullet());
    if (stacked) {
      this.setSeriesMinValue(series);
      valueLabel.label.text = '{valueY.sum}';
      valueLabel.tooltipText = '{valueY.sum.formatNumber("#,###.00")}';
    } else {
      valueLabel.label.text = '{valueY}';
      valueLabel.tooltipText = '{valueY.formatNumber("#,###.00")}';
    }
    valueLabel.label.truncate = false; // don't cut the full label
    valueLabel.label.dy = -10;
    valueLabel.label.textAlign = "middle";
    valueLabel.label.adapter.add("textOutput", (v, t, k) => {
      const num = this.numberFormatService.format(v);
      if (num)
        return num;
      return v;
    });
    let isChanged = false;
    valueLabel.label.events.on("sizechanged", (ev) => {

      const label = ev.target;
      if (!label.availableWidth || isChanged)
        return;
      const width = Math.round(label.availableWidth);
      if (width >= 60) {
        this.setColumnLabels(valueLabel, width, 15);
      }
      else if (width >= 30) {
        this.setColumnLabels(valueLabel, width, 10);
      }
      else if (width >= 20) {
        this.setColumnLabels(valueLabel, width, 8);
      }
      else if (width >= 15) {
        this.setColumnLabels(valueLabel, width, 11, true);
      }
      else if (width >= 10) {
        this.setColumnLabels(valueLabel, width, 10, true);
      }
      else if (width >= 7) {
        this.setColumnLabels(valueLabel, width, 8, true);
      }
      else if (width >= 4) {
        this.setColumnLabels(valueLabel, width, 6, true);
      }
      else if (width >= 3) {
        this.setColumnLabels(valueLabel, width, 3, true);
      }
      else {
        this.setColumnLabels(valueLabel, width, 0, true);
      }
      isChanged = true;
    });
  }

  private setColumnLabels(labelsContainer: LabelBullet, width: number, fontSize: number, rotation?: boolean) {
    labelsContainer.fontSize = fontSize;

    if (rotation) {
      labelsContainer.rotation = -90;
      labelsContainer.dy = width >= 15 ? -25 : width >= 10 ? -20 : width >= 5 ? -15 : -10;
      labelsContainer.dx = 10;
    }
  }

  getNewNumberFormatter() {
    const numberFormatter = new NumberFormatter();
    numberFormatter.smallNumberPrefixes = [];
    return numberFormatter;
  }

  private setSeriesMinValue(serie: ColumnSeries) {
    this.chart.events.on("ready", () => {
      this.checkStackColumnsTotalValue(serie);//one on first init
      //one on series hide/show (total value has changed)
      this.chart.series.values.forEach(x => {
        x.events.on('shown', () => {
          this.checkStackColumnsTotalValue(serie);
        });
        x.events.on('hidden', () => {
          this.checkStackColumnsTotalValue(serie);
        });
      }
      );
    });
  }

  private checkStackColumnsTotalValue(series: ColumnSeries) {
    let init = this.getMinMax(series);//get columns min and max - e.g. max:23000,min:20000 or max:-1 min:-10
    const interval = setInterval(() => {
      const newInit = this.getMinMax(series);
      if (init.min == newInit.min && init.max == newInit.max) {
        clearInterval(interval);
      } else {
        init = newInit;
      }
      const valueAxisCurrentMax = (<any>this.valueAxis)._finalMax || 1;
      //if min value is more the 0 the chart min value displayed will be 0 else it will be undefined so negative values could be displayed
      if ((init.min >= 0 && init.max >= valueAxisCurrentMax * 0.8) || (init.min >= -0.1 && init.max >= 10)) {
        this.valueAxis.min = 0;
      }
      else {
        this.valueAxis.min = undefined;
      }
    }, 300);
  }

  private getMinMax(series: ColumnSeries) {
    const values = <any>(series.columns).values.map(v => v.dataItem.values.valueY.sum);
    // console.log(values);
    const max = Math.max(...values);

    const min = Math.min(...values);
    return { min, max };
  }

  private setYAxes(chart: XYChart) {
    const valueAxis: ValueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.extraMax = 0.15;
    valueAxis.maxZoomFactor = 10000000;
    valueAxis.renderer.grid.template.align = 'right';
    valueAxis.numberFormatter = this.getNewNumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#';
    valueAxis.strictMinMax = this.chartDataDisplay.strictMinMax;
    this.disableValueLineOnZero(valueAxis);
    if (!this.chartDataDisplay.xAxisLineShow)
      valueAxis.renderer.axis.children.values[1].disabled = true;
    valueAxis.renderer.grid.template.disabled = !this.chartDataDisplay.yAxisShowGrid;
    valueAxis.renderer.grid.template.strokeDasharray = this.chartDataDisplay.yAxisGridDashed ? '4,4' : '';
    valueAxis.renderer.labels.template.disabled = !this.chartDataDisplay.yAxisShowLabels;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.labels.template.adapter.add("textOutput", (v, t, k) => {
      return this.numberFormatService.format(v, undefined, undefined, true);
    });
    this.valueAxis = valueAxis;
  }

  private disableValueLineOnZero(valueAxis) {
    // const axisBreak = valueAxis.axisBreaks.create();
    // axisBreak.startValue = 0;
    // axisBreak.endValue = 0.1;
    // axisBreak.hidden = true;
  }

}

function compare(a, b, special?) {
  if (a == special)
    return -2;
  if (a > b)
    return 1;
  else if (a < b)
    return -1;
  else
    return 0;
}