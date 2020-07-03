import { Component, OnInit } from '@angular/core';

import { useTheme, create, percent, color, DropShadowFilter, Label } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, Legend, XYCursor, LabelBullet, } from "@amcharts/amcharts4/charts";
import { StackVertDataService } from '../services/stackVertDataService/stack-vert-data.service';
import { BehaviorSubject } from 'rxjs';
import { clone } from '@amcharts/amcharts4/.internal/core/utils/Object';
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


    if (chart.xAxes._values.length) chart.xAxes.removeIndex(0)
    if (chart.yAxes._values.length) chart.yAxes.removeIndex(0)

    let categoryAxis: CategoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = dataDisplay.display.yAxis;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    let valueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.min = 0;


    const series = [...chart.series._values]
    for (let i = 0; i < series.length; i++) {
      chart.series.removeIndex(0)
    }

    for (let i = 0; i < dataDisplay.display.xAxis.length; i++) {
      const element = dataDisplay.display.xAxis[i];
      this.createSeries(element, element, true, dataDisplay);
    }

    console.log(chart.series._values)

    if (!chart.legend) {
      chart.legend = new Legend();
      chart.legend.maxHeight = 40;
      chart.legend.scrollable = true;
    }
  }

  createSeries = (field, name, stacked, dataDisplay) => {
    let series: ColumnSeries = this.chart.series.push(new ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = dataDisplay.display.yAxis;
    series.name = name;
    series.columns.template.tooltipText = "categoryX"
    series.columns.template.adapter.add("tooltipText", (e, a) => {
      const y = a.dataItem[e];
      const obj = {
        ...this.dataSubject$.value.data.find(x => x[dataDisplay.display.yAxis] == y)
      }
      delete obj[dataDisplay.display.yAxis]
      let values = Object.keys(obj)
      values = values.sort(function (a, b) {
        if (obj[a] < obj[b])
          return 1
        if (obj[a] > obj[b])
          return -1
        return 0
      })
      let string = ""
      let count = 0
      values.forEach(key => {
        string += `${key} : ${this.addComma(obj[key])}  ₪ [/]\n`

        count += Number(obj[key])
      })
      string += `------------------\nTotal : ${this.addComma(count)} ₪`
      return string;
    })
    series.stacked = stacked;
    series.columns.template.width = percent(95);
    series.events.on("hit", (e) => {
      console.log(e)
    })

    let valueLabel = series.bullets.push(new LabelBullet());
    valueLabel.label.text = "{categoryD}";
    valueLabel.label.dy = -10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;
    series.adapter.add("readerLabelledBy", (e, x) => {
      if (x.dataFields.valueY != "Project F") {
        x.bulletsContainer.disabled = true
      }
      return "1200"
    })
    
  }

  addComma(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
