/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],  // 匹配规则：以spec或test结尾的文件
  //testMatch: ['**/unit-test/**/*.test.ts'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};