'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _colorsColorsSafe = require('@colors/colors/safe');

var _colorsColorsSafe2 = _interopRequireDefault(_colorsColorsSafe);

var _fsExtra = require('fs-extra');

var _cli = require('./cli');

jest.mock('fs-extra', function () {
  return _extends({}, jest.requireActual('fs-extra'), {
    copySync: jest.fn(),
    readdirSync: jest.fn()
  });
});

console.log = jest.fn();

describe('Cli', function () {
  afterEach(function () {
    jest.clearAllMocks();
  });

  describe('Update baseline images', function () {
    it('should not update baseline images if argument is not specified', function () {
      (0, _cli.cli)(['--dummyArg1', '--dummyArg2']);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(0);
    });

    it('should update baseline images if argument is specified', function () {
      var files = ['File1.png', 'File2.png'];
      _fsExtra.readdirSync.mockReturnValue(files);

      (0, _cli.cli)(['--dummyArg1', '--dummyArg2', '-u']);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(2);
      expect(console.log.mock.calls[0][0]).toBe(_colorsColorsSafe2['default'].green('Updated baseline image ' + files[0]));
      expect(console.log.mock.calls[1][0]).toBe(_colorsColorsSafe2['default'].green('Updated baseline image ' + files[1]));
    });

    it('should ignore the first 2 arguments', function () {
      (0, _cli.cli)(['-u', '-u']);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(0);
    });

    it('should output message when no images to be updated', function () {
      _fsExtra.readdirSync.mockReturnValue();
      (0, _cli.cli)(['--dummyArg1', '--dummyArg2', '-u']);

      var expectedOutput = 'No baselines to be updated. Make sure to run the visual tests before running update.';
      expect(console.log.mock.calls[0][0]).toBe(_colorsColorsSafe2['default'].yellow(expectedOutput));
    });
  });
});