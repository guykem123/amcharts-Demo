import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewDataService } from 'src/app/services/newDataService/new-data.service';
import { StackVertDataService } from 'src/app/services/stackVertDataService/stack-vert-data.service';
import { VerticalBarComponent } from 'src/app/shared/chart/components/vertical-bar/vertical-bar.component';
import { ChartTypeEnum } from 'src/app/shared/chart/models/ChartTypeEnum';
import { XYChartsDisplayData } from 'src/app/shared/chart/models/XYChartsDisplayData';
import { ChartService } from 'src/app/shared/chart/services/chartService/chart.service';
import { WidgetComponent } from '../../model/WidgetComponent';

let index = 0;

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
  metadata: any;
  chartDivId: string;
  chartDataDisplay: XYChartsDisplayData;
  categoryType: any;
  showChartLegendDivide: boolean;

  isChartPickOpen: boolean;

  items = [{ name: 'set 1', value: "Projects" }, { name: 'set 2', value: "Services" }, { name: 'set 3', value: "Locations" }];
  selectedItem: any = this.items[0];

  types = [{ name: 'line', value: ChartTypeEnum.LINE }, { name: 'vertical', value: ChartTypeEnum.STACKED_VERTICAL_BAR }];
  selectedType: any = this.types[0];


  stackVertDataOptions;
  dataDisplay;
  dataDisplayArea;

  currentComponentType: ChartTypeEnum;

  chartTypesOptions: { name: string; }[];
  selectedChartTypeOption: { name: ChartTypeEnum; };

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
      { type: ChartTypeEnum.HORIZONTAL_BAR, icon: "icon-line-chart" },
      // { type: ChartTypeEnum.PIE, icon: "icon-pie-chart" }, 
    ];

    this.chartTypesOptions = this.chartTypes.map(x => ({ name: x.type }));



    this.chartId = "firstChart";
    this.chartDivId = "chartdivid";
    this.stackVertDataOptions = this.stackVertService.getAllDataOptions().map(data => ({ ...data }));
    this.dataDisplay = { ...this.stackVertDataOptions[0] };
    this.dataDisplayArea = { ...this.stackVertDataOptions[0] };
    this.chartDataDisplay = this.dataService.verticalBarData.Projects;
    this.categoryType = "Nan";
    this.selectedChartType = this.chartTypes[index].type;
    this.selectedChartTypeOption = { name: this.chartTypes[index].type };
    this.currentComponentType = this.chartTypes[index].type;
    this.metadata = {};
    index += 1;
  }

  changeSelectChartType(name: ChartTypeEnum) {
    this.selectedChartType = name;
    this.currentComponentType = this.selectedChartType;
    this.destroyChartComponent();
    this.setInsight();
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

  onChange(ev) {
    this.selectedItem = this.items[ev.target.options.selectedIndex];
    this.chartDataDisplay = this.dataService.verticalBarData[this.selectedItem.value];
  }

  selectChartType(ev) {
    // const type = this.types[ev.target.options.selectedIndex].value;
    // this.charts[index]?.dispose();
    // switch (type) {
    //   case "line":
    //     this.createLineChart(index);
    //     break;
    //   case "vert":
    //     this.createVertChart(index);
    //     break;

    //   default:
    //     break;
    // }
  }
  async ngOnInit() {
    await this.setInsight();
  }

  private async setInsight() {
    this.setComponent(this.chartService.getComponent(this.currentComponentType), this.chartDataDisplay);
  }

  get isLine() {
    return this.selectedChartType === ChartTypeEnum.LINE;
  }

  get isHorizontalBar() {
    return this.selectedChartType === ChartTypeEnum.HORIZONTAL_BAR;
  }

  get isVerticalBar() {
    return this.selectedChartType === ChartTypeEnum.STACKED_VERTICAL_BAR || this.selectedChartType === ChartTypeEnum.VERTICAL_BAR;
  }

  get isArea() {
    return this.selectedChartType === ChartTypeEnum.AREA;
  }

  changeSelect(name) {
    this.chartDataDisplay = this.dataService.verticalBarData[name];
    this.setInsight();
  }

  resetChartType(type) {
    this.isChartPickOpen = false;
    this.currentComponentType = type;
    this.chartComponentInstance = undefined;
    this.setInsight();
  }

  onChartExpend(ev) {
    // console.log(ev);
  }

  onChartReady(ev) {
    console.log(ev);
  }


  //finally create a new chart component with its data
  private setComponent(chartComponent: any, XYChartData: XYChartsDisplayData) {
    if (this.chartComponentInstance) {//if the chart component already exist and we need to reset the data
      this.chartComponentInstance.chartId = this.chartId;
      this.chartComponentInstance.chartDataDisplay = XYChartData;
      this.chartComponentInstance.showChartLegendDivide = true;
      this.chartComponentInstance.setChart();
      return;
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
