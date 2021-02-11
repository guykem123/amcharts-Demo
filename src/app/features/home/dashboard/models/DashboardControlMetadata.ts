import { ChartTypeEnum } from "src/app/shared/chart/models/ChartTypeEnum";
import { InsightDataModelType } from "src/app/shared/chart/models/InsightDataModelType";
import { InsightDataModelField, InsightDataModelFormula } from "./InsightDataModel";

export class DashboardControlMetadata {
    id: number;
    showTitle: boolean;
    chartType: ChartTypeEnum;
    fields: InsightDataModelField[];
    formulaFields: InsightDataModelFormula[];
    categoryKey: string;//usageDate
    categoryKeyType: InsightDataModelType;
    groupByKey: string;//project
    valuesKey: string;//cost
    comparable: boolean;
    advancedOptions: boolean;
    costFilter: { [title: string]: { readonly key: string, value: boolean; }; };
}