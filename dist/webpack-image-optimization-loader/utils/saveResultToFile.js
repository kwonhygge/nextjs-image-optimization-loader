"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveResultToFile = void 0;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var saveResultToFile = exports.saveResultToFile = function saveResultToFile(imageInfo, resultFilePath) {
  _fs["default"].writeFileSync(resultFilePath, JSON.stringify(imageInfo));
};