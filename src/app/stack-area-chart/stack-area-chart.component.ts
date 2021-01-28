import { AfterViewInit, Component, OnInit } from '@angular/core';

import { useTheme, create, color, Scrollbar } from "@amcharts/amcharts4/core";
import { XYChart, Legend, XYCursor, LineSeries, DateAxis, ValueAxis, CategoryAxis } from "@amcharts/amcharts4/charts";
import { StackVertDataService } from '../services/stackVertDataService/stack-vert-data.service';
import { viewClassName } from '@angular/compiler';
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-stack-area-chart',
  templateUrl: './stack-area-chart.component.html',
  styleUrls: ['./stack-area-chart.component.css']
})
export class StackAreaChartComponent implements OnInit, AfterViewInit {

  data: any[] = [{
    "year": "1994",
    "cars": 1587,
    "motorcycles": 650,
    "bicycles": 121
  }, {
    "year": "1995",
    "cars": 1567,
    "motorcycles": 683,
    "bicycles": 146
  }, {
    "year": "1996",
    "cars": 1617,
    "motorcycles": 691,
    "bicycles": 138
  }, {
    "year": "1997",
    "cars": 1630,
    "motorcycles": 642,
    "bicycles": 127
  }, {
    "year": "1998",
    "cars": 1660,
    "motorcycles": 699,
    "bicycles": 105
  }, {
    "year": "1999",
    "cars": 1683,
    "motorcycles": 721,
    "bicycles": 109
  }, {
    "year": "2000",
    "cars": 1691,
    "motorcycles": 737,
    "bicycles": 112
  }, {
    "year": "2001",
    "cars": 1298,
    "motorcycles": 680,
    "bicycles": 101
  }, {
    "year": "2002",
    "cars": 1275,
    "motorcycles": 664,
    "bicycles": 97
  }, {
    "year": "2003",
    "cars": 1246,
    "motorcycles": 648,
    "bicycles": 93
  }, {
    "year": "2004",
    "cars": 1318,
    "motorcycles": 697,
    "bicycles": 111
  }, {
    "year": "2005",
    "cars": 1213,
    "motorcycles": 633,
    "bicycles": 87
  }, {
    "year": "2006",
    "cars": 1199,
    "motorcycles": 621,
    "bicycles": 79
  }, {
    "year": "2007",
    "cars": 1110,
    "motorcycles": 210,
    "bicycles": 81
  }, {
    "year": "2008",
    "cars": 1165,
    "motorcycles": 232,
    "bicycles": 75
  }, {
    "year": "2009",
    "cars": 1145,
    "motorcycles": 219,
    "bicycles": 88
  }, {
    "year": "2010",
    "cars": 1163,
    "motorcycles": 201,
    "bicycles": 82
  }, {
    "year": "2011",
    "cars": 1180,
    "motorcycles": 285,
    "bicycles": 87
  }, {
    "year": "2012",
    "cars": 1159,
    "motorcycles": 277,
    "bicycles": 71
  }];
  dataSubject$: any;
  chart: XYChart;
  chartId: string;

  constructor(private stackVertService: StackVertDataService) {
    this.dataSubject$ = this.stackVertService.selectedDataArea;
    this.chartId = getRandomWord();
  }
  ngAfterViewInit(): void {
    this.dataSubject$.subscribe(x => this.setChart(x));
  }

  ngOnInit(): void {

  }


  private setChart(dataDisplay) {
    if (this.chart)
      this.chart.dispose();
    this.chart = create(this.chartId, XYChart);
    this.chart.data = dataDisplay.data;

    //set axis
    setXAxis(this.chart, dataDisplay);
    setYAxis(this.chart);

    //set series
    this.setSeries(dataDisplay);

    addLegend(this.chart);
  }

  private setSeries(dataDisplay: any) {
    for (let i = 0; i < dataDisplay.display.xAxis.length; i++) {
      const element = dataDisplay.display.xAxis[i];
      const isLastSerie = i == dataDisplay.display.xAxis.length - 1;
      const serie = createSerie(element, element, true, dataDisplay, isLastSerie, this.chart);
    }
  }
}
function createSerie(name, key, isTrue, dataDisplay, isLastSerie, chart) {
  let series: LineSeries = chart.series.push(new LineSeries());
  series.name = name;
  series.dataFields.valueY = key;
  series.dataFields.categoryX = dataDisplay.display.yAxis;
  series.tooltip.background.fill = color("#FFF");
  series.tooltip.getStrokeFromObject = true;
  series.tooltip.background.strokeWidth = 3;
  series.tooltip.getFillFromObject = false;
  series.fillOpacity = 0.6;
  series.strokeWidth = 2;
  series.stacked = true;
}

function addLegend(chart: XYChart) {
  chart.legend = new Legend();
}

function setXAxis(chart: XYChart, dataDisplay) {
  let categoryAxis: CategoryAxis = chart.xAxes.push(new CategoryAxis());
  categoryAxis.dataFields.category = dataDisplay.display.yAxis;
  categoryAxis.renderer.minGridDistance = 60;
  categoryAxis.startLocation = 0.5;
  categoryAxis.endLocation = 0.5;
}

function setYAxis(chart: XYChart) {
  let valueAxis = chart.yAxes.push(new ValueAxis());
  valueAxis.tooltip.disabled = true;
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