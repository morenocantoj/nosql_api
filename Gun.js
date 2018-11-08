"use strict"

const uuid = require('uuid/v4')

class Gun {
  constructor() {
    this.uuid = uuid()
    this.name = null
    this.cost = null
    this.damage = null
    this.type = null
    this.side = null
    this.rpm = null
    this.penetration = null
  }

  set uuid(uuid) {
    this._uuid = uuid
  }

  get uuid() {
    return this._uuid
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
}

module.exports = Gun
