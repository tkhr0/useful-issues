'use strict'

import Storage from '../../app/scripts.babel/modules/storage.js'

export default class MockStorage extends Storage {
  constructor () {
    super()

    this.data = {}
    this.lastError = null
  }

  set (data, callback) {
    this.data = Object.assign({}, this.data, data)

    if (callback) {
      callback()
    }
  }

  get (key, callback) {
    if (key === null) {
      callback(this.data)
    } else if (this.data.hasOwnProperty(key)) {
      callback(this.data[key])
    } else {
      this.lastError = 'not found key'
      callback()
    }
  }
}

