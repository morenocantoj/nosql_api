"use strict"

// Dependencies
var express = require('express');
var bodyparser = require('body-parser');
var url = require('url');
var cors = require('cors');
var database = require('./database')
var responses = require('./responses')

// Classes
var Gun = require('./Gun')

var app = express();
app.use(cors());
app.use(bodyparser.json() );       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var port = 3000;

// Database
database.connectMongo((client) => {
  if (client) {
    client.close()
  }
})

// Router
var router = express.Router()
app.use('/api', router)

app.get('/', (req, resp) => {
  console.log("GET /")
  responses.OK200({
    message: "Welcome to my NoSQL's API app!",
    api_url: getFullUrl(req) + "/api"}, resp)
})

router.get('/', (req, resp) => {
  console.log("GET /api")
  responses.OK200({
    login_url: "Not implemented yet!"
  }, resp)
})

router.post('/guns', (req, resp) => {
  console.log("POST /api/guns")
})

module.exports = app;

// Server engagement
var server = app.listen(process.env.PORT || port, () => {
  console.log("Server working!")
});


// Methods

/**
* Get current url with protocol and port
* @param req current request
*/
function getFullUrl(req) {
  var fullUrl = req.protocol + '://' + req.get('host');
  return fullUrl
}
