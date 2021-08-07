import { isRight } from 'fp-ts/lib/Either';
import container from '../inversify/inversifyContainer';
import { ApiInteractionService } from '../ApiInteractionService';
import { SERVICE_IDENTIFIER } from '../inversify/inversifyTypes';

const API_URL = 'https://axoltlapi.herokuapp.com/';

test('basic', async () => {
    const api = new ApiInteractionService(API_URL);
    const response = await api.get('/');
    expect(isRight(response)).toBe(true);
});

test('inverisfy', async () => {
    container.bind(SERVICE_IDENTIFIER.ApiInteractionService).toConstantValue(new ApiInteractionService(API_URL));
    const api = container.get<ApiInteractionService>(SERVICE_IDENTIFIER.ApiInteractionService);
    const response = await api.get('/');
    expect(isRight(response)).toBe(true);
});

export {};
