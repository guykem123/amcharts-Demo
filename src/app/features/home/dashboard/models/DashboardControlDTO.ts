import { DashboardContentTypeEnum } from './enum/DashboardContentTypeEnum';

export class DashboardControlDTO {
    contentId: number;
    contentType: any;
    controlHeight: number;
    controlWidth: number;
    dashboardId: number;
    horizontalPosition: number;
    id: number;
    parentControlId: number;
    showTitle: boolean;
    title: string;
    verticalPosition: number;
    verticalPositionEnd?: number;
    horizontalPositionEnd?: number;
    isFullWidth?: boolean;
    isInsight?: boolean;
}
