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

var ConnectCas = require('connect-cas2');
var bodyParser = require('body-parser');
var session = require('express-session');
// var cookieParser = require('cookie-parser');
var MemoryStore = require('session-memory-store')(session);
var casClient = new ConnectCas({
  ignore: [
    /^\/$/,
    /\/(signup)$/,
    /\..*$/
  ],
  match: [],
  servicePrefix:  process.env.SVC_PREFIX || 'https://cas-sailsjs-demo.herokuapp.com',
  serverPath: 'https://casserver.herokuapp.com',
  paths: {
    validate: '/cas/validate',
    serviceValidate: '/cas/serviceValidate',
    proxy: '/cas/proxy',
    login: '/cas/login',
    logout: '/cas/logout',
    proxyCallback: ''
  },
  redirect: false,
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
    casClient: casClient.core(),
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
      'casClient',
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

  // customMiddleware: function(app){

  //   var ConnectCas = require('connect-cas2');
  //   var bodyParser = require('body-parser');
  //   var session = require('express-session');
  //   var cookieParser = require('cookie-parser');
  //   var MemoryStore = require('session-memory-store')(session);
    
  //   app.use(cookieParser());
  //   app.use(session({
  //     name: 'NSESSIONID',
  //     secret: 'Hello I am a long long long secret',
  //     resave: true,
  //     saveUninitialized: true,
  //     store: new MemoryStore()  // or other session store
  //   }));

  //   var casClient = new ConnectCas({
  //       ignore: [
  //         /\/login/
  //       ],
  //       match: [],
  //       servicePrefix:  process.env.SVC_PREFIX || 'https://cas-sailsjs-demo.herokuapp.com',
  //       serverPath: 'https://casserver.herokuapp.com',
  //       paths: {
  //         validate: '/cas/validate',
  //         serviceValidate: '/cas/serviceValidate',
  //         proxy: '/cas/proxy',
  //         login: '/cas/login',
  //         logout: '/cas/logout',
  //         proxyCallback: ''
  //       },
  //       redirect: false,
  //       gateway: false,
  //       renew: false,
  //       slo: true,
  //       cache: {
  //         enable: true,
  //         ttl: 5 * 60 * 1000,
  //         filter: []
  //       },
  //       fromAjax: {
  //         header: 'x-client-ajax',
  //         status: 418
  //       }
  //   });

  //   app.use(casClient.core());

  //   // NOTICE: If you want to enable single sign logout, you must use casClient middleware before bodyParser.
  //   app.use(bodyParser.json());
  //   app.use(bodyParser.urlencoded({ extended: true }));

  //   // or do some logic yourself
  //   app.get('/logout', function(req, res, next) {
  //     // Do whatever you like here, then call the logout middleware
  //     console.log("logout ...")
  //     casClient.logout()(req, res, next);
  //   });

  //   app.get('/cas/loggedin/', (req, res) => res.send('Login Successful!'))
  // }
};
