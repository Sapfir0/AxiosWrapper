import { bimap, TaskEither, map, fold } from 'fp-ts/TaskEither';
import { ApiInteractionService } from './ApiInteractionService';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { ValidationError } from './errors/ValidationError';
import TokenService from './TokenService';
import { IIdentityInteractionService } from './typings/ApiTypes';
import { IdentityServerRoutes, TokensData, TokensDataExtended } from './typings/auth';
import { IData, RequestSettings } from './typings/common';
import { flow, pipe } from 'fp-ts/function';

export class BearerApiInteractionService extends ApiInteractionService implements IIdentityInteractionService {
    private readonly _token: TokenService;

    constructor(API_URL: string, protected AUTH_SERVICE_URL: string, protected routes: IdentityServerRoutes) {
        super(API_URL);
        this._token = new TokenService();
    }

    public login = (username: string, password: string): TaskEither<ValidationError, TokensData> => {
        const data = {
            grant_type: 'password',
            client_id: 'browser',
            username: username,
            password: password,
        };

        const authData: TaskEither<BaseInteractionError, TokensData> = super.post<TokensData>(
            this.routes.CONNECT_TOKEN,
            data,
            { stringify: true, host: this.AUTH_SERVICE_URL },
        );

        return bimap(
            (e: BaseInteractionError) => new BaseInteractionError(e.message),
            (tokens: TokensData) => {
                this._token.setTokens(tokens as TokensDataExtended);
                return tokens;
            },
        )(authData);
    };

    public logout = (): TaskEither<BaseInteractionError, null> => {
        return super.get(
            this.routes.LOGOUT,
            { id_token_hint: this._token.getTokens()?.access_token },
            { host: this.AUTH_SERVICE_URL },
        );
    };

    public request = async () => {
        await this.updateTokenIfOld();
    };

    public get<T = any>(
        url: string,
        data?: IData,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return flow(this.updateTokenIfOld, super.get<T>(url, data, this.setAuthHeader(settings)));
    }

    public post<T = any>(
        url: string,
        data?: IData,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return flow(this.updateTokenIfOld, super.post<T>(url, data, this.setAuthHeader(settings)));
    }

    public put<T = any>(
        url: string,
        data?: IData,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return flow(this.updateTokenIfOld, super.put<T>(url, data, this.setAuthHeader(settings)));
    }

    public delete<T = any>(
        url: string,
        data?: IData,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return flow(this.updateTokenIfOld, super.delete<T>(url, data, this.setAuthHeader(settings)));
    }

    private setAuthHeader = ({ config, ...settings }: RequestSettings): RequestSettings => {
        return {
            ...settings,
            config: {
                ...config,
                headers: {
                    Authorization: `Bearer ${this._token.getTokens()?.access_token}`,
                    ...config?.headers,
                },
            },
        };
    };

    private refreshToken = async (refreshToken: string) => {
        const data = {
            grant_type: 'refresh_token',
            client_id: 'browser',
            refresh_token: refreshToken,
        };

        return this.post(this.routes.CONNECT_TOKEN, data, {
            stringify: true,
            host: this.AUTH_SERVICE_URL,
        });
    };

    private updateTokenIfOld = async () => {
        const user = this._token.getTokens();
        const isUpdatable = this._token.needLongToken();

        if (user && isUpdatable) {
            const newUser = await this.refreshToken(user.refresh_token);
            console.log(newUser);
            map((user: any) => {
                this._token.setTokens(user);
            })(newUser);
        }
    };
}
