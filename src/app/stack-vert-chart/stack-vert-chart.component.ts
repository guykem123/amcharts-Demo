import { Component, OnInit } from '@angular/core';

import { useTheme, create, percent } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, Legend, } from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-stack-vert-chart',
  templateUrl: './stack-vert-chart.component.html',
  styleUrls: ['./stack-vert-chart.component.css']
})
export class StackVertChartComponent implements OnInit {

  data: any[] = [{
    "year": "2003",
    "europe": 2.5,
    "namerica": 2.5,
    "asia": 2.1,
    "lamerica": 1.2,
    "meast": 0.2,
    "africa": 0.1
  }, {
    "year": "2004",
    "europe": 2.6,
    "namerica": 2.7,
    "asia": 2.2,
    "lamerica": 1.3,
    "meast": 0.3,
    "africa": 0.1
  }, {
    "year": "2005",
    "europe": 2.8,
    "namerica": 2.9,
    "asia": 2.4,
    "lamerica": 1.4,
    "meast": 0.3,
    "africa": 0.1
  }];


  constructor() { }

  ngOnInit(): void {
    let chart = create("stackVertChart", XYChart);
    chart.data = this.data

    let categoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.title.text = "Local country offices";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    let valueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.min = 0;

    function createSeries(field, name, stacked) {
      let series = chart.series.push(new ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = percent(95);
    }

    createSeries("europe", "Europe", true);
    createSeries("namerica", "North America", true);
    createSeries("asia", "Asia", true);
    createSeries("lamerica", "Latin America", true);
    createSeries("meast", "Middle East", true);
    createSeries("africa", "Africa", true);

    chart.legend = new Legend();
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
  }

}
