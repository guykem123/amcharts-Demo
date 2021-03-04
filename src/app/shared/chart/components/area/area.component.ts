import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, ChangeDetectionStrategy, HostListener, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { create, color as createColor, options, DateFormatter, Container, percent, color } from "@amcharts/amcharts4/core";
import { XYChart, ValueAxis, CategoryAxis, XYCursor, LineSeries, DateAxis, XYSeries, Legend } from "@amcharts/amcharts4/charts";
import { XYChartsDisplayData } from '../../models/XYChartsDisplayData';
import { ChartService } from '../../services/chartService/chart.service';
import { ColorDetail } from '../../models/ColorDetail';
import { SerieMetadata } from '../../models/SerieMetadata';
import { AxisType } from '../../models/AxisType';
import { IChartComponent } from '../../models/IChartComponent';
import { LegendMarker } from '../../models/LegendMarker';
import { Subscription } from 'rxjs';
import { NumberFormatService } from '../../services/numberFormatService/number-format.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements AfterViewInit, OnChanges, OnDestroy, IChartComponent {

  @Input() chartId: string;
  @Input() chartDataDisplay: XYChartsDisplayData;
  @Input() categoryType: any;
  @Input() showChartLegendDivide: boolean;
  @Output() chartReady: EventEmitter<void> = new EventEmitter<void>();
  chart: XYChart;
  currentSerieDisplay: LineSeries;
  @Input() colors: ColorDetail[];
  isRendering: boolean;
  types: { [key: string]: AxisType; };
  chosenType: AxisType;
  legendHeight: number;
  dataIsInsufficient: boolean;
  series: LegendMarker[] = [];
  subscriptions: Subscription = new Subscription();

  constructor(
    private chartService: ChartService,
    private numberFormatService: NumberFormatService,
  ) {
    options.autoSetClassName = true;
    this.types = {
      dateType: { class: DateAxis, keyName: 'date', seriesKey: 'dateX', xAxisTooltip: "date.formatDate('MMM dd')" },
      categoryType: { class: CategoryAxis, keyName: 'category', seriesKey: 'categoryX', xAxisTooltip: "category" }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart)
      this.setChart();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.disposeChart();
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

  private disposeChart() {
    this.chart?.dispose();
    this.chartService.removePdfFunc(this.chartId);
    delete this.chart;
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
      this.chart = create(this.chartId, XYChart);
      this.chart.zoomOutButton.disabled = true;
      this.chart.numberFormatter.smallNumberPrefixes = [];
      const categoryFirstValue = this.chartDataDisplay.data[0][this.chartDataDisplay.metadata.categoryAxisKey];
      this.chosenType = categoryFirstValue.match(/^[0-9]+[\-.][0-9]+[\-.][0-9]+$/g) ? this.types.dateType : this.types.categoryType;
      this.chart.data = this.chartDataDisplay.data;
      this.setYAxes(this.chart);
      this.setXAxes(this.chart);
      this.setChartColors(this.chartDataDisplay.metadata.seriesMetadata);
      this.chartService.setToolTip(this.chartDataDisplay, this.chartDataDisplay.data,
        this.chart.colors.list, this.chartDataDisplay.metadata.seriesMetadata, this.chosenType.class);
      const series = this.chartDataDisplay.metadata.seriesMetadata;
      for (let i = 0; i < series.length; i++) {
        const serie = series[i];
        const serieColorHex = this.chart.colors.list[i].hex;
        this.createSeries(serie.key, serie.title,
          serie.tooltip, this.chart, serieColorHex);
      }
      this.sortTheChartByDate();
      this.chartService.addLegend(this.chart, this);
      this.chartService.setPdfFunc(this.chartId, this.chart);
      this.chart.events.on('ready', (ev) => {// sort by date
        this.isRendering = false;
        this.chartReady.emit();
      });
      this.chart.events.on('beforedatavalidated', (ev) => {// sort by date
        const serieKeys = this.chartDataDisplay.metadata.seriesMetadata
          .map(serie => serie.key);
        for (let i = 0; i < serieKeys.length; i++) {
          const key = serieKeys[i];
          this.chart.data.forEach(obj => {
            //if serie as no amount in the data the area chart will get misshape 
            if (!obj[key]) {
              obj[key] = 0;
            }
          });
        }
      });
    }
    else {
      setTimeout(() => {
        this.isRendering = false;
      });
    }
  }


  private sortTheChartByDate() {
    this.chart.events.on('beforedatavalidated', (ev) => {
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

  ngAfterViewInit(): void {
    this.setChart();
  }

  private createSeries(field, name, tooltip, chart, color) {
    let series: LineSeries = this.createSerieWithMetadata(chart, field, tooltip, name, color);
  }

  private setXAxes(chart) {
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
    chart.cursor.lineX.disabled = !this.chartDataDisplay.showCursor;
    chart.cursor.lineY.disabled = !this.chartDataDisplay.showCursor;
    xAxis.cursorTooltipEnabled = this.chartDataDisplay.showCursor;
    chart.cursor.maxTooltipDistance = -1000;
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

  private createSerieWithMetadata(chart: any, field: any, tooltip, name: any, color) {
    let series: LineSeries = chart.series.push(new LineSeries());
    this.series.push({ color, serie: series, name, isLast: name.toLowerCase().includes("more") });
    series.dataFields.valueY = field;
    series.dataFields[this.chosenType.seriesKey] = this.chartDataDisplay.metadata.categoryAxisKey;
    series.name = name;
    if (tooltip) {//set tooltip only if exist
      series.tooltipHTML = `{${tooltip}}`;
    }

    var segment = series.segments.template;
    segment.interactionsEnabled = true;
    var hs = segment.states.create("hover");

    series.fillOpacity = 0.6;
    series.stacked = true;
    series.strokeWidth = 2;
    return series;
  }

  private setYAxes(chart: XYChart) {
    const valueAxis: ValueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.extraMax = 0.1;
    valueAxis.renderer.grid.template.align = 'right';
    valueAxis.numberFormatter.numberFormat = '#';
    valueAxis.strictMinMax = this.chartDataDisplay.strictMinMax;
    if (!this.chartDataDisplay.xAxisLineShow)
      valueAxis.renderer.axis.children.values[1].disabled = true;
    valueAxis.renderer.grid.template.disabled = !this.chartDataDisplay.yAxisShowGrid;
    valueAxis.renderer.grid.template.strokeDasharray = this.chartDataDisplay.yAxisGridDashed ? '4,4' : '';
    valueAxis.renderer.labels.template.disabled = !this.chartDataDisplay.yAxisShowLabels;
    valueAxis.calculateTotals = true;
    valueAxis.cursorTooltipEnabled = this.chartDataDisplay.showCursor;
    valueAxis.renderer.labels.template.adapter.add("text", (v, t, k) => {
      return this.numberFormatService.format(v,undefined,undefined,true);
    });
  }

}