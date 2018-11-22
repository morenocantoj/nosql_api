var mongo = require('mongodb');
var bcrypt = require('bcrypt')
const saltRounds = 10;

// Database constants
const mongo_uri = "mongodb+srv://jaume:cDYnAOegaJGLZSs6@csgo-stats-aq1qv.mongodb.net/test?retryWrites=true"
const db_selected = "csgo-stats"

/**
* Manages database error thrown
* @param err MongoDB thrown error object
*/
function manage_dberr(err) {
  switch (err.code) {
    case 11000:
      // Duplicate insert record
      return { err: 'DUPL_REC' }
      break;
    case 121:
      // minLength not accomplished
      return { err: 'MIN_LENGTH' }
      break;
    default:
      // Default server error
      return { err: 'DB_FAIL' }
  }
}

return module.exports = {

  /**
  * Inits database collections and rules
  */
  initDatabase: function(callback) {
    mongo.connect(mongo_uri, {useNewUrlParser: true}, (err, client) => {
      if (client == null) return callback({ err: 'DB_FAIL' })

      client.db(db_selected).createCollection("users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["_id", "_username", "_password"],
            properties: {
              _username: {
                bsonType: "string",
                description: "must be an string, is required and must contain at least 4 characters",
                minLength: 4,
                maxLength: 255,
              },
              _password: {
                bsonType: "string",
                description: "must be an string between 4 and 24 characters",
                minLength: 4
              },
              _steam_profile: {
                bsonType: "string"
              },
              _otp_enable: {
                bsonType: "bool"
              },
              _otp_secret: {
                bsonType: "string"
              }
            }
          }
        }
      }, (response) => {
        client.db(db_selected).createCollection("guns", () => {
          client.db(db_selected).collection('users').createIndex({ _username: 1 }, { unique: true }, (response) => {
            client.close()
            callback(true)
            return null
          });
        })
      })
    })
  },

  // Connect to database
  connectMongo: function(callback) {
    mongo.connect(mongo_uri, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        console.error("Error connecting MongoDB database!");
        callback(false)
        return null

      } else {
        console.log("Connected to MongoDB database")
        callback(client.db("csgo-stats"))

        client.close()
        console.log("Client to MongoDB closed")
        return null
      }
    })
  },

  // Connect to database with async/await
  connectMongoAsync: async function() {
    var client
    try {
      client = await mongo.connect(mongo_uri, {useNewUrlParser: true})
    } catch (err) {
      console.error("Error connecting MongoDB database!");
      throw err
      return { err: 'DB_FAIL' }
    }

    console.log("Connected to MongoDB database")
    return client
  },

  /**
  * Inserts a new gun record into Guns collection
  * @param gun new gun to insert
  * @param callback function
  */
  insertGun: (gun, callback) => {
    module.exports.connectMongo((client) => {
      if (client == null) return callback(false)

      // Insert new collection
      client.collection("guns").insertOne(gun, (err, res) => {
        if (err) return callback(false)

        // Else, new gun is inserted successfully
        console.log("New gun inserted!")

        callback(true)
        return null
      })
    })
  },

  /**
  * Retrieves all guns in a record
  * @param callback function
  */
  getAllGuns: (callback) => {
    module.exports.connectMongo((client) => {
      if (client == null) return callback(false)

      // Retrieve all guns existing
      client.collection("guns").find({}).toArray((err, res) => {
        if (err) return callback(false)

        callback(res)
        return null
      })
    })
  },

  /**
  * Retrieves one gun data searching it by his id
  * @param gun with id
  * @param callback function
  */
  getGun: (gun, callback) => {
    module.exports.connectMongo((client) => {
      if (client == null) return callback(false)

      // Retrieve the gun
      client.collection("guns").findOne({_id : gun.id}, (err, result) => {
        if (err) throw err

        callback(result)
        return null
      })
    })
  },

  /**
  * Deletes one gun from collection
  * @param gun object
  * @param callback function
  */
  deleteGun: (gun, callback) => {
    module.exports.connectMongo((client) => {
      if (client == null) return callback(false)

      // Delete the gun
      client.collection("guns").deleteOne({_id: gun.id}, (err, result) => {
        if (err) throw err

        callback(true)
        return null
      })
    })
  },

  /**
  * Inserts one gun to database
  * @param user object
  */
  insertUser: async function(user) {
    // Get client first
    var client = await module.exports.connectMongoAsync()

    let response
    let passwordHash

    try {
      // Apply bcrypt to users password
      passwordHash = await bcrypt.hash(user.password, saltRounds)

      // Insert a new user
      response = await client.db("csgo-stats").collection("users").insertOne({
        _id: String(user.id),
        _username: String(user.username),
        _password: String(passwordHash),
        _steam_profile: String(user.steam_profile),
        _otp_enable: Boolean(user.otp_enable),
        _otp_secret: String(user.otp_secret)
      })

    } catch(err) {
      console.log("Error inserting a new user!")
      return manage_dberr(err)

    } finally {
      // Close db client
      client.close()
    }

    console.log("New user inserted successfully!")
    return true
  },

  /**
  * Checks username and password in database
  * @param username nickname of user to compare
  * @param password password of user to compare
  */
  checkUser: async function(username, password) {
    var client = await module.exports.connectMongoAsync()

    let response
    let passwordCheck

    try {
      // Find user
      response = await client.db("csgo-stats").collection("users").findOne({_username: username})

      // If response is null there's no user
      if(response == null) return false

      // Check password
      passwordCheck = await bcrypt.compare(password, response._password)
      return passwordCheck

    } catch(err) {
      console.log("Error retrieving data from database!")
      throw err

    } finally {
      // Close db client
      client.close()
    }
  },

  /**
  * Deletes this user in database if exists
  * @param user user to delete
  */
  deleteUser: async function(user) {
    var client = await module.exports.connectMongoAsync()

    try {
      // Delete user if exists
      let response = await client.db("csgo-stats").collection("users").deleteOne({_id: user.id})
      return response.deletedCount > 0 ? true : { err: 'COLL_NO_EXISTS' }

    } catch (err) {
      console.log("Error deleting data from database")
      console.log(err)
      return { err : 'DB_FAIL' }

    } finally {
      // Close db client
      client.close()
    }
  },
}
