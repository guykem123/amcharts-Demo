import { Injectable } from '@angular/core';
import { XYChartsDisplayData } from 'src/app/shared/chart/models/XYChartsDisplayData';
import { VerticalBarComponent } from 'src/app/shared/chart/components/vertical-bar/vertical-bar.component';
import { LineComponent } from 'src/app/shared/chart/components/line/line.component';
import { HorizontalBarComponent } from 'src/app/shared/chart/components/horizontal-bar/horizontal-bar.component';
import { AreaComponent } from 'src/app/shared/chart/components/area/area.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorDetail } from '../../models/ColorDetail';
import { color as createColor, DateFormatter, color, Color, addLicense, options, create, percent, Container } from '@amcharts/amcharts4/core';
import { SerieMetadata } from '../../models/SerieMetadata';
import { DateAxis } from '@amcharts/amcharts4/.internal/charts/axes/DateAxis';
import { Legend, XYChart } from '@amcharts/amcharts4/charts';
import { ChartTypeEnum } from '../../models/ChartTypeEnum';
import { CurrencyPipe } from '@angular/common';

type PdfCreationFunction = (callback: (legendImg: any, chartImg: any) => any, exportName?: string) => void;
const colors = [
  {
    "name": "Grey",
    "color": "#b5b0b0",
    "priority": 1,
    "intend": "More",
    "intendContain": "More"
  },
  {
    "name": "Amazing Blue",
    "color": "#1E6EE5",
    "priority": 1,
    "intend": "Current"
  },
  {
    "name": "Amazing Blue Light",
    "color": "#ADDCF4",
    "priority": 1,
    "intend": "Previous"
  },
  {
    "name": "Spectacular Gold",
    "color": "#ECDA7C",
    "priority": 1,
    "intend": "Projection"
  },
  {
    "name": "Dust Red",
    "color": "#f74e57",
    "priority": 2,
    "intend": ""
  },
  {
    "name": "Volcano",
    "color": "#fb7649",
    "priority": 3,
    "intend": ""
  },
  {
    "name": "Sunset Orange",
    "color": "#fbbd43",
    "priority": 4,
    "intend": ""
  },
  {
    "name": "Poler Green",
    "color": "#75d048",
    "priority": 5,
    "intend": ""
  },
  {
    "name": "Cyan",
    "color": "#42cece",
    "priority": 6,
    "intend": ""
  },
  {
    "name": "Daybreak Blue",
    "color": "#46a6ff",
    "priority": 7,
    "intend": ""
  },
  {
    "name": "Geek Blue",
    "color": "#5976ef",
    "priority": 8,
    "intend": ""
  },
  {
    "name": "Purple",
    "color": "#8e58da",
    "priority": 9,
    "intend": ""
  },
  {
    "name": "Red",
    "color": "#ff3838",
    "priority": 11,
    "intend": ""
  }
];
@Injectable({
  providedIn: 'root'
})
export class ChartService {
  chartDisplayDataDefaults: { [chartTypeEnum: string]: XYChartsDisplayData; };
  chartComponents: { [chartTypeEnum: string]: any; };
  colors: ColorDetail[];
  pdfFuncs: { [chartId: string]: PdfCreationFunction; };
  private colorSubject: BehaviorSubject<{ colors: { name: string, color: string; }[], chartId: string; }> = new BehaviorSubject(undefined);
  colorsObs: Observable<{ colors: { name: string, color: string; }[], chartId: string; }>;
  compareOptions: { value: any; compare: string; }[];
  dateFormatter: DateFormatter = new DateFormatter();
  constructor(
    private costPipe: CurrencyPipe
  ) {
    options.autoDispose = true;
    this.pdfFuncs = {};
    this.colors = colors;
    this.setChartComponentsProp();
    this.setChartDisplayDataProp();
    this.colorsObs = this.colorSubject.asObservable();
  }


  sortChartCategoryByString(a: { [key: string]: string; }, b: { [key: string]: string; }, categoryKey: string) {
    if (typeof a[categoryKey] == 'string' && typeof b[categoryKey] == 'string')
      return a[categoryKey]?.localeCompare(b[categoryKey]);
    return 0;
  }

