import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewDataService } from 'src/app/services/newDataService/new-data.service';
import { StackVertDataService } from 'src/app/services/stackVertDataService/stack-vert-data.service';
import { VerticalBarComponent } from 'src/app/shared/chart/components/vertical-bar/vertical-bar.component';
import { ChartTypeEnum } from 'src/app/shared/chart/models/ChartTypeEnum';
import { XYChartsDisplayData } from 'src/app/shared/chart/models/XYChartsDisplayData';
import { ChartService } from 'src/app/shared/chart/services/chartService/chart.service';
import { WidgetComponent } from '../../model/WidgetComponent';



@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.css']
})
export class InsightComponent implements OnInit, OnDestroy {

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
  mainSubscription: Subscription = new Subscription();
  insightDataCancelId: number;
  chartIsReady: boolean;//whether the chart as been initialized yet or not
  isApiDataHaveAnyValue: boolean;//whether the data we get from the api have values e.g.  [{totalCost:-1},{totalCost:1}] == true

  chartDivId: string;
  chartDataDisplay: XYChartsDisplayData;
  categoryType: any;
  showChartLegendDivide: boolean;

  isChartPickOpen: boolean;


  stackVertDataOptions;
  dataDisplay;
  dataDisplayArea;

  currentComponentType: ChartTypeEnum;

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

    this.currentComponentType = ChartTypeEnum.STACKED_VERTICAL_BAR;

    this.chartId = "firstChart";
    this.chartDivId = "chartdivid";
    this.stackVertDataOptions = this.stackVertService.getAllDataOptions().map(data => ({ ...data }));
    this.dataDisplay = { ...this.stackVertDataOptions[0] };
    this.dataDisplayArea = { ...this.stackVertDataOptions[0] };
    this.chartDataDisplay = this.dataService.verticalBarData.Projects;
    this.categoryType = "Nan";
  }

  changeIsChartPickOpenState() {
    this.isChartPickOpen = !this.isChartPickOpen;
  }

  ngOnDestroy(): void {
    this.mainSubscription.unsubscribe();
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
    this.setComponent(this.chartService.getComponent(this.currentComponentType), this.chartDataDisplay);
  }


  changeSelect(name) {
    this.chartDataDisplay = this.dataService.verticalBarData[name];
    this.setInsight();
  }

  resetChartType(type) {
    this.isChartPickOpen = false;
    this.currentComponentType = type;
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
    this.mainSubscription.add(this.chartComponentInstance.chartReady.subscribe(res => {
      this.chartIsReady = true;
    }));
    this.mainSubscription.add(this.chartComponentInstance.chartCategoryExpend?.subscribe(isChartNeedExpend => {
      this.isChartNeedExpend = isChartNeedExpend;
    }));
  }
}
