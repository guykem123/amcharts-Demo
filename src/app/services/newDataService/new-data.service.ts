import { Injectable } from '@angular/core';
import { ChartTypeEnum } from 'src/app/shared/chart/models/ChartTypeEnum';
import { XYChartsDisplayData } from 'src/app/shared/chart/models/XYChartsDisplayData';
import { ChartService } from 'src/app/shared/chart/services/chartService/chart.service';
import { DataService } from '../dataService/data.service';

@Injectable({
  providedIn: 'root'
})
export class NewDataService {
  verticalBarData: {
    Projects: XYChartsDisplayData,
    Services: XYChartsDisplayData,
    Locations: XYChartsDisplayData,
  };
  constructor(private chartService: ChartService,
    private dataService: DataService) {
    this.verticalBarData = {
      Projects: this.projectDataVert,
      Services: this.serviceDataVert,
      Locations: this.locationDataVert,
    };
  }

  get projectDataVert() {
    const displayData = this.chartService.getChartDisplayData(ChartTypeEnum.STACKED_VERTICAL_BAR);
    displayData.data = this.dataService.generateProjectData();
    displayData.metadata.categoryAxisKey = 'year';
    displayData.metadata.seriesMetadata = [
      { key: "Project A", title: "Project A" },
      { key: "Project B", title: "Project B" },
      { key: "Project C", title: "Project C" },
      { key: "Negative", title: "Negative" },
    ];
    return displayData;
  }

  get serviceDataVert() {
    const displayData = this.chartService.getChartDisplayData(ChartTypeEnum.VERTICAL_BAR);
    displayData.data = this.dataService.generateServiceData();
    displayData.metadata.categoryAxisKey = 'year';
    displayData.metadata.seriesMetadata = [
      { key: "Service A", title: "Service A" },
      { key: "Service B", title: "Service B" },
    ];
    return displayData;
  }

  get locationDataVert() {
    const displayData = this.chartService.getChartDisplayData(ChartTypeEnum.VERTICAL_BAR);
    displayData.data = this.dataService.generateLocationData();
    displayData.metadata.categoryAxisKey = 'Month';
    displayData.metadata.seriesMetadata = [
      { key: "USA", title: "USA" },
      { key: "ISRAEL", title: "ISRAEL" },
      { key: "GERMANY", title: "GERMANY" },
      { key: "RUSSIA", title: "RUSSIA" },
      { key: "SPAIN", title: "SPAIN" },
      { key: "ITALY", title: "ITALY" },
    ];
    return displayData;
  }
}
