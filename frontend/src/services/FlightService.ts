/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flight } from "../types/flight.types.ts";
import api from "../utils/axios.ts";

export class FlightService {
    private static baseUrl = "/flights";

    static async getAllFlights(): Promise<Flight[]> {
        try {
            const response = await api.get<Flight[]>(this.baseUrl);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch flights");
        }
    }

    static async addFlight(flight: Flight): Promise<Flight> {
        try {
            const flightPayload = {
                ...flight,
                departureTime: flight.departureTime.toISOString(),
                arrivalTime: flight.arrivalTime.toISOString(),
            };
            const response = await api.post<Flight>(this.baseUrl, flightPayload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to add flight");
        }
    }

    static async updateFlight(flight: Flight): Promise<Flight> {
        try {
            const flightPayload = {
                ...flight,
                departureTime: flight.departureTime.toISOString(),
                arrivalTime: flight.arrivalTime.toISOString(),
            };
            const response = await api.put<Flight>(`${this.baseUrl}/${flight.id}`, flightPayload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update flight");
        }
    }

    static async deleteFlight(id: string | undefined): Promise<void> {
        if (!id) return;
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete flight");
        }
    }
}
