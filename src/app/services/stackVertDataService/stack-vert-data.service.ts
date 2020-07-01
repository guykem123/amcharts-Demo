import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../dataService/data.service';

@Injectable({
  providedIn: 'root'
})
export class StackVertDataService {
  changeDataForVert(dataDispaly: any) {
    this.selectedData.next(dataDispaly)
  }

  projects: { name: string, data: any[], display: { yAxis: string, xAxis: string[] } }
  services: { name: string, data: any[], display: { yAxis: string, xAxis: string[] } }
  locations: { name: string, data: any[], display: { yAxis: string, xAxis: string[] } }
  selectedData: BehaviorSubject<{ name: string, data: any[] }>
  constructor(private dataService: DataService) {
    this.projects = {
      name: "Projects",
      data: dataService.projectsData,
      display: {
        yAxis: Object.keys(dataService.projectsData[0]).find(x => !x.includes("Project")),
        xAxis: Object.keys(dataService.projectsData[0]).filter(x => x.includes("Project")),
      }
    }
    this.services = {
      name: "Services",
      data: dataService.servicesData,
      display: {
        yAxis: Object.keys(dataService.servicesData[0]).find(x => !x.includes("Service")),
        xAxis: Object.keys(dataService.servicesData[0]).filter(x => x.includes("Service")),
      }
    }
    this.locations = {
      name: "Locations",
      data: dataService.locationData,
      display: {
        yAxis: "Month",
        xAxis: Object.keys(dataService.locationData[0]).filter(x => !x.includes("Month")),
      }
    }
    this.selectedData = new BehaviorSubject<{ name: string, data: any[] }>(this.projects)
  }

  getAllDataOptions() {
    return [
      this.projects,
      this.services,
      this.locations,
    ]
  }
}
