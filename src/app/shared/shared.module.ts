import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ChartModule } from "./chart/chart.module";


@NgModule({
  declarations: [
  ],
  imports: [
    ReactiveFormsModule,
    ChartModule,
  ],
  exports: [
    ChartModule,
  ]
})
export class SharedModule { }
