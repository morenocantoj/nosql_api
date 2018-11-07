// Dependencies
var express = require('express');
var bodyparser = require('body-parser');
var url = require('url');

var app = express();
var port = 3000;

module.exports = app;

// Server engagement
var server = app.listen(process.env.PORT || port, () => {
  console.log("Server working!")
});
