import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FirstGraphComponent } from './group-bar-chart/first-graph.component';
import { StackAreaChartComponent } from './stack-area-chart/stack-area-chart.component';
import { StackVertChartComponent } from './stack-vert-chart/stack-vert-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstGraphComponent,
    StackAreaChartComponent,
    StackVertChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
