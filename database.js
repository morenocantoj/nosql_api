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
        callback(client)
        return null
      }
    })
  }
}
