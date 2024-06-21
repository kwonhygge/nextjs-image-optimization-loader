"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileName = void 0;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var getFileName = exports.getFileName = function getFileName(filePath) {
  return _path["default"].basename(filePath, _path["default"].extname(filePath));
};