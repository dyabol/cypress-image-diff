'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fsExtra = require('fs-extra');

var _utils = require('./utils');

var _utilsBrowser = require('./utils.browser');

jest.mock('fs-extra', function () {
  return _extends({}, jest.requireActual('fs-extra'), {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    emptyDirSync: jest.fn(),
    readdirSync: jest.fn(),
    moveSync: jest.fn(),
    copySync: jest.fn(),
    writeFile: jest.fn()
  });
});

describe('Utils', function () {
  var args = ['some/path'];
  var sampleFiles = ['test.png', 'test1.png'];

  afterEach(function () {
    jest.clearAllMocks();
  });

  describe('Create dir', function () {
    it('should trigger create directory function when path doesn\'t exist', function () {
      _fsExtra.existsSync.mockReturnValue(false);

      (0, _utils.createDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.mkdirSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.mkdirSync).toBeCalledWith(args[0], { "recursive": true });
    });

    it('should not trigger create directory function when path exists', function () {
      _fsExtra.existsSync.mockReturnValue(true);

      (0, _utils.createDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.mkdirSync).toHaveBeenCalledTimes(0);
    });
  });

  describe('Clean dir', function () {
    it('should trigger clean directory function when path exists', function () {
      _fsExtra.existsSync.mockReturnValue(true);
      _fsExtra.readdirSync.mockReturnValue(sampleFiles);

      (0, _utils.cleanDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.emptyDirSync).toHaveBeenCalledTimes(1);
    });

    it('should not trigger clean directory function when path doesn\'t exist', function () {
      _fsExtra.existsSync.mockReturnValue(false);

      (0, _utils.cleanDir)(args);
      expect(_fsExtra.existsSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.emptyDirSync).toHaveBeenCalledTimes(0);
    });
  });

  describe('Move files', function () {
    it('should move files', function () {
      (0, _utils.renameAndMoveFile)(sampleFiles[0], sampleFiles[1]);
      expect(_fsExtra.moveSync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.moveSync).toBeCalledWith(sampleFiles[0], sampleFiles[1], { "overwrite": true });
    });
  });

  describe('Copy files', function () {
    it('should copy files', function () {
      (0, _utils.renameAndCopyFile)(sampleFiles[0], sampleFiles[1]);
      expect(_fsExtra.copySync).toHaveBeenCalledTimes(1);
      expect(_fsExtra.copySync).toBeCalledWith(sampleFiles[0], sampleFiles[1], { "overwrite": true });
    });
  });

  describe('Get relative path from the current working directory', function () {
    var processCwd = jest.spyOn(process, 'cwd');
    var fakeCwd = 'User/my-project/';

    beforeEach(function () {
      processCwd.mockReturnValue(fakeCwd);
    });

    it('should return empty string when path doesn\'t exist', function () {
      _fsExtra.existsSync.mockReturnValue(false);

      var relativePath = (0, _utils.getRelativePathFromCwd)('User/my-project/cypress/screenshot.png');
      expect(relativePath).toBe('');
    });

    it('should return a relative path when given path exists', function () {
      _fsExtra.existsSync.mockReturnValue(true);

      var relativePath = (0, _utils.getRelativePathFromCwd)('User/my-project/cypress/screenshot.png');
      expect(relativePath).toBe('cypress/screenshot.png');
    });
  });

  describe('Get clean date string', function () {
    afterEach(function () {
      jest.restoreAllMocks();
    });

    it('should return a clean date string', function () {
      var fakeDate = '01/09/2023, 23:22:48';
      jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue(fakeDate);

      expect((0, _utils.getCleanDate)()).toBe('01-09-2023_232248');
    });
  });

  describe('Write incremented filename', function () {
    var filename = 'User/my-project/report.json';
    var filenameIncremented = 'User/my-project/report_2.json';
    var fakeData = '{\n  "name": "test"\n}';

    it('should create a new file with given name when no filename found', function () {
      _fsExtra.existsSync.mockReturnValue(false);

      (0, _utils.writeFileIncrement)(filename, fakeData);
      expect(_fsExtra.writeFile).toHaveBeenCalledTimes(1);
      expect(_fsExtra.writeFile).toBeCalledWith(filename, fakeData);
    });

    it('should increment filename when it already exists', function () {
      _fsExtra.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

      (0, _utils.writeFileIncrement)(filename, fakeData);
      expect(_fsExtra.writeFile).toHaveBeenCalledTimes(1);
      expect(_fsExtra.writeFile).toBeCalledWith(filenameIncremented, fakeData);
    });
  });

  describe('getFileName', function () {
    it('should replace placeholders correctly', function () {
      var template = '[browserName]/[givenName]-[specName]-[width]x[height].js';
      var result = (0, _utilsBrowser.getFileName)({
        nameTemplate: template,
        givenName: 'test',
        specName: 'example.spec.js',
        browserName: 'chrome',
        width: 1280,
        height: 720
      });
      expect(result).toBe('chrome/test-example.spec-1280x720.js');
    });

    it('should remove special characters correctly', function () {
      var template = '[givenName]-[specName]-[browserName]-[width]x[height].js';
      var result = (0, _utilsBrowser.getFileName)({
        nameTemplate: template,
        givenName: 'test$123',
        specName: 'spec file.js',
        browserName: 'safari',
        width: 800,
        height: 600
      });
      expect(result).toBe('test123-specfile-safari-800x600.js');
    });
  });
});