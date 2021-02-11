import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-data',
  templateUrl: './loading-data.component.html',
  styleUrls: ['./loading-data.component.css']
})
export class LoadingDataComponent implements OnInit {

  @Input('customText') customText: string

  constructor() { }

  ngOnInit(): void {
  }

}
