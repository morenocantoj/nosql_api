var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');
const uuid = require('uuid/v4')

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
  it('Create Gun object with non null UUID', () => {
    var uuidGun = new Gun()
    assert.notEqual(uuidGun.id, null)
  })
  it('POST /api/guns for create a Gun expected 400 Bad Request', (done) => {
    supertest(app)
    .post('/api/guns')
    .send({name: "MP9", cost: 1250})
    .set('Content-Type', 'application/json')
    .expect(400)
    .end(function(err, result) {
      chk(err, done)
      assert.notEqual(result.body.error, null)
      assert.notEqual(result.body.parameters_list, null)
      done()
    })
  })
  it('POST /api/guns for create a Gun expected 201 Created', (done) => {
    supertest(app)
    .post('/api/guns')
    .send({
    	name: "MP9",
    	cost: 1250,
    	damage: 389,
    	type: "SMG",
    	side: "CT/T",
    	rpm: 857,
    	penetration: 50.0
    })
    .set('Content-Type', 'application/json')
    .expect(201)
    .end(function(err, result) {
      chk(err, done)
      assert.equal(result.body.created, true)
      assert.notEqual(result.body.info, null)
      assert.notEqual(result.body.gun_url, null)
      done()
    })
  })

  var selected_gun
  it('GET /api/guns for retrieve all guns expected 200 OK', (done) => {
    supertest(app)
    .get('/api/guns')
    .expect(200)
    .end((err, result) => {
      chk(err, done)
      assert.notEqual(result.body.guns, null)
      assert.notEqual(result.body.guns[0].gun_url, null)
      selected_gun = result.body.guns[0]
      done()
    })
  })
  it('GET /api/guns/123 for retrieve one gun expected 404 Not Fund', (done) => {
    supertest(app)
    .get('/api/guns/123')
    .expect(404, done)
  })
  it('GET /api/guns/:id for retrieve one gun expected 200 OK', (done) => {
    supertest(app)
    .get('/api/guns/'+selected_gun._id)
    .expect(200)
    .end((err, result) => {
      chk(err, done)
      assert.equal(result.body.gun._name, "MP9")
      assert.equal(result.body.gun._cost, 1250)
      assert.equal(result.body.gun._penetration, 50)
      assert.equal(result.body.gun._damage, 389)
      assert.equal(result.body.gun._type, "SMG")
      assert.equal(result.body.gun._side, "CT/T")
      assert.equal(result.body.gun._rpm, 857)
      done()
    })
  })
})
