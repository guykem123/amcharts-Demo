import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BasicModule } from "../basics/basics.module";
import { ChartModule } from "../chart/chart.module";
import { InsightComponent } from "./components/insight/insight.component";




@NgModule({
  declarations: [
    InsightComponent,
  ],
  exports: [
    InsightComponent,
    ChartModule,
  ],
  imports: [
    ChartModule,
  ],
  providers: [
  ]
})
export class WidgetsModule { }
