'use strict';

/*
 * issueページのテキストを取得する
 *
 * return {
 *   "title": "タイトル"
 *   "body": "本文"
 * }
 */

var title = document.getElementById('issue_title').value;
var body = document.getElementById('issue_body').value;
var data = {
  "title": title,
  "body": body
};

data;
