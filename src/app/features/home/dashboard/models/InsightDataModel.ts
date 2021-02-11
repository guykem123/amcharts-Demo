import { AggregationTypeEnum } from './enum/AggregationTypeEnum';
import { GranularityEnum } from './enum/GranularityEnum';

export class InsightDataModelDTO {
    id: number;
    name: string;
    settings: string;
    limit: any;
    comparable: boolean;
    fields: InsightDataModelField[];
    groupBys: InsightDataModelGroupBy[];
    formulaFields: InsightDataModelFormula[];
}

export class InsightDataModelField {
    id: number;
    aggregationType: AggregationTypeEnum;
    columnLabel: string;
    insightDataModelId: number;
    subjectAreaField: SubjectAreaField;
    subjectAreaFieldName: string;
    subjectAreaFieldId: number;
    dataField: string;
}
export class InsightDataModelGroupBy {
    granularity: GranularityEnum;
    groupLevel: number;
    id: number;
    insightDataModelFieldId: number;
    insightDataModelId: number;
    optional: boolean;
    selectable: boolean;
}
export class InsightDataModelFormula {
    aggregationType: AggregationTypeEnum;
    columnLabel: string;
    id: number;
    insightDataModelFields: number[];
    insightDataModelId: number;
    insightDataModelName: string;
    name: string;
    selectable: boolean;
}

export class SubjectAreaField {
    id: number;
    name: string;
    groupable: boolean;
    filterable: boolean;
    title: string;
    costApplicable: boolean;
    logicalType: string;
    type: InsightDataModelType;
    referenceField: any;
}

export type InsightDataModelType = "DATE" | "TEXT" | "NUMBER" | "JSON";