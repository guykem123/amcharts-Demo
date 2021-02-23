import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from './widgets/widgets.module';

@NgModule({
  declarations: [
  ],
  imports: [
    ReactiveFormsModule,
    WidgetsModule,
  ],
  exports: [
    WidgetsModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class SharedModule { }
