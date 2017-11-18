'use strict';

import Storage from 'modules/storage.js'

class Background {

  constructor() {
    this.storage = new Storage()
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
}

(function() {
  window.bg = new Background();
})();
