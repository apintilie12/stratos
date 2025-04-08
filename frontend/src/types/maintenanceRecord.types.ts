import {Dayjs} from "dayjs";
import {Aircraft} from "./aircraft.types.ts";

export interface MaintenanceRecord {
    id?: string;
    aircraft: Aircraft;
    engineer: string;
    type: string;
    startDate: Dayjs;
    endDate: Dayjs;
    status: string;
}
