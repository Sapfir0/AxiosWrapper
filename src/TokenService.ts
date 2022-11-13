import { LocalStorage } from './LocalStorage'
import type { TokensDataExtended } from './typings/auth'

class TokenService {
  private readonly timeoutDivider = 2 // при каком отношении таймстемпа генерации и уже прошедшего времени мы будем обновлять токен
  private readonly _ls = new LocalStorage('USER')

  constructor() {
    const databaseUser = this._ls.get<TokensDataExtended>()

    if (databaseUser) {
      this.setTokens(databaseUser)
    }
  }

  private static getDiff(tokenGenerateTimestamp: number) {
    const currentTimestamp = Date.now()

    return (currentTimestamp - tokenGenerateTimestamp) / 1000 // потому что now возвращает миллисекунды
  }

  public setTokens = (user: TokensDataExtended): void => {
    if (user) {
      if (!user.timestampGeneration) {
        user.timestampGeneration = Date.now()
      }

      this._ls.set(user)
    }
  }

  public isAuth = (): boolean => Boolean(this._ls.get())

  public getTokens = (): TokensDataExtended | null => this._ls.get()

  public removeTokens = (): void => {
    this._ls.remove()
  }

  public needLongToken = (): boolean => {
    const user = this.getTokens()

    if (user) {
      return TokenService.getDiff(user.timestampGeneration) > user.expiresIn / this.timeoutDivider
    }

    return false
  }
}

export default TokenService
