return module.exports = {
  /**
  * Sends a 200 OK HTTP response to client
  * @param body of the response
  * @param resp server response
  */
  OK200: function(body, resp) {
    resp.status(200)
    resp.send(body)
  },

  /**
  * Sends a 201 Created HTTP response to client
  * @param body of the response
  * @param resp server response
  */
  Created201: function(body, resp) {
    resp.status(201)
    resp.send(body)
  },

  /**
  * Sends a 400 Bad Request HTTP response to client
  * @param body of the response
  * @param resp server response
  */
  BadRequest400: function(body, resp) {
    resp.status(400)
    resp.send(body)
  },

  /**
  * Sends a 500 Server Error response to client
  * @param resp server response
  */
  ServerError500: function(resp) {
    resp.status(500)
    resp.send({error: "Oops! We had an error in server side"})
  },

  /**
  * Sends a 404 Not Fund response to client
  * It's a new response, nobody knows about it
  * No, really, even Mozilla foundation didn´t know about it
  * @param resp server response
  */
  NotFound404: function(resp) {
    resp.status(404)
    resp.send({error: "Sorry, we didn´t find what you´ve been looking for!"})
  },

  /**
  * Sends a 401 Unauthorized HTTP response to client
  * @param body of the response
  * @param resp server response
  */
  Unauthorized401: function(body, resp) {
    resp.status(401)
    resp.send(body)
  }
}
