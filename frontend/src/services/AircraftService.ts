/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aircraft } from "../types/aircraft.types.ts";
import api from "../utils/axios.ts";

export class AircraftService {
    static async getAircraft(): Promise<Aircraft[]> {
        try {
            const response = await api.get<Aircraft[]>("/aircraft");
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch aircraft");
        }
    }

    static async addAircraft(newAircraft: Aircraft): Promise<Aircraft> {
        try {
            const response = await api.post<Aircraft>("/aircraft", newAircraft);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to add aircraft");
        }
    }

    static async updateAircraft(updatedAircraft: Aircraft): Promise<Aircraft> {
        try {
            const response = await api.put<Aircraft>(`/aircraft/${updatedAircraft.id}`, updatedAircraft);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update aircraft");
        }
    }

    static async deleteAircraft(id: string | undefined): Promise<void> {
        if (!id) return;

        try {
            await api.delete(`/aircraft/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete aircraft");
        }
    }

    static async getAircraftTypesAndStatuses(): Promise<{ types: string[]; statuses: string[] }> {
        try {
            const [typeRes, statusRes] = await Promise.all([
                api.get<string[]>("/aircraft/types"),
                api.get<string[]>("/aircraft/statuses"),
            ]);

            return {
                types: typeRes.data,
                statuses: statusRes.data,
            };
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch types and statuses");
        }
    }
}
