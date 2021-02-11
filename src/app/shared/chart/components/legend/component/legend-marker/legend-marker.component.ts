import { XYSeries } from '@amcharts/amcharts4/charts';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-legend-marker',
  templateUrl: './legend-marker.component.html',
  styleUrls: ['./legend-marker.component.css']
})
export class LegendMarkerComponent implements OnInit {
  @Input() marker: { color: string, serie: XYSeries, name: string; };
  @Output() markerClicked: EventEmitter<{ serie: XYSeries, currentSerieShow: boolean; }> = new EventEmitter();
  currentSerieShow: boolean;

  constructor() { }

  ngOnInit(): void {
    this.currentSerieShow = true;
  }

  onSerieClicked() {
    this.markerClicked.emit({ serie: this.marker.serie, currentSerieShow: this.currentSerieShow });
    this.currentSerieShow = !this.currentSerieShow;
  }

}
