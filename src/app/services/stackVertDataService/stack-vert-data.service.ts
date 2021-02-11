import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../dataService/data.service';
export interface DataForStackVertBar {
  name: string,
  data: any[],
  display: { yAxis: string, xAxis: string[]; };
}

@Injectable({
  providedIn: 'root'
})
export class StackVertDataService {
  
  changeDataForVert(dataDisplay: any) {
    this.selectedData.next({ ...dataDisplay, data: this.getDataByName(dataDisplay.name) });
  }

  changeDataForArea(dataDisplay: any) {
    this.selectedDataArea.next({ ...dataDisplay, data: this.getDataByName(dataDisplay.name) });
  }
  getDataByName(name: any): any[] {
    switch (name) {
      case "Projects":
        return this.dataService.projectsData;
      case "Services":
        return this.dataService.projectsData;
      case "Locations":
        return this.dataService.projectsData;
    }
  }

  projects: DataForStackVertBar;
  services: DataForStackVertBar;
  locations: DataForStackVertBar;
  selectedData: BehaviorSubject<DataForStackVertBar>;
  selectedDataArea: BehaviorSubject<DataForStackVertBar>;
  selectedDataLine: BehaviorSubject<DataForStackVertBar>;
  selectedDataService: BehaviorSubject<DataForStackVertBar>;
  constructor(private dataService: DataService) {
    this.projects = {
      name: "Projects",
      data: this.dataService.projectsData,
      display: {
        yAxis: Object.keys(dataService.projectsData[0]).find(x => !x.includes("Project")),
        xAxis: Object.keys(dataService.projectsData[0]).filter(x => x.includes("Project")),
      }
    };
    this.services = {
      name: "Services",
      data: this.dataService.servicesData,
      display: {
        yAxis: Object.keys(dataService.servicesData[0]).find(x => !x.includes("Project")),
        xAxis: Object.keys(dataService.servicesData[0]).filter(x => x.includes("Project")),
      }
    };
    this.locations = {
      name: "Locations",
      data: this.dataService.locationData,
      display: {
        yAxis: "Month",
        xAxis: Object.keys(dataService.locationData[0]).filter(x => !x.includes("Month")),
      }
    };
    this.selectedDataService = new BehaviorSubject<DataForStackVertBar>(this.services);
    this.selectedData = new BehaviorSubject<DataForStackVertBar>(this.projects);
    this.selectedDataArea = new BehaviorSubject<DataForStackVertBar>(this.projects);
  }

  getAllDataOptions() {
    return [
      this.projects,
      this.services,
      this.locations,
    ];
  }
}
