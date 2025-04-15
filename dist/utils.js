'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pngjs = require('pngjs');

var _regeneratorRuntime = require("regenerator-runtime");

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var createDir = function createDir(dirs) {
  dirs.forEach(function (dir) {
    if (!_fsExtra2['default'].existsSync(dir)) {
      _fsExtra2['default'].mkdirSync(dir, { recursive: true });
    }
  });
};

var cleanDir = function cleanDir(dirs) {
  dirs.forEach(function (dir) {
    if (_fsExtra2['default'].existsSync(dir)) {
      _fsExtra2['default'].emptyDirSync(dir);
    }
  });
};

var readDir = function readDir(dir) {
  return _fsExtra2['default'].readdirSync(dir);
};

var setFilePermission = function setFilePermission(dir, permission) {
  try {
    if (_fsExtra2['default'].existsSync(dir)) {
      var fd = _fsExtra2['default'].openSync(dir, 'r');
      _fsExtra2['default'].fchmodSync(fd, permission);
      _fsExtra2['default'].closeSync(fd);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

var renameAndMoveFile = function renameAndMoveFile(originalFilePath, newFilePath) {
  _fsExtra2['default'].moveSync(originalFilePath, newFilePath, { overwrite: true });
};

var renameAndCopyFile = function renameAndCopyFile(originalFilePath, newFilePath) {
  _fsExtra2['default'].copySync(originalFilePath, newFilePath, { overwrite: true });
};

var parseImage = function parseImage(image) {
  return _regeneratorRuntime2['default'].async(function parseImage$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', new Promise(function (resolve, reject) {
          var fd = _fsExtra2['default'].createReadStream(image);
          fd.on('error', function (error) {
            return reject(error);
          }).pipe(new _pngjs.PNG())
          // eslint-disable-next-line func-names
          .on('parsed', function () {
            var that = this;
            resolve(that);
          });
        }));

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

var adjustCanvas = function adjustCanvas(image, width, height) {
  var imageAdjustedCanvas;
  return _regeneratorRuntime2['default'].async(function adjustCanvas$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(image.width === width && image.height === height)) {
          context$1$0.next = 2;
          break;
        }

        return context$1$0.abrupt('return', image);

      case 2:
        imageAdjustedCanvas = new _pngjs.PNG({
          width: width,
          height: height,
          bitDepth: image.bitDepth,
          inputHasAlpha: true
        });

        _pngjs.PNG.bitblt(image, imageAdjustedCanvas, 0, 0, image.width, image.height, 0, 0);

        return context$1$0.abrupt('return', imageAdjustedCanvas);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

var getRelativePathFromCwd = function getRelativePathFromCwd(dir) {
  var relative = _path2['default'].relative(process.cwd(), dir);
  return _fsExtra2['default'].existsSync(relative) ? relative : '';
};

var getCleanDate = function getCleanDate(date) {
  var source = date ? new Date(date) : new Date();
  return source.toLocaleString('en-GB').replace(/(,\s*)|,|\s+/g, '_').replace(/\\|\//g, '-').replace(/:/g, '');
};

var writeFileIncrement = function writeFileIncrement(name, data) {
  var increment = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
  var filename, absolutePath;
  return _regeneratorRuntime2['default'].async(function writeFileIncrement$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        filename = '' + _path2['default'].basename(name, _path2['default'].extname(name)) + (increment >= 2 ? '_' + increment : '') + _path2['default'].extname(name);
        absolutePath = _path2['default'].join(_path2['default'].dirname(name), filename);

        if (!(_fsExtra2['default'].existsSync(absolutePath) === false)) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return', _fsExtra2['default'].writeFile(absolutePath, data));

      case 4:
        return context$1$0.abrupt('return', writeFileIncrement(name, data, increment + 1));

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

var toBase64 = function toBase64(relativePath) {
  var absolutePath, content;
  return _regeneratorRuntime2['default'].async(function toBase64$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(relativePath === '')) {
          context$1$0.next = 2;
          break;
        }

        return context$1$0.abrupt('return', '');

      case 2:
        absolutePath = _path2['default'].join(process.cwd(), relativePath);
        context$1$0.next = 5;
        return _regeneratorRuntime2['default'].awrap(_fsExtra2['default'].readFile(absolutePath, { encoding: 'base64' }));

      case 5:
        content = context$1$0.sent;
        return context$1$0.abrupt('return', 'data:image/png;base64,' + content);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

exports.createDir = createDir;
exports.cleanDir = cleanDir;
exports.readDir = readDir;
exports.parseImage = parseImage;
exports.adjustCanvas = adjustCanvas;
exports.setFilePermission = setFilePermission;
exports.renameAndMoveFile = renameAndMoveFile;
exports.renameAndCopyFile = renameAndCopyFile;
exports.getRelativePathFromCwd = getRelativePathFromCwd;
exports.getCleanDate = getCleanDate;
exports.writeFileIncrement = writeFileIncrement;
exports.toBase64 = toBase64;