import {User} from "../types/user.types.ts";

export class UserService {
    private static baseUrl = import.meta.env.VITE_APP_API_URL + "/users";

    static async getAllUsers(): Promise<User[]> {
        const response = await fetch(this.baseUrl);
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
    }

    static async addUser(user: User): Promise<User> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Failed to add user");
        return response.json();
    }

    static async updateUser(user: User): Promise<User> {
        const response = await fetch(`${this.baseUrl}/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Failed to update user");
        return response.json();
    }

    static async deleteUser(id: string | undefined): Promise<void> {
        if(!id) return;
        const response = await fetch(`${this.baseUrl}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete user");
    }

    static async getUserRoles(): Promise<string[]> {
        const response = await fetch(`${this.baseUrl}/roles`);
        if (!response.ok) throw new Error("Failed to fetch user roles");
        return response.json();

    }
}
