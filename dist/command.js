'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashMerge = require('lodash/merge');

var _lodashMerge2 = _interopRequireDefault(_lodashMerge);

var _cypressRecurse = require('cypress-recurse');

var _configDefault = require('./config.default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _utilsBrowser = require('./utils.browser');

var compareSnapshotCommand = function compareSnapshotCommand() {
  var userConfig = Cypress.env('cypressImageDiff') || _configDefault2['default'];

  var height = Cypress.config('viewportHeight') || 1440;
  var width = Cypress.config('viewportWidth') || 1980;

  // Force screenshot resolution to keep consistency of test runs across machines
  Cypress.config('viewportHeight', parseInt(height, 10));
  Cypress.config('viewportWidth', parseInt(width, 10));

  Cypress.Commands.add('compareSnapshot', { prevSubject: 'optional' }, function (subject, orignalOptions) {
    var _ref = typeof orignalOptions === 'string' ? { name: orignalOptions } : orignalOptions;

    var name = _ref.name;
    var _ref$testThreshold = _ref.testThreshold;
    var testThreshold = _ref$testThreshold === undefined ? userConfig.FAILURE_THRESHOLD : _ref$testThreshold;
    var _ref$retryOptions = _ref.retryOptions;
    var retryOptions = _ref$retryOptions === undefined ? userConfig.RETRY_OPTIONS : _ref$retryOptions;
    var _ref$exactName = _ref.exactName;
    var exactName = _ref$exactName === undefined ? false : _ref$exactName;
    var cypressScreenshotOptions = _ref.cypressScreenshotOptions;
    var _ref$nameTemplate = _ref.nameTemplate;
    var nameTemplate = _ref$nameTemplate === undefined ? userConfig.NAME_TEMPLATE : _ref$nameTemplate;

    // IN-QUEUE-FOR-BREAKING-CHANGE: Ternary condition here is to avoid a breaking change with the new option nameTemplate, will be simplified once we remove the exactName option
    // eslint-disable-next-line no-nested-ternary
    var testName = nameTemplate ? (0, _utilsBrowser.getFileName)({
      nameTemplate: nameTemplate,
      givenName: name,
      specName: Cypress.spec.name,
      browserName: Cypress.browser.name,
      width: Cypress.config('viewportWidth'),
      height: Cypress.config('viewportHeight')
    }) : exactName ? name : '' + Cypress.spec.name.replace('.js', '') + (/^\//.test(name) ? '' : '-') + name;

    var defaultRetryOptions = {
      limit: 1,
      log: function log(percentage) {
        var prefix = percentage <= testThreshold ? 'PASS' : 'FAIL';
        cy.log(prefix + ': Image difference percentage ' + percentage);
      },
      error: 'Image difference greater than threshold: ' + testThreshold
    };

    (0, _cypressRecurse.recurse)(function () {
      // Clear the comparison/diff screenshots/reports for this test
      cy.task('deleteScreenshot', { testName: testName });
      cy.task('deleteReport', { testName: testName });

      var screenshotOptions = (0, _lodashMerge2['default'])({}, userConfig.CYPRESS_SCREENSHOT_OPTIONS, cypressScreenshotOptions);
      var objToOperateOn = subject ? cy.get(subject) : cy;
      var screenshotted = objToOperateOn.screenshot(testName, screenshotOptions);

      if (userConfig.FAIL_ON_MISSING_BASELINE === false) {
        // copy to baseline if it does not exist
        screenshotted.task('copyScreenshot', {
          testName: testName
        });
      }

      // Compare screenshots
      var options = {
        testName: testName,
        testThreshold: testThreshold,
        failOnMissingBaseline: userConfig.FAIL_ON_MISSING_BASELINE,
        specFilename: Cypress.spec.name,
        specPath: Cypress.spec.relative,
        inlineAssets: userConfig.INLINE_ASSETS
      };

      return cy.task('compareSnapshotsPlugin', options);
    }, function (percentage) {
      return percentage <= testThreshold;
    }, Object.assign({}, defaultRetryOptions, retryOptions));
  });

  Cypress.Commands.add('hideElement', { prevSubject: 'optional' }, function (subject) {
    var hide = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    if (hide) {
      cy.get(subject).invoke('attr', 'style', 'display: none;');
    } else {
      cy.get(subject).invoke('attr', 'style', 'display: \'\';');
    }
    return undefined;
  });
};

module.exports = compareSnapshotCommand;