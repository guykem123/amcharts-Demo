import { NgModule } from "@angular/core";
import { ChartModule } from "../chart/chart.module";
import { InsightComponent } from "./components/insight/insight.component";


@NgModule({
  declarations: [
    InsightComponent,
  ],
  entryComponents: [
    InsightComponent,
  ],
  exports: [
    InsightComponent,
    ChartModule
  ],
  imports: [
    ChartModule
  ],
  providers: [
  ]
})
export class WidgetsModule { }
