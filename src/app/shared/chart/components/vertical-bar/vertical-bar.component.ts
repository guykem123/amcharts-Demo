import { Component, AfterViewInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { create, color as createColor, DateFormatter, options, string, number, useTheme, Container, percent, NumberFormatter, color } from '@amcharts/amcharts4/core';
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

let num = 1;
@Component({
  selector: 'app-vertical-bar',
  templateUrl: './vertical-bar.component.html',
  styleUrls: ['./vertical-bar.component.css']
})
export class VerticalBarComponent implements AfterViewInit, OnDestroy, OnChanges, IChartComponent {

  @Input() chartId: string;
  chartDivId: string;
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

  constructor(
    private chartService: ChartService,
    private numberFormatService: NumberFormatService,
  ) {
    this.types = {
      dateType: { class: DateAxis, keyName: 'date', seriesKey: 'dateX', xAxisTooltip: "date.formatDate('MMM dd')" },
      categoryType: { class: CategoryAxis, keyName: 'category', seriesKey: 'categoryX', xAxisTooltip: "category" }
    };
    options.autoSetClassName = true;
    this.onSideBarChange();

    this.chartDivId = getRandomWord();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart)
      this.setChart();
  }


  private onSideBarChange() {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposeChart();
  }

  private disposeChart() {
    console.log("dispose", this.chart.id);
    this.chartService.removePdfFunc(this.chartId);
    this.chart?.dispose();
    delete this.chart;
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  setChart() {
    if (this.chart)
      this.disposeChart();
    if (this.chartDataDisplay && this.chartDataDisplay.data.length) {
      this.chart = create(this.chartDivId, XYChart);
      this.chart.id = num.toString();
      num++;
      this.series = [];
      console.log("create", this.chart.id);
      this.chart.zoomOutButton.disabled = true;
      this.chart.numberFormatter.smallNumberPrefixes = [];
      this.chart.dateFormatter.dateFormat = "yyyy-MM-dd";
      this.setMoreOptionInStart();
      const categoryFirstValue = this.chartDataDisplay.data[0][this.chartDataDisplay.metadata.categoryAxisKey];
      this.chosenType = this.categoryType == "DATE" ? this.types.dateType : this.types.categoryType;
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
      // this.chartService.addLegend(this.chart, this);
      this.setTotalLabelForStack();
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
    // if (tooltip) {//set tooltip only if exist
    //   serie.columns.template.tooltipHTML = `{${tooltip}}`;
    // }
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
      valueLabel.label.text = '{valueY.total}';
      valueLabel.tooltipText = '{valueY.total.formatNumber("#,###.00")}';
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
    valueLabel.label.events.on("sizechanged", (ev) => {
      const label = ev.target;
      if (!label.availableWidth)
        return;
      else if (label.availableWidth >= 30) {
        valueLabel.fontSize = 10;
      }
      else if (label.availableWidth >= 20) {
        valueLabel.fontSize = 8;
      }
      else if (label.availableWidth >= 12) {
        valueLabel.fontSize = 7;
      }
      else {
        valueLabel.disabled = true;
      }
    });
  }

  getNewNumberFormatter() {
    const numberFormatter = new NumberFormatter();
    numberFormatter.smallNumberPrefixes = [];
    return numberFormatter;
  }

  private setYAxes(chart: XYChart) {
    const valueAxis: ValueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.extraMax = 0.1;
    valueAxis.maxZoomFactor = 10000000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.grid.template.align = 'right';
    valueAxis.numberFormatter = this.getNewNumberFormatter();
    valueAxis.numberFormatter.numberFormat = '#a';
    this.disableValueLineOnZero(valueAxis);
    if (!this.chartDataDisplay.xAxisLineShow)
      valueAxis.renderer.axis.children.values[1].disabled = true;
    valueAxis.renderer.grid.template.disabled = !this.chartDataDisplay.yAxisShowGrid;
    valueAxis.renderer.grid.template.strokeDasharray = this.chartDataDisplay.yAxisGridDashed ? '4,4' : '';
    valueAxis.renderer.labels.template.disabled = !this.chartDataDisplay.yAxisShowLabels;
    valueAxis.calculateTotals = true;
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

function getRandomWord() {
  let word = '';
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 20; i++) {
    const index = Math.floor(Math.random() * chars.length);
    word += chars[index];
  }
  return word;
}