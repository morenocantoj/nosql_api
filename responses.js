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
  }
}
