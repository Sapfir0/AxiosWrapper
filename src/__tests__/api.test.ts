import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { ApiInteractionService } from '../ApiInteractionService';
import axios from 'axios';
import { userInfo } from 'os';

const API_URL = 'https://petstore.swagger.io/v2';

const api = new ApiInteractionService(API_URL);

const dogExample = {
    name: 'doggie',
    photoUrls: ['string'],
    status: 'available',
};

describe('CRUD', () => {
    test('post', async () => {
        const petEither = await api.post('/pet', dogExample)();

        expect(E.isRight(petEither)).toBeTruthy()
        if (E.isLeft(petEither)) return

        const response = await api.get(`/pet/${petEither.right.id}`)();
        expect(E.isRight(response)).toBeTruthy()
    });
});

const user = {
    username: "Alex",
    password: "12345678"
}

describe('Auth', () => {
    test('create user', async () => {
        const userEither = await api.post('/user', user)();
        expect(E.isRight(userEither)).toBeTruthy()
    });
    test('login', async () => {
        const userEither = await api.get('/user/login', user)();
        expect(E.isRight(userEither)).toBeTruthy()
    });
});


export {};
