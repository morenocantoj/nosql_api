var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');

function chk(err, done) {
  if (err) {
    console.log(err)
    done()
  }
}

describe('NoSQL´s API Test suite', function() {
  console.log("-- BEGINNING OF TESTS --")
  console.log("- MISCELANEOUS TESTS -")

  it('GET Home "/"', (done) => {
    supertest(app)
    .get('/')
    .expect(200)
    .end(function(err, result) {
      chk(err, done)
      assert.equal(result.body.message, "Welcome to my NoSQL's API app!")
      done()
    })
  })
})
