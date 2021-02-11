import { Injectable } from '@angular/core';
import { InsightComponent } from '../../components/insight/insight.component';

import { DashboardContentTypeEnum } from 'src/app/features/home/dashboard/models/enum/DashboardContentTypeEnum';


@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  chartComponents: { [widgetType: string]: any; };//dictionary for the widget component select- used for choosing the right component to initialize

  constructor() {
    this.setChartComponentsProp();
  }

  private setChartComponentsProp() {
    this.chartComponents = {};
    this.chartComponents[DashboardContentTypeEnum.INSIGHT] = InsightComponent;
  }

  getComponent(type: DashboardContentTypeEnum): any {
    return this.chartComponents[type];
  }

}