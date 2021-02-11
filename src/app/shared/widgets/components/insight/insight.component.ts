import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewDataService } from 'src/app/services/newDataService/new-data.service';
import { StackVertDataService } from 'src/app/services/stackVertDataService/stack-vert-data.service';
import { VerticalBarComponent } from 'src/app/shared/chart/components/vertical-bar/vertical-bar.component';
import { ChartTypeEnum } from 'src/app/shared/chart/models/ChartTypeEnum';
import { XYChartsDisplayData } from 'src/app/shared/chart/models/XYChartsDisplayData';
import { ChartService } from 'src/app/shared/chart/services/chartService/chart.service';
import { WidgetComponent } from '../../model/WidgetComponent';

const nameKey = "name";
const totalKey = "total";
export const numberToMonth = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "April", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };
export const numberToDay = { "1": "Sunday", "2": "Monday", "3": "Tuesday", "4": "Wednesday", "5": "Thursday", "6": "Friday", "7": "Saturday" };

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.css']
})
export class InsightComponent implements OnInit, OnDestroy, WidgetComponent {

  // @Input() isDateDiffEqual: boolean;
  chartId: string;
  // @Input() showTotal: boolean;//whether to show or not, the small containers of the total and projection cost
  // @Input() XYChartData: XYChartsDisplayData;
  // @Input() isCurrentFilterIsInvoice: boolean;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  chartComponentInstance: any;
  insightData: any;
  current: number = 0;
  prediction: number = 0;
  isShowDateDiffEqual: boolean;
  costFilters: any[];
  chartTypes: { type: ChartTypeEnum, icon: string; }[];
  selectedChartType: ChartTypeEnum;
  chartMetadataIsInvalid: boolean;
  isRendering: boolean;
  isChartNeedExpend: boolean;
  // mainSubscription: Subscription = new Subscription();
  insightDataCancelId: number;
  chartIsReady: boolean;//whether the chart as been initialized yet or not
  isApiDataHaveAnyValue: boolean;//whether the data we get from the api have values e.g.  [{totalCost:-1},{totalCost:1}] == true

  chartDivId: string;
  chartDataDisplay: XYChartsDisplayData;
  categoryType: any;
  showChartLegendDivide: boolean;

  stackVertDataOptions;
  dataDisplay;
  dataDisplayArea;

  constructor(
    private chartService: ChartService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private stackVertService: StackVertDataService,
    private dataService: NewDataService
  ) {
    this.chartTypes = [
      { type: ChartTypeEnum.AREA, icon: "icon-area-chart" },
      { type: ChartTypeEnum.STACKED_VERTICAL_BAR, icon: "icon-vertical-chart" },
      { type: ChartTypeEnum.LINE, icon: "icon-line-chart" },
      // { type: ChartTypeEnum.PIE, icon: "icon-pie-chart" }, 
    ];

    this.chartId = "firstChart";
    this.chartDivId = "chartdivid";
    this.stackVertDataOptions = this.stackVertService.getAllDataOptions().map(data => ({ ...data }));
    this.dataDisplay = { ...this.stackVertDataOptions[0] };
    this.dataDisplayArea = { ...this.stackVertDataOptions[0] };
    this.chartDataDisplay = this.dataService.verticalBarData.Projects;
    this.categoryType = "Nan";
  }

  ngOnDestroy(): void {
    // this.mainSubscription.unsubscribe();
    this.destroyChartComponent();
  };

  resetWidgetData() {

  }

  private destroyChartComponent() {
    this.chartIsReady = false;
    this.chartComponentInstance = undefined;
    this.container.clear();
  }

  async ngOnInit() {
    await this.setInsight();
  }

  private async setInsight() {
    this.setComponent(this.chartService.getComponent(ChartTypeEnum.STACKED_VERTICAL_BAR), this.chartDataDisplay);
  }


  changeSelect() {
    this.chartDataDisplay = this.dataService.verticalBarData[this.dataDisplay.name];
    this.setInsight();
  }


  //finally create a new chart component with its data
  private setComponent(chartComponent: any, XYChartData: XYChartsDisplayData) {
    if (this.chartComponentInstance) {//if the chart component already exist and we need to reset the data
      this.destroyChartComponent();
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(chartComponent);
    this.chartComponentInstance = this.container.createComponent<any>(componentFactory).instance;
    this.chartComponentInstance.chartId = this.chartId;
    this.chartComponentInstance.chartDataDisplay = XYChartData;
    this.chartComponentInstance.showChartLegendDivide = true;
    this.chartComponentInstance.categoryType = '';
  }
}
