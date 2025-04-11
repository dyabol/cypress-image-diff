'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TestStatus = function TestStatus(_ref) {
  var status = _ref.status;
  var name = _ref.name;
  var percentage = _ref.percentage;
  var failureThreshold = _ref.failureThreshold;
  var specPath = _ref.specPath;
  var specFilename = _ref.specFilename;
  var baselinePath = _ref.baselinePath;
  var diffPath = _ref.diffPath;
  var comparisonPath = _ref.comparisonPath;

  _classCallCheck(this, TestStatus);

  this.status = status ? 'pass' : 'fail';
  this.name = name;
  this.percentage = percentage;
  this.failureThreshold = failureThreshold;
  this.specPath = specPath;
  this.specFilename = specFilename;
  this.baselinePath = baselinePath;
  this.diffPath = diffPath;
  this.comparisonPath = comparisonPath;
};

exports['default'] = TestStatus;
module.exports = exports['default'];