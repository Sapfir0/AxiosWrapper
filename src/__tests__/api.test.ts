import { isRight } from 'fp-ts/lib/Either';
import { ApiInteractionService } from '../ApiInteractionService';

const API_URL = 'https://axoltlapi.herokuapp.com/';

test('basic', async () => {
    const api = new ApiInteractionService(API_URL);
    const response = await api.get('/');
    expect(isRight(response)).toBe(true);
});


export {};
