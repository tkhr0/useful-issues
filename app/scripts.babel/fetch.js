'use strict';

/*
 * issueページのテキストを取得する
 *
 * return {
 *   "title": "タイトル"
 *   "body": "本文"
 * }
 */

var title, body;

var url = window.location.href;
if (url.match(new RegExp('github\.com/.+/compare/.+'))) {
  // when PR
  title = document.getElementById('pull_request_title').value;
  body = document.getElementById('pull_request_body').value;
} else if (url.match(new RegExp('github\.com/.+/issues/new'))) {
  // when issue
  title = document.getElementById('issue_title').value;
  body = document.getElementById('issue_body').value;
}

var data = {
  "title": title,
  "body": body
};

data;
