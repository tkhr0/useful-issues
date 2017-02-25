
# useful issues

This is a Chrome extention.  
It enables you to memorize and reuse template for github issue.

![weekly downloads](https://img.shields.io/chrome-web-store/d/ndjffnpnjoipcpbpfkgengipennjbblh.svg)

## Extension usage

![useage for useful issues](https://tkhr0.github.io/useful-issues/assets/image/main-image.gif)

and more!: [tkhr0.github.io/useful-issues](https://tkhr0.github.io/useful-issues/)

### download and install

[download on chrome webstore](https://chrome.google.com/webstore/detail/useful-issues/ndjffnpnjoipcpbpfkgengipennjbblh?hl=ja)

## contribution

![github forks](https://img.shields.io/github/forks/tkhr0/useful-issues.svg?style=social&label=Fork)

```
$ npm install
$ bower install
$ gulp watch
```

### gulp tasks
This project use [yeomen/generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension).
A complete reference should look at this about it.
ref: [generator-chrome-extension/readme.md](https://github.com/yeoman/generator-chrome-extension/blob/master/readme.md).

### watch
When updating the source code, chrome extension needs to reload it in the browser.
But if you do this it is not necessary.
Of course, it also compiles.

```
$ gulp watch
```

### babel
The generator supports ES 2015 syntax through babel transforming.
You may have a source files in `script.babel`.

```
$ gulp babel
```

### Build and Package
When installing as an extension on chrome, doing this will only retrieve the necessary files.

```
$ gulp build
```
