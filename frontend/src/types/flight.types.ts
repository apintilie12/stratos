import {Dayjs} from "dayjs";

export interface Flight {
    id?: string;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: Dayjs;
    arrivalTime: Dayjs | null;
    aircraft: string;
}
