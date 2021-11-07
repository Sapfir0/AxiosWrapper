import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either } from 'fp-ts/lib/Either';
import * as qs from 'querystring';
import { TaskEither, bimap } from 'fp-ts/lib/TaskEither';
import { ApiHelper } from './ApiHelper';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { NetworkError } from './errors/NetworkError';
import { IBaseInteractionService } from './typings/ApiTypes';
import { IData, RequestSettings } from './typings/common';

export class ApiInteractionService implements IBaseInteractionService {
    private readonly _fetcher: ApiHelper;

    constructor(private API_URL: string) {
        this._fetcher = new ApiHelper();
    }

    public get<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): TaskEither<BaseInteractionError, T> {
        return this.query<T>({ method: 'get', url: url, params: data, baseURL: host, ...config });
    }

    public post<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ): TaskEither<BaseInteractionError, T> {
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
    ): TaskEither<BaseInteractionError, T> {
        return this.query<T>({ method: 'put', url: url, baseURL: host, data: data, ...config });
    }

    public delete<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): TaskEither<BaseInteractionError, T> {
        return this.query<T>({ method: 'delete', url: url, data: data, baseURL: host, ...config });
    }

    private query = <T>(config: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
        };

        const req = axios.request<T>({ ...newConfig });
        const response = this._fetcher.request<T>(req);

        return bimap(
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
