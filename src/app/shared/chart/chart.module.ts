import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalBarComponent } from './components/vertical-bar/vertical-bar.component';
import { LineComponent } from './components/line/line.component';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';
import { HorizontalBarComponent } from './components/horizontal-bar/horizontal-bar.component';
import { AreaComponent } from './components/area/area.component';
import { LegendComponent } from './components/legend/legend.component';
import { LegendMarkerComponent } from './components/legend/component/legend-marker/legend-marker.component';
import { BasicModule } from '../basics/basics.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';


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
  exports: [
    LegendComponent,
    LegendMarkerComponent,
    VerticalBarComponent,
    LineComponent,
    PivotTableComponent,
    HorizontalBarComponent,
    AreaComponent,
    BasicModule
  ],
  imports: [
    BasicModule,
    NzDividerModule,
  ]
})
export class ChartModule { }
