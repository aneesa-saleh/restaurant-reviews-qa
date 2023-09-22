import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/junit/results-[hash].xml',
    jenkinsMode: true
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    baseUrl: 'https://restaurant-reviews.glitch.me/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*'],
    video: false,
  },
  env: {
    apiUrl: 'https://api-restaurant-reviews.glitch.me/',
  },
});
