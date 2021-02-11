import { XYSeries } from '@amcharts/amcharts4/charts';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Input() series: { color: string, serie: XYSeries, name: string; }[];

  constructor() { }

  ngOnInit(): void {
  }

  onSerieSelected(ev: { serie: XYSeries, currentSerieShow: boolean; }) {
    if (ev.currentSerieShow) {
      ev.serie.hide();
    } else {
      ev.serie.show();
    }
  }

}
