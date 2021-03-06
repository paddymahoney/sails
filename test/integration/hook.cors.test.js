/**
 * Module dependencies
 */

var assert = require('assert');
var httpHelper = require('./helpers/httpHelper.js');
var appHelper = require('./helpers/appHelper');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var tmp = require('tmp');

var Sails = require('../../lib').constructor;


describe('CORS config ::', function() {

  var setups = {
    'with default settings': {
      expectations: [
        {
          route: 'PUT /no-cors-config',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'OPTIONS /no-cors-config',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
           'access-control-allow-origin': '*',
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /origin-example-com',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /origin-example-com',
          request_headers: {origin: 'http://somewhere.com'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'OPTIONS /origin-example-com',
          request_headers: {origin: 'http://somewhere.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'OPTIONS /origin-example-com',
          request_headers: {origin: 'http://somewhere.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /origin-example-com-somewhere-com',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /origin-example-com-somewhere-com',
          request_headers: {origin: 'http://somewhere.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://somewhere.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com',
          request_headers: {origin: 'http://somewhere.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://somewhere.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com',
          request_headers: {origin: 'http://somewhere.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /origin-example-com-somewhere-com-array',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com-array',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com-array',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /origin-example-com-somewhere-com-array',
          request_headers: {origin: 'http://somewhere.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://somewhere.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com-array',
          request_headers: {origin: 'http://somewhere.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://somewhere.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /origin-example-com-somewhere-com-array',
          request_headers: {origin: 'http://somewhere.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: null
        },
        {
          route: 'PUT /all-methods-origin-example-com',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /all-methods-origin-example-com',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'POST /all-methods-origin-example-com',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /all-methods-origin-example-com',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },

        {
          route: 'DELETE /unsafe',
          request_headers: {origin: 'http://foobar.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://foobar.com',
            'access-control-allow-credentials': 'true',
            'vary': 'Origin'
          }
        },

        {
          route: 'OPTIONS /unsafe',
          request_headers: {origin: 'http://foobar.com', 'access-control-request-method': 'DELETE'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://foobar.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-credentials': 'true',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },

      ]
    },

    'with `allRoutes: true`': {
      sailsCorsConfig: {allRoutes: true},
      expectations: [
        {
          route: 'PUT /no-cors-config',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': '*',
          }
        },
        {
          route: 'OPTIONS /no-cors-config',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
           'access-control-allow-origin': '*',
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
          }
        },
      ],
    },
    'with `allRoutes: true`, `credentials: true`, `allowAnyOriginWithCredentialsUnsafe: true`': {
      sailsCorsConfig: {allRoutes: true, credentials: true, allowAnyOriginWithCredentialsUnsafe: true},
      expectations: [
        {
          route: 'PUT /no-cors-config',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin':'http://example.com',
            'access-control-allow-methods': undefined,
            'access-control-allow-headers': undefined,
            'access-control-allow-credentials': 'true',
            'access-control-exposed-headers': undefined,
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /no-cors-config',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin':'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'access-control-allow-credentials': 'true',
            'access-control-exposed-headers': undefined,
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin':'http://example.com',
            'access-control-allow-methods': undefined,
            'access-control-allow-headers': undefined,
            'access-control-allow-credentials': 'true',
            'access-control-exposed-headers': undefined,
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin':'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'access-control-allow-credentials': 'true',
            'access-control-exposed-headers': undefined,
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin':'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'access-control-allow-credentials': 'true',
            'access-control-exposed-headers': undefined,
            'vary': 'Origin'
          }
        },
      ]
    },
    'with `allRoutes: true`, `origin: http://example.com`': {
      sailsCorsConfig: {allRoutes: true, origin: 'http://example.com'},
      expectations: [
        {
          route: 'PUT /no-cors-config',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /no-cors-config',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
           'access-control-allow-origin': 'http://example.com',
           'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://somewhere.com'},
          response_status: 200,
          response_headers: null
        },
      ]
    },
    'with `allRoutes: true`, `origin: http://example.com, http://somewhere.com`': {
      sailsCorsConfig: {allRoutes: true, origin: 'http://example.com, http://somewhere.com'},
      expectations: [
        {
          route: 'PUT /no-cors-config',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /no-cors-config',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
           'access-control-allow-origin': 'http://example.com',
           'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://somewhere.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://somewhere.com',
            'vary': 'Origin'
          }
        },
      ]
    },
    'with `allRoutes: true`, `origin: [\'http://example.com\', \'http://somewhere.com\']`': {
      sailsCorsConfig: {allRoutes: true, origin: ['http://example.com', 'http://somewhere.com']},
      expectations: [
        {
          route: 'PUT /no-cors-config',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /no-cors-config',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://example.com'},
          response_status: 200,
          response_headers: {
           'access-control-allow-origin': 'http://example.com',
           'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'PUT'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'OPTIONS /cors-true',
          request_headers: {origin: 'http://example.com', 'access-control-request-method': 'POST'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://example.com',
            'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
            'access-control-allow-headers': 'content-type',
            'vary': 'Origin'
          }
        },
        {
          route: 'PUT /cors-true',
          request_headers: {origin: 'http://somewhere.com'},
          response_status: 200,
          response_headers: {
            'access-control-allow-origin': 'http://somewhere.com',
            'vary': 'Origin'
          }
        },
      ]
    }
  };

  _.each(setups, function(setup, name) {
    describe(name, function() {
      var sailsApp;

      before(function(done) {
        (new Sails()).load({
            hooks: {grunt: false, views: false, blueprints: false, policies: false},
            log: {level: 'error'},
            cors: setup.sailsCorsConfig,
            routes: {
              'PUT /no-cors-config': function(req, res){return res.ok();},
              'PUT /cors-true': {cors: true, target: function(req, res){return res.ok();}},
              'PUT /origin-example-com': {cors: {origin: 'http://example.com'}, target: function(req, res){return res.ok();}},
              'PUT /origin-example-com-somewhere-com': {cors: {origin: 'http://example.com, http://somewhere.com'}, target: function(req, res){return res.ok();}},
              'PUT /origin-example-com-somewhere-com-array': {cors: {origin: ['http://example.com', 'http://somewhere.com']}, target: function(req, res){return res.ok();}},
              '/all-methods-origin-example-com': {cors: {origin: 'http://example.com'}, target: function(req, res){return res.ok();}},
              '/unsafe': {cors: {origin: '*', credentials: true, allowAnyOriginWithCredentialsUnsafe: true}, target: function(req, res){return res.ok();}},
            }
          }, function(err, _sails) {
            sailsApp = _sails;
            return done(err);
          }
        );
      });

      after(function(done) {
        sailsApp.lower(done);
      });

      _.each(setup.expectations, function(expectation) {
        var routeParts = expectation.route.split(' ');
        var method = routeParts[0];
        var path = routeParts[1];
        describe('a ' + method.toUpperCase() + ' request to ' + path + ' using ' + JSON.stringify(expectation.request_headers), function() {

          var responseHolder = {};
          before(function(done) {
            sailsApp.request({
              url: path,
              method: method,
              headers: expectation.request_headers
            }, function (err, response, data) {
              if (err) {return done(err);}
              responseHolder.response = response;
              return done();
            });
          });

          it('should respond with status code ' + expectation.response_status, function() {
            assert.equal(responseHolder.response.statusCode, expectation.response_status);
          });

          var expectedHeaders = _.extend({}, {
            'access-control-allow-origin': undefined,
            'access-control-allow-methods': undefined,
            'access-control-allow-headers': undefined,
            'access-control-allow-credentials': undefined,
            'access-control-exposed-headers': undefined,
            'vary': undefined
          }, expectation.response_headers || {});

          expectHeaders(responseHolder, expectedHeaders);

        });
      });

    });
  });

  describe('with invalid global CORS config ({allRoutes: true, origin: \'*\', credentials: true})', function() {

    it('should fail to lift', function(done) {
      (new Sails()).load({
          hooks: {grunt: false, views: false, blueprints: false, policies: false},
          log: {level: 'silent'},
          cors: {allRoutes: true, origin: '*', credentials: true},
        }, function(err, _sails) {
          if (err) {return done();}
          return done(new Error('Sails should have failed to lift with invalid global CORS config!'));
        }
      );
    });

  });

  describe('with invalid route CORS config ({allRoutes: true, origin: \'*\', credentials: true})', function() {

    it('should fail to lift', function(done) {
      (new Sails()).load({
          hooks: {grunt: false, views: false, blueprints: false, policies: false},
          log: {level: 'silent'},
          routes: {
            '/invalid': {cors: {origin: '*', credentials: true}}
          }
        }, function(err, _sails) {
          if (err) {return done();}
          return done(new Error('Sails should have failed to lift with invalid route CORS config!'));
        }
      );
    });

  });

}); //</describe('CORS config ::')>


function makeRequest(options, responseHolder, sailsApp) {
  return function(done) {
    sailsApp.request(options, function (err, response, data) {
      if (err) {return done(err);}
      responseHolder.response = response;
      return done();
    });
  };
}

function expectHeaders(responseHolder, headers) {
  _.each(headers, function(val, header) {
    if (_.isUndefined(val)) {
      it('`' + header + '` should be undefined', function(){ assert(_.isUndefined(responseHolder.response.headers[header]), responseHolder.response.headers[header]); });
    } else {
      it('`' + header + '` should be `' + val + '`', function(){ assert.equal(responseHolder.response.headers[header], val); });
    }
  });

}


