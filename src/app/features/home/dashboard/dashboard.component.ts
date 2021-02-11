import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { DashboardControlDTO } from "./models/DashboardControlDTO";
import { DashboardRangeSelection } from "./models/DashboardRangeSelection";
import { DashboardContentTypeEnum } from "./models/enum/DashboardContentTypeEnum";


const dashboardDto = {
  id: 1,
  externalId: "8626735d-7975-41fb-a31c-b8f0702915c9",
  title: "GCP Account",
  platform: "GCP",
  settings: "{}",
  userId: null,
  customerId: null,
  accountId: null,
  resellerId: null,
  dashboardControls: [
    {
      "id": 100,
      "title": "Total Spend",
      "showTitle": true,
      "controlWidth": 1,
      "controlHeight": 1,
      "horizontalPosition": 1,
      "verticalPosition": 1,
      "contentType": "TOTAL_SPEND",
      "contentId": 1,
      "dashboardId": 1,
      "parentControlId": null
    },
    {
      "id": 101,
      "title": "Min & Max Cost",
      "showTitle": true,
      "controlWidth": null,
      "controlHeight": null,
      "horizontalPosition": 2,
      "verticalPosition": 1,
      "contentType": "COST_DETAIL",
      "contentId": 2,
      "dashboardId": 1,
      "parentControlId": null
    },
    {
      "id": 102,
      "title": "Projection",
      "showTitle": true,
      "controlWidth": null,
      "controlHeight": null,
      "horizontalPosition": 3,
      "verticalPosition": 1,
      "contentType": "COST_PROJECTION",
      "contentId": 3,
      "dashboardId": 1,
      "parentControlId": null
    },
    {
      "id": 103,
      "title": "Budget",
      "showTitle": true,
      "controlWidth": null,
      "controlHeight": null,
      "horizontalPosition": 4,
      "verticalPosition": 1,
      "contentType": "BUDGET",
      "contentId": 4,
      "dashboardId": 1,
      "parentControlId": null
    },
    {
      "id": 105,
      "title": "Top Locations",
      "showTitle": true,
      "controlWidth": 2,
      "controlHeight": 1,
      "horizontalPosition": 3,
      "verticalPosition": 2,
      "contentType": "INSIGHT",
      "contentId": 6,
      "dashboardId": 1,
      "parentControlId": null
    },
    {
      "id": 104,
      "title": "Cost of Project By Day of Month",
      "showTitle": false,
      "controlWidth": 2,
      "controlHeight": 1,
      "horizontalPosition": 1,
      "verticalPosition": 2,
      "contentType": "INSIGHT",
      "contentId": 5,
      "dashboardId": 1,
      "parentControlId": null
    },


  ]
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardControls: DashboardControlDTO[];
  dateRangeOptions: { title: string, children: any[]; }[];
  currentRangeOptions: DashboardRangeSelection[];
  lastRangeOptions: DashboardRangeSelection[];
  currentRangeSelect: DashboardRangeSelection;
  scopeFilterOpenState: boolean = false;
  currentSelectedScope$: Observable<string>;
  subscription: Subscription;
  isDashboardReady: boolean;
  constructor(

  ) {
   
  }

  ngOnDestroy(): void {
    this.dashboardControls = undefined;
  }


  async ngOnInit() {
    if (dashboardDto) {
      this.dashboardControls = dashboardDto.dashboardControls.map(c => ({
        ...c,
        isInsight: c.contentType == DashboardContentTypeEnum.INSIGHT
      }));
    }
  }

}
