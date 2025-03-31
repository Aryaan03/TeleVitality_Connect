module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Use babel-jest to transform .js, .jsx, .ts, and .tsx files
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./setupTests.js'], // Simulates a browser-like environment for testing React components
  extensionsToTreatAsEsm: ['.jsx'], // Treat .jsx files as ESM
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
};
