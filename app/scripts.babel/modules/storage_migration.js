'use strict'

import Storage from './storage.js'

export default class StorageMigration {
  constructor () {
    this.storage = new Storage()
  }

  //
  // check storage version and convert storage structure
  //
  convert () {
    this.storage.get(null, (data) => {

      // at first version
      if (!data.hasOwnProperty(this.storage.STORAGE_KEY_STORAGE_VERSION)) {
        this._migrate(null)
        return
      }

      const storageVersion = data[this.storage.STORAGE_KEY_STORAGE_VERSION]

      // latest version
      if (storageVersion === this.storage.STORAGE_VERSION) {
        return
      }

      // older version
      this._migrate(storageVersion)
    })
  }

  //
  // migrate storage structure
  //
  _migrate (currentVersion) {
    switch (currentVersion) {
      case null:
        this._migrateNullTo1_0_0()
    }
  }

  //
  // migrate first version to 1.0.0
  //
  // VERSION first
  // {template: {
  //     id: {
  //       id: id,
  //       name: name,
  //       title: title,
  //       body: body
  //     }
  // }}
  //
  // VERSION 1.0.0
  // {template: {
  //   TYPE: {
  //     id: {
  //       id: id,
  //         name: name,
  //         title: title,
  //         body: body
  //     }
  //   }
  // }}
  _migrateNullTo1_0_0 () {

    (new Promise((resolve, reject) => {
      // save old model templates in new model
      this.storage.get(null, (data) => {
        resolve(data)
      })
    })).then((data) => {

      let oldIds = Object.keys(data.template)
      let i
      loop(() => {
        // initialize
        return new Promise((resolve) => {
          i = 0
          resolve()
        })
      }, () => {
        // condition
        return new Promise((resolve) => {
          resolve(i < oldIds.length)
        })
      }, () => {
        // incriment
        return new Promise((resolve) => {
          i++
          resolve()
        })
      }, () => {
        return new Promise((resolve) => {
          // resave old model to new model
          // old model used integer key
          if (typeof parseInt(templateId) !== 'number') {
            resolve()
          }
          const templateId = Object.keys(data.template)[i]
          const template = data.template[templateId]
          this.storage.saveOriginal(template.name, template.title, template.body, () => {
            resolve()
          })
        })

      }).then(() => {
        // delete old model templates
        new Promise((resolve) => {
          this.storage.get(this.storage.STORAGE_KEY_TEMPLATE, (templates) => {
            for (let templateId in templates) {
              let intId = parseInt(templateId)
              if ((!isNaN(intId)) && (typeof intId === 'number')) {
                delete templates[templateId]
              }
            }
            resolve()
          })

        }).then(() => {
          this.storage.get(null, (data) => {
            data[this.storage.STORAGE_KEY_STORAGE_VERSION]
              = this.storage.STORAGE_VERSION
            this.storage.set(data)
          })
        })
      })
    })
  }
}

function loop(init, condition, increment, callback) {
  return new Promise(function (resolve, reject) {
    init().then(function _loop() {
      condition().then(function (result) {
        if (result) {
          callback().then(increment).then(_loop, reject)
        } else {
          resolve()
        }
      }, reject)
    }, reject)
  })
}
