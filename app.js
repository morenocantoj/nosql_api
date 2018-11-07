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


// Router
var router = express.Router()


router.get('/', (req, resp) => {
  response200OK({
    message: "Welcome to my NoSQL's API app!"}, resp)
})

// Methods

/**
* Sends a 200 OK HTTP response to client
* @param body of the response
* @param resp server response
*/
function response200OK(body, resp) {
  resp.status(200);
  resp.send(resp);
}