  private setChartComponentsProp() {
    this.chartComponents = {};
    this.chartComponents[ChartTypeEnum.STACKED_VERTICAL_BAR] = VerticalBarComponent;
    this.chartComponents[ChartTypeEnum.VERTICAL_BAR] = VerticalBarComponent;
    this.chartComponents[ChartTypeEnum.LINE] = LineComponent;
    this.chartComponents[ChartTypeEnum.HORIZONTAL_BAR] = HorizontalBarComponent;
    this.chartComponents[ChartTypeEnum.AREA] = AreaComponent;
  }

  private setChartDisplayDataProp() {
    this.chartDisplayDataDefaults = {};
    this.setStackVerticalDisplay();
    this.setAreaDisplay();
    this.setHorizontalDisplay();
    this.setLineDisplay();
  }
  private setStackVerticalDisplay() {
    this.chartDisplayDataDefaults[ChartTypeEnum.STACKED_VERTICAL_BAR] = new XYChartsDisplayData();
    const stackVert = this.chartDisplayDataDefaults[ChartTypeEnum.STACKED_VERTICAL_BAR];
    stackVert.isStacked = true;
    stackVert.xAxisLineShow = true;
    stackVert.xAxisShowLabels = true;
    stackVert.yAxisShowLabels = true;
    stackVert.showSerieLabel = true;
    stackVert.xAxisShowGrid = false;
    stackVert.yAxisShowGrid = true;
    stackVert.yAxisGridDashed = true;
    stackVert.cellStartLocation = 0.2;
    stackVert.cellEndLocation = 0.8;
  }

  private setAreaDisplay() {
    this.chartDisplayDataDefaults[ChartTypeEnum.AREA] = new XYChartsDisplayData();
    const areaDisplay = this.chartDisplayDataDefaults[ChartTypeEnum.AREA];
    areaDisplay.isStacked = true;
    areaDisplay.xAxisLineShow = true;
    areaDisplay.xAxisShowLabels = true;
    areaDisplay.yAxisShowLabels = true;
    areaDisplay.showSerieLabel = true;
    areaDisplay.xAxisShowGrid = false;
    areaDisplay.yAxisShowGrid = true;
    areaDisplay.yAxisGridDashed = true;
  }

  private setHorizontalDisplay() {
    this.chartDisplayDataDefaults[ChartTypeEnum.HORIZONTAL_BAR] = new XYChartsDisplayData();
    const horizontalDisplay = this.chartDisplayDataDefaults[ChartTypeEnum.HORIZONTAL_BAR];
    horizontalDisplay.xAxisShowGrid = false;
    horizontalDisplay.xAxisShowLabels = false;
    horizontalDisplay.yAxisShowGrid = false;
    horizontalDisplay.yAxisShowLabels = true;
    horizontalDisplay.xAxisLineShow = false;
    horizontalDisplay.legendPosition = "bottom";
    horizontalDisplay.cellStartLocation = 0.2;
    horizontalDisplay.cellEndLocation = 0.8;
  }

  private setLineDisplay() {
    this.chartDisplayDataDefaults[ChartTypeEnum.LINE] = new XYChartsDisplayData();
    const lineDisplay = this.chartDisplayDataDefaults[ChartTypeEnum.LINE];
    lineDisplay.xAxisLineShow = true;
    lineDisplay.xAxisShowLabels = true;
    lineDisplay.yAxisShowLabels = true;
    lineDisplay.showSerieLabel = true;
    lineDisplay.xAxisShowGrid = false;
    lineDisplay.yAxisShowGrid = true;
    lineDisplay.yAxisGridDashed = true;
  }

  //this legend is created only for the pdf legend image
  addLegend(chart: XYChart, component) {
    if (component.chartDataDisplay.showLegend && chart) {
      chart.legend = new Legend();
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;
      chart.legend.itemContainers.template.events.on("hit", (ev) => {
        ev.target.opacity = 0.5;
      });
      chart.legend.itemContainers.template.paddingLeft = 10;
      chart.legend.reverseOrder = true;

      let legendContainer = create("legend" + component.chartId, Container);
      legendContainer.width = percent(100);
      legendContainer.height = percent(100);
      legendContainer.fillOpacity = 1;
      chart.legend.valueLabels.template.fill = color("#f00");
      chart.legend.parent = legendContainer;
      this.setLegendHeight(legendContainer, component);
    }
  }

