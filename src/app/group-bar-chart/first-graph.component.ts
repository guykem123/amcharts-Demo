import { Component, OnInit } from '@angular/core';

import { useTheme, create, color } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, LabelBullet, Legend, } from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-first-graph',
  templateUrl: './first-graph.component.html',
  styleUrls: ['./first-graph.component.css']
})
export class FirstGraphComponent implements OnInit {

  incomeState
  expensesState
  chart: XYChart
  data: any[] = [{
    "year": 2005,
    "income": 23.5,
    "expenses": 18.1
  }, {
    "year": 2006,
    "income": 26.2,
    "expenses": 22.8
  }, {
    "year": 2007,
    "income": 30.1,
    "expenses": 23.9
  }, {
    "year": 2008,
    "income": 29.5,
    "expenses": 25.1,
  }, {
    "year": 2009,
    "income": 24.6,
    "expenses": 25
  }];

  constructor() {
    useTheme(am4themes_animated);
  }

  ngOnInit(): void {
    this.chart = create("groupBarChart", XYChart);
    this.chart.data = this.data
    this.chart.clickable = true;
    
    setYAxes(this.chart);
    setXAxes(this.chart);

    //set series
    createSeries("income", "Income", this.chart);
    createSeries("expenses", "Xxpenses", this.chart);

    // addLegend(this.chart);

  }

  changeIncomeState() {
    const s = this.chart.series.values.find((s) => s.dataFields.valueX == "income")
    if (this.incomeState)
      s.hide()
    else
      s.show()
    this.incomeState = !this.incomeState
  }
  changeExpensesState() {
    const s = this.chart.series.values.find((s) => s.dataFields.valueX == "expenses")
    if (this.expensesState)
      s.hide()
    else
      s.show()
    this.expensesState = !this.expensesState
  }
}

function createSeries(field, name, chart) {
  let series: ColumnSeries = createSerieWithMetadata(chart, field, name);
  setSerieOnClickEv(series);
  setLabelForEachSerie(series);
}

function setXAxes(chart) {
  let valueAxis = chart.xAxes.push(new ValueAxis());

  valueAxis.renderer.opposite = true;
  valueAxis.renderer.grid.template.strokeOpacity = 0;
  valueAxis.min = 0;
  // valueAxis.renderer.grid.template.disabled = true;
  // valueAxis.renderer.labels.template.disabled = true;
}
function createSerieWithMetadata(chart: any, field: any, name: any) {
  let series: ColumnSeries = chart.series.push(new ColumnSeries());
  series.clickable = true;
  series.dataFields.valueX = field;
  series.hiddenState.transitionDuration = 400;
  series.dataFields.categoryY = "year";
  series.name = name;
  series.sequencedInterpolation = true;
  series.userClassName = "serie";
  return series;
}
function setSerieOnClickEv(series: ColumnSeries) {
  series.events.on("hit", (e) => {
    if (e.target.visible)
      e.target.hide();
    else
      e.target.appear();
  });
}
function setLabelForEachSerie(series: ColumnSeries) {
  let valueLabel = series.bullets.push(new LabelBullet());
  valueLabel.userClassName = "abc";
  valueLabel.label.horizontalCenter = "left";
  valueLabel.label.dx = 10;
  valueLabel.label.hideOversized = false;
  valueLabel.label.truncate = false;
}
function setYAxes(chart: XYChart) {
  let categoryAxis = chart.yAxes.push(new CategoryAxis());
  categoryAxis.dataFields.category = "year";
  categoryAxis.numberFormatter.numberFormat = "#";
  categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.grid.template.strokeOpacity = 0;
  // categoryAxis.renderer.grid.template.disabled = true;
  // categoryAxis.renderer.labels.template.disabled = true;
}
function addLegend(chart: XYChart) {
  chart.legend = new Legend();
  chart.legend.position = "top";
  chart.legend.maxHeight = 40;
  chart.legend.scrollable = true;
  chart.legend.useDefaultMarker = true;
  let marker: any = chart.legend.markers.template.children.getIndex(0);
  marker.cornerRadius(12, 12, 12, 12);
  marker.strokeWidth = 2;
  marker.strokeOpacity = 1;
  marker.stroke = color("#ccc");

}

