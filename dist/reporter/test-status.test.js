'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _testStatus = require('./test-status');

var _testStatus2 = _interopRequireDefault(_testStatus);

describe('Test Status', function () {
  it('should return pass when there is no pixel difference', function () {
    var testStatus = new _testStatus2['default']({ status: true, name: 'TestName' });
    expect(testStatus.status).toEqual('pass');
  });

  it('should return fail when there is pixel differencea', function () {
    var testStatus = new _testStatus2['default']({ status: false, name: 'TestName' });
    expect(testStatus.status).toEqual('fail');
  });
});