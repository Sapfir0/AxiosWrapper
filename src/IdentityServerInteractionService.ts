import { AxiosRequestConfig } from 'axios';
import { BaseInteractionService } from './BaseInteractionService';
import { ValidationError } from './errors/ValidationError';
import { Either, bimap, map } from 'fp-ts/Either';
import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from './inversify/inversifyTypes';
import TokenService from './TokenService';
import { IAuthInteractionService } from './typings/ApiTypes';
import { IdentityServerRoutes, TokensData, TokensDataExtended } from './typings/auth';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { IData, RequestSettings } from './typings/common';
import container from './inversify/inversifyContainer';


@injectable()
export class IdentityServerInteractionService implements IAuthInteractionService {
    private readonly _token: TokenService
    private readonly _fetcher: BaseInteractionService
    constructor(
        protected AUTH_SERVICE_URL: string,
        protected routes: IdentityServerRoutes
    ) {
        this._fetcher = container.get(SERVICE_IDENTIFIER.BaseInteractionService)
        this._token = container.get(SERVICE_IDENTIFIER.TokenService)
    }

    public login = async (username: string, password: string): Promise<Either<ValidationError, TokensData>> => {
        const data = {
            grant_type: 'password',
            client_id: 'browser',
            username: username,
            password: password,
        };

        const authData: Either<BaseInteractionError, TokensData> = await this._fetcher.post<TokensData>(
            this.routes.CONNECT_TOKEN,
            data,
            this.AUTH_SERVICE_URL,
            { stringify: true },
        );
        
        return bimap(
            (e: BaseInteractionError) => new BaseInteractionError(e.message),
            (tokens: TokensData) => {
                this._token.setTokens(tokens as TokensDataExtended);
                return tokens;
            },
        )(authData);

    };

    public logout = async (): Promise<Either<BaseInteractionError, null>> => {
        return this._fetcher.get(this.routes.LOGOUT, {}, this.AUTH_SERVICE_URL, {
            params: { id_token_hint: this._token.getTokens()?.access_token },
        });
    };

    public request = async () => {
        await this.updateTokenIfOld();
    };

    
    public async get<T = any>(url: string, data?:IData, host?: string, config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this._fetcher.get<T>(url, data, host, this.setAuthHeader(config))
    }

    public async post<T = any>(url: string, data?: IData, host?: string,  settings?: RequestSettings, config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this._fetcher.post<T>(url, data, host, settings, this.setAuthHeader(config))
    }

    public async put<T = any>(url: string, data?: IData, host?: string,  settings?: RequestSettings, config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this._fetcher.put<T>(url, data, host, settings, this.setAuthHeader(config))
    }

    public async delete<T = any>(url: string, data?: IData, host?: string,  config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this._fetcher.delete<T>(url, data, host, this.setAuthHeader(config))
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

        return this._fetcher.post(this.routes.CONNECT_TOKEN, data, this.AUTH_SERVICE_URL, {
            stringify: true,
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
            })(newUser)

        }
    };
}
