export interface TokenPayload{
    sub: string;
    name: string;
    username: string;
    role: string;
}

export interface TokenPayloadVerify{
    sub: string;
    name: string;
    username: string;
    role: string;
    iat: number,
    exp: number
}