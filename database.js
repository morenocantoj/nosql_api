var mongo = require('mongodb');
var bcrypt = require('bcrypt')
const saltRounds = 10;
const mongo_uri = "mongodb+srv://jaume:cDYnAOegaJGLZSs6@csgo-stats-aq1qv.mongodb.net/test?retryWrites=true"

return module.exports = {

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
    client = await module.exports.connectMongoAsync()

    let response
    let passwordHash

    try {
      // Apply bcrypt to users password
      passwordHash = await bcrypt.hash(user.password, saltRounds)

      // Insert a new user
      response = await client.db("csgo-stats").collection("users").insertOne({
        _id: user.id,
        _username: user.username,
        _password: passwordHash,
        _steam_profile: user.steam_profile,
        _otp_enable: user.otp_enable,
        _otp_secret: user.otp_secret
      })

    } catch(err) {
      console.log("Error inserting a new user!")
      return false

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
    client = await module.exports.connectMongoAsync()

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
}
