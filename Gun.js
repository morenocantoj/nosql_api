"use strict"

const uuid = require('uuid/v4')
var database = require('./database')

class Gun {
  constructor() {
    this.id = uuid()
    this.name = null
    this.cost = null
    this.damage = null
    this.type = null
    this.side = null
    this.rpm = null
    this.penetration = null
  }

  set id(uuid) {
    this._id = uuid
  }

  get id() {
    return this._id
  }

  set name(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set cost(cost) {
    this._cost = cost
  }

  get cost() {
    return this._cost
  }

  set damage(damage) {
    this._damage = damage
  }

  get damage() {
    return this._damage
  }

  set type(type) {
    this._type = type
  }

  get type() {
    return this._type
  }

  set side(side) {
    this._side = side
  }

  get side() {
    return this._side
  }

  set rpm(rpm) {
    this._rpm = rpm
  }

  get rpm() {
    return this._rpm
  }

  set penetration(penetration) {
    this._penetration = penetration
  }

  get penetration() {
    return this._penetration
  }

  /**
  * Retrieves all gun data from database
  * Gun id needs to be setted before
  * @param callback function
  */
  retrieveFromDatabase(callback) {
    if (!this.id) return callback(false)

    // Retrieve gun from database
    database.getGun(this, (gunData) => {
      if (gunData) {
        // Set data to current object
        this.cost = gunData._cost
        this.name = gunData._name
        this.damage = gunData._damage
        this.type = gunData._type
        this.side = gunData._side
        this.rpm = gunData._rpm
        this.penetration = gunData._penetration

        callback(true)
        return null

      } else {
        callback(false)
        return null
      }
    })
  }

  /**
  * Deletes an object even, and also does it in database
  * @param callback function callback
  */
  delete(callback) {
    if (this.id) {
      // Try to delete gun in database if exists
      database.deleteGun(this, (deleted) => {
        if (!deleted) return callback(false)
      })
    }

    // Delete gun properties
    delete this
    callback(true)
    return null
  }
}

module.exports = Gun
