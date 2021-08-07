import { AxiosRequestConfig } from 'axios';
import { bimap, Either, map } from 'fp-ts/Either';
import { ApiInteractionService } from './ApiInteractionService';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { ValidationError } from './errors/ValidationError';
import TokenService from './TokenService';
import { IIdentityInteractionService } from './typings/ApiTypes';
import { IdentityServerRoutes, TokensData, TokensDataExtended } from './typings/auth';
import { IData, RequestSettings } from './typings/common';


export class IdentityServerInteractionService extends ApiInteractionService implements IIdentityInteractionService {
    private readonly _token: TokenService
    
    constructor(
        API_URL: string,
        protected AUTH_SERVICE_URL: string,
        protected routes: IdentityServerRoutes
    ) {
        super(API_URL)
        this._token = new TokenService()
    }

    public login = async (username: string, password: string): Promise<Either<ValidationError, TokensData>> => {
        const data = {
            grant_type: 'password',
            client_id: 'browser',
            username: username,
            password: password,
        };

        const authData: Either<BaseInteractionError, TokensData> = await super.post<TokensData>(
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
        return super.get(this.routes.LOGOUT, {}, this.AUTH_SERVICE_URL, {
            params: { id_token_hint: this._token.getTokens()?.access_token },
        });
    };

    public request = async () => {
        await this.updateTokenIfOld();
    };

    
    public async get<T = any>(url: string, data?:IData, host?: string, config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this.get<T>(url, data, host, this.setAuthHeader(config))
    }

    public async post<T = any>(url: string, data?: IData, host?: string,  settings?: RequestSettings, config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this.post<T>(url, data, host, settings, this.setAuthHeader(config))
    }

    public async put<T = any>(url: string, data?: IData, host?: string,  settings?: RequestSettings, config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this.put<T>(url, data, host, settings, this.setAuthHeader(config))
    }

    public async delete<T = any>(url: string, data?: IData, host?: string,  config?: AxiosRequestConfig): Promise<Either<BaseInteractionError, T>> {
        await this.updateTokenIfOld()
        return this.delete<T>(url, data, host, this.setAuthHeader(config))
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

        return this.post(this.routes.CONNECT_TOKEN, data, this.AUTH_SERVICE_URL, {
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
