import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as E from 'fp-ts/lib/Either';
import * as qs from 'querystring';
import { ApiHelper } from './ApiHelper';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { NetworkError } from './errors/NetworkError';
import container from './inversify/inversifyContainer';
import { SERVICE_IDENTIFIER } from './inversify/inversifyTypes';
import { IBaseInteractionService } from './typings/ApiTypes';
import { IData, RequestSettings } from './typings/common';

export class BaseInteractionService implements IBaseInteractionService {
    private readonly _fetcher: ApiHelper;

    constructor(private API_URL: string) {
        this._fetcher = container.get<ApiHelper>(SERVICE_IDENTIFIER.ApiHelper);
    }

    public get<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<E.Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'get', url: url, params: data, baseURL: host, ...config });
    }

    public post<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ): Promise<E.Either<BaseInteractionError, T>> {
        const parsedData = settings?.stringify ? qs.stringify(data) : data;
        const parsedConfig = settings?.multipartData ? this.setMultipartDataHeader(config) : config;

        return this.query<T>({ method: 'post', url: url, baseURL: host, data: parsedData, ...parsedConfig });
    }

    public put<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ): Promise<E.Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'put', url: url, baseURL: host, data: data, ...config });
    }

    public delete<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<E.Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'delete', url: url, data: data, baseURL: host, ...config });
    }

    private query = async <T>(config: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
        };

        const req = axios.request<T>({ ...newConfig });
        const response = await this._fetcher.request<T>(req)();

        return E.bimap(
            (e: NetworkError) => new BaseInteractionError(e.message),
            (res: AxiosResponse<T>) => res.data,
        )(response);
    };

    private setMultipartDataHeader = (config?: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        };
        return newConfig;
    };
}
