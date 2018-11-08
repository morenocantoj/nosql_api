var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');

// External dependencies
var Gun = require('../Gun')

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
  it('GET API Home "/api"', (done) => {
    supertest(app)
    .get('/api')
    .expect(200)
    .end(function(err, result) {
      chk(err, done)
      assert.notEqual(result.body.login_url, null)
      done()
    })
  })
  it('Create Gun object equal to null', () => {
    var nullGun = new Gun()
    assert.equal(nullGun.name, null)
    assert.equal(nullGun.cost, null)
    assert.equal(nullGun.type, null)
    assert.equal(nullGun.damage, null)
    assert.equal(nullGun.penetration, null)
  })
  it('Create Gun object and set some fields not equal to null', () => {
    var nullGun = new Gun()
    assert.equal(nullGun.name, null)
    assert.equal(nullGun.cost, null)
    assert.equal(nullGun.type, null)
    assert.equal(nullGun.damage, null)
    assert.equal(nullGun.penetration, null)

    nullGun.cost = 1250
    nullGun.name = 'MP9'
    assert.equal(nullGun.cost, 1250)
    assert.equal(nullGun.name, 'MP9')
  })
})
