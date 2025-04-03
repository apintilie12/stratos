import { Flight } from "../types/flight.types.ts";

export class FlightService {
    private static baseUrl = import.meta.env.VITE_APP_API_URL + "/flights";

    static async getAllFlights(): Promise<Flight[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error("Failed to fetch flights");
        return response.json();
    }

    static async addFlight(flight: Flight): Promise<Flight> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...flight, departureTime: flight.departureTime.toISOString(), arrivalTime: flight.arrivalTime.toISOString() }),
        });
        if (!response.ok){
            const responseData = await response.json();
            throw new Error(responseData.message || "Failed to add flight");
        }
        return await response.json();
    }

    static async updateFlight(flight: Flight): Promise<Flight> {
        const response = await fetch(`${this.baseUrl}/${flight.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...flight, departureTime: flight.departureTime.toISOString(), arrivalTime: flight.arrivalTime.toISOString() }),
        });
        if (!response.ok) throw new Error("Failed to update flight");
        return response.json();
    }

    static async deleteFlight(id: string | undefined): Promise<void> {
        if (!id) return;
        const response = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete flight");
    }
}
