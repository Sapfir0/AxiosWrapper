export interface TokensData { // dto
    access_token: string,
    refresh_token: string,
    expires_in: number,
    token_type: string,
    scope: string
}

export type IdentityServerRoutes = {
    CONNECT_TOKEN: '/connect/token';
    LOGOUT: '/connect/endsession';
};

export interface TokensDataExtended extends TokensData {
    timestamp_generation: number
}