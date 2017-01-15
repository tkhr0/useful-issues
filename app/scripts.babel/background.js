'use strict';

(function() {
  class Background {

    constructor() {
      this.nextDataId = 0;
      this.assignEventHandlers();
      this._initTemplateId();
    }

    assignEventHandlers() {
    }

    /*
     * テンプレートをIDを指定してストレージから取得する
     */
    getTemplateById(templateId, callback) {
      chrome.storage.local.get('template', (item) => {
        var templates = item.template;
        if (callback && templates.hasOwnProperty(templateId)) {
          callback(templates[templateId]);
        }
      });
    }

    /*
     * テンプレートをストレージから全取得する
     */
    getAllTemplates(callback) {
      chrome.storage.local.get('template', (items) => {
        if ("template" in items) {
          callback(items.template);
        } else {
          callback({});
        }
      });
    }

    /*
     * テンプレートを保存する
     */
    saveTemplate(name, title, body) {
      var id = this._getNextId();
      var data = {
        id: id,
        name: name,
        title: title,
        body: body
      };
      this.getAllTemplates((templates) => {
        templates[id] = data;
        chrome.storage.local.set({template: templates});
      });
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

  window.bg = new Background();
})();
