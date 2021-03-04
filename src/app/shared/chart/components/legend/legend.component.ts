import { XYSeries } from '@amcharts/amcharts4/charts';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LegendMarker } from '../../models/LegendMarker';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit, AfterViewInit {
  @ViewChild("mainContainer") mainContainer: ElementRef;
  @Input() series: LegendMarker[];
  seriesNameMinWidths: number[] = [];
  markerContentWidth: string;
  markerMaxWidth: number = 0;
  textMaxWidth: number = 0;

  constructor(
  ) { }

  ngAfterViewInit(): void {
   
  }

  ngOnInit(): void {
    if (!this.series)
      return;
    this.series.sort((a, b) => b.isLast ? -1 : 0);//this action is for setting the more option at the end 
    this.series.forEach(x => {
      let width = this.getTextWidth(x.name);
      width = width * 1.1 + 30; //with margin size and square color and little space. 10 for margin and 20 for square
      this.seriesNameMinWidths.push(width);
    });
  }

  onSerieSelected(ev: { serie: XYSeries, currentSerieShow: boolean; }) {
    if (ev.currentSerieShow) {
      ev.serie.hide();
    } else {
      ev.serie.show();
    }
  }

  getTextWidth(text: string) {

    const htmlElement = document.createElement("span");
    document.body.appendChild(htmlElement);

    htmlElement.style.fontSize = 12 + "px";
    htmlElement.style.fontWeight = "600";
    htmlElement.style.height = 'auto';
    htmlElement.style.width = 'auto';
    htmlElement.style.position = 'absolute';
    htmlElement.style.whiteSpace = 'no-wrap';
    htmlElement.innerHTML = text;
    const width = Math.ceil(htmlElement.clientWidth);
    document.body.removeChild(htmlElement);

    return width;
  }

}
