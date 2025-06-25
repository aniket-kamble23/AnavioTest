const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl: "http://localhost:4200/",
    baseUrl: "https://ui.anavio.ai",
    viewportWidth: 1440,
    viewportHeight: 900,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
