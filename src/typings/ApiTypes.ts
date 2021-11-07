import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseInteractionError } from '../errors/BaseInteractionError';
import { NetworkError } from '../errors/NetworkError';
import { ValidationError } from '../errors/ValidationError';
import { Either } from 'fp-ts/lib/Either';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { TokensData } from './auth';
import { IData, RequestSettings } from './common';

export interface IApiHelper {
    request: <T>(promise: Promise<AxiosResponse>) => TaskEither<NetworkError, T>;
}

export interface IBaseInteractionService {
    get: <T = any>(
        url: string,
        data?: IData,
        host?: string,
        config?: AxiosRequestConfig,
    ) => TaskEither<BaseInteractionError, T>;
    post: <T = any>(
        url: string,
        data?: IData,
        host?: string,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ) => TaskEither<BaseInteractionError, T>;
    delete: <T = any>(
        url: string,
        data?: any,
        host?: string,
        config?: AxiosRequestConfig,
    ) => TaskEither<BaseInteractionError, T>;
    put: <T = any>(
        url: string,
        data?: any,
        host?: string,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ) => TaskEither<BaseInteractionError, T>;
}

export interface IIdentityInteractionService extends IBaseInteractionService {
    login: (username: string, password: string) => TaskEither<ValidationError, TokensData>;
    logout: () => TaskEither<BaseInteractionError, null>;
}
