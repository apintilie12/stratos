interface TokenPayload {
    iss: string;
    iat: number;
    exp: number;
    userId: string;
    role: string;
}

export default TokenPayload;