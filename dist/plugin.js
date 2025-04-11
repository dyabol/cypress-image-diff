'use strict';

var _this2 = this;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _pixelmatch = require('pixelmatch');

var _pixelmatch2 = _interopRequireDefault(_pixelmatch);

var _pngjs = require('pngjs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _reporterTestStatus = require('./reporter/test-status');

var _reporterTestStatus2 = _interopRequireDefault(_reporterTestStatus);

var _reporter = require('./reporter');

var testStatuses = [];

var setupFolders = function setupFolders() {
  (0, _utils.createDir)([_config2['default'].dir.baseline, _config2['default'].dir.comparison, _config2['default'].dir.diff, _config2['default'].reportDir]);
};

var tearDownDirs = function tearDownDirs() {
  (0, _utils.cleanDir)([_config2['default'].dir.comparison, _config2['default'].dir.diff]);
};

var generateReport = function generateReport() {
  var instance = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  if (testStatuses.length > 0) {
    (0, _reporter.createReport)({ tests: JSON.stringify(testStatuses), instance: instance });
  }
  return true;
};

var deleteReport = function deleteReport(args) {
  testStatuses = testStatuses.filter(function (testStatus) {
    return testStatus.name !== args.testName;
  });

  return true;
};

var copyScreenshot = function copyScreenshot(args) {
  // If baseline does not exist, copy comparison image to baseline folder
  if (!_fsExtra2['default'].existsSync(_config2['default'].image.baseline(args.testName))) {
    _fsExtra2['default'].copySync(_config2['default'].image.comparison(args.testName), _config2['default'].image.baseline(args.testName));
  }

  return true;
};

// Delete screenshot from comparison and diff directories
var deleteScreenshot = function deleteScreenshot(args) {
  if (_fsExtra2['default'].existsSync(_config2['default'].image.comparison(args.testName))) {
    _fsExtra2['default'].unlinkSync(_config2['default'].image.comparison(args.testName));
  }

  if (_fsExtra2['default'].existsSync(_config2['default'].image.diff(args.testName))) {
    _fsExtra2['default'].unlinkSync(_config2['default'].image.diff(args.testName));
  }

  return true;
};

var getStatsComparisonAndPopulateDiffIfAny = function getStatsComparisonAndPopulateDiffIfAny(args) {
  var baselineImg, comparisonImg, diff, baselineFullCanvas, comparisonFullCanvas, pixelMismatchResult, percentage, testFailed;
  return regeneratorRuntime.async(function getStatsComparisonAndPopulateDiffIfAny$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        baselineImg = undefined;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return regeneratorRuntime.awrap((0, _utils.parseImage)(_config2['default'].image.baseline(args.testName)));

      case 4:
        baselineImg = context$1$0.sent;
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](1);
        return context$1$0.abrupt('return', args.failOnMissingBaseline ? { percentage: 1, testFailed: true } : { percentage: 0, testFailed: false });

      case 10:
        comparisonImg = undefined;
        context$1$0.prev = 11;
        context$1$0.next = 14;
        return regeneratorRuntime.awrap((0, _utils.parseImage)(_config2['default'].image.comparison(args.testName)));

      case 14:
        comparisonImg = context$1$0.sent;
        context$1$0.next = 20;
        break;

      case 17:
        context$1$0.prev = 17;
        context$1$0.t1 = context$1$0['catch'](11);
        return context$1$0.abrupt('return', { percentage: 1, testFailed: true });

      case 20:
        diff = new _pngjs.PNG({
          width: Math.max(comparisonImg.width, baselineImg.width),
          height: Math.max(comparisonImg.height, baselineImg.height)
        });
        context$1$0.next = 23;
        return regeneratorRuntime.awrap((0, _utils.adjustCanvas)(baselineImg, diff.width, diff.height));

      case 23:
        baselineFullCanvas = context$1$0.sent;
        context$1$0.next = 26;
        return regeneratorRuntime.awrap((0, _utils.adjustCanvas)(comparisonImg, diff.width, diff.height));

      case 26:
        comparisonFullCanvas = context$1$0.sent;
        pixelMismatchResult = (0, _pixelmatch2['default'])(baselineFullCanvas.data, comparisonFullCanvas.data, diff.data, diff.width, diff.height, _config.userConfig.COMPARISON_OPTIONS);
        percentage = Math.pow(pixelMismatchResult / diff.width / diff.height, 0.5);
        testFailed = percentage > args.testThreshold;

        if (!testFailed) {
          context$1$0.next = 33;
          break;
        }

        context$1$0.next = 33;
        return regeneratorRuntime.awrap((function callee$1$0() {
          var stream;
          return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _fsExtra2['default'].ensureFileSync(_config2['default'].image.diff(args.testName));
                stream = diff.pack().pipe(_fsExtra2['default'].createWriteStream(_config2['default'].image.diff(args.testName)));
                context$2$0.next = 4;
                return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                  stream.once('finish', resolve);
                  stream.once('error', reject);
                }));

              case 4:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        })());

      case 33:
        return context$1$0.abrupt('return', { percentage: percentage, testFailed: testFailed });

      case 34:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this2, [[1, 7], [11, 17]]);
};

function compareSnapshotsPlugin(args) {
  var _ref, percentage, testFailed, newTest, _ref2, _ref22, baselineDataUrl, diffDataUrl, comparisonDataUrl;

  return regeneratorRuntime.async(function compareSnapshotsPlugin$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return regeneratorRuntime.awrap(getStatsComparisonAndPopulateDiffIfAny(args));

      case 2:
        _ref = context$1$0.sent;
        percentage = _ref.percentage;
        testFailed = _ref.testFailed;
        newTest = new _reporterTestStatus2['default']({
          status: !testFailed,
          name: args.testName,
          percentage: percentage,
          failureThreshold: args.testThreshold,
          specFilename: args.specFilename,
          specPath: args.specPath,
          baselinePath: (0, _utils.getRelativePathFromCwd)(_config2['default'].image.baseline(args.testName)),
          diffPath: (0, _utils.getRelativePathFromCwd)(_config2['default'].image.diff(args.testName)),
          comparisonPath: (0, _utils.getRelativePathFromCwd)(_config2['default'].image.comparison(args.testName))
        });

        if (!args.inlineAssets) {
          context$1$0.next = 15;
          break;
        }

        context$1$0.next = 9;
        return regeneratorRuntime.awrap(Promise.all([(0, _utils.toBase64)(newTest.baselinePath), (0, _utils.toBase64)(newTest.diffPath), (0, _utils.toBase64)(newTest.comparisonPath)]));

      case 9:
        _ref2 = context$1$0.sent;
        _ref22 = _slicedToArray(_ref2, 3);
        baselineDataUrl = _ref22[0];
        diffDataUrl = _ref22[1];
        comparisonDataUrl = _ref22[2];

        newTest = _extends({}, newTest, {
          baselineDataUrl: baselineDataUrl,
          diffDataUrl: diffDataUrl,
          comparisonDataUrl: comparisonDataUrl
        });

      case 15:

        testStatuses.push(newTest);

        return context$1$0.abrupt('return', percentage);

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

var generateJsonReport = function generateJsonReport(results) {
  var testsMappedBySpecPath, suites, totalPassed, stats, jsonFilename, jsonPath;
  return regeneratorRuntime.async(function generateJsonReport$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        testsMappedBySpecPath = testStatuses.reduce(function (map, item) {
          if (map[item.specPath] === undefined) {
            // eslint-disable-next-line no-param-reassign
            map[item.specPath] = {
              name: item.specFilename,
              path: item.specPath,
              tests: []
            };
          }
          map[item.specPath].tests.push(item);

          return map;
        }, {});
        suites = Object.values(testsMappedBySpecPath);
        totalPassed = testStatuses.filter(function (t) {
          return t.status === 'pass';
        }).length;
        stats = {
          total: testStatuses.length,
          totalPassed: totalPassed,
          totalFailed: testStatuses.length - totalPassed,
          totalSuites: suites.length,
          suites: suites,
          startedAt: results.startedTestsAt,
          endedAt: results.endedTestsAt,
          duration: results.totalDuration,
          browserName: results.browserName,
          browserVersion: results.browserVersion,
          cypressVersion: results.cypressVersion
        };
        jsonFilename = _config.userConfig.JSON_REPORT.FILENAME ? _config.userConfig.JSON_REPORT.FILENAME + '.json' : 'report_' + (0, _utils.getCleanDate)(stats.startedAt) + '.json';
        jsonPath = _path2['default'].join(_config2['default'].reportDir, jsonFilename);

        if (!_config.userConfig.JSON_REPORT.OVERWRITE) {
          context$1$0.next = 11;
          break;
        }

        context$1$0.next = 9;
        return regeneratorRuntime.awrap(_fsExtra2['default'].writeFile(jsonPath, JSON.stringify(stats, null, 2)));

      case 9:
        context$1$0.next = 13;
        break;

      case 11:
        context$1$0.next = 13;
        return regeneratorRuntime.awrap((0, _utils.writeFileIncrement)(jsonPath, JSON.stringify(stats, null, 2)));

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this2);
};

var generateJsonReportTask = function generateJsonReportTask(result) {
  generateJsonReport(result || {});
  return true;
};

var getCompareSnapshotsPlugin = function getCompareSnapshotsPlugin(on, config) {
  // Create folder structure
  setupFolders();

  // Delete comparison and diff images to ensure a clean run
  tearDownDirs();

  // Force screenshot resolution to keep consistency of test runs across machines
  on('before:browser:launch', function (browser, launchOptions) {
    var width = config.viewportWidth || '1280';
    var height = config.viewportHeight || '720';

    if (browser.name === 'chrome') {
      launchOptions.args.push('--window-size=' + width + ',' + height);
      launchOptions.args.push('--force-device-scale-factor=1');
    }
    if (browser.name === 'electron') {
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.width = Number.parseInt(width, 10);
      // eslint-disable-next-line no-param-reassign
      launchOptions.preferences.height = Number.parseInt(height, 10);
    }
    if (browser.name === 'firefox') {
      launchOptions.args.push('--width=' + width);
      launchOptions.args.push('--height=' + height);
    }
    return launchOptions;
  });

  // Intercept cypress screenshot and create a new image with our own
  // name convention and file structure for simplicity and consistency
  on('after:screenshot', function (details) {
    // A screenshot could be taken automatically due to a test failure
    // and not a call to cy.compareSnapshot / cy.screenshot. These files
    // should be left alone
    if (details.testFailure) {
      return;
    }

    // Change screenshots file permission so it can be moved from drive to drive
    (0, _utils.setFilePermission)(details.path, 511);
    (0, _utils.setFilePermission)(_config2['default'].image.comparison(details.name), 511);

    if (config.env.preserveOriginalScreenshot === true) {
      (0, _utils.renameAndCopyFile)(details.path, _config2['default'].image.comparison(details.name));
    } else {
      (0, _utils.renameAndMoveFile)(details.path, _config2['default'].image.comparison(details.name));
    }
  });

  on('after:run', function callee$1$0(results) {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!_config.userConfig.JSON_REPORT) {
            context$2$0.next = 3;
            break;
          }

          context$2$0.next = 3;
          return regeneratorRuntime.awrap(generateJsonReport(results));

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this2);
  });

  on('task', {
    compareSnapshotsPlugin: compareSnapshotsPlugin,
    copyScreenshot: copyScreenshot,
    deleteScreenshot: deleteScreenshot,
    generateReport: generateReport,
    deleteReport: deleteReport,
    generateJsonReport: generateJsonReportTask
  });

  // eslint-disable-next-line no-param-reassign
  config.env.cypressImageDiff = _config.userConfig;

  return config;
};

module.exports = getCompareSnapshotsPlugin;

// make sure the diff image fully populated before proceeding further

// Saving test status object to build report if task is triggered