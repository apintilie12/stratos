import {Dayjs} from "dayjs";

export interface MaintenanceRecord {
    id: string;
    aircraft: string;
    engineer: string;
    type: string;
    startDate: Dayjs;
    endDate: Dayjs;
    status: string;
}
