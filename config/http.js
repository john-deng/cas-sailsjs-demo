/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */
var url = require('url');
var ConnectCas = require('connect-cas2');
var bodyParser = require('body-parser');
var session = require('express-session');
// var cookieParser = require('cookie-parser');
var MemoryStore = require('session-memory-store')(session);
var casClient = new ConnectCas({
  ignore: [
    /^\/$/,
    /\/(signup|logout)$/,
    /\..*$/
  ],
  match: [],
  servicePrefix:  process.env.SVC_PREFIX || 'http://localhost:3000',
  serverPath: process.env.SERVER_PATH || 'http://localhost:8080',
  paths: {
    validate: process.env.VALIDATE || '/cas/validate',
    serviceValidate: process.env.SVC_VALIDATE || '/cas/serviceValidate',
    proxy: process.env.PROXY || '/cas/proxy',
    login: process.env.LOGIN_PATH || '/cas/login',
    logout: process.env.LOGOUT_PATH || '/cas/logout',
    proxyCallback: ''
  },
  redirect: function(req, res) {
    // 在redirect中， 根据是否有特殊cookie来决定是否跳走
    console.log("redirect ...")
    // if (req.cookies.logoutFrom) {
    //   // 返回您想要重定向的路径
    //   return url.parse(req.cookies.logoutFrom).pathname;
    // }
  },
  gateway: false,
  renew: false,
  slo: true,
  cache: {
    enable: true,
    ttl: 5 * 60 * 1000,
    filter: []
  },
  fromAjax: {
    header: 'x-client-ajax',
    status: 418
  }
});

module.exports.casClient = casClient;

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {


    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/
    casClientCore: casClient.core(),
    bodyParser: bodyParser.json(),
    bodyParserEncoded: bodyParser.urlencoded({ extended: true }),
    session: session({
      name: 'NSESSIONID',
      secret: 'Hello I am a long long long secret',
      resave: true,
      saveUninitialized: true,
      store: new MemoryStore()  // or other session store
    }),
    // cookieParser: cookieParser(),
    order: [
      'cookieParser',
      'session',
      'casClientCore',
      'bodyParser',
      'bodyParserEncoded',
      'compress',
      'poweredBy',
      'router',
      'www',
      'favicon'
    ],


    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },
};
