import {Dayjs} from "dayjs";
import {Aircraft} from "./aircraft.types.ts";
import {User} from "./user.types.ts";

export interface MaintenanceRecord {
    id: string;
    aircraft: Aircraft;
    engineer: User;
    type: string;
    startDate: Dayjs;
    endDate: Dayjs;
    status: string;
}
