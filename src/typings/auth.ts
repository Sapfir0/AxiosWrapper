export interface ITokensData { // dto
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  scope: string
}

export interface IdentityServerRoutes {
  CONNECT_TOKEN: '/connect/token'
  LOGOUT: '/connect/endsession'
}

export interface TokensDataExtended extends ITokensData {
  timestampGeneration: number
}
