module.exports = {
  preset: 'ts-jest',
  testTimeout: 20000,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.*/node_modules/'],
  modulePathIgnorePatterns: ['./dist'],
  //setupFiles: ['dotenv/config'],
  coverageReporters: ["cobertura", "clover", "json", "lcov", "text"],
  collectCoverageFrom: [
    '**/*.{ts,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};