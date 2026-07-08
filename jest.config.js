const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!(cheerio|parse5|parse5-htmlparser2-tree-adapter|undici)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
