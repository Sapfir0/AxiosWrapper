import type { TaskEither } from 'fp-ts/TaskEither'
import { bimap, map } from 'fp-ts/TaskEither'
import { flow } from 'fp-ts/function'

import { ApiInteractionService } from './ApiInteractionService'
import { BaseInteractionError } from './errors/BaseInteractionError'
import type { ValidationError } from './errors/ValidationError'
import TokenService from './TokenService'
import type { IIdentityInteractionService } from './typings/ApiTypes'
import type { IdentityServerRoutes, ITokensData, TokensDataExtended } from './typings/auth'
import type { IData, IRequestSettings } from './typings/common'

export class BearerApiInteractionService extends ApiInteractionService implements IIdentityInteractionService {
  private readonly _token: TokenService

  constructor(API_URL: string, protected AUTH_SERVICE_URL: string, protected routes: IdentityServerRoutes) {
    super(API_URL)
    this._token = new TokenService()
  }

  public login = (username: string, password: string): TaskEither<ValidationError, ITokensData> => {
    const data = {
      grantType: 'password',
      clientId: 'browser',
      username,
      password,
    }

    const authData: TaskEither<BaseInteractionError, ITokensData> = super.post<ITokensData>(
      this.routes.CONNECT_TOKEN,
      data,
      {
        stringify: true,
        host: this.AUTH_SERVICE_URL,
      },
    )

    return bimap(
      (e: BaseInteractionError) => new BaseInteractionError(e.message),
      (tokens: ITokensData) => {
        this._token.setTokens(tokens as TokensDataExtended)
        return tokens
      },
    )(authData)
  }

  public logout = (): TaskEither<BaseInteractionError, null> => super.get(
    this.routes.LOGOUT,
    {
      idTokenHint: this._token.getTokens()?.accessToken,
    },
    {
      host: this.AUTH_SERVICE_URL,
    },
  )

  public request = async () => {
    await this.updateTokenIfOld()
  }

  public get<T = any>(
    url: string,
    data?: IData,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return flow(this.updateTokenIfOld, super.get<T>(url, data, this.setAuthHeader(settings)))
  }

  public post<T = any>(
    url: string,
    data?: IData,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return flow(this.updateTokenIfOld, super.post<T>(url, data, this.setAuthHeader(settings)))
  }

  public put<T = any>(
    url: string,
    data?: IData,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return flow(this.updateTokenIfOld, super.put<T>(url, data, this.setAuthHeader(settings)))
  }

  public delete<T = any>(
    url: string,
    data?: IData,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return flow(this.updateTokenIfOld, super.delete<T>(url, data, this.setAuthHeader(settings)))
  }

  private readonly setAuthHeader = ({ config, ...settings }: IRequestSettings): IRequestSettings => ({
    ...settings,
    config: {
      ...config,
      headers: {
        Authorization: `Bearer ${this._token.getTokens()?.accessToken}`,
        ...config?.headers,
      },
    },
  })

  private readonly refreshToken = async (refreshToken: string) => {
    const data = {
      grant_type: 'refresh_token',
      clientId: 'browser',
      refreshToken,
    }

    return this.post(this.routes.CONNECT_TOKEN, data, {
      stringify: true,
      host: this.AUTH_SERVICE_URL,
    })
  }

  private readonly updateTokenIfOld = async () => {
    const user = this._token.getTokens()
    const isUpdatable = this._token.needLongToken()

    if (user && isUpdatable) {
      const newUser = await this.refreshToken(user.refreshToken)

      map((user: any) => {
        this._token.setTokens(user)
      })(newUser)
    }
  }
}