  //set the legend height by the amcharts container of the legend labels
  private setLegendHeight(legendContainer: Container, component) {
    let count = 0;
    const interval = setInterval(() => {

      const legendHeight: number = legendContainer.dom.getBBox().height;
      if (!legendHeight)
        return;
      if (component.legendHeight === legendHeight)//if its still the same height continue the countdown
        count++;
      else//if its not the same height reset the countdown
        count = 0;
      if (count > 4)//after 4 times the height stay the same,end the interval
        clearInterval(interval);

      component.legendHeight = legendHeight;
    }, 1000);
  }

  getPdfFunc(chartId: string): PdfCreationFunction {
    return this.pdfFuncs[chartId];
  }

  setPdfFunc(chartId: string, chart: XYChart) {
    const func = this.createPdfChartFunc(chart, chartId);
    this.pdfFuncs[chartId] = func;
  }

  removePdfFunc(chartId: string) {
    delete this.pdfFuncs[chartId];
  }

  private createPdfChartFunc(chart: XYChart, chartId: string): PdfCreationFunction {
    const func: PdfCreationFunction = (callback, exportName) => {
      try {
        const c = document.createElement("div"); //adding loader for pdf creation 
        c.classList.add("loader-container");
        c.innerHTML = `<div class="loader">Loading...</div>`;
        this.startGeneratedPdf(c);
        //must be used because only the get svg image retrieve valid image but its is image of type svg and we need image of type png
        const legendImageAsync = new Promise<any>((res, rej) => {
          chart.legend.svgContainer.container.exporting.getSVG("svg").then(
            svgImage => {
              const { body } = document;
              const canvas = document.createElement('canvas');
              canvas.width = chart.legend.svgContainer.width;
              canvas.height = chart.legend.svgContainer.height;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              const tempImg = document.createElement('img');
              tempImg.addEventListener('load', onTempImageLoad);
              tempImg.src = svgImage;

              const targetImg = document.createElement('img');
              targetImg.setAttribute("style", "display:none;");
              body.appendChild(targetImg);

              function onTempImageLoad(e) {
                ctx.drawImage(e.target, 0, 0);
                targetImg.src = canvas.toDataURL();
                res(targetImg.src);
                body.removeChild(targetImg);
              }
            }
          );
        });
        Promise.all([
          chart.exporting.pdfmake,
          chart.exporting.getImage("png"),
          legendImageAsync
        ]).then(async (res) => {
          var pdfMake = res[0];
          var chartImg = res[1];
          var legendImg = res[2];
          const doc = callback(chartImg, legendImg);

          var pdf = pdfMake.createPdf(doc).download(exportName,
            () => { this.stopGeneratedPdf(c); });

        });
      }
      catch (error) {
        console.log(error);
      }
    };
    return func;
  }

  //removing the loader
  stopGeneratedPdf(c) {
    document.body.removeChild(c);
  }
  //showing the loader
  startGeneratedPdf(c) {
    document.body.appendChild(c);

    setTimeout(() => {
      if (c.parentNode == document.body)
        this.stopGeneratedPdf(c);
    }, 30000);
  }

  getComponent(type: ChartTypeEnum): any {
    return this.chartComponents[type];
  }

  getChartDisplayData(type: ChartTypeEnum): XYChartsDisplayData {
    if (this.chartDisplayDataDefaults[type])
      return {
        ...this.chartDisplayDataDefaults[type], data: [], metadata: {
          categoryAxisKey: "",
          seriesMetadata: []
        }
      };
    else
      return new XYChartsDisplayData();
  }

  getChartsColors(seriesMetadata: SerieMetadata[], colorsOptions?: ColorDetail[]): Color[] {
    const colorList = colorsOptions || this.colors;
    let newColors = colorList
      .filter(x => !x.intend)
      .sort((a, b) => b.priority - a.priority)
      .map(x => createColor(x.color));
    for (let i = 0; i < seriesMetadata.length; i++) {
      const serie = seriesMetadata[i];
      const specifyColorOfSerie = colorList.find(x => typeof serie?.key === 'string' && serie.key.match(/[a-zA-Z]/g)?.join('') === x.intend);
      if (specifyColorOfSerie) {
        newColors.splice(i, 0, createColor(specifyColorOfSerie.color));
      }
    }
    return newColors;
  }

