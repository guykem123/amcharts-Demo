import { IInsightDropdownContent } from 'src/app/core/models/dashboard/IInsightDropdownMeta';
import { DashboardDTO } from './DashboardDTO';

export interface IDashboardMetaDto {
    meta: {
        granularity: IInsightDropdownContent,
        aggregation: IInsightDropdownContent,
        dashboard: DashboardDTO
    };
}