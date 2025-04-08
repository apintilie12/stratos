import { MaintenanceRecord } from "../types/maintenanceRecord.types.ts"

export class MaintenanceRecordService {
    private static baseUrl = import.meta.env.VITE_APP_API_URL + "/maintenance-records";

    static async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error("Failed to fetch maintenance records");
        return response.json();
    }

    static async getMaintenanceRecordsForUser(userId: string): Promise<MaintenanceRecord[]> {
        const response = await fetch(`${this.baseUrl}?engineerId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch maintenance records for the user");
        return response.json();
    }
    static async addMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord> {
        console.log(this.baseUrl);
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...record,
                startDate: record.startDate.toISOString(),
                endDate: record.endDate.toISOString(),
            }),
        });
        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.message || "Failed to add maintenance record");
        }
        return await response.json();
    }

    static async updateMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord> {
        const response = await fetch(`${this.baseUrl}/${record.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...record,
                startDate: record.startDate.toISOString(),
                endDate: record.endDate.toISOString(),
                aircraft: record.aircraft.registrationNumber,
            }),
        });
        if (!response.ok) throw new Error("Failed to update maintenance record");
        return response.json();
    }

    static async deleteMaintenanceRecord(id: string | undefined): Promise<void> {
        if(id === undefined)
            return;
        const response = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete maintenance record");
    }

    static async getAllMaintenanceTypes(): Promise<string[]> {
        const response = await fetch(`${this.baseUrl}/types`);
        if (!response.ok) throw new Error("Failed to fetch maintenance types");
        return response.json();
    }

    static async getAllMaintenanceStatuses(): Promise<string[]> {
        const response = await fetch(`${this.baseUrl}/statuses`);
        if (!response.ok) throw new Error("Failed to fetch maintenance statuses");
        return response.json();
    }

}
