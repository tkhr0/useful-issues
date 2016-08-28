'use strict';

(function() {
    class Background {
        constructor() {
            this.assignEventHandlers();
            this.nextDataId = 0;
        }
        assignEventHandlers() {
        }
        getTemplateById(template_id) {
            chrome.storage.local.get(template_id, (items) => {
                if (items.hasOwnProperty(template_id)) {
                    callback(items[template_id]);
                } else {
                    callback({});
                }
            });
        }
        getAllTemplates(callback) {
            chrome.storage.local.get('template', (items) => {
                callback(items.template);
            });
        }
        saveTemplate(name, title, body) {
            var data = {
                id: this._getNextId(),
                name: name,
                title: title,
                body: body
            };
            chrome.storage.local.set({template: [data]}, () => {
            });
        }
        _getNextId() {
            var nextid = this.nextDataId;
            this.nextDataId += 1;
            return nextid;
        }
    }

    window.bg = new Background();
})();
