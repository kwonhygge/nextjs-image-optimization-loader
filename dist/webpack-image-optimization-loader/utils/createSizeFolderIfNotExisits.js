"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResizedFolderIfNotExists = void 0;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var createResizedFolderIfNotExists = exports.createResizedFolderIfNotExists = function createResizedFolderIfNotExists(optimizedFolderPath) {
  if (!_fs["default"].existsSync(optimizedFolderPath)) {
    _fs["default"].mkdirSync(optimizedFolderPath);
  }
};