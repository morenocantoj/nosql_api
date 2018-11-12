var mongo = require('mongodb');
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
  }
}
