import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { create, color, options, Container, percent } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, LabelBullet, DateAxis, XYSeries } from "@amcharts/amcharts4/charts";
import { XYChartsDisplayData } from '../../models/XYChartsDisplayData';
import { IChartComponent } from '../../models/IChartComponent';
import { AxisType } from '../../models/AxisType';
import { ColorDetail } from '../../models/ColorDetail';
import { ChartService } from '../../services/chartService/chart.service';
import { SerieMetadata } from '../../models/SerieMetadata';
import { NumberFormatService } from '../../services/numberFormatService/number-format.service';
import { Subscription } from 'rxjs';
import { LegendMarker } from '../../models/LegendMarker';


@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.css']
})
export class HorizontalBarComponent implements AfterViewInit, OnChanges {

  @Input() chartId: string;
  @Input() chartDivId: string;
  @Input() chartDataDisplay: XYChartsDisplayData;
  @Input() categoryType: any;
  @Input() showChartLegendDivide: boolean;
  @Output() chartReady: EventEmitter<void> = new EventEmitter<void>();
  chart: XYChart;
  @Input() colors: ColorDetail[];
  isRendering: boolean = true;
  types: { [key: string]: AxisType; };
  chosenType: AxisType;
  series: LegendMarker[] = [];
  subscriptions: Subscription = new Subscription();

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
    this.setChart();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposeChart();
  }

  ngAfterViewInit(): void {
    this.setChart();
  }

  private disposeChart() {
    this.chart?.dispose();
    this.chartService.removePdfFunc(this.chartId);
    delete this.chart;
  }

  setChart() {
    if (this.chartDataDisplay && this.chartDataDisplay.data.length) {
      if (!this.chart)
        this.chart = create(this.chartDivId, XYChart);
      else {
        removeOldAxisData(this.chart);
        removeOldSeries(this.chart);
        this.series = [];
      }
      this.chart.zoomOutButton.disabled = true;
      this.chart.numberFormatter.smallNumberPrefixes = [];
      this.chart.data = this.chartDataDisplay.data.reverse();//the chart display the last first so we use the reverse function, especially for the "More" option
      this.setYAxes(this.chart);
      this.setXAxes(this.chart);
      this.setChartColors(this.chartDataDisplay.metadata.seriesMetadata);
      this.chosenType = this.categoryType == "DATE" ? this.types.dateType : this.types.categoryType;
      this.chartService.setToolTip(this.chartDataDisplay, this.chartDataDisplay.data,
        this.chart.colors.list, this.chartDataDisplay.metadata.seriesMetadata, this.chosenType.class);
      const series = this.chartDataDisplay.metadata.seriesMetadata;
      for (let i = 0; i < series.length; i++) {
        const meta = series[i];
        const serieColorHex = this.chart.colors.list[i].hex;
        this.createSeries(meta.key, meta.title, this.chart, meta.tooltip, this.chartDataDisplay.isStacked, serieColorHex);
      }
      this.chart.events.on('ready', (ev) => {// sort by date
        this.isRendering = false;
      });
      this.chart.events.on('beforedatavalidated', (ev) => {// sort by date
        this.sortDataByAmount();
      });

    }
    else {
      setTimeout(() => {
        this.isRendering = false;
      });
    }
  }

  //change the data to be sorted by cost of the category
  private sortDataByAmount() {
    this.chart.data.sort((a, b) => {
      let aCost = 0;
      let bCost = 0;
      const allSeries = this.chartDataDisplay.metadata.seriesMetadata;
      const category = this.chartDataDisplay.metadata.categoryAxisKey;
      const serie = this.chartDataDisplay.metadata.seriesMetadata
        .find(s => s.firstInOrder) || allSeries[0];
      const key = serie.key;
      aCost = a[key] ? aCost + a[key] : aCost;
      bCost = b[key] ? bCost + b[key] : bCost;
      return compare(aCost, bCost, b[category]?.toLowerCase().includes('more'));
    });
  }

  setChartColors(seriesMetadata: SerieMetadata[]) {
    this.chart.colors.list = this.chartService.getChartsColors(seriesMetadata, this.colors);
    this.colors = this.colors || this.chartService.getColors();
  }

  private createSeries(field, name, chart, tooltip, stacked, serieColorHex) {
    let series: ColumnSeries = this.createSerieWithMetadata(field, name, chart, tooltip, stacked, serieColorHex);
    this.setLabelForEachSerie(series);
  }

  private setYAxes(chart: XYChart) {
    let categoryAxis = chart.yAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = this.chartDataDisplay.metadata.categoryAxisKey;
    categoryAxis.renderer.ticks.template.disabled = false;
    categoryAxis.renderer.ticks.template.strokeOpacity = 0.2;
    categoryAxis.renderer.grid.template.disabled = !this.chartDataDisplay.yAxisShowGrid;
    categoryAxis.renderer.labels.template.disabled = !this.chartDataDisplay.yAxisShowLabels;
    categoryAxis.renderer.minGridDistance = 30;
    if (!this.chartDataDisplay.xAxisLineShow) {
      categoryAxis.renderer.axis.children.values[3].dom.style.display = "none";
    }
    categoryAxis.renderer.cellStartLocation = this.chartDataDisplay.cellStartLocation;
    categoryAxis.renderer.cellEndLocation = this.chartDataDisplay.cellEndLocation;
    categoryAxis.renderer.line.strokeOpacity = 1;

    categoryAxis.renderer.labels.template.events.on('sizechanged', (ev) => {
      const labelTemplate = categoryAxis.renderer.labels.template;
      if (chart.measuredWidth) {
        labelTemplate.maxWidth = chart.measuredWidth - 100;
      }
      labelTemplate.truncate = true;
      labelTemplate.tooltipText = `{${this.chosenType.xAxisTooltip}}`;
    });
  }

  private getMaxXAxisWidth(label: any, cellWidth: any): any {
    if (label && label.text && label.text.length < 10)
      return (label.text.length) * 20;
    else
      return cellWidth + 10;
  }

  private createSerieWithMetadata(field, name, chart, tooltip, stacked, serieColorHex) {
    let series: ColumnSeries = chart.series.push(new ColumnSeries());
    this.series.push({ color: serieColorHex, serie: series, name, isLast: name.toLowerCase().includes("more") });
    series.clickable = true;
    series.dataFields.valueX = field;
    series.numberFormatter.numberFormat = "#";
    series.hiddenState.transitionDuration = 600;
    series.defaultState.transitionDuration = 600;
    series.dataFields.categoryY = this.chartDataDisplay.metadata.categoryAxisKey;
    series.name = name;
    series.userClassName = "serie";
    series.columns.template.tooltipHTML = `{${tooltip}}`;
    series.stacked = stacked;
    return series;
  }

  private setLabelForEachSerie(series: ColumnSeries) {
    if (this.chart.data.length < 31) {
      let valueLabel: LabelBullet = series.bullets.push(new LabelBullet());
      valueLabel.dx = 5;
      valueLabel.label.text = '{valueY}';
      valueLabel.tooltipText = '{valueY.formatNumber("#,###.00")}';
      valueLabel.label.truncate = false;
      valueLabel.label.hideOversized = false;
      valueLabel.label.horizontalCenter = "left";
      valueLabel.label.text = `{${series.name}}`;
      valueLabel.label.adapter.add("textOutput", (v, t, k) => {
        const num = this.numberFormatService.format(v);
        if (num)
          return num;
        return v;
      });

      valueLabel.label.events.on("sizechanged", (ev) => {
        const label = ev.target;
        if (!label.availableHeight)
          return;
        else if (label.availableHeight >= 10) {
          valueLabel.fontSize = 9;
        }
        else if (label.availableHeight >= 6) {
          valueLabel.fontSize = 7;
        }
        else if (label.availableHeight >= 4) {
          valueLabel.fontSize = 6;
        }
        else {
          valueLabel.disabled = true;
        }
      });
    }
  }
  private setXAxes(chart: XYChart) {
    let valueAxis = chart.xAxes.push(new ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.extraMax = 0.1;
    if (!this.chartDataDisplay.xAxisLineShow) {
      valueAxis.renderer.axis.children.values[2].disabled = true;
    }
    valueAxis.strictMinMax = this.chartDataDisplay.strictMinMax;
    valueAxis.numberFormatter.numberFormat = "#.0a";
    valueAxis.renderer.grid.template.disabled = !this.chartDataDisplay.xAxisShowGrid;
    valueAxis.renderer.labels.template.disabled = !this.chartDataDisplay.xAxisShowLabels;
  }


}

function compare(a, b, isOverrideHigher) {
  if (isOverrideHigher)
    return 2;
  if (a > b)
    return 1;
  else if (a < b)
    return -1;
  else
    return 0;
}

function removeOldSeries(chart: any) {
  const series = [...chart.series._values];
  for (let i = 0; i < series.length; i++) {
    chart.series.removeIndex(0);
  }
}

function removeOldAxisData(chart: any) {
  if (chart.xAxes._values.length)
    chart.xAxes.removeIndex(0);
  if (chart.yAxes._values.length)
    chart.yAxes.removeIndex(0);
}
