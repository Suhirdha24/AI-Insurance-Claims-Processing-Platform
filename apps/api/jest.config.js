module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@ai-insurance/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
};
