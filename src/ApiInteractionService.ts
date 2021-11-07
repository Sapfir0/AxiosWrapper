import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either, fold } from 'fp-ts/lib/Either';
import * as qs from 'querystring';
import { TaskEither, bimap } from 'fp-ts/lib/TaskEither';
import { ApiHelper } from './ApiHelper';
import { BaseInteractionError } from './errors/BaseInteractionError';
import { NetworkError } from './errors/NetworkError';
import { IBaseInteractionService } from './typings/ApiTypes';
import { IData, RequestSettings } from './typings/common';
import { flow, pipe } from 'fp-ts/function';

export class ApiInteractionService<URL extends string = string> implements IBaseInteractionService<URL> {
    private readonly _fetcher: ApiHelper;
    protected readonly defaultSettings = { host: this.API_URL };

    constructor(private API_URL: string) {
        this._fetcher = new ApiHelper();
    }

    public get<T = any>(
        url: URL,
        data?: any,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return this.query<T>({ method: 'get', url: url, params: data, baseURL: settings?.host, ...settings?.config });
    }

    public post<T = any>(
        url: URL,
        data?: any,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        const parsedData = settings?.stringify ? qs.stringify(data) : data;
        const parsedConfig = settings?.multipartData ? this.setMultipartDataHeader(settings.config) : settings.config;

        return this.query<T>({ method: 'post', url: url, baseURL: settings.host, data: parsedData, ...parsedConfig });
    }

    public put<T = any>(
        url: URL,
        data?: IData,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return this.query<T>({ method: 'put', url: url, baseURL: settings.host, data: data, ...settings.config });
    }

    public delete<T = any>(
        url: URL,
        data?: IData,
        settings: RequestSettings = this.defaultSettings,
    ): TaskEither<BaseInteractionError, T> {
        return this.query<T>({ method: 'delete', url: url, data: data, baseURL: settings.host, ...settings.config });
    }

    private query = <T>(config: AxiosRequestConfig) => {
        return flow<
            [AxiosRequestConfig],
            Promise<AxiosResponse<T>>,
            TaskEither<NetworkError, AxiosResponse<T>>,
            TaskEither<BaseInteractionError, T>
        >(
            axios.request,
            this._fetcher.request,
            bimap(
                (e: NetworkError) => new BaseInteractionError(e.message),
                (res: AxiosResponse<T>) => res.data,
            ),
        )(config);
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
