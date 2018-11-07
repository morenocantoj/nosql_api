// Dependencies
var express = require('express');
var bodyparser = require('body-parser');
var url = require('url');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyparser.json() );       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var port = 3000;

// Router
var router = express.Router()
app.use('/api', router)

app.get('/', (req, resp) => {
  console.log("GET /")
  response200OK({
    message: "Welcome to my NoSQL's API app!",
    api_url: getFullUrl(req) + "/api"}, resp)
})

router.get('/', (req, resp) => {
  console.log("GET /api")
  response200OK({
    login_url: "Not implemented yet!"
  }, resp)
})

module.exports = app;

// Server engagement
var server = app.listen(process.env.PORT || port, () => {
  console.log("Server working!")
});


// Methods

/**
* Sends a 200 OK HTTP response to client
* @param body of the response
* @param resp server response
*/
function response200OK(body, resp) {
  resp.status(200);
  resp.send(body);
}

/**
* Get current url with protocol and port
* @param req current request
*/
function getFullUrl(req) {
  var fullUrl = req.protocol + '://' + req.get('host');
  return fullUrl
}
