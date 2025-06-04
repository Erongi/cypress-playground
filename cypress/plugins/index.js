const socialLogin = require("cypress-social-logins").plugins;

module.exports = (on, config) => {
  on("task", {
    MicrosoftLogin: socialLogin,
  });
};
