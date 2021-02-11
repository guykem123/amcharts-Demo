import { Component, OnInit, OnDestroy, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { Subscription } from "rxjs";
import { WidgetComponent } from "src/app/shared/widgets/model/WidgetComponent";
import { WidgetService } from "src/app/shared/widgets/services/widgetService/widget.service";
import { DashboardControlDTO } from "../../models/DashboardControlDTO";
import { DashboardControlMetadata } from "../../models/DashboardControlMetadata";
import { DashboardContentTypeEnum } from "../../models/enum/DashboardContentTypeEnum";



@Component({
  selector: 'dashboard-control-content',
  templateUrl: './dashboard-control-content.component.html',
  styleUrls: ['./dashboard-control-content.component.css']
})
export class DashboardControlContentComponent implements OnInit, OnDestroy {
  @Input() control: DashboardControlDTO;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  metadata: DashboardControlMetadata;
  widgetInstance: WidgetComponent;
  dateRange: { current: Date[]; previous: Date[]; };
  dateChangeSubscription: Subscription;
  constructor(
    private widgetService: WidgetService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnDestroy(): void {
    this.dateChangeSubscription?.unsubscribe();
    this.container?.clear();
    this.widgetInstance = undefined;
  }

  private setDateRangeToInsightBody(dateRange: { current: Date[]; previous: Date[]; }) {
  }

  async ngOnInit() {
    this.setDateRangeToInsightBody(this.dateRange);
    const widgetComponent = this.widgetService.getComponent(DashboardContentTypeEnum.INSIGHT);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(widgetComponent);
    this.widgetInstance = <WidgetComponent>this.container.createComponent(componentFactory).instance;
  }


}