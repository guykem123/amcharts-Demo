import { XYSeries } from '@amcharts/amcharts4/charts';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LegendMarker } from '../../../models/LegendMarker';

@Component({
  selector: 'app-legend-marker',
  templateUrl: './legend-marker.component.html',
  styleUrls: ['./legend-marker.component.css']
})
export class LegendMarkerComponent implements OnInit, OnChanges {
  @Input() marker: LegendMarker;
  @Input() markerMaxWidth: number;
  @Input() textMaxWidth: number;
  @Output() markerClicked: EventEmitter<{ serie: XYSeries, currentSerieShow: boolean; }> = new EventEmitter();
  currentSerieShow: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const change: any = changes;
    if (change.markerMaxWidth && change.textMaxWidth) {
      this.markerMaxWidth = change.markerMaxWidth.currentValue;
      this.textMaxWidth = change.textMaxWidth.currentValue;
    }
  }

  ngOnInit(): void {
    this.currentSerieShow = true;
    this.markerMaxWidth = this.markerMaxWidth ? this.markerMaxWidth : undefined;
    this.textMaxWidth = this.textMaxWidth ? this.markerMaxWidth : undefined;//in case of 0
  }

  onSerieClicked() {
    this.markerClicked.emit({ serie: this.marker.serie, currentSerieShow: this.currentSerieShow });
    this.currentSerieShow = !this.currentSerieShow;
  }

}
