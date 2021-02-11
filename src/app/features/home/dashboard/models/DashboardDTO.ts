import { DashboardControlDTO } from './DashboardControlDTO';
import { CloudPlatformEnum } from 'src/app/core/models/accounts/enum/CloudPlatformEnum';

export class DashboardDTO {
    accountId: number;
    customerId: number;
    dashboardControls: DashboardControlDTO[];
    externalId: string;
    id: number;
    platform: CloudPlatformEnum;
    resellerId: number;
    settings: string;
    title: string;
    userId: number;
}