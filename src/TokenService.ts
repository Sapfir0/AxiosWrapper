import { getLocalStorage } from './LocalStorage';
import { TokensDataExtended } from './typings/auth';

class TokenService {
    private readonly timeoutDivider = 2; // при каком отношении таймстемпа генерации и уже прошедшего времени мы будем обновлять токен
    private _ls = getLocalStorage('USER');

    constructor() {
        const databaseUser = this._ls.get<TokensDataExtended>();
        if (databaseUser !== undefined) {
            this.setTokens(databaseUser);
        }
    }

    private static getDiff(tokenGenerateTimestamp: number) {
        const currentTimestamp = Date.now();
        return (currentTimestamp - tokenGenerateTimestamp) / 1000; // потому что now возвращает миллисекунды
    }

    public setTokens = (user: TokensDataExtended): void => {
        if (user) {
            if (!user.timestamp_generation) {
                user.timestamp_generation = Date.now();
            }
            this._ls.set(user);
        }
    };

    public isAuth = (): boolean => {
        return !!this._ls.get();
    };

    public getTokens = (): TokensDataExtended | undefined => {
        return this._ls.get();
    };

    public removeTokens = (): void => {
        this._ls.remove();
    };

    public needLongToken = (): boolean => {
        const user = this.getTokens();
        if (user !== undefined) {
            return TokenService.getDiff(user.timestamp_generation) > user.expires_in / this.timeoutDivider;
        }
        return false;
    };
}

export default TokenService;
