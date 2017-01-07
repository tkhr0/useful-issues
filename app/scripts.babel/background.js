'use strict';

(function() {
    class Background {
        constructor() {
            this.assignEventHandlers();
            this.nextDataId = 0;
        }
        assignEventHandlers() {
        }
        getTemplateById(templateId, callback) {
            chrome.storage.local.get('template', (item) => {
                var templates = item.template;
                templates.forEach((template, callback) => {
                    if (template.hasOwnProperty(templateId)) {
                        callback(templates[templateId]);
                    }
                });
            });
        }
        getAllTemplates(callback) {
            chrome.storage.local.get('template', (items) => {
                if ("template" in items) {
                    callback(items.template);
                } else {
                    callback([]);
                }
            });
        }
        saveTemplate(name, title, body) {
            var data = {
                id: this._getNextId(),
                name: name,
                title: title,
                body: body
            };
            this.getAllTemplates((templates) => {
                templates.push(data);
                chrome.storage.local.set({template: templates});
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
