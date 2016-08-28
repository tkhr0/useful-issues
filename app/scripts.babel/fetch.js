var issue = (function() {
    class Issue {
        constructor() {
        }
        getTitle() {
            return this.getValue('issue_title');
        }
        getBody() {
            return this.getValue('issue_body');
        }
        getDatas() {
            return {
                title: this.getTitle(),
                body: this.getBody(),
            };
        }
        getValue(elementId) {
            var element = document.getElementById(elementId);
            if (element) {
                return element.value;
            } else {
                return '';
            }
        }
    }
    return new Issue();
})();

issue.getDatas();
