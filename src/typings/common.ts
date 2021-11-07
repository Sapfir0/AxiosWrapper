import { AxiosRequestConfig } from 'axios';

export interface RequestSettings {
    host?: string;
    config?: AxiosRequestConfig;
    stringify?: boolean;
    multipartData?: boolean;
}

export interface IDataIndex {
    [name: string]: any;
}

export type IData = IDataIndex | FormData;
