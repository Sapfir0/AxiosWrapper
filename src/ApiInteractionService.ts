import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { bimap, Either } from 'fp-ts/Either';
import * as qs from 'querystring';
import { BaseApiInteractionService } from './BaseApiInteractionService';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { NetworkError } from './errors/NetworkError';
import { IApiInteractionService } from './typings/ApiTypes';
import { RequestSettings } from './typings/common';

export class ApiInteractionService implements IApiInteractionService {
    constructor(private fetcher: BaseApiInteractionService, private API_URL: string) {}

    public get<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'get', url: url, params: data, baseURL: host, ...config });
    }

    public post<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        const parsedData = settings?.stringify ? qs.stringify(data) : data;
        const parsedConfig = settings?.multipartData ? this.setMultipartDataHeader(config) : config;

        return this.query<T>({ method: 'post', url: url, baseURL: host, data: parsedData, ...parsedConfig });
    }

    public put<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'put', url: url, baseURL: host, data: data, ...config });
    }

    public delete<T = any>(
        url: string,
        data?: any,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.query<T>({ method: 'delete', url: url, data: data, baseURL: host, ...config });
    }

    private query = async <T>(config: AxiosRequestConfig) => {
        const newConfig: AxiosRequestConfig = {
            ...config,
        };

        const req = axios.request<T>({ ...newConfig });
        const response = await this.fetcher.request<T>(req);

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
