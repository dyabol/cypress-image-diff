"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileName = void 0;

/* eslint-disable import/prefer-default-export */
var getFileName = function getFileName(_ref) {
  var nameTemplate = _ref.nameTemplate,
      givenName = _ref.givenName,
      specName = _ref.specName,
      browserName = _ref.browserName,
      width = _ref.width,
      height = _ref.height;
  return nameTemplate.replace(/\[givenName\]/, givenName).replace(/\[specName\]/, specName.replace(/\.(js|jsx|ts|tsx)$/, '')).replace(/\[browserName\]/, browserName).replace(/\[width\]/, width).replace(/\[height\]/, height).replace(/[^a-z0-9_\-/.]/gi, ''); // remove anything that's not a letter, a number, a dash, an underscore or a dot.
};

exports.getFileName = getFileName;