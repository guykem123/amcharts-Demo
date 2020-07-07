import { Component, OnInit } from '@angular/core';

import { useTheme, create, percent, color, DropShadowFilter, Label } from "@amcharts/amcharts4/core";
import { XYChart, ColumnSeries, ValueAxis, CategoryAxis, Legend, XYCursor, LabelBullet, } from "@amcharts/amcharts4/charts";
import { StackVertDataService, DataForStackVertBar } from '../services/stackVertDataService/stack-vert-data.service';
import { BehaviorSubject } from 'rxjs';
import { clone } from '@amcharts/amcharts4/.internal/core/utils/Object';
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-stack-vert-chart',
  templateUrl: './stack-vert-chart.component.html',
  styleUrls: ['./stack-vert-chart.component.css']
})
export class StackVertChartComponent implements OnInit {
  //observable that return the current selected data
  dataSubject$: BehaviorSubject<DataForStackVertBar>
  seriesState: { serie: ColumnSeries, stateHidden: boolean }[]
  chart: XYChart
  constructor(private stackVertData: StackVertDataService) {
    this.dataSubject$ = this.stackVertData.selectedData
  }

  ngOnInit(): void {
    this.chart = create("stackVertChart", XYChart);
    //change chart data on BehaviorSubject event change
    this.dataSubject$.subscribe(x => this.setChart(this.chart, x))
  }

  setChart(chart, dataDisplay) {
    if (!chart)
      return
    chart.data = dataDisplay.data

    //set axis
    removeOldAxisData(chart);
    let categoryAxis: CategoryAxis = this.setXAxis(chart, dataDisplay);
    //change tooltipText data
    setXAxisTooltip(categoryAxis, chart);
    setYAxis(chart);

    removeOldSeries(chart);
    this.setSeries(dataDisplay);
    addLegend(chart);

  }

  private setSeries(dataDisplay: any) {
    for (let i = 0; i < dataDisplay.display.xAxis.length; i++) {
      const element = dataDisplay.display.xAxis[i];
      const isLastSerie = i == dataDisplay.display.xAxis.length - 1;
      const serie = createSerie(element, element, true, dataDisplay, isLastSerie, this.chart);
      this.setSerieOnColumnOverEv(serie, dataDisplay);
    }
  }
  private setSerieOnColumnOverEv(serie: ColumnSeries, dataDisplay) {
    serie.columns.template.events.on("over", (e) => {
      const valueYAxis = (<any>e.target.dataItem).categoryX;
      const keyYAxis = (<any>e.target.parent.dataItem.component.dataFields).categoryX;
      const series = this.chart.series.values

      let str

      str = `
      <div style ="background-color:white">
      <center><strong style ="color:black;">${keyYAxis.toUpperCase()} ${valueYAxis}</strong></center>
        <hr />
          <table>`

      const obj = dataDisplay.data.find(x => x[keyYAxis] == valueYAxis)
      if (!obj)
        return
      const keys = Object.keys(obj)
      for (let i = 0; i < keys.length; i++) {
        if (this.dataSubject$.value.display.xAxis.find(x => x == keys[i])) {
          const serie = series.find(s => s.dataFields.valueY == keys[i])
          if (!serie.isHidden) {
            const value = obj[keys[i]];
            str += `<tr>
                    <th>
                    <svg width="10" height="10">
                    <rect width="300" height="100" style="fill:${serie.fill};stroke-width:3;stroke:rgb(0,0,0)" />
                    </svg>
                    </th> : 
                    <th align="left" style ="color:black;font-size:12px;">${keys[i]}</th>
                    <td style ="color:black;font-size:12px;">${value}</td>
                  </tr>`
          }
        }
      }

      str += `</table>
      <hr />
      </div>`

      this.chart.xAxes.values[0].tooltip.element.node.parentElement.children[0].setAttribute("fill", "white")
      this.chart.xAxes.values[0].tooltip.html = str;
    })
  }
  private setXAxis(chart: any, dataDisplay: any) {
    let categoryAxis: CategoryAxis = chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = dataDisplay.display.yAxis;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    return categoryAxis;
  }
}

//serie functions
function createSerie(field: string, name: string, stacked: boolean, dataDisplay, isLastSerie: boolean, chart: XYChart) {
  let series: ColumnSeries = creatSerieMetadta(chart, field, dataDisplay, name, stacked);

  //on hide or show events we change the column total price of all projects
  onSerieHideEv(series, chart);
  onSerieShownEv(series, chart);
  //we add label to serie if it is the last one
  addLabelToSerie(series, isLastSerie);

  return series
}
function addLabelToSerie(series, isLastSerie) {
  if (isLastSerie) {
    let valueLabel = series.bullets.push(new LabelBullet());
    valueLabel.label.text = "{total}";
    valueLabel.label.dy = -10;
    valueLabel.label.hideOversized = false;
    valueLabel.label.truncate = false;
  }
}
function creatSerieMetadta(chart: XYChart, field: string, dataDisplay: any, name: string, stacked: boolean) {
  let series: ColumnSeries = chart.series.push(new ColumnSeries());
  series.dataFields.valueY = field;
  series.dataFields.categoryX = dataDisplay.display.yAxis;
  series.name = name;
  series.stacked = stacked;
  series.columns.template.width = percent(95);
  return series;
}
function onSerieShownEv(series: ColumnSeries, chart: XYChart) {
  series.events.on("shown", (e) => {
    console.log("appeared");
    const prop = (<ColumnSeries>e.target).dataFields.valueY;
    chart.data.forEach(element => {
      element["total"] += element[prop];
    });
  });
}
function onSerieHideEv(series: ColumnSeries, chart: XYChart) {
  series.events.on("hidden", (e) => {
    console.log("hidden");
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
  valueAxis.min = 0;
  valueAxis.cursorTooltipEnabled = false;
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

