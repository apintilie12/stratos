export interface User {
    id?: string;
    username: string;
    password?: string;
    role: string;
    isOtpEnabled?: boolean;
}

export interface UserCreateDTO {
    username: string;
    password: string;
}