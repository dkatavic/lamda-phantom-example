console.log("Phantom script started");

var args = require("system").args,
    sites = args[1],
    facebook = args[2];

var baseImagePath = '/tmp/';

sites = JSON.parse(sites);
facebook = JSON.parse(facebook);

var webSitesLength = sites.length;
var fbWebSitesLength = facebook.webSites.length;
var pagesVisited = 0;
var fbPagesVisited = 0;

var webPage = require('webpage');

// Start script

webSiteScrap(function(){
  facebookScrap(function(){
    console.log("SC are done. Exiting phantom");
    phantom.exit();
  });
})

// Scrap all regular websites

function webSiteScrap(cb) {
  var timeout = 1000 + webSitesLength * 300;
  sites.forEach(function(site){
    createSC(site, timeout, function(){
      pagesVisited++;
        if (pagesVisited >= webSitesLength) {
          return cb();
        }
    });
  });
}

// scrap all facebook pages

function facebookScrap(cb) {
  facebookLogin(function(){
    var timeout = 1000 + webSitesLength * 950;
    facebook.webSites.forEach(function(site){
      createSC(site, timeout, function(){
        fbPagesVisited++;
        if (fbPagesVisited >= fbWebSitesLength) {
          return cb();
        }
      });
    });
  });
}

// Create SC of URL

function createSC(url, timeout, cb) {
  
  timeout = timeout || 3000;
  
  var page = webPage.create();
  page.open(url, function(status) {
    
    var filePath = baseImagePath + getFilenameOfUrl(url);
    page.viewportSize = {
      width: 1920
    };
    // setTimeout is because of phantomjs bug of prematurely emiting done
    setTimeout(function(){
      page.render(filePath, {format: 'jpeg', quality: '95'});
      cb();
      page.close();
    }, timeout);
  });
}

// Get Filename Based on url

function getFilenameOfUrl(url) {
  return url.replace(/[\/\:.?=]/g, '') + ".jpeg";
}

// Login to facebook

function facebookLogin(cb){
  
  var page = webPage.create();
  page.open('https://www.facebook.com/', function(status) {
    page.evaluate(function(loginData) {
      document.querySelector("#email").value = loginData.email;
      document.querySelector("#pass").value = loginData.password;
      document.querySelector("#loginbutton").click();
    }, facebook);
    setTimeout(function(){
      cb();
    }, 3000);
  })
  
}
