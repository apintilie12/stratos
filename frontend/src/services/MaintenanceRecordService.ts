/* eslint-disable @typescript-eslint/no-explicit-any */
import { MaintenanceRecord } from "../types/maintenanceRecord.types.ts";
import api from "../utils/axios.ts";

export class MaintenanceRecordService {
    private static baseUrl = "/maintenance-records";

    static async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
        try {
            const response = await api.get<MaintenanceRecord[]>(this.baseUrl);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch maintenance records");
        }
    }

    static async getMaintenanceRecordsForUser(userId: string): Promise<MaintenanceRecord[]> {
        try {
            const response = await api.get<MaintenanceRecord[]>(`${this.baseUrl}?engineerId=${userId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch maintenance records for the user");
        }
    }

    static async addMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord> {
        try {
            const payload = {
                ...record,
                startDate: record.startDate.toISOString(),
                endDate: record.endDate.toISOString(),
            };
            const response = await api.post<MaintenanceRecord>(this.baseUrl, payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to add maintenance record");
        }
    }

    static async updateMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord> {
        try {
            const payload = {
                ...record,
                startDate: record.startDate.toISOString(),
                endDate: record.endDate.toISOString(),
                aircraft: record.aircraft.registrationNumber,
            };
            const response = await api.put<MaintenanceRecord>(`${this.baseUrl}/${record.id}`, payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update maintenance record");
        }
    }

    static async deleteMaintenanceRecord(id: string | undefined): Promise<void> {
        if (!id) return;
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete maintenance record");
        }
    }

    static async getAllMaintenanceTypes(): Promise<string[]> {
        try {
            const response = await api.get<string[]>(`${this.baseUrl}/types`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch maintenance types");
        }
    }

    static async getAllMaintenanceStatuses(): Promise<string[]> {
        try {
            const response = await api.get<string[]>(`${this.baseUrl}/statuses`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch maintenance statuses");
        }
    }
}
