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

  items = [{ name: 'set 1', value: "Projects" }, { name: 'set 2', value: "Services" }, { name: 'set 3', value: "Locations" }];
  selectedItem: any = this.items[0];
  chartDataDisplay2: XYChartsDisplayData;


  constructor(
    private stackVertService: StackVertDataService,
    private dataService: NewDataService
  ) {
    this.dashboardControls = [
      {
        "controlWidth": 1,
        "controlHeight": 2,
        "horizontalPosition": 1,
        "verticalPosition": 1,
      },
      {
        "controlWidth": 1,
        "controlHeight": 2,
        "horizontalPosition": 1,
        "verticalPosition": 2,
      },
      {
        "controlWidth": 1,
        "controlHeight": 2,
        "horizontalPosition": 1,
        "verticalPosition": 3,
      },
      {
        "controlWidth": 1,
        "controlHeight": 2,
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
    this.chartDataDisplay2 = this.dataService.verticalBarData.Services;
    this.categoryType = "Nan";
  }

  changeSelect(name) {
    this.chartDataDisplay = this.dataService.verticalBarData[name];
  }

  changeSelectArea() {
    this.stackVertService.changeDataForArea(this.stackVertDataOptions.find(x => x.name == this.dataDisplayArea.name));
  }

  onChange(ev) {
    this.selectedItem = this.items[ev.target.options.selectedIndex];
    this.chartDataDisplay = this.dataService.verticalBarData[this.selectedItem.value];
  }
}