  getColors(): ColorDetail[] {
    return this.colors;
  }

  setToolTip(chartDataDisplay: XYChartsDisplayData, data: any[], colors: any[], seriesMetadata: SerieMetadata[], categoryAxisClass: any) {
    const categoryKey = "tooltipCategory";
    data.forEach(el => {
      let category = categoryAxisClass == DateAxis && el[categoryKey] ? this.dateFormatter.format(el[categoryKey], "dd-MMMM") : el[categoryKey];
      for (let i = 0; i < seriesMetadata.length; i++) {
        const { key, tooltip, title } = seriesMetadata[i];
        const color = colors[i].hex;
        const tooltipData = el[tooltip];//e.g. {"Project A":16000}
        if (!tooltipData || typeof (tooltipData) != "object") {//if there is not tooltip don't create one
          continue;
        }
        const dimensions = Object.keys(tooltipData);
        if (dimensions.length == 1) {
          el[tooltip] = this.getSingleTooltip(dimensions[0], tooltipData[dimensions[0]], color, category, this.costPipe);
        }
        else if (dimensions.length > 1) {
          const result = Object.keys(tooltipData).map((key) => [key, tooltipData[key]]).sort((a, b) => b[1] - a[1]);
          const names = result.map(x => x[0]);
          const values = result.map(x => x[1]);
          el[tooltip] = this.getMultiTooltip(names, values, color, category, this.costPipe);
        }
        else {
          el[tooltip] = "";
        }
      }
    });
  }

  setNewColors(colors: { name: string, color: string; }[], chartId: string) {
    this.colorSubject.next({ colors, chartId });
  }

  /*
  set sortable array with the sum values for each category
  e.g. the sum of project A (cost over 12 months) 
  */
  private getSingleTooltip(name: string, value: number | string, color: string, date: string, costPipe: CurrencyPipe) {
    let tooltip = `<div class="tooltip-amcharts-series">
                  `;
    tooltip += date ? `<div class="tooltip-amcharts-data timeline">${date}</div>` : ``;
    name = name.match(/^[0-9]+[\-.][0-9]+[\-.][0-9]+$/g) ? this.dateFormatter.format(name, "dd-MMMM") : name;
    tooltip += `<div class="tooltip-amcharts-data"> <div class="tooltip-group-by-name ${name}" style="color: ${color};"> ${name}</div><span class="tooltip-group-by-value ${name}">${costPipe.transform(value)}</span></div></div>`;
    return tooltip;
  }

  private getMultiTooltip(names: string[], values: number[], color: string, date: string, costPipe: CurrencyPipe) {

    let tooltip = `<div class="tooltip-amcharts-series">`;
    tooltip += date ? `<div class="tooltip-amcharts-data timeline">${date}</div>` : ``;
    let totalValue = 0;
    const max = 10;
    let otherValues = 0;
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      name = name.match(/^[0-9]+[\-.][0-9]+[\-.][0-9]+$/g) ? this.dateFormatter.format(name, "dd-MMMM") : name;
      const value = values[i];
      totalValue += value;
      if (i >= max && max + 1 < names.length) {
        otherValues += value;
        if (i + 1 == names.length) {
          tooltip += ` <div class="tooltip-amcharts-data">
                <div class="tooltip-group-by-name ${name}" style="color: ${color};">
                   Others
                 </div>
                <span class="tooltip-group-by-value ${name}">
                  ${costPipe.transform(otherValues)}
               </span>
               </div>`;
        }
      }
      else {
        tooltip += ` <div class="tooltip-amcharts-data">
                <div class="tooltip-group-by-name ${name}" style="color: ${color};">
                   ${name}
                 </div>
                <span class="tooltip-group-by-value ${name}">
                  ${costPipe.transform(value)}
               </span>
               </div>`;
      }
    }
    tooltip += ` <div class="tooltip-amcharts-data total">
                <div class="tooltip-group-by-name" style="color: ${color};">
                   Total
                 </div>
                <span class="tooltip-group-by-value ${name}">
                  ${costPipe.transform(totalValue)}
               </span>
               </div>`;
    tooltip += `</div>`;
    return tooltip;
  }
}

