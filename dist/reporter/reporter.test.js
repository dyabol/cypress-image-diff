'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ = require('.');

var _testStatus = require('./test-status');

var _testStatus2 = _interopRequireDefault(_testStatus);

describe('Reporter', function () {
  describe('create report', function () {
    it('should create html template', function () {
      var testResult1 = new _testStatus2['default']({ status: true, name: 'Visual Test 1' });
      var testResult2 = new _testStatus2['default']({ status: false, name: 'Visual Test 2' });
      var result = (0, _.generateTemplate)({ tests: [testResult1, testResult2]
      });
      expect(result).toMatchSnapshot();
    });
  });
});