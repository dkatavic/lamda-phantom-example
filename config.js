// config.js

module.exports = {
  // email config
  emailConfig: {
    subject: 'Lambda email',
    text: 'Check atachment',
    address: 'upwork.emailsender@yahoo.com',
    password: '1pQwasd1c',
    smtp: {
      host: 'plus.smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        // TODO: refactor this. it's the same as emailConfig.adress/password. You can leave it blank, It's c/p on the bottom of config.js for now
        user: null,
        pass: null
      }
    }
  },
  // email adresses to send report email
  emailAdresses: ["domo1503@gmail.com"],
  // web sites to create screenshot
  webSites: ['http://www.index.hr/'],
  // If you want to screenshot facebook pages while been logged in, fill facebook configs
  facebook: {
    // facebook user email to login
    email: '',
    // facebook user password
    password: '',
    // facebook websites to screenshot
    webSites: ['https://www.facebook.com/AndroidPolice/','https://www.facebook.com/PrestigeSplit/','https://www.facebook.com/BeStrong-Fitness-1444189089216615/?fref=ts']
  }
  
};

module.exports.emailConfig.smtp.auth.user = module.exports.emailConfig.address;
module.exports.emailConfig.smtp.auth.pass = module.exports.emailConfig.password;