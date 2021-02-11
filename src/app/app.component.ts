import { Component, OnInit } from '@angular/core';
import { NewDataService } from './services/newDataService/new-data.service';
import { StackVertDataService } from './services/stackVertDataService/stack-vert-data.service';
import { XYChartsDisplayData } from './shared/chart/models/XYChartsDisplayData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  chartId: string;
  chartDivId: string;
  chartDataDisplay: XYChartsDisplayData;
  categoryType: any;
  showChartLegendDivide: boolean;
  title = 'AmChartDemo';
  stackVertDataOptions;
  dataDisplay;
  dataDisplayArea;
  dashboardControls: any[];
  constructor(
    private stackVertService: StackVertDataService,
    private dataService: NewDataService
  ) {
    this.dashboardControls = [
      {
        "controlWidth": 1,
        "controlHeight": 1,
        "horizontalPosition": 1,
        "verticalPosition": 1,
      },
      {
        "controlWidth": 1,
        "controlHeight": 1,
        "horizontalPosition": 1,
        "verticalPosition": 2,
      },
      {
        "controlWidth": 1,
        "controlHeight": 1,
        "horizontalPosition": 1,
        "verticalPosition": 3,
      },
      {
        "controlWidth": 1,
        "controlHeight": 1,
        "horizontalPosition": 1,
        "verticalPosition": 4,
      },
    ];
  }

  
  ngOnInit(): void {
    this.chartId = "firstChart";
    this.chartDivId = "chartdivid";
    this.stackVertDataOptions = this.stackVertService.getAllDataOptions();
    this.dataDisplay = { ...this.stackVertDataOptions[0] };
    this.dataDisplayArea = { ...this.stackVertDataOptions[0] };
    this.chartDataDisplay = this.dataService.verticalBarData.Projects;
    this.categoryType = "Nan";
  }

  changeSelect(name) {
    this.chartDataDisplay = this.dataService.verticalBarData[name];
  }

  changeSelectArea() {
    this.stackVertService.changeDataForArea(this.stackVertDataOptions.find(x => x.name == this.dataDisplayArea.name));
  }
}
