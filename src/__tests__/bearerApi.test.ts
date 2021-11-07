import * as E from 'fp-ts/lib/Either';
import { BearerApiInteractionService } from '../BearerApiInteractionService';
import { TEST_API_URL } from '../testConfig/config';


const api = new BearerApiInteractionService(TEST_API_URL, TEST_API_URL, {
    CONNECT_TOKEN: '/connect/token',
    LOGOUT: '/connect/endsession',
});


const user = {
    username: 'Alex',
    password: '12345678',
};

describe('Auth', () => {
    test('create user', async () => {
        const userEither = await api.post('/user', user)();
        expect(E.isRight(userEither)).toBeTruthy();
    });
    test('login', async () => {
        const userEither = await api.get('/user/login', user)();
        expect(E.isRight(userEither)).toBeTruthy();
    });
});

export {};
