import api from "../utils/axios.ts";


export class AuthService {
    private static baseUrl = "/auth";

    static async login(username: string, password: string) {
        try {
            const response = await api.post(`${this.baseUrl}/login`, {
                username,
                password,
            });
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    static async enableOTP(username: string) {
        try {
            const response = await api.post(`${this.baseUrl}/enable-otp/${username}`, {})
            return response.data;
        } catch (error) {
            console.error("OTP failed:", error);
            throw error;
        }
    }

    static async verifyOTP(username: string, code: string) {
        return await api.post(`${this.baseUrl}/verify-otp`, {
            username,
            code,
        });
    }

    static async verifyOTPReset(username: string, code: string) {
        return await api.post(`${this.baseUrl}/verify-otp-reset`, {
            username,
            code,
        })
    }

    static async resetPassword(username: string, password: string): Promise<void> {
        const response = await api.post(`${this.baseUrl}/reset-password`, {username, password});
        return response.data;
    }
}