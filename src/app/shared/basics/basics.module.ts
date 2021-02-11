import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingDataComponent } from './loading-data/loading-data.component';
import { DataNotAvailableComponent } from './data-not-available/data-not-available.component';
import { FormsModule } from '@angular/forms';
import { MenuSelectorComponent } from './menu-selector/menu-selector.component';


@NgModule({
  declarations: [
    LoadingDataComponent,
    DataNotAvailableComponent,
    MenuSelectorComponent,
  ],
  exports: [
    LoadingDataComponent,
    DataNotAvailableComponent,
    MenuSelectorComponent,
    CommonModule,
    FormsModule
  ],
  imports: [
    CommonModule,
  ],
})
export class BasicModule { }
