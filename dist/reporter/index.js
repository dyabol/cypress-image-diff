'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var generateTemplate = function generateTemplate(options) {
  var templateFile = _fs2['default'].readFileSync(_path2['default'].resolve(__dirname, '../reporter/template.hbs'), 'utf8');
  var template = _handlebars2['default'].compile(templateFile);

  return template(options);
};

exports.generateTemplate = generateTemplate;
var createReport = function createReport(options) {
  var template = generateTemplate(options);
  _fs2['default'].writeFile(_config2['default'].report(options.instance), template, function (err) {
    if (err) throw err;
  });
};
exports.createReport = createReport;