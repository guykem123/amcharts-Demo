import { Injectable } from '@angular/core';

interface ProjectData {
  "year": string,
  [projectName: string]: number | string;
}

interface ServiceData {
  "year": string,
  [serviceName: string]: number | string;
}


interface LocationData {
  "Month": string,
  "USA": number,
  "ISRAEL": number,
  "GERMANY": number,
  "RUSSIA": number,
  "SPAIN": number,
  "ITALY": number,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  get projectsData() {
    return this.generateProjectData();
  }
  get servicesData() {
    return this.generateServiceData();
  }
  get locationData() {
    return this.generateLocationData();
  }
  constructor() { }

  generateProjectData(): ProjectData[] {
    const years = this.getYears();
    const data: ProjectData[] = years.map(year => this.getProjectData(year));
    return data;
  };

  generateServiceData(): ServiceData[] {
    const years = this.getYears();
    const data: ServiceData[] = years.map(year => this.getServiceData(year));
    return data;
  };

  generateLocationData(): LocationData[] {
    const months = this.getMonths();
    const data: LocationData[] = months.map(m => this.getLocationData(m));
    return data;
  };
  private getProjectData(year: string): ProjectData {
    return ({
      year,
      "Project Small Data": (Math.floor(Math.random() * 3)),
      "Project Large Data": this.getRandomNumber(),
    });
  }

  private getLocationData(month: string): LocationData {
    return ({
      "Month": month,
      "USA": this.getRandomNumber(),
      "ISRAEL": this.getRandomNumber(),
      "GERMANY": this.getRandomNumber(),
      "RUSSIA": this.getRandomNumber(),
      "SPAIN": this.getRandomNumber(),
      "ITALY": this.getRandomNumber(),
    });
  }

  private getServiceData(year: string): ServiceData {
    return ({
      year,
      "Project Small Data": (Math.floor(Math.random() * 10)),
      "Project Also Small Data": (Math.floor(Math.random() * 10)),
    });
  }

  private getMonths() {
    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return mS;
  }

  private getYears() {
    const years = ["1985"];
    for (let i = 1; i < 30; i++) {
      if (!Math.floor(Math.random() * 5))
        continue;
      const element = years[0];
      const year = parseInt(element) + i;
      years.push(year.toString());
    }
    return years;
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 30000 + 20000);
  }
}
