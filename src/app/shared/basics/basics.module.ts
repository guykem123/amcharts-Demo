import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDataComponent } from './loading-data/loading-data.component';
import { DataNotAvailableComponent } from './data-not-available/data-not-available.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoadingDataComponent,
    DataNotAvailableComponent,
  ],
  exports: [
    LoadingDataComponent,
    DataNotAvailableComponent,
    CommonModule, 
    FormsModule
  ],
  imports: [
    CommonModule,
  ],
})
export class BasicModule { }
