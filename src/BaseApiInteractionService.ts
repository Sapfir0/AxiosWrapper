import { AxiosResponse } from 'axios';
import { Either, left, right } from 'fp-ts/Either';
import { NetworkError } from './errors/NetworkError';

class BaseApiInteractionService {
    public request = async <T>(promise: Promise<AxiosResponse<T>>): Promise<Either<NetworkError, any>> => {
        try {
            const data = await promise;
            return right<NetworkError, AxiosResponse<T>>(data);
        } catch (e) {
            const error = { ...e };
            console.warn(error);
            return left<NetworkError, AxiosResponse<T>>(new NetworkError(error.response?.data.error ?? 'Null error'));
        }
    };
}

export default BaseApiInteractionService;
