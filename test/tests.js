var app = require('../app');
var supertest = require('supertest');
var assert = require('assert');
const uuid = require('uuid/v4')

// External dependencies
var Gun = require('../Gun')
var User = require('../User')

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
  }).timeout(4000)
  it('Create Gun object and set some fields not equal to null', (done) => {
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
    done()
  }).timeout(4000)
  it('Create Gun object with non null UUID', (done) => {
    var uuidGun = new Gun()
    assert.notEqual(uuidGun.id, null)
    done()
  }).timeout(4000)
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
  }).timeout(4000)
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
  }).timeout(4000)

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
  }).timeout(4000)
  it('GET /api/guns/123 for retrieve one gun expected 404 Not Fund', (done) => {
    supertest(app)
    .get('/api/guns/123')
    .expect(404, done)
  }).timeout(4000)
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
  }).timeout(4000)
  it('DELETE /api/guns/123 expected 404 Not Found', (done) => {
    supertest(app)
    .delete('/api/guns/123')
    .expect(404, done)
  }).timeout(4000)
  it('DELETE /api/guns/:id expected 200 OK', (done) => {
    supertest(app)
    .delete('/api/guns/'+selected_gun._id)
    .expect(200)
    .end(function(err, result) {
      chk(err, done)
      assert.notEqual(result.body.info, null)
      assert.notEqual(result.body.guns_url, null)
      done()
    })
  }).timeout(4000)
  it('Create User object with non null UUID, username and password', (done) => {
    var uuidUser = new User('pashaBiceps', 'thegreatjaroslaw')
    assert.notEqual(uuidUser.id, null)
    assert.equal(uuidUser.username, 'pashaBiceps')
    assert.equal(uuidUser.password, 'thegreatjaroslaw')
    done()
  }).timeout(4000)
  it('Create User object and set some fields', (done) => {
    var uuidUser = new User('pashaBiceps', 'thegreatjaroslaw')
    assert.notEqual(uuidUser.id, null)
    assert.equal(uuidUser.username, 'pashaBiceps')
    assert.equal(uuidUser.password, 'thegreatjaroslaw')
    uuidUser.username = 'papaBiceps'
    uuidUser.otp_enable = true
    uuidUser.otp_secret = 'secret'
    assert.equal(uuidUser.username, 'papaBiceps')
    assert.equal(uuidUser.otp_enable, true)
    assert.equal(uuidUser.otp_secret, 'secret')
    done()
  }).timeout(4000)
  var user_selected_url
  it('Create User object and insert it into database', (done) => {
    supertest(app)
    .post('/api/users')
    .send({
      username: "morenocantoj",
      password: "secret",
    })
    .set('Content-Type', 'application/json')
    .expect(201)
    .end(function(err, result) {
      chk(err, done)
      assert.equal(result.body.created, true)
      assert.notEqual(result.body.info, null)
      assert.notEqual(result.body.user_url, null)

      var parts = result.body.user_url.split('/');
      user_selected_url = parts.pop() || parts.pop();  // handle potential trailing slash
      done()
    })
  }).timeout(4000)
  it('Create User object expected 400', (done) => {
    supertest(app)
    .post('/api/users')
    .send({
      username: "morenocantoj",
    })
    .set('Content-Type', 'application/json')
    .expect(400, done)
  }).timeout(4000)
  it('User login expect 401', (done) => {
    supertest(app)
    .post('/api/login')
    .send({
      username: "wrongusername",
      password: "wrongpassword"
    })
    .set('Content-Type', 'application/json')
    .expect(401, done)
  }).timeout(4000)
  it('User login expect 400', (done) => {
    supertest(app)
    .post('/api/login')
    .send({
      username: "elfary"
    })
    .set('Content-Type', 'application/json')
    .expect(400, done)
  }).timeout(4000)
  var user_selected_url2
  it('Create User object and insert it into database II', (done) => {
    supertest(app)
    .post('/api/users')
    .send({
      username: "elfary",
      password: "secret",
    })
    .set('Content-Type', 'application/json')
    .expect(201)
    .end(function(err, result) {
      chk(err, done)
      assert.equal(result.body.created, true)
      assert.notEqual(result.body.info, null)
      assert.notEqual(result.body.user_url, null)

      var parts = result.body.user_url.split('/');
      user_selected_url2 = parts.pop() || parts.pop();  // handle potential trailing slash
      done()
    })
  }).timeout(4000)
  it('User login expect 200 OK', (done) => {
    supertest(app)
    .post('/api/login')
    .send({
      username: "elfary",
      password: "secret"
    })
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, result) {
      chk(err, done)
      assert.notEqual(result.body.info, null)
      assert.notEqual(result.body.user_url, null)
      done()
    })
  }).timeout(4000)
  it('Delete user expect Not Found 404', (done) => {
    supertest(app)
    .delete('/api/users/id-not-existing')
    .expect(404, done)
  }).timeout(4000)
  it('Delete user expect 200 OK', (done) => {
    supertest(app)
    .delete('/api/users/' + user_selected_url)
    .expect(200, done)
  }).timeout(4000)
  it('Delete user expect 200 OK II', (done) => {
    supertest(app)
    .delete('/api/users/' + user_selected_url2)
    .expect(200, done)
  }).timeout(4000)
})
