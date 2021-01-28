import { AfterViewInit, Component, OnInit } from '@angular/core';

import { useTheme, create, percent, color, DropShadowFilter, Label, NumberFormatter } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, Legend, XYCursor, LabelBullet, } from "@amcharts/amcharts4/charts";
import { StackVertDataService, DataForStackVertBar } from '../services/stackVertDataService/stack-vert-data.service';
import { BehaviorSubject } from 'rxjs';
import { clone } from '@amcharts/amcharts4/.internal/core/utils/Object';
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
let isProject = true;


@Component({
  selector: 'app-stack-vert-chart',
  templateUrl: './stack-vert-chart.component.html',
  styleUrls: ['./stack-vert-chart.component.css']
})
export class StackVertChartComponent implements OnInit, AfterViewInit {
  //observable that return the current selected data
  dataSubject$: BehaviorSubject<DataForStackVertBar>;
  seriesState: { serie: ColumnSeries, stateHidden: boolean; }[];
  chart: XYChart;
  chartId: string;
  constructor(private stackVertData: StackVertDataService) {
    this.chartId = getRandomWord();
    this.dataSubject$ = isProject ? this.stackVertData.selectedData : this.stackVertData.selectedDataService;
    isProject = !isProject;
  }

  ngAfterViewInit(): void {
    //change chart data on BehaviorSubject event change
    this.dataSubject$.subscribe(x => this.setChart(this.chart, x));
  }

  ngOnInit(): void {

  }

  setChart(chart:XYChart, dataDisplay) {
    if (chart)
      this.chart.dispose();
    this.chart = create(this.chartId, XYChart);
    chart = this.chart;
    chart.data = dataDisplay.data;
    chart.numberFormatter.numberFormat = "#.a"

    let categoryAxis: CategoryAxis = this.setXAxis(chart, dataDisplay);
    //change tooltipText data
    // setXAxisTooltip(categoryAxis, chart);
    setYAxis(chart);
    this.setSeries(dataDisplay);
    setTotalLabelForStack(dataDisplay, this.chart);
    addLegend(chart);
    

  }

  private setSeries(dataDisplay: any) {
    for (let i = 0; i < dataDisplay.display.xAxis.length; i++) {
      const element = dataDisplay.display.xAxis[i];
      const isLastSerie = i == dataDisplay.display.xAxis.length - 1;
      const serie = createSerie(element, element, true, dataDisplay, isLastSerie, this.chart);
    }
  }


  private moveScrollTooltip(className: string, tooltip: any) {
    const tooltipEl = document.querySelector(`.${className}`);
    if (tooltipEl) {
      tooltipEl.parentNode.parentNode.parentNode.parentElement.removeAttribute("style");
    }
  }
  private setXAxis(chart: any, dataDisplay: any) {
    let categoryAxis: CategoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = dataDisplay.display.yAxis;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -70;
    labelTemplate.horizontalCenter = "right";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.maxWidth = 100;
    return categoryAxis;
  }
}

//serie functions
function createSerie(field: string, name: string, stacked: boolean, dataDisplay, isLastSerie: boolean, chart: XYChart) {
  let series: ColumnSeries = creatSerieMetadata(chart, field, dataDisplay, name, stacked);
  //   series.columns.template.tooltipHTML = `
  //   <div style="display: flex; align-items: center; justify-content: center;flex-direction:column">
  //     <div>Header</div>
  //     <div style="display: flex; justify-content: space-between; width: 100%;">
  //         <div>Data</div>
  //         <div>Something</div>
  //     </div>
  // </div>
  //   `;
  //on hide or show events we change the column total price of all projects
  onSerieHideEv(series, chart);
  onSerieShownEv(series, chart);
  addLabelToSerie(series, isLastSerie);

  return series;
}

function addLabelToSerie(series, isLastSerie) {
  if (isLastSerie) {
    let valueLabel = series.bullets.push(new LabelBullet());
    valueLabel.label.text = "{valueY.total}";
    valueLabel.label.dy = -10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;
  }
}

function setTotalLabelForStack(dataDisplay, chart) {
  const totalSeries = chart.series.push(new ColumnSeries());
  chart.data.forEach(chartCategoryV => chartCategoryV.totalSeriesValues = 0);//this is for aggregate the sum of all series on one category
  totalSeries.dataFields.valueY = 'totalSeriesValues';
  totalSeries.dataFields.categoryX = dataDisplay.display.yAxis;
  totalSeries.stacked = true;
  totalSeries.hiddenInLegend = true;
  totalSeries.columns.template.strokeOpacity = 0;
  setLabelForEachSerie(totalSeries, true);
}

function setLabelForEachSerie(series, stacked) {
  const valueLabel: LabelBullet = series.bullets.push(new LabelBullet());
  valueLabel.label.text = '{valueY.sum}';
  valueLabel.tooltipText = '{valueY.sum}';
  valueLabel.label.truncate = false; // don't cut the full label
  valueLabel.label.dy = -10;
  valueLabel.label.textAlign = "middle";

}

function creatSerieMetadata(chart: XYChart, field: string, dataDisplay: any, name: string, stacked: boolean) {
  let series: ColumnSeries = chart.series.push(new ColumnSeries());
  series.dataFields.valueY = field;
  series.dataFields.categoryX = dataDisplay.display.yAxis;
  series.name = name;
  series.stacked = stacked;
  series.columns.template.width = percent(95);
  series.hiddenState.transitionDuration = 600;
  series.defaultState.transitionDuration = 600;
  return series;
}

function onSerieShownEv(series: ColumnSeries, chart: XYChart) {
  series.events.on("shown", (e) => {
    const prop = (<ColumnSeries>e.target).dataFields.valueY;
    chart.data.forEach(element => {
      element["total"] += element[prop];
    });
  });
}

function onSerieHideEv(series: ColumnSeries, chart: XYChart) {
  series.events.on("hidden", (e) => {
    const prop = (<ColumnSeries>e.target).dataFields.valueY;
    chart.data.forEach(element => {
      element["total"] -= element[prop];
    });
  });
}
function removeOldSeries(chart: any) {
  const series = [...chart.series._values];
  for (let i = 0; i < series.length; i++) {
    chart.series.removeIndex(0);
  }
}

function addLegend(chart: any) {
  if (!chart.legend) {
    chart.legend = new Legend();
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
  }
}

//axis functions
function setYAxis(chart: any) {
  let valueAxis = chart.yAxes.push(new ValueAxis());
  valueAxis.cursorTooltipEnabled = false;
  valueAxis.calculateTotals = true;
}

function setXAxisTooltip(categoryAxis: CategoryAxis, chart: any) {
  let axisTooltip = categoryAxis.tooltip;
  axisTooltip.background.strokeWidth = 0;
  axisTooltip.background.cornerRadius = 3;
  axisTooltip.background.pointerLength = 0;
  axisTooltip.dy = -300;

  chart.cursor = new XYCursor();
  (<XYCursor>chart.cursor).lineX.disabled = true;
  (<XYCursor>chart.cursor).lineY.disabled = true;

  let dropShadow = new DropShadowFilter();
  dropShadow.dy = 1;
  dropShadow.dx = 1;
  dropShadow.opacity = 0.5;
  axisTooltip.filters.push(dropShadow);
}

function removeOldAxisData(chart: any) {
  if (chart.xAxes._values.length)
    chart.xAxes.removeIndex(0);
  if (chart.yAxes._values.length)
    chart.yAxes.removeIndex(0);
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