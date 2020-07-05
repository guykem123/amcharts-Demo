import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  projectsData: any[] = [
    {
      "year": "1990",
      "Project A": 19892,
      "Project B": 19892,
      "Project C": 44655,
      "Project D": 13922,
      "Project E": 44655,
      "Project F": 32093,
    },
    {
      "year": "2000",
      "Project A": 55352,
      "Project B": 55352,
      "Project C": 41337,
      "Project D": 32093,
      "Project E": 41337,
      "Project F": 32093,
    },
    {
      "year": "2010",
      "Project A": 59771,
      "Project B": 59771,
      "Project C": 17345,
      "Project D": 52122,
      "Project E": 17345,
      "Project F": 52122,
    }
  ]
  servicesData: any[] = [
    {
      "year": "1990",
      "Service A": 1000,
      "Service B": 2000,
      "Service C": 3000,
      "Service D": 2500,
      "Service E": 3500,
      "Service F": 4000,
    },
    {
      "year": "2000",
      "Service A": 2000,
      "Service B": 2500,
      "Service C": 3000,
      "Service D": 2500,
      "Service E": 4000,
      "Service F": 2000,
    },
    {
      "year": "2010",
      "Service A": 1000,
      "Service B": 2000,
      "Service C": 3000,
      "Service D": 4000,
      "Service E": 2000,
      "Service F": 3000,
    }
  ]
  locationData: any[] = [
    {
      "Month": "April",
      "USA": 1992,
      "ISRAEL": 1989,
      "GERMANY": 4655,
      "RUSSIA": 1922,
      "SPAIN": 7465,
      "ITALY": 132,
    },
    {
      "Month": "May",
      "USA": 5532,
      "ISRAEL": 5352,
      "GERMANY": 4337,
      "RUSSIA": 3203,
      "SPAIN": 4137,
      "ITALY": 3093,
    },
    {
      "Month": "June",
      "USA": 5977,
      "ISRAEL": 5771,
      "GERMANY": 1734,
      "RUSSIA": 2192,
      "SPAIN": 1735,
      "ITALY": 2122,
    }
  ]
  constructor() { }
}
