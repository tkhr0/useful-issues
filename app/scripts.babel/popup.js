'use strict';

(function() {
    class Popup {
        constructor() {
            window.addEventListener('load', (evt) => {
                console.log('load');
                this.start();
            });
        }
        start() {
            this.assignEventHandlers();
            console.log('start');
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
                    document.getElementById('area').value = datas.title;
                    chrome.runtime.getBackgroundPage((backgroundPage) => {
                        let bg = backgroundPage.bg;
                        bg.saveTemplate(datas.title, datas.title, datas.body);
                        this.reload();
                    });
                } else {
                    document.getElementById('area').value = 'not found';
                }
            });
        }
        reload() {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg = backgroundPage.bg;
                bg.getAllTemplates((items) => {
                    console.log(items);
                    items.forEach((template, idx, items) => {
                        console.log(template);
                        var divList = document.getElementById('list');
                        var divTemplate = document.getElementById('template').cloneNode(true);

                        divTemplate.getElementsByClassName('name')[0].text = template.name;
                        divTemplate.id = '';

                        console.log(divTemplate);
                        divList.appendChild(divTemplate);

                    });
                });
            });
        }
    }

    new Popup();
})();

