'use strict';

import JsSha from 'jssha'

export default class Storage {

  //
  // strage version
  //
  get STORAGE_KEY_STORAGE_VERSION () {
    return 'storage_version'
  }

  //
  // it use storage root
  //
  get STORAGE_KEY_TEMPLATE () {
    return 'template'
  }

  //
  // strage version
  //
  get STORAGE_VERSION () {
    return '1.0.0'
  }

  //
  get model () {
    return {
      id: null,
      name: null,
      title: null,
      body: null,
      created_at: null,
    }
  }

  //
  // get original type template
  //
  // templateId: want to get template's id
  //
  getOriginal (templateId, callback) {
    this._getTemplate('ORIGINAL', templateId, callback)
  }

  //
  // get all templates
  //
  // callback: callback(item)
  //
  getAll (callback) {
    this._fetch((templatePerType) => {
      let templates = {}

      for (let key in templatePerType) {
        templates = Object.assign(templates, templatePerType[key])
      }

      callback(templates)
    })
  }

  //
  // get template
  // it should be wrap for deciding type
  //
  // type: template was defined type
  // templateId: want to get template's id
  _getTemplate (type, templateId, callback) {
    this._fetch((items) => {
      const templates = items[type]

      if (callback && templates && templates.hasOwnProperty(templateId)) {
        callback(templates[templateId])
      }
    })
  }

  //
  // save original type template
  //
  // title: template title
  // body: template body
  //
  saveOriginal (name, title, body, callback) {
    const template = Object.assign(this.model, {
      name: name,
      title: title,
      body: body
    })

    this._saveTemplate('ORIGINAL', template, callback)
  }

  //
  // save template
  // it should be wrap for deciding type
  //
  // type: template was defined type
  // template: template data
  _saveTemplate(type, template, callback) {
    template.id = this._createTemplateId(template.name + template.title + template.body)
    template.created_at = this._now()

    this._fetch((fullyTemplates) => {
      if (!fullyTemplates.hasOwnProperty(type)) {
        fullyTemplates[type] = {}
      }

      fullyTemplates[type][template.id] = template
      this._save(fullyTemplates, callback)
    })
  }

  //
  // delete template by id
  //
  // templateId: want to delete template id
  // callback: callback(boolean isDeleted)
  //
  deleteOriginal (templateId, callback) {
    this._delete('ORIGINAL', templateId, callback)
  }

  //
  // delete the template
  //
  // type: it was defined template type
  // templateId: want to delete template id
  // callback: callback(boolean isDeleted)
  //
  _delete (type, templateId, callback) {
    this._fetch((fullyTemplates) => {
      const isDeleted = delete fullyTemplates[type][templateId]
      this._save(fullyTemplates, () => {
        callback(isDeleted)
      })
    })
  }

  //
  // generate unique id for saving templates
  //
  _createTemplateId(seed) {
    const jssha = new JsSha('SHA-1', 'TEXT')
    jssha.update(seed)
    return jssha.getHash('HEX')
  }

  _now() {
    return (new Date).getTime()
  }

  //
  // save fully template data
  //
  // fullyTemplates: replaced this data
  // callback: callback on success or failure
  //           callback()
  //
  _save(fullyTemplates, callback) {
    const data = {}
    data[this.STORAGE_KEY_TEMPLATE] = fullyTemplates

    this.set(data, callback)
  }

  //
  // fetch fully template data
  //
  // callback: Callback with storage items, or on failure
  //           callback(Object items)
  _fetch(callback) {
    this.get(this.STORAGE_KEY_TEMPLATE, (root) => {
      if (root) {
        callback(root)
      } else {
        callback({})
      }
    })
  }

  //
  // get chrome storage
  //
  // key: pick up key. get all key-values if key is null
  // callback: callback(picked_up_object)
  //
  get (key, callback) {
    chrome.storage.local.get(key, callback)
  }

  //
  // set chrome storage
  //
  // data: will be set data
  // callback: call always. callback()
  //
  set (data, callback) {
    chrome.storage.local.set(data, callback)
  }
}
