return module.exports = {
  /**
  * Sends a 200 OK HTTP response to client
  * @param body of the response
  * @param resp server response
  */
  OK200: function(body, resp) {
    resp.status(200);
    resp.send(body);
  }
}
