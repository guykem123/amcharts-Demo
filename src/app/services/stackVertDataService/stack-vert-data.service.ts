import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../dataService/data.service';
export interface DataForStackVertBar {
  name: string,
  data: any[],
  display: { yAxis: string, xAxis: string[] }
}

@Injectable({
  providedIn: 'root'
})
export class StackVertDataService {
  changeDataForVert(dataDispaly: any) {
    this.selectedData.next(dataDispaly)
  }

  projects: DataForStackVertBar
  services: DataForStackVertBar
  locations: DataForStackVertBar
  selectedData: BehaviorSubject<DataForStackVertBar>
  constructor(private dataService: DataService) {
    this.projects = {
      name: "Projects",
      data: this.dataService.projectsData.map(obj => {
        const values = Object.values(obj)
        let total = 0
        values.forEach(element => {
          if (element && typeof (element) == "number") {
            total += element
          }
        });
        return { ...obj, total }
      }),
      display: {
        yAxis: Object.keys(dataService.projectsData[0]).find(x => !x.includes("Project")),
        xAxis: Object.keys(dataService.projectsData[0]).filter(x => x.includes("Project")),
      }
    }
    this.services = {
      name: "Services",
      data: this.dataService.servicesData.map(obj => {
        const values = Object.values(obj)
        let total = 0
        values.forEach(element => {
          if (element && typeof (element) == "number") {
            total += element
          }
        });
        return { ...obj, total }
      }),
      display: {
        yAxis: Object.keys(dataService.servicesData[0]).find(x => !x.includes("Service")),
        xAxis: Object.keys(dataService.servicesData[0]).filter(x => x.includes("Service")),
      }
    }
    this.locations = {
      name: "Locations",
      data: this.dataService.locationData.map(obj => {
        const values = Object.values(obj)
        let total = 0
        values.forEach(element => {
          if (element && typeof (element) == "number") {
            total += element
          }
        });
        return { ...obj, total }
      }),
      display: {
        yAxis: "Month",
        xAxis: Object.keys(dataService.locationData[0]).filter(x => !x.includes("Month")),
      }
    }
    this.selectedData = new BehaviorSubject<DataForStackVertBar>(this.projects)
  }

  getAllDataOptions() {
    return [
      this.projects,
      this.services,
      this.locations,
    ]
  }
}
