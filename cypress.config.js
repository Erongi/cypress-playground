const { defineConfig } = require("cypress");
require("dotenv").config();
const { MicrosoftSocialLogin } = require("cypress-social-logins").plugins;

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_MY_DOMAIN,
    supportFile: false,
    setupNodeEvents(on, config) {
      on("task", {
        MicrosoftLogin: MicrosoftSocialLogin,
      });

      return config;
    },
  },
  env: {
    TEST_MS_USERNAME: process.env.CYPRESS_TEST_MS_USERNAME,
    MY_DOMAIN: process.env.CYPRESS_MY_DOMAIN,
  },
});
