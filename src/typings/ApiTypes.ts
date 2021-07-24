import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseInteractionError } from 'errors/BaseInteractionError';
import { NetworkError } from 'errors/NetworkError';
import { Either } from 'fp-ts/Either';

export interface IBaseApiInteractionService {
    request: <T>(promise: Promise<AxiosResponse>) => Promise<Either<NetworkError, T>>;
}

export interface IApiInteractionService {
    get: <T = any>(
        url: string,
        data?: any,
        host?: string,
        config?: AxiosRequestConfig,
    ) => Promise<Either<BaseInteractionError, T>>;
    post: <T = any>(
        url: string,
        data?: any,
        host?: string,
        settings?: any,
        config?: AxiosRequestConfig,
    ) => Promise<Either<BaseInteractionError, T>>;
    delete: <T = any>(
        url: string,
        data?: any,
        host?: string,
        config?: AxiosRequestConfig,
    ) => Promise<Either<BaseInteractionError, T>>;
    put: <T = any>(
        url: string,
        data?: any,
        host?: string,
        settings?: any,
        config?: AxiosRequestConfig,
    ) => Promise<Either<BaseInteractionError, T>>;
}
