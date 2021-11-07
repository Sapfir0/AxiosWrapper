import { LocalStorage } from '../LocalStorage';

const userDB = new LocalStorage('user');

beforeEach(() => {
    userDB.remove()
})

test('simple set', () => {
    const setter = { bar: 'baz' };
    userDB.set(setter);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(setter));
});

test('remove', () => {
    const setter = { bar: 'baz' };
    userDB.set(setter);
    userDB.remove()
    expect(localStorage.getItem('user')).toBe(null);
});