import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Set the base URL for your application
    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },
    specPattern: 'cypress/e2e/**/*.cy.js', // Path to test files
    supportFile: 'cypress/support/e2e.js', // Path to support file
  },
});
