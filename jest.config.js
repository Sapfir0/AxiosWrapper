module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    setupFilesAfterEnv: ['<rootDir>/src/testConfig/localStorageMock.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
