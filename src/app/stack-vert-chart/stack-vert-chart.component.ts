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
  columnText: string
  constructor(private stackVertData: StackVertDataService) {
    this.dataSubject$ = this.stackVertData.selectedData
    this.columnText = ""
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
    categoryAxis.tooltipText = this.columnText;
    categoryAxis.tooltipHTML = this.columnText;

    let axisTooltip = categoryAxis.tooltip;
    axisTooltip.background.fill = color("black");
    axisTooltip.stroke = color("red");
    axisTooltip.background.strokeWidth = 0;
    axisTooltip.background.cornerRadius = 3;
    axisTooltip.background.pointerLength = 0;
    axisTooltip.dy = -300;
    axisTooltip.dx = 70;

    chart.cursor = new XYCursor();
    (<XYCursor>chart.cursor).lineX.disabled = true;
    (<XYCursor>chart.cursor).lineY.disabled = true;

    categoryAxis.adapter.add("getTooltipText", (a, e, k) => {
      console.log(e.tooltip)
      return this.columnText
    })

    let dropShadow = new DropShadowFilter();
    dropShadow.dy = 1;
    dropShadow.dx = 1;
    dropShadow.opacity = 0.5;
    axisTooltip.filters.push(dropShadow);


    let valueAxis = chart.yAxes.push(new ValueAxis());
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;


    const series = [...chart.series._values]
    for (let i = 0; i < series.length; i++) {
      chart.series.removeIndex(0)
    }

    for (let i = 0; i < dataDisplay.display.xAxis.length; i++) {
      const element = dataDisplay.display.xAxis[i];
      this.createSeries(element, element, true, dataDisplay, i == dataDisplay.display.xAxis.length - 1);
    }


    if (!chart.legend) {
      chart.legend = new Legend();
      chart.legend.maxHeight = 40;
      chart.legend.scrollable = true;
    }
  }

  createSeries = (field, name: string, stacked: boolean, dataDisplay, isLastSerie) => {
    let series: ColumnSeries = this.chart.series.push(new ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = dataDisplay.display.yAxis;
    series.name = name;

    series.columns.template.events.on("over", (e) => {
      this.columnText = ""
      const year = (<any>e.target.dataItem).categoryX
      const obj = this.dataSubject$.value.data.find(x => x["year"] == year)
      const keys = Object.keys(obj)
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].includes("Project")) {
          const value = obj[keys[i]];
          this.columnText += `${keys[i]}: ${value}\n`
        }
      }
      this.columnText += `total: ${obj.total}`
    })

    series.stacked = stacked;
    series.columns.template.width = percent(95);
    series.events.on("hit", (e) => {
    })
    series.events.on("hidden", (e) => {
      const prop = (<ColumnSeries>e.target).dataFields.valueY
      this.chart.data.forEach(element => {
        element["total"] -= element[prop]
      });
    })


    series.events.on("shown", (e) => {
      console.log("appeared")
      const prop = (<ColumnSeries>e.target).dataFields.valueY
      this.chart.data.forEach(element => {
        element["total"] += element[prop]
      });
    })

    if (isLastSerie) {
      let valueLabel = series.bullets.push(new LabelBullet());
      valueLabel.label.text = "{total}";
      valueLabel.label.dy = -10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;
    }

  }

  addComma(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
