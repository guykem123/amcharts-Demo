import { Component, OnInit, OnChanges, AfterViewInit, Input, HostListener, OnDestroy, EventEmitter, Output, ChangeDetectorRef, SimpleChanges, } from '@angular/core';
import { create, color, net, options, Container, percent, useTheme, DateFormatter } from '@amcharts/amcharts4/core';
import { XYChart, ValueAxis, CategoryAxis, XYCursor, LineSeries, DateAxis, XYSeries } from '@amcharts/amcharts4/charts';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { XYChartsDisplayData } from '../../models/XYChartsDisplayData';
import { IChartComponent } from '../../models/IChartComponent';
import { ChartService } from '../../services/chartService/chart.service';
import { AxisType } from '../../models/AxisType';
import { ColorDetail } from '../../models/ColorDetail';
import { SerieMetadata } from '../../models/SerieMetadata';
import { Subscription } from 'rxjs';
import { LegendMarker } from '../../models/LegendMarker';
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements AfterViewInit, OnDestroy, IChartComponent {

  @Input() chartId: string;
  @Input() chartDivId: string;
  @Input() chartDataDisplay: XYChartsDisplayData;
  @Input() categoryType: any;
  @Input() showChartLegendDivide: boolean;
  @Output() chartReady: EventEmitter<void> = new EventEmitter<void>();
  chart: XYChart;
  isCategoryDate: boolean;
  types: { [key: string]: AxisType; };
  chosenType: AxisType;
  @Input() colors: ColorDetail[];
  isRendering: boolean = true;
  dataIsInsufficient: boolean;
  legendHeight: number;
  subscriptions: Subscription = new Subscription();
  series: LegendMarker[] = [];

  constructor(
    private chartService: ChartService,
  ) {
    // useTheme(am4themes_animated);
    this.types = {
      dateType: { class: DateAxis, keyName: 'date', seriesKey: 'dateX', xAxisTooltip: "date.formatDate('MMM dd')" },
      categoryType: { class: CategoryAxis, keyName: 'category', seriesKey: 'categoryX', xAxisTooltip: "category" }
    };
    options.autoSetClassName = true;
    this.dataIsInsufficient = false;
    this.onSideBarChange();
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposeChart();
  }

  ngAfterViewInit(): void {
    this.setChart();
  }


  private onSideBarChange() {
   
  }


  setChart() {
    if (this.chart) {
      this.disposeChart();
    }
    if (this.chartDataDisplay && this.chartDataDisplay.data.length) {
      if (this.chartDataDisplay.data.length == 1) {
        setTimeout(() => {
          this.isRendering = false;
          this.dataIsInsufficient = true;
        });
        return;
      }
      this.chart = create(this.chartDivId, XYChart);
      console.log("create", this.chart.id);
      this.chart.zoomOutButton.disabled = true;
      this.chart.numberFormatter.smallNumberPrefixes = [];
      this.chart.data = this.chartDataDisplay.data;
      const categoryFirstValue = this.chartDataDisplay.data[0][this.chartDataDisplay.metadata.categoryAxisKey];
      this.chosenType = this.categoryType == "DATE" && Date.parse(categoryFirstValue) ? this.types.dateType : this.types.categoryType;
      this.setYAxes(this.chart);
      this.setXAxes(this.chart);
      this.setChartColors(this.chartDataDisplay.metadata.seriesMetadata);
      this.chartService.setToolTip(this.chartDataDisplay, this.chartDataDisplay.data,
        this.chart.colors.list, this.chartDataDisplay.metadata.seriesMetadata, this.chosenType.class);


      const series = this.chartDataDisplay.metadata.seriesMetadata;
      for (let i = 0; i < series.length; i++) {
        const meta = series[i];
        const serieColorHex = this.chart.colors.list[i].hex;
        this.createSeries(meta.key, meta.title, meta.tooltip, meta.dashLine,
          this.chart, meta.color, serieColorHex);
      }
      this.chartService.setPdfFunc(this.chartId, this.chart);
      this.sortTheChartCategoryValues();
      this.chart.events.on('ready', (ev) => {// sort by date
        this.isRendering = false;
        this.chartReady.emit();
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

  private disposeChart() {
    console.log("dispose", this.chart);
    this.chart?.dispose();
    delete this.chart;
  }

  private createSeries(field, name, tooltip, dashLine, chart, colorString, serieColorHex) {
    let series: LineSeries = chart.series.push(new LineSeries());
    this.series.push({ color: serieColorHex, serie: series, name, isLast: name.toLowerCase().includes("more") });
    series.dataFields.valueY = field;
    series.dataFields[this.chosenType.seriesKey] = this.chartDataDisplay.metadata.categoryAxisKey;
    series.name = name;
    series.tensionX = 0.75;
    if (colorString) {
      series.stroke = color(colorString);
    }
    series.strokeWidth = this.chartDataDisplay.lineStrokeWidth || 1;
    if (dashLine)
      series.strokeDasharray = dashLine;
    if (tooltip) {//set tooltip only if exist
      series.tooltipHTML = `{${tooltip}}`;
    }
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
    chart.cursor = new XYCursor();
    chart.cursor.numberFormatter.numberFormat = "#.0a";
    chart.cursor.lineX.disabled = !this.chartDataDisplay.showCursor;
    chart.cursor.lineY.disabled = !this.chartDataDisplay.showCursor;
    xAxis.cursorTooltipEnabled = this.chartDataDisplay.showCursor;
    chart.cursor.maxTooltipDistance = -1;
    chart.cursor.behavior = "none";
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
      const cellWidth = label.pixelWidth / (xAxis.endIndex - xAxis.startIndex);
      if (cellWidth < 110 && this.chosenType.class == CategoryAxis) {
        labelTemplate.rotation = -70;
        labelTemplate.horizontalCenter = "right";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.maxWidth = 100;
      }
      else {
        labelTemplate.rotation = 0;
        labelTemplate.horizontalCenter = "middle";
        labelTemplate.verticalCenter = "middle";
        label.maxWidth = this.getMaxXAxisWidth(label, cellWidth);
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
    xAxis.renderer.labels.template.adapter.add('text', (xAxisLabelText, xAxisLabel, key) => {
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

  private setYAxes(chart: XYChart) {
    let valueAxis: ValueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.numberFormatter.numberFormat = "#.a";
    valueAxis.strictMinMax = this.chartDataDisplay.strictMinMax;
    valueAxis.renderer.grid.template.disabled = !this.chartDataDisplay.yAxisShowGrid;
    valueAxis.renderer.labels.template.disabled = !this.chartDataDisplay.yAxisShowLabels;

    valueAxis.cursorTooltipEnabled = this.chartDataDisplay.showCursor;
    if (!this.chartDataDisplay.xAxisLineShow) {
      valueAxis.renderer.axis.children.values[1].disabled = true;
    }

  }

  setChartColors(seriesMetadata: SerieMetadata[]) {
    this.chart.colors.list = this.chartService.getChartsColors(seriesMetadata, this.colors);
    this.colors = this.colors || this.chartService.getColors();
  }

}
