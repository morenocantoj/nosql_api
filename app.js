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

/* -- Router -- */
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
  var newGun = getGunFromParameters(req)

  if (newGun != null) {
    database.insertGun(newGun, (result) => {
      if (result) {
        // New gun saved!
        responses.Created201({
          info: "New gun created!",
          created: true,
          gun_url: getFullUrl(req) + "/guns/" + newGun.id }, resp)

      } else {
        // Database error
        responses.ServerError500(resp)
      }
    })

  } else {
    // Parameter missing!
    responses.BadRequest400({
      error: "All parameters are obligatory, check which one is missing",
      parameters_list: ['name', 'cost', 'damage', 'type', 'side', 'rpm', 'penetration']
    }, resp)
  }
})

router.get('/guns', (req, resp) => {
  console.log("GET /api/guns")

  // Get all guns existing in database
  database.getAllGuns((guns) => {
    if (guns) {
      // Append gun URL to each element of array
      guns.forEach((element) => {
        element.gun_url = getFullUrl(req) + "/guns/" + element._id
      })

      responses.OK200({
        guns: guns
      }, resp)

    } else {
      // Error retrieving data
      responses.ServerError500(resp)
    }
  })
})

/* -- Server engagement -- */
module.exports = app;

var server = app.listen(process.env.PORT || port, () => {
  console.log("Server working!")
});


/* -- Methods -- */

/**
* Get current url with protocol and port
* @param req current request
*/
function getFullUrl(req) {
  var fullUrl = req.protocol + '://' + req.get('host');
  return fullUrl
}

/**
* Gets all gun parameters from request and return them in a Gun object
* @param req HTTP request
*/
function getGunFromParameters(request) {
  // Check if any parameter is missing
  if (request.body.name == undefined || request.body.cost == undefined || request.body.damage == undefined ||
      request.body.type == undefined || request.body.side == undefined || request.body.side == undefined ||
      request.body.rpm == undefined || request.body.penetration == undefined) {

    return null
  }

  var gun = new Gun()
  gun.name = request.body.name
  gun.cost = request.body.cost
  gun.damage = request.body.damage
  gun.type = request.body.type
  gun.side = request.body.side
  gun.rpm = request.body.rpm
  gun.penetration = request.body.penetration

  return gun
}
