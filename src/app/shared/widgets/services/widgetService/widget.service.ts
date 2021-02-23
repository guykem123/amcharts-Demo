import { Injectable } from '@angular/core';
import { InsightComponent } from '../../components/insight/insight.component';
import { BudgetComponent } from '../../components/budget/budget.component';
import { CostDetailComponent } from '../../components/cost-detail/cost-detail.component';
import { CostProjectionComponent } from '../../components/cost-projection/cost-projection.component';
import { TotalSpendComponent } from '../../components/total-spend/total-spend.component';
import { DashboardContentTypeEnum } from 'src/app/features/home/dashboard/models/enum/DashboardContentTypeEnum';


@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  chartComponents: { [widgetType: string]: any }//dictionary for the widget component select- used for choosing the right component to initialize

  constructor() {
    this.setChartComponentsProp();
  }

  private setChartComponentsProp() {
    this.chartComponents = {}
    this.chartComponents[DashboardContentTypeEnum.INSIGHT] = InsightComponent;
    this.chartComponents[DashboardContentTypeEnum.BUDGET] = BudgetComponent;
    this.chartComponents[DashboardContentTypeEnum.COST_DETAIL] = CostDetailComponent;
    this.chartComponents[DashboardContentTypeEnum.COST_PROJECTION] = CostProjectionComponent;
    this.chartComponents[DashboardContentTypeEnum.TOTAL_SPEND] = TotalSpendComponent;
  }

  getComponent(type: DashboardContentTypeEnum): any {
    return this.chartComponents[type]
  }

}