import { Aircraft } from "../types/aircraft.types.ts";

export class AircraftService {
    private static apiURL = import.meta.env.VITE_APP_API_URL;

    static async getAircraft(): Promise<Aircraft[]> {
        try {
            const response = await fetch(`${this.apiURL}/aircraft`);
            if (!response.ok) {
                throw new Error("Failed to fetch aircraft");
            }
            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error");
        }
    }

    static async addAircraft(newAircraft: Aircraft): Promise<Aircraft> {
        try {
            const response = await fetch(`${this.apiURL}/aircraft`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAircraft),
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || "Failed to add aircraft");
            }
            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error");
        }
    }

    static async updateAircraft(updatedAircraft: Aircraft): Promise<Aircraft> {
        try {
            const response = await fetch(`${this.apiURL}/aircraft/${updatedAircraft.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAircraft),
            });
            if (!response.ok) {
                throw new Error("Failed to update aircraft");
            }
            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error");
        }
    }

    static async deleteAircraft(id: string | undefined): Promise<void> {
        if(id === undefined)
            return;
        try {
            const response = await fetch(`${this.apiURL}/aircraft/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete aircraft");
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error");
        }
    }

    static async getAircraftTypesAndStatuses(): Promise<{ types: string[]; statuses: string[] }> {
        try {
            const [typeResponse, statusResponse] = await Promise.all([
                fetch(`${this.apiURL}/aircraft/types`),
                fetch(`${this.apiURL}/aircraft/statuses`),
            ]);
            if (!typeResponse.ok || !statusResponse.ok) {
                throw new Error("Failed to fetch types and statuses");
            }

            const types = await typeResponse.json();
            const statuses = await statusResponse.json();

            return { types, statuses };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error");
        }
    }
}