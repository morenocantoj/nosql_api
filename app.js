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
var User = require('./User')

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

// Guns management
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

router.get('/guns/:id', (req, resp) => {
  console.log("GET /api/guns/{id}")

  var gunId = req.params.id
  if (gunId) {
    // Create a new gun from existing id
    var gun = new Gun()
    gun.id = gunId

    // Check if gun exists in database
    gun.retrieveFromDatabase((response) => {
      if (response) {
        responses.OK200({
          gun: gun
        }, resp)

      } else {
        // Not found
        responses.NotFound404(resp)
      }
    })

  } else {
    // Missing parameter, not reached because API enters /api/guns route
    responses.BadRequest400({
      error: "Missing id parameter!"
    }, resp)
  }
})

router.delete('/guns/:id', (req, resp) => {
  console.log("DELETE /api/guns/{id}")

  var gunId = req.params.id
  if (gunId) {
    // Create a new gun from existing id
    var gun = new Gun()
    gun.id = gunId

    // Check if gun exists in database
    gun.retrieveFromDatabase((response) => {
      if (response) {

        // Delete gun
        gun.delete((deleted) => {
          if (deleted) {
            responses.OK200({
              info: "Gun deleted successfully!",
              guns_url: getFullUrl(req) + "/api/guns"
            }, resp)

          } else {
            // Error ocurred in some point of deleting process
            responses.ServerError500(resp)
          }
        })

      } else {
        // Not found
        responses.NotFound404(resp)
      }
    })

  } else {
    // Missing id parameter
    responses.BadRequest400({
      error: "Missing id parameter!"
    }, resp)
  }
})

// User management
router.post('/users', async (req, resp) => {
  console.log("POST /api/users")
  var newUser = getUserFromParameters(req)

  if (newUser != null) {
    var inserted = await newUser.save()

    if (inserted.err == 'DUPL_REC') {
      // Parameter missing!
      responses.BadRequest400({
        error: "That user already exists in database!"
      }, resp)

    } else if(inserted.err == "MIN_LENGTH") {
      // Parameter missing!
      responses.BadRequest400({
        error: "Username and password need to be, at least, 4 characters!"
      }, resp)

    } else if (inserted == true) {
      responses.Created201({
        info: "New user created",
        created: true,
        user_url: getFullUrl(req) + "/api/users/" + newUser.id
      }, resp)

    } else {
      // Server error
      responses.ServerError500(resp)
    }

  } else {
    // Parameter missing!
    responses.BadRequest400({
      error: "Username and password are required!"
    }, resp)
  }
})

router.post('/login', async (req, resp) => {
  console.log("POST /api/login")
  var user = getUserFromParameters(req)

  if (user != null) {
    // Attempt to login
    var login = await user.checkInDatabase()

    if (login) {
      responses.OK200({
        info: "You're logged in successfully!",
        user_url: getFullUrl(req) + "/api/users/" + user.id
      }, resp)

    } else {
      // Credentials error
      responses.Unauthorized401({
        error: "Username or password not valid"
      }, resp)
    }

  } else {
    // Parameter missing!
    responses.BadRequest400({
      error: "Username and password are required!"
    }, resp)
  }
})

router.delete('/users/:id', async (req, resp) => {
  console.log("DELETE /api/users/{id}")
  var userId = req.params.id

  if (userId) {
    try {
      // Create user object and assign id
      var user = new User()
      user.id = userId

      // Delete user object
      let deleted = await user.delete()

      if (deleted.err == 'COLL_NO_EXISTS') {
        // User no exists in database
        responses.NotFound404(resp)

      } else if (deleted.err == 'DB_FAIL') {
        // Failed to connect to database
        responses.ServerError500(resp)

      } else {
        // User deleted successfully
        responses.OK200({
          info: 'User deleted successfully'
        }, resp)
      }

    } catch (err) {
      throw err
      responses.ServerError500(resp)
    }

  } else {
    // Missing user id parameter
    responses.BadRequest400({
      error: "Missing id parameter!"
    }, resp)
  }
})

/* -- Server engagement -- */
module.exports = app;
database.initDatabase((dbInit) => {
  if (dbInit) {
    var server = app.listen(process.env.PORT || port, () => {
      console.log("Server listening!")
    });

  } else {
    console.log("Error initiating database!!!")
    process.exit(22)
  }
})

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

/**
* Gets all user parameters from request and return them in a User object
* @param req HTTP request
*/
function getUserFromParameters(request){
  // Check obligatory parameters missing
  if (request.body.username == undefined || request.body.password == undefined) return null

  var user = new User(request.body.username, request.body.password)
  if (request.body.steam_profile) user.steam_profile = request.body.steam_profile

  return user

}
