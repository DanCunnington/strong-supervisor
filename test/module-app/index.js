// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-supervisor
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

var options = require('optimist').argv;
var express = require('express');
var app = express();

app.set('port', options.port || process.env.PORT || 0);

app.get('/', (function() {
  var started = new Date();
  return function(req, res) {
    res.send({
      started: started,
      uptime: (Date.now() - Number(started)) / 1000
    });
  };
})());

app.get('/delay', function(req, res) {
  setTimeout(function() { // line 18
    res.send('OK\n'); // line 19
  }, Math.random() * 100);
});

var server = app.listen(app.get('port'), function() {
  console.log('module-app listening on http://localhost:%d',
              server.address().port);
  process.argv.forEach(function(v, i, a) {
    console.log('argv %d: %s', i, v);
  });
  console.log('env VAR="%s"', process.env.VAR);

  Object.keys(process.env).forEach(function(v, i, a) {
    if (/STRONGLOOP/.test(v) || /SL/.test(v))
      console.log('env %s="%s"', v, process.env[v]);
  });
});
