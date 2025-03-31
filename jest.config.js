module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts'],
    rootDir: './src',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};