'use strict';

import Storage from 'modules/storage.js'

class Background {

  constructor() {
    this.nextDataId = 0;
    this.assignEventHandlers();
    this._initTemplateId();
    this.storage = new Storage()
  }

  assignEventHandlers() {
  }

  /*
    * テンプレートをIDを指定してストレージから取得する
    */
    getTemplateById(templateId, callback) {
      this.storage.getOriginal(templateId, callback)
    }

  /*
    * テンプレートをストレージから全取得する
    */
    getAllTemplates(callback) {
      this.storage.getAll(callback)
    }

  /*
    * テンプレートを保存する
    */
    saveTemplate(name, title, body) {
      this.storage.saveOriginal(name, title, body)
    }

  /*
    * テンプレートをID指定で削除する
    */
    deleteTemplate(templateId, callback) {
      this.getAllTemplates((templates) => {
        var isDeleted = delete templates[templateId];
        if (isDeleted) {
          chrome.storage.local.set({template: templates});
        }
        callback(isDeleted);
      });
    }

  /*
    * テンプレートの次のIDを初期化する
    */
    _initTemplateId() {
      self = this;
      this.getAllTemplates((templates) => {
        Object.keys(templates).forEach((val, idx, arr) => {
          if (val.id > self.nextDataId) {
            self.nextDataId = val.id + 1;
          }
        });
      });
    }

  /*
    * テンプレートの次のIDを取得する
    */
    _getNextId() {
      var nextid = this.nextDataId;
      this.nextDataId += 1;
      return nextid;
    }

}

(function() {
  window.bg = new Background();
})();
