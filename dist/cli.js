'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.cli = cli;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arg = require('arg');

var _arg2 = _interopRequireDefault(_arg);

var _colorsColorsSafe = require('@colors/colors/safe');

var _colorsColorsSafe2 = _interopRequireDefault(_colorsColorsSafe);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

var parseArgumentsIntoOptions = function parseArgumentsIntoOptions(rawArgs) {
  var args = (0, _arg2['default'])({
    '--update': Boolean,
    '-u': '--update'
  }, {
    argv: rawArgs.slice(2)
  });

  return {
    updateBaseline: args['--update'] || false
  };
};

// eslint-disable-next-line import/prefer-default-export

function cli(args) {
  var options = parseArgumentsIntoOptions(args);
  if (options.updateBaseline) {
    // Only update image if it failed the comparison
    var filesToUpdate = (0, _utils.readDir)(_config2['default'].dir.diff);
    if (filesToUpdate) {
      filesToUpdate.forEach(function (file) {
        _fsExtra2['default'].copySync(_config2['default'].dir.comparison + '/' + file, _config2['default'].dir.baseline + '/' + file);
        console.log(_colorsColorsSafe2['default'].green('Updated baseline image ' + file));
      });
    } else {
      var output = 'No baselines to be updated. Make sure to run the visual tests before running update.';
      console.log(_colorsColorsSafe2['default'].yellow(output));
    }
  }
}