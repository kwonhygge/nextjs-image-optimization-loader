"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = NextCustomImageLoader;
var RESULT = require('./result.json');
var SCREEN_BREAK_POINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};
var getSizeName = function getSizeName(width) {
  var breakpoints = Object.keys(SCREEN_BREAK_POINT);
  for (var _i = 0, _breakpoints = breakpoints; _i < _breakpoints.length; _i++) {
    var breakpoint = _breakpoints[_i];
    if (width <= SCREEN_BREAK_POINT[breakpoint]) {
      return breakpoint;
    }
  }
  return 'optimized';
};
function NextCustomImageLoader(_ref) {
  var src = _ref.src,
    width = _ref.width;
  var regex = /\/_next\/static\/media\/([^\/.]+)\.[^\/.]+(\.\w+)?$/;
  var isModuleImportMatch = src.match(regex);
  if (process.env.NODE_ENV === 'development') return src;
  if (isModuleImportMatch) {
    var fileName = isModuleImportMatch[1];
    var sizeName = getSizeName(width);
    if (RESULT[fileName]) {
      var fileSrc = RESULT[fileName][sizeName];
      if (fileSrc) {
        return fileSrc;
      } else {
        console.error("Image size ".concat(sizeName, " not found for ").concat(fileName, " in result.json"));
      }
    }
    return src;
  }
  return src;
}