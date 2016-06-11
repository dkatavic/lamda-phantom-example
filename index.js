"use strict";

var fs = require('fs'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  path = require('path'),
  childProcess = require('child_process'),
  config = require('./config');

var baseImagePath = '/tmp/';
var webSites = config.webSites;

// Entry Point
exports.handler = function(event, context, callback) {
  
  // Execute the phantom call and exit
  callPhantom(function(err) {
    if (err) {
      callback(err);
    }
    emailSC(function(err){
      callback(err);
    });
  });
}

// Get the path to the phantomjs application
function getPhantomFileName(cb) {
  cb(path.join(__dirname, 'phantomjs'));
}

// Call the phantomjs script
function callPhantom(cb) {
  
  getPhantomFileName(function(phantomJsPath) {

    var childArgs = [
      path.join(__dirname, 'phantomjs-script.js'),
      JSON.stringify(webSites),
      JSON.stringify(config.facebook)
    ];

    // This option causes the shared library loader to output
    // useful information if phantomjs can't start.
    process.env['LD_WARN'] = 'true';

    // Tell the loader to look in this script's directory for
    // the shared libraries that Phantom.js 2.0.0 needs directly.
    // This shouldn't be necessary once
    // https://github.com/ariya/phantomjs/issues/12948
    // is fixed.
    process.env['LD_LIBRARY_PATH'] = __dirname;

    console.log('Calling phantom: ', phantomJsPath, childArgs);
    var pjs = childProcess.execFile(phantomJsPath, childArgs, function(err) {
      if (err) {
        console.error("Error calling phantom");
        console.error(err);
        return cb(err);
      }
    });

    pjs.stdout.on('data', function(data) {
      console.log(data);
    });

    pjs.stderr.on('data', function(data) {
      console.error('phantom error  ---:> ' + data);
    });

    pjs.on('exit', function(code) {
      cb();
    });

  });
}

// Get Filename Based on url
function getFilenameOfUrl(url) {
  return url.replace(/[\/\:.?=]/g, '') + ".jpeg";
}


function emailSC(cb) {

  var transporter = nodemailer.createTransport(smtpTransport(config.emailConfig.smtp));

  var attachments = webSites.map((elem) => {
    return {
      filename: getFilenameOfUrl(elem),
      path: baseImagePath + getFilenameOfUrl(elem)
    };
  });
  
  attachments = attachments.concat(config.facebook.webSites.map((elem) => {
    return {
      filename: getFilenameOfUrl(elem),
      path: baseImagePath + getFilenameOfUrl(elem)
    };
  }));

  // setup e-mail data
  var mailOptions = {
    from: config.emailConfig.address, // sender address 
    to: config.emailAdresses, // list of receivers 
    subject: config.emailConfig.subject, // Subject line 
    text: config.emailConfig.text, // plaintext body 
    attachments: attachments
  };

  console.log('sending email');

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('error sending email');
      console.error(error);
      return cb(error);
    }
    console.log('Message sent: ' + info.response);
    cb();
  });
}
