var express = require('express');

var app = express();

require('./config/middleware.js')(app, express);

// database connection
module.exports = app;