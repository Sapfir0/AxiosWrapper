import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseInteractionError } from '../errors/BaseInteractionError';
import { NetworkError } from 'errors/NetworkError';
import { ValidationError } from '../errors/ValidationError';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { TokensData } from './auth';
import { IData, RequestSettings } from './common';

export interface IApiHelper {
    request: <T>(promise: Promise<AxiosResponse>) => Promise<TE.TaskEither<NetworkError, T>>;
}

export interface IBaseInteractionService {
    get: <T = any>(
        url: string,
        data?: IData,
        host?: string,
        config?: AxiosRequestConfig,
    ) => Promise<E.Either<BaseInteractionError, T>>;
    post: <T = any>(
        url: string,
        data?: IData,
        host?: string,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ) => Promise<E.Either<BaseInteractionError, T>>;
    delete: <T = any>(
        url: string,
        data?: any,
        host?: string,
        config?: AxiosRequestConfig,
    ) => Promise<E.Either<BaseInteractionError, T>>;
    put: <T = any>(
        url: string,
        data?: any,
        host?: string,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ) => Promise<E.Either<BaseInteractionError, T>>;
}


export interface IAuthInteractionService extends IBaseInteractionService {
    login: (username: string, password: string) => Promise<E.Either<ValidationError, TokensData>>
    logout: () => Promise<E.Either<BaseInteractionError, null>>
}