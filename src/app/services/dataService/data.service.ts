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
  data = this.generateProjectData();
  get projectsData() {
    return this.data.map(x => ({
      ...x,
      "Project Negative Values": -1 * (Math.floor(Math.random() * 3))
    })
    );
  }
  get servicesData() {
    return this.data.map(x => ({
      ...x,
      "Project Negative Value": -1 * (Math.floor(Math.random() * 3))
    })
    );
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
      "Project A": this.getRandomNumber(),
      "Project B": this.getRandomNumber(),
      "Project C": this.getRandomNumber(),
      "Negative": (Math.floor(Math.random() * -10)),
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
      "Service A": (Math.floor(Math.random() * 10)),
      "Service B": (Math.floor(Math.random() * 10)),
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

function getRandomWord() {
  let word = '';
  const chars = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * chars.length);
    word += chars[index];
  }
  return word;
}
