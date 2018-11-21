"use strict"

const uuid = require('uuid/v4')
var database = require('./database')

class User {
  constructor(username = null, password = null) {
    this.id = uuid()
    this.username = username
    this.password = password
    this.steam_profile = null
    this.otp_enable = false
    this.otp_secret = null
  }

  set id(uuid) {
    this._id = uuid
  }

  get id() {
    return this._id
  }

  set username(username) {
    this._username = username
  }

  get username() {
    return this._username
  }

  set password(password) {
    this._password = password
  }

  get password() {
    return this._password
  }

  set steam_profile(steam_profile) {
    this._steam_profile = steam_profile
  }

  get steam_profile() {
    return this._steam_profile
  }

  set otp_enable(otp_enable) {
    this._otp_enable = otp_enable
  }

  get otp_enable() {
    return this._otp_enable
  }

  set otp_secret(otp_secret) {
    this._otp_secret = otp_secret
  }

  get otp_secret() {
    return this._otp_secret
  }

  /**
  * Saves this user into database
  */
  async save() {
    return await database.insertUser(this)
  }

  /**
  * Checks current user in database
  */
  async checkInDatabase() {
    return await database.checkUser(this.username, this.password)
  }

  /**
  * Deletes current user in database and returns the result
  */
  async delete() {
    if (this.id) {
      // Try to delete gun in database if exists
      return await database.deleteUser(this)
    }

    // Delete gun properties
    delete this
    return true
  }
}

module.exports = User
