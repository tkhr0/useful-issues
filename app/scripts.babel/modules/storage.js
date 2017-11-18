'use strict';

export default class Storage {

  //
  // it use storage root
  //
  static get STORAGE_KEY_TEMPLATE () {
    return 'template'
  }

  //
  // get original type template
  //
  // templateId: want to get template's id
  //
  getOriginal (templateId, callback) {
  }

  //
  // get template
  // it should be wrap for deciding type
  //
  // type: template was defined type
  // templateId: want to get template's id
  _getTemplate (type, templateId) {

  }

  //
  // save original type template
  //
  // title: template title
  // body: template body
  //
  saveOriginal (title, body) {
  }

  //
  // save template
  // it should be wrap for deciding type
  //
  // type: template was defined type
  // template: template data
  _saveTemplate(type, template) {
  }

  //
  // generate unique id for saving templates
  //
  _createTemplateId(seed) {
  }

  //
  // save fully template data
  //
  // fullyTemplates: replaced this data
  // callback: callback on success or failure
  //
  _save(fullyTemplates, callback) {
    const key = this.STORAGE_KEY_TEMPLATE
    chrome.storage.sync.set({key: fullyTemplates}, callback)
  }

  //
  // fetch fully template data
  //
  // callback: Callback with storage items, or on failure
  //           callback(Object items)
  _fetch(callback) {
    chrome.storage.sync.get(this.STORAGE_KEY_TEMPLATE, callback)
  }
}
