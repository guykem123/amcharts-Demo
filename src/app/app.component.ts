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
  dataDispaly;
  constructor(private stackVertService: StackVertDataService) {
    // this.stackVertDataOptions = this.stackVertService.getAllDataOptions()
    // this.dataDispaly = this.stackVertDataOptions[0]
  }
  ngOnInit(): void {
    
    this.stackVertDataOptions = this.stackVertService.getAllDataOptions()
    this.dataDispaly = {...this.stackVertDataOptions[0]}
  }
  changeSelect(){
    this.stackVertService.changeDataForVert(this.stackVertDataOptions.find(x=>x.name == this.dataDispaly.name))
  }
}
