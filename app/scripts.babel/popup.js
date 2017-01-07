'use strict';

(function() {
    class Popup {
        constructor() {
            window.addEventListener('load', (evt) => {
                this.start();
            });
        }
        start() {
            this.assignEventHandlers();
            this.paint();
        }
        assignEventHandlers() {
            document.getElementById('fetch').addEventListener('click', (evt) => {
                this.onClickFetchBtn(evt);
            });
        }
        onClickFetchBtn(evt) {
            chrome.tabs.executeScript(null, {
                file: 'scripts/fetch.js'
            }, (results) => {
                if (results) {
                    var datas = results[0];
                    chrome.runtime.getBackgroundPage((backgroundPage) => {
                        let bg = backgroundPage.bg;
                        bg.saveTemplate(datas.title, datas.title, datas.body);
                        this.repaint();
                    });
                }
            });
        }
        onClickTitleLink(evt) {
            var divTemplate = this.parentElement;
            var templateId = divTemplate.getAttribute('data-id');

            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg = backgroundPage.bg;
                bg.getTemplateById(templateId, (template) => {
                    let issue = backgroundPage.issue;
                    issue.setDatas(template.title, template.body);
                });
            });
        }
        paint() {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg = backgroundPage.bg;
                bg.getAllTemplates((templates) => {
                    var divList = document.getElementById('list');
                    var divTemplate;
                    for (var i=0; i<templates.length; i++){
                        divTemplate = document.getElementById('template').cloneNode(true);

                        divTemplate.getElementsByClassName('name')[0].text = templates[i].name;
                        divTemplate.id = '';
                        divTemplate.setAttribute('data-id', templates[i].id);

                        divList.appendChild(divTemplate);

                    }
                    this.bindApply();
                });
            });
        }
        repaint() {
            document.getElementById('list').innerHTML = '';
            this.paint();
        }
        bindApply() {
            Array.prototype.forEach.call(document.getElementsByClassName('name'), (element) => {
                element.addEventListener('click', (evt) => {
                    this.onClickTitleLink.call(element, evt);
                });
            });
        }
    }

    new Popup();
})();

