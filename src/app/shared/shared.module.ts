import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NzModule } from "./nzModule/nz.module";
import { WidgetsModule } from "./widgets/widgets.module";


@NgModule({
  declarations: [
  ],
  imports: [
    ReactiveFormsModule,
    WidgetsModule,
    NzModule
  ],
  exports: [
    WidgetsModule,
  ]
})
export class SharedModule { }
