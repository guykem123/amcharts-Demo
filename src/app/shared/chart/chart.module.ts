import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { VerticalBarComponent } from './components/vertical-bar/vertical-bar.component';
import { LineComponent } from './components/line/line.component';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';
import { HorizontalBarComponent } from './components/horizontal-bar/horizontal-bar.component';
import { AreaComponent } from './components/area/area.component';
import { BasicModule } from '../basics/basics.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { LegendComponent } from './components/legend/legend.component';
import { LegendMarkerComponent } from './components/legend/legend-marker/legend-marker.component';


@NgModule({
  declarations: [
    VerticalBarComponent,
    LineComponent,
    PivotTableComponent,
    HorizontalBarComponent,
    AreaComponent,
    LegendComponent,
    LegendMarkerComponent
  ],
  entryComponents: [
    VerticalBarComponent,
    LineComponent,
    PivotTableComponent,
    HorizontalBarComponent,
    AreaComponent
  ],
  exports: [
    VerticalBarComponent,
    LineComponent,
    PivotTableComponent,
    HorizontalBarComponent,
    AreaComponent
  ],
  imports: [
    CommonModule,
    BasicModule,
    NzDividerModule,
  ],
  providers: [
    CurrencyPipe
  ]
})
export class ChartModule { }
