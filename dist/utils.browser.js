/* eslint-disable import/prefer-default-export */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var getFileName = function getFileName(_ref) {
  var nameTemplate = _ref.nameTemplate;
  var givenName = _ref.givenName;
  var specName = _ref.specName;
  var browserName = _ref.browserName;
  var width = _ref.width;
  var height = _ref.height;

  return nameTemplate.replace(/\[givenName\]/, givenName).replace(/\[specName\]/, specName.replace(/\.(js|jsx|ts|tsx)$/, '')).replace(/\[browserName\]/, browserName).replace(/\[width\]/, width).replace(/\[height\]/, height).replace(/[^a-z0-9_\-/.]/gi, ''); // remove anything that's not a letter, a number, a dash, an underscore or a dot.
};

exports.getFileName = getFileName;