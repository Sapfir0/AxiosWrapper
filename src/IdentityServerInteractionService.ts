import { AxiosRequestConfig } from 'axios';
import { BaseApiInteractionService } from 'BaseApiInteractionService';
import { ValidationError } from 'Errors/ValidationError';
import { Either } from 'fp-ts/Either';
import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from 'inversify/inversifyTypes';
import TokenService from 'TokenService';
import { IAuthInteractionService } from 'typings/ApiTypes';
import { TokensData } from 'typings/auth';
import { BaseInteractionError } from './Errors/BaseInteractionError';

@injectable()
export default class IdentityServerInteractionService implements IAuthInteractionService {
    constructor(
        @inject(SERVICE_IDENTIFIER.BaseInteractionService) private readonly _fetcher: BaseApiInteractionService,
        @inject(SERVICE_IDENTIFIER.TokenService) private readonly _token: TokenService,
    ) {}

    public login = async (username: string, password: string): Promise<Either<ValidationError, TokensData>> => {
        const data = {
            grant_type: 'password',
            client_id: 'browser',
            username: username,
            password: password,
        };

        const authData: Either<BaseInteractionError, TokensData> = await this._fetcher.post<TokensData>(
            AuthServiceRoutes.CONNECT_TOKEN,
            data,
            AUTH_SERVICE_URL,
            { stringify: true },
        );
        const tokens = authData
            .mapRight((tokens: TokensData) => {
                this._token.setTokens(tokens as TokensDataExtended);
                return tokens;
            })
            .mapLeft((e: BaseInteractionError) => new ValidationError());
        return tokens;
    };

    public logout = async (): Promise<Either<BaseInteractionError, null>> => {
        return this._fetcher.get(AuthServiceRoutes.LOGOUT, {}, AUTH_SERVICE_URL, {
            params: { id_token_hint: this._token.getTokens()?.access_token },
        });
    };

    public request = async () => {
        await this.updateTokenIfOld();
    }

    private setAuthHeader = (config?: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                Authorization: `Bearer ${this._token.getTokens()?.access_token}`,
                ...config?.headers,
            },
        };
        return newConfig;
    };

    private refreshToken = async (refreshToken: string) => {
        const data = {
            grant_type: 'refresh_token',
            client_id: 'browser',
            refresh_token: refreshToken,
        };

        return this._baseInteractionService.post(AuthServiceRoutes.CONNECT_TOKEN, data, AUTH_SERVICE_URL, {
            stringify: true,
        });
    };

    private updateTokenIfOld = async () => {
        const user = this._token.getTokens();
        const isUpdatable = this._token.needLongToken();

        if (user && isUpdatable) {
            const newUser = await this.refreshToken(user.refresh_token);
            console.log(newUser);
            newUser.mapRight((user) => {
                this._token.setTokens(user);
            });
        }
    };
}
