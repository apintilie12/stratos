/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../types/user.types.ts";
import api from "../utils/axios.ts";

export class UserService {
    private static baseUrl = "/users";

    static async getAllUsers(params: { username?: string; role?: string; sortBy?: string; sortOrder?: string }): Promise<User[]> {
        try {
            const response = await api.get<User[]>(this.baseUrl, { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch users");
        }
    }

    static async addUser(user: User): Promise<User> {
        try {
            const response = await api.post<User>(this.baseUrl, user);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to add user");
        }
    }

    static async updateUser(user: User): Promise<User> {
        try {
            const response = await api.put<User>(`${this.baseUrl}/${user.id}`, user);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update user");
        }
    }

    static async deleteUser(id: string | undefined): Promise<void> {
        if (!id) return;
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete user");
        }
    }

    static async getUserRoles(): Promise<string[]> {
        try {
            const response = await api.get<string[]>(`${this.baseUrl}/roles`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch user roles");
        }
    }
}
