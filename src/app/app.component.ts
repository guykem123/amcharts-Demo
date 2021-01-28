import { Component, OnInit } from '@angular/core';
import { StackVertDataService } from './services/stackVertDataService/stack-vert-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AmChartDemo';
  stackVertDataOptions;
  dataDisplay;
  dataDisplayArea;
  constructor(private stackVertService: StackVertDataService) {

  }
  ngOnInit(): void {
    this.stackVertDataOptions = this.stackVertService.getAllDataOptions();
    this.dataDisplay = { ...this.stackVertDataOptions[0] };
    this.dataDisplayArea = { ...this.stackVertDataOptions[0] };
  }
  changeSelect() {
    this.stackVertService.changeDataForVert(this.stackVertDataOptions.find(x => x.name == this.dataDisplay.name));
  }

  changeSelectArea() {
    this.stackVertService.changeDataForArea(this.stackVertDataOptions.find(x => x.name == this.dataDisplayArea.name));
  }
}
