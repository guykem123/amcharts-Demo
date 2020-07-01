import { Component, OnInit } from '@angular/core';

import { useTheme, create, percent } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, Legend, } from "@amcharts/amcharts4/charts";
import { StackVertDataService } from '../services/stackVertDataService/stack-vert-data.service';
import { BehaviorSubject } from 'rxjs';
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-stack-vert-chart',
  templateUrl: './stack-vert-chart.component.html',
  styleUrls: ['./stack-vert-chart.component.css']
})
export class StackVertChartComponent implements OnInit {
  dataSubject$: BehaviorSubject<any>
  chart
  constructor(private stackVertData: StackVertDataService) {
    this.dataSubject$ = this.stackVertData.selectedData
  }

  ngOnInit(): void {
    this.chart = create("stackVertChart", XYChart);
    this.dataSubject$.subscribe(x => this.setChart(this.chart, x))
  }

  setChart(chart, dataDisplay) {
    if (!chart)
      return
    chart.data = dataDisplay.data


    if(chart.xAxes._values.length) chart.xAxes.removeIndex(0)
    if(chart.yAxes._values.length) chart.yAxes.removeIndex(0)

    let categoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = dataDisplay.display.yAxis;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    
    let valueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.min = 0;

    function createSeries(field, name, stacked) {
      let series = chart.series.push(new ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = dataDisplay.display.yAxis;
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = percent(95);
    }
    const series = [...chart.series._values]
    for (let i = 0; i < series.length; i++) {
      chart.series.removeIndex(0)
    }

    for (let i = 0; i < dataDisplay.display.xAxis.length; i++) {
      const element = dataDisplay.display.xAxis[i];
      createSeries(element, element, true);
    }

    console.log(chart.series._values)

    if (!chart.legend) {
      chart.legend = new Legend();
      chart.legend.maxHeight = 40;
      chart.legend.scrollable = true;
    }
  }

}
