// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: strong-supervisor
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var debug = require('./debug');
var tracer = require('../lib/tracer');
var tap = require('tap');
var w = require('./watcher');

var Worker = w.Worker;
var watcher = w.watcher;

var skipIfNoLicense = process.env.STRONGLOOP_LICENSE
                    ? false
                    : {skip: 'tested feature requires license'};

var SKIP = {skip: 'FIXME fails on agent.lrtime is not a function'};
tap.test('trace-object', SKIP || skipIfNoLicense, function(t) {
  w.select('trace-object');

  t.test('in worker, tracing disabled', function(tt) {
    var parentCtl = null;
    var cluster = Worker();
    var config = {
      enableTracing: false,
    };

    tt.doesNotThrow(function() {
      watcher.start(parentCtl, cluster, cluster, config);
    });

    tt.end();
  });

  t.test('in worker, tracing enabled', function(tt) {
    var parentCtl = null;
    var cluster = Worker(send);
    var config = {
      enableTracing: true,
    };
    process.env.STRONGLOOP_APPNAME = 'some app name';
    tt.assert(tracer.start());

    watcher.start(parentCtl, cluster, cluster, config);

    function send(msg, type) {
      debug('trace:object: %s', debug.json(msg));
      tt.equal(type, 'send');
      tt.equal(msg.cmd, 'trace:object');
      tt.equal(typeof msg.record, 'string');
      var record = JSON.parse(msg.record);
      tt.assert(record.version);
      tt.assert(record.packet);
      tt.end();
    }
  });

  t.end();
});
