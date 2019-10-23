import React, { PureComponent, useState, useCallback, memo, useMemo, Fragment, useRef, useEffect } from 'react';
import { useTheme, lineCurvePropType, blendModePropType, motionPropTypes, curveFromProp, useValueFormatter, useMotionConfig, SmartMotion, getLabelGenerator, DotsItem, withContainer, useDimensions, CartesianMarkers, SvgWrapper, ResponsiveWrapper, getRelativeCursor, isCursorInRect } from '@nivo/core';
import { ordinalColorsPropType, useOrdinalColorScale, useInheritedColor } from '@nivo/colors';
import { axisPropType, Grid, Axes, renderGridLinesToCanvas, renderAxesToCanvas } from '@nivo/axes';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isPlainObject from 'lodash/isPlainObject';
import { BasicTooltip, TableTooltip, crosshairPropTypes, useTooltip, Crosshair } from '@nivo/tooltip';
import { line, area } from 'd3-shape';
import { scalePropType, computeXYScalesForSeries } from '@nivo/scales';
import { LegendPropShape as LegendPropShape$1, renderLegendToCanvas } from '@nivo/legends';
import { TransitionMotion, spring } from 'react-motion';
import { Mesh as Mesh$2, useVoronoiMesh, renderVoronoiToCanvas, renderVoronoiCellToCanvas } from '@nivo/voronoi';

var DIRECTION_ROW = 'row';
var DIRECTION_COLUMN = 'column';
var ANCHOR_TOP = 'top';
var ANCHOR_TOP_RIGHT = 'top-right';
var ANCHOR_RIGHT = 'right';
var ANCHOR_BOTTOM_RIGHT = 'bottom-right';
var ANCHOR_BOTTOM = 'bottom';
var ANCHOR_BOTTOM_LEFT = 'bottom-left';
var ANCHOR_LEFT = 'left';
var ANCHOR_TOP_LEFT = 'top-left';
var ANCHOR_CENTER = 'center';
var DIRECTION_LEFT_TO_RIGHT = 'left-to-right';
var DIRECTION_RIGHT_TO_LEFT = 'right-to-left';
var DIRECTION_TOP_TO_BOTTOM = 'top-to-bottom';
var DIRECTION_BOTTOM_TO_TOP = 'bottom-to-top';

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var legendEffectPropType = PropTypes.shape({
  on: PropTypes.oneOfType([PropTypes.oneOf(['hover'])]).isRequired,
  style: PropTypes.shape({
    itemTextColor: PropTypes.string,
    itemBackground: PropTypes.string,
    itemOpacity: PropTypes.number,
    symbolSize: PropTypes.number,
    symbolBorderWidth: PropTypes.number,
    symbolBorderColor: PropTypes.string
  }).isRequired
});
var symbolPropTypes = {
  symbolShape: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  symbolSize: PropTypes.number,
  symbolSpacing: PropTypes.number,
  symbolBorderWidth: PropTypes.number,
  symbolBorderColor: PropTypes.string
};
var interactivityPropTypes = {
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};
var datumPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  fill: PropTypes.string
});
var LegendPropShape = _objectSpread({
  data: PropTypes.arrayOf(datumPropType),
  anchor: PropTypes.oneOf([ANCHOR_TOP, ANCHOR_TOP_RIGHT, ANCHOR_RIGHT, ANCHOR_BOTTOM_RIGHT, ANCHOR_BOTTOM, ANCHOR_BOTTOM_LEFT, ANCHOR_LEFT, ANCHOR_TOP_LEFT, ANCHOR_CENTER]).isRequired,
  translateX: PropTypes.number,
  translateY: PropTypes.number,
  direction: PropTypes.oneOf([DIRECTION_ROW, DIRECTION_COLUMN]).isRequired,
  itemsSpacing: PropTypes.number,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemDirection: PropTypes.oneOf([DIRECTION_LEFT_TO_RIGHT, DIRECTION_RIGHT_TO_LEFT, DIRECTION_TOP_TO_BOTTOM, DIRECTION_BOTTOM_TO_TOP]),
  itemTextColor: PropTypes.string,
  itemBackground: PropTypes.string,
  itemOpacity: PropTypes.number
}, symbolPropTypes, interactivityPropTypes, {
  effects: PropTypes.arrayOf(legendEffectPropType)
});

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } return target; }
function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var zeroPadding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var computeDimensions = function computeDimensions(_ref) {
  var direction = _ref.direction,
      itemsSpacing = _ref.itemsSpacing,
      _padding = _ref.padding,
      itemCount = _ref.itemCount,
      itemWidth = _ref.itemWidth,
      itemHeight = _ref.itemHeight;
  var padding;
  if (isNumber(_padding)) {
    padding = {
      top: _padding,
      right: _padding,
      bottom: _padding,
      left: _padding
    };
  } else if (isPlainObject(_padding)) {
    padding = _objectSpread$1({}, zeroPadding, _padding);
  } else {
    throw new TypeError("Invalid property padding, must be one of: number, object");
  }
  var horizontalPadding = padding.left + padding.right;
  var verticalPadding = padding.top + padding.bottom;
  var width = itemWidth + horizontalPadding;
  var height = itemHeight + verticalPadding;
  var spacing = (itemCount - 1) * itemsSpacing;
  if (direction === DIRECTION_ROW) {
    width = itemWidth * itemCount + spacing + horizontalPadding;
  } else if (direction === DIRECTION_COLUMN) {
    height = itemHeight * itemCount + spacing + verticalPadding;
  }
  return {
    width: width,
    height: height,
    padding: padding
  };
};
var computePositionFromAnchor = function computePositionFromAnchor(_ref2) {
  var anchor = _ref2.anchor,
      translateX = _ref2.translateX,
      translateY = _ref2.translateY,
      containerWidth = _ref2.containerWidth,
      containerHeight = _ref2.containerHeight,
      width = _ref2.width,
      height = _ref2.height;
  var x = translateX;
  var y = translateY;
  switch (anchor) {
    case ANCHOR_TOP:
      x += (containerWidth - width) / 2;
      break;
    case ANCHOR_TOP_RIGHT:
      x += containerWidth - width;
      break;
    case ANCHOR_RIGHT:
      x += containerWidth - width;
      y += (containerHeight - height) / 2;
      break;
    case ANCHOR_BOTTOM_RIGHT:
      x += containerWidth - width;
      y += containerHeight - height;
      break;
    case ANCHOR_BOTTOM:
      x += (containerWidth - width) / 2;
      y += containerHeight - height;
      break;
    case ANCHOR_BOTTOM_LEFT:
      y += containerHeight - height;
      break;
    case ANCHOR_LEFT:
      y += (containerHeight - height) / 2;
      break;
    case ANCHOR_CENTER:
      x += (containerWidth - width) / 2;
      y += (containerHeight - height) / 2;
      break;
  }
  return {
    x: x,
    y: y
  };
};
var computeItemLayout = function computeItemLayout(_ref3) {
  var direction = _ref3.direction,
      justify = _ref3.justify,
      symbolSize = _ref3.symbolSize,
      symbolSpacing = _ref3.symbolSpacing,
      width = _ref3.width,
      height = _ref3.height;
  var symbolX;
  var symbolY;
  var labelX;
  var labelY;
  var labelAnchor;
  var labelAlignment;
  switch (direction) {
    case DIRECTION_LEFT_TO_RIGHT:
      symbolX = 0;
      symbolY = (height - symbolSize) / 2;
      labelY = height / 2;
      labelAlignment = 'central';
      if (justify === true) {
        labelX = width;
        labelAnchor = 'end';
      } else {
        labelX = symbolSize + symbolSpacing;
        labelAnchor = 'start';
      }
      break;
    case DIRECTION_RIGHT_TO_LEFT:
      symbolX = width - symbolSize;
      symbolY = (height - symbolSize) / 2;
      labelY = height / 2;
      labelAlignment = 'central';
      if (justify === true) {
        labelX = 0;
        labelAnchor = 'start';
      } else {
        labelX = width - symbolSize - symbolSpacing;
        labelAnchor = 'end';
      }
      break;
    case DIRECTION_TOP_TO_BOTTOM:
      symbolX = (width - symbolSize) / 2;
      symbolY = 0;
      labelX = width / 2;
      labelAnchor = 'middle';
      if (justify === true) {
        labelY = height;
        labelAlignment = 'alphabetic';
      } else {
        labelY = symbolSize + symbolSpacing;
        labelAlignment = 'text-before-edge';
      }
      break;
    case DIRECTION_BOTTOM_TO_TOP:
      symbolX = (width - symbolSize) / 2;
      symbolY = height - symbolSize;
      labelX = width / 2;
      labelAnchor = 'middle';
      if (justify === true) {
        labelY = 0;
        labelAlignment = 'text-before-edge';
      } else {
        labelY = height - symbolSize - symbolSpacing;
        labelAlignment = 'alphabetic';
      }
      break;
  }
  return {
    symbolX: symbolX,
    symbolY: symbolY,
    labelX: labelX,
    labelY: labelY,
    labelAnchor: labelAnchor,
    labelAlignment: labelAlignment
  };
};

var symbolPropTypes$1 = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired
};
var symbolDefaultProps = {
  borderWidth: 0,
  borderColor: 'transparent'
};

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } return target; }
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var SymbolCircle =
function (_PureComponent) {
  _inherits(SymbolCircle, _PureComponent);
  function SymbolCircle() {
    _classCallCheck(this, SymbolCircle);
    return _possibleConstructorReturn(this, _getPrototypeOf(SymbolCircle).apply(this, arguments));
  }
  _createClass(SymbolCircle, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          x = _this$props.x,
          y = _this$props.y,
          size = _this$props.size,
          fill = _this$props.fill,
          borderWidth = _this$props.borderWidth,
          borderColor = _this$props.borderColor;
      return React.createElement("circle", {
        r: size / 2,
        cx: x + size / 2,
        cy: y + size / 2,
        fill: fill,
        strokeWidth: borderWidth,
        stroke: borderColor,
        style: {
          pointerEvents: 'none'
        }
      });
    }
  }]);
  return SymbolCircle;
}(PureComponent);
_defineProperty$2(SymbolCircle, "propTypes", _objectSpread$2({}, symbolPropTypes$1));
_defineProperty$2(SymbolCircle, "defaultProps", _objectSpread$2({}, symbolDefaultProps));

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } return target; }
function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }
function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }
function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }
function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }
function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }
function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var SymbolDiamond =
function (_PureComponent) {
  _inherits$1(SymbolDiamond, _PureComponent);
  function SymbolDiamond() {
    _classCallCheck$1(this, SymbolDiamond);
    return _possibleConstructorReturn$1(this, _getPrototypeOf$1(SymbolDiamond).apply(this, arguments));
  }
  _createClass$1(SymbolDiamond, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          x = _this$props.x,
          y = _this$props.y,
          size = _this$props.size,
          fill = _this$props.fill,
          borderWidth = _this$props.borderWidth,
          borderColor = _this$props.borderColor;
      return React.createElement("g", {
        transform: "translate(".concat(x, ",").concat(y, ")")
      }, React.createElement("path", {
        d: "\n                    M".concat(size / 2, " 0\n                    L").concat(size * 0.8, " ").concat(size / 2, "\n                    L").concat(size / 2, " ").concat(size, "\n                    L").concat(size * 0.2, " ").concat(size / 2, "\n                    L").concat(size / 2, " 0\n                "),
        fill: fill,
        strokeWidth: borderWidth,
        stroke: borderColor,
        style: {
          pointerEvents: 'none'
        }
      }));
    }
  }]);
  return SymbolDiamond;
}(PureComponent);
_defineProperty$3(SymbolDiamond, "propTypes", _objectSpread$3({}, symbolPropTypes$1));
_defineProperty$3(SymbolDiamond, "defaultProps", _objectSpread$3({}, symbolDefaultProps));

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$4(target, key, source[key]); }); } return target; }
function _typeof$2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }
function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn$2(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$2(self); }
function _assertThisInitialized$2(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _getPrototypeOf$2(o) { _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$2(o); }
function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$2(subClass, superClass); }
function _setPrototypeOf$2(o, p) { _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$2(o, p); }
function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var SymbolSquare =
function (_PureComponent) {
  _inherits$2(SymbolSquare, _PureComponent);
  function SymbolSquare() {
    _classCallCheck$2(this, SymbolSquare);
    return _possibleConstructorReturn$2(this, _getPrototypeOf$2(SymbolSquare).apply(this, arguments));
  }
  _createClass$2(SymbolSquare, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          x = _this$props.x,
          y = _this$props.y,
          size = _this$props.size,
          fill = _this$props.fill,
          borderWidth = _this$props.borderWidth,
          borderColor = _this$props.borderColor;
      return React.createElement("rect", {
        x: x,
        y: y,
        fill: fill,
        strokeWidth: borderWidth,
        stroke: borderColor,
        width: size,
        height: size,
        style: {
          pointerEvents: 'none'
        }
      });
    }
  }]);
  return SymbolSquare;
}(PureComponent);
_defineProperty$4(SymbolSquare, "propTypes", _objectSpread$4({}, symbolPropTypes$1));
_defineProperty$4(SymbolSquare, "defaultProps", _objectSpread$4({}, symbolDefaultProps));

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$5(target, key, source[key]); }); } return target; }
function _typeof$3(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn$3(self, call) { if (call && (_typeof$3(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$3(self); }
function _assertThisInitialized$3(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _getPrototypeOf$3(o) { _getPrototypeOf$3 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$3(o); }
function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$3(subClass, superClass); }
function _setPrototypeOf$3(o, p) { _setPrototypeOf$3 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$3(o, p); }
function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var SymbolTriangle =
function (_PureComponent) {
  _inherits$3(SymbolTriangle, _PureComponent);
  function SymbolTriangle() {
    _classCallCheck$3(this, SymbolTriangle);
    return _possibleConstructorReturn$3(this, _getPrototypeOf$3(SymbolTriangle).apply(this, arguments));
  }
  _createClass$3(SymbolTriangle, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          x = _this$props.x,
          y = _this$props.y,
          size = _this$props.size,
          fill = _this$props.fill,
          borderWidth = _this$props.borderWidth,
          borderColor = _this$props.borderColor;
      return React.createElement("g", {
        transform: "translate(".concat(x, ",").concat(y, ")")
      }, React.createElement("path", {
        d: "\n                M".concat(size / 2, " 0\n                L").concat(size, " ").concat(size, "\n                L0 ").concat(size, "\n                L").concat(size / 2, " 0\n            "),
        fill: fill,
        strokeWidth: borderWidth,
        stroke: borderColor,
        style: {
          pointerEvents: 'none'
        }
      }));
    }
  }]);
  return SymbolTriangle;
}(PureComponent);
_defineProperty$5(SymbolTriangle, "propTypes", _objectSpread$5({}, symbolPropTypes$1));
_defineProperty$5(SymbolTriangle, "defaultProps", _objectSpread$5({}, symbolDefaultProps));

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$6(target, key, source[key]); }); } return target; }
function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var symbolByShape = {
  circle: SymbolCircle,
  diamond: SymbolDiamond,
  square: SymbolSquare,
  triangle: SymbolTriangle
};
var LegendSvgItem = function LegendSvgItem(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      data = _ref.data,
      direction = _ref.direction,
      justify = _ref.justify,
      textColor = _ref.textColor,
      background = _ref.background,
      opacity = _ref.opacity,
      symbolShape = _ref.symbolShape,
      symbolSize = _ref.symbolSize,
      symbolSpacing = _ref.symbolSpacing,
      symbolBorderWidth = _ref.symbolBorderWidth,
      symbolBorderColor = _ref.symbolBorderColor,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      effects = _ref.effects;
  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      style = _useState2[0],
      setStyle = _useState2[1];
  var theme = useTheme();
  var handleClick = useCallback(function (event) {
    return onClick && onClick(data, event);
  }, [onClick, data]);
  var handleMouseEnter = useCallback(function (event) {
    if (effects.length > 0) {
      var applyEffects = effects.filter(function (_ref2) {
        var on = _ref2.on;
        return on === 'hover';
      });
      var _style = applyEffects.reduce(function (acc, effect) {
        return _objectSpread$6({}, acc, effect.style);
      }, {});
      setStyle(_style);
    }
    if (onMouseEnter === undefined) return;
    onMouseEnter(data, event);
  }, [onMouseEnter, data, effects]);
  var handleMouseLeave = useCallback(function () {
    if (effects.length > 0) {
      var applyEffects = effects.filter(function (_ref3) {
        var on = _ref3.on;
        return on !== 'hover';
      });
      var _style2 = applyEffects.reduce(function (acc, effect) {
        return _objectSpread$6({}, acc, effect.style);
      }, {});
      setStyle(_style2);
    }
    if (onMouseLeave === undefined) return;
    onMouseLeave(data, event);
  }, [onMouseLeave, data, effects]);
  var _computeItemLayout = computeItemLayout({
    direction: direction,
    justify: justify,
    symbolSize: style.symbolSize || symbolSize,
    symbolSpacing: symbolSpacing,
    width: width,
    height: height
  }),
      symbolX = _computeItemLayout.symbolX,
      symbolY = _computeItemLayout.symbolY,
      labelX = _computeItemLayout.labelX,
      labelY = _computeItemLayout.labelY,
      labelAnchor = _computeItemLayout.labelAnchor,
      labelAlignment = _computeItemLayout.labelAlignment;
  var isInteractive = [onClick, onMouseEnter, onMouseLeave].some(function (handler) {
    return handler !== undefined;
  });
  var _Symbol;
  if (isFunction(symbolShape)) {
    _Symbol = symbolShape;
  } else {
    _Symbol = symbolByShape[symbolShape];
  }
  return React.createElement("g", {
    transform: "translate(".concat(x, ",").concat(y, ")"),
    style: {
      opacity: style.itemOpacity !== undefined ? style.itemOpacity : opacity
    }
  }, React.createElement("rect", {
    width: width,
    height: height,
    fill: style.itemBackground || background,
    style: {
      cursor: isInteractive ? 'pointer' : 'auto'
    },
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }), React.createElement(_Symbol, {
    x: symbolX,
    y: symbolY,
    size: style.symbolSize || symbolSize,
    fill: data.fill || data.color,
    borderWidth: style.symbolBorderWidth !== undefined ? style.symbolBorderWidth : symbolBorderWidth,
    borderColor: style.symbolBorderColor || symbolBorderColor
  }), React.createElement("text", {
    textAnchor: labelAnchor,
    style: _objectSpread$6({}, theme.legends.text, {
      fill: style.itemTextColor || textColor,
      dominantBaseline: labelAlignment,
      pointerEvents: 'none',
      userSelect: 'none'
    }),
    x: labelX,
    y: labelY
  }, data.label));
};
LegendSvgItem.displayName = 'LegendSvgItem';
LegendSvgItem.propTypes = _objectSpread$6({
  data: datumPropType.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  textColor: PropTypes.string,
  background: PropTypes.string,
  opacity: PropTypes.number,
  direction: PropTypes.oneOf(['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top']).isRequired,
  justify: PropTypes.bool.isRequired
}, symbolPropTypes, interactivityPropTypes);
LegendSvgItem.defaultProps = {
  direction: 'left-to-right',
  justify: false,
  textColor: 'black',
  background: 'transparent',
  opacity: 1,
  symbolShape: 'square',
  symbolSize: 16,
  symbolSpacing: 8,
  symbolBorderWidth: 0,
  symbolBorderColor: 'transparent',
  effects: []
};

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$7(target, key, source[key]); }); } return target; }
function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var LegendSvg = function LegendSvg(_ref) {
  var data = _ref.data,
      x = _ref.x,
      y = _ref.y,
      containerHeight = _ref.containerHeight,
      scrollableLegend = _ref.scrollableLegend,
      direction = _ref.direction,
      _padding = _ref.padding,
      justify = _ref.justify,
      effects = _ref.effects,
      itemWidth = _ref.itemWidth,
      itemHeight = _ref.itemHeight,
      itemDirection = _ref.itemDirection,
      itemsSpacing = _ref.itemsSpacing,
      itemTextColor = _ref.itemTextColor,
      itemBackground = _ref.itemBackground,
      itemOpacity = _ref.itemOpacity,
      symbolShape = _ref.symbolShape,
      symbolSize = _ref.symbolSize,
      symbolSpacing = _ref.symbolSpacing,
      symbolBorderWidth = _ref.symbolBorderWidth,
      symbolBorderColor = _ref.symbolBorderColor,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave;
  var _computeDimensions = computeDimensions({
    itemCount: data.length,
    itemWidth: itemWidth,
    itemHeight: itemHeight,
    itemsSpacing: itemsSpacing,
    direction: direction,
    padding: _padding
  }),
      padding = _computeDimensions.padding;
  var xStep = 0;
  var yStep = 0;
  if (direction === 'row') {
    xStep = itemWidth + itemsSpacing;
  } else if (direction === 'column') {
    yStep = itemHeight + itemsSpacing;
  }
  return React.createElement("g", {
    transform: "translate(".concat(x, ",").concat(y, ")")
  }, scrollableLegend ? React.createElement("foreignObject", {
    width: 180,
    height: containerHeight
  }, React.createElement("div", {
    style: {
      height: '100%',
      overflow: 'auto'
    },
    xmlns: "http://www.w3.org/1999/xhtml"
  }, React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    role: "img",
    width: '100%',
    height: "".concat(data.length * itemHeight, "px")
  }, data.map(function (data, i) {
    return React.createElement(LegendSvgItem, {
      key: i,
      data: data,
      x: i * xStep + padding.left,
      y: i * yStep + padding.top,
      width: itemWidth,
      height: itemHeight,
      direction: itemDirection,
      justify: justify,
      effects: effects,
      textColor: itemTextColor,
      background: itemBackground,
      opacity: itemOpacity,
      symbolShape: symbolShape,
      symbolSize: symbolSize,
      symbolSpacing: symbolSpacing,
      symbolBorderWidth: symbolBorderWidth,
      symbolBorderColor: symbolBorderColor,
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    });
  })))) : React.createElement(React.Fragment, null, data.map(function (data, i) {
    return React.createElement(LegendSvgItem, {
      key: i,
      data: data,
      x: i * xStep + padding.left,
      y: i * yStep + padding.top,
      width: itemWidth,
      height: itemHeight,
      direction: itemDirection,
      justify: justify,
      effects: effects,
      textColor: itemTextColor,
      background: itemBackground,
      opacity: itemOpacity,
      symbolShape: symbolShape,
      symbolSize: symbolSize,
      symbolSpacing: symbolSpacing,
      symbolBorderWidth: symbolBorderWidth,
      symbolBorderColor: symbolBorderColor,
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
    });
  })));
};
LegendSvg.propTypes = _objectSpread$7({
  data: PropTypes.arrayOf(datumPropType).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  containerHeight: PropTypes.number,
  scrollableLegend: PropTypes.bool,
  direction: PropTypes.oneOf(['row', 'column']).isRequired,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  })]).isRequired,
  justify: PropTypes.bool.isRequired,
  itemsSpacing: PropTypes.number.isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemDirection: PropTypes.oneOf([DIRECTION_LEFT_TO_RIGHT, DIRECTION_RIGHT_TO_LEFT, DIRECTION_TOP_TO_BOTTOM, DIRECTION_BOTTOM_TO_TOP]).isRequired,
  itemTextColor: PropTypes.string.isRequired,
  itemBackground: PropTypes.string.isRequired,
  itemOpacity: PropTypes.number.isRequired
}, symbolPropTypes, interactivityPropTypes);
LegendSvg.defaultProps = {
  padding: 0,
  justify: false,
  itemsSpacing: 0,
  itemDirection: 'left-to-right',
  itemTextColor: 'black',
  itemBackground: 'transparent',
  itemOpacity: 1
};

function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$8(target, key, source[key]); }); } return target; }
function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var BoxLegendSvg = function BoxLegendSvg(_ref) {
  var data = _ref.data,
      containerWidth = _ref.containerWidth,
      containerHeight = _ref.containerHeight,
      scrollableLegend = _ref.scrollableLegend,
      translateX = _ref.translateX,
      translateY = _ref.translateY,
      anchor = _ref.anchor,
      direction = _ref.direction,
      padding = _ref.padding,
      justify = _ref.justify,
      itemsSpacing = _ref.itemsSpacing,
      itemWidth = _ref.itemWidth,
      itemHeight = _ref.itemHeight,
      itemDirection = _ref.itemDirection,
      itemTextColor = _ref.itemTextColor,
      itemBackground = _ref.itemBackground,
      itemOpacity = _ref.itemOpacity,
      symbolShape = _ref.symbolShape,
      symbolSize = _ref.symbolSize,
      symbolSpacing = _ref.symbolSpacing,
      symbolBorderWidth = _ref.symbolBorderWidth,
      symbolBorderColor = _ref.symbolBorderColor,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      effects = _ref.effects;
  var _computeDimensions = computeDimensions({
    itemCount: data.length,
    itemsSpacing: itemsSpacing,
    itemWidth: itemWidth,
    itemHeight: itemHeight,
    direction: direction,
    padding: padding
  }),
      width = _computeDimensions.width,
      height = _computeDimensions.height;
  var _computePositionFromA = computePositionFromAnchor({
    anchor: anchor,
    translateX: translateX,
    translateY: translateY,
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    width: width,
    height: height
  }),
      x = _computePositionFromA.x,
      y = _computePositionFromA.y;
  return React.createElement(LegendSvg, {
    data: data,
    x: x,
    y: y,
    containerHeight: containerHeight,
    scrollableLegend: scrollableLegend,
    direction: direction,
    padding: padding,
    justify: justify,
    effects: effects,
    itemsSpacing: itemsSpacing,
    itemWidth: itemWidth,
    itemHeight: itemHeight,
    itemDirection: itemDirection,
    itemTextColor: itemTextColor,
    itemBackground: itemBackground,
    itemOpacity: itemOpacity,
    symbolShape: symbolShape,
    symbolSize: symbolSize,
    symbolSpacing: symbolSpacing,
    symbolBorderWidth: symbolBorderWidth,
    symbolBorderColor: symbolBorderColor,
    onClick: onClick,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  });
};
BoxLegendSvg.propTypes = _objectSpread$8({
  data: PropTypes.arrayOf(datumPropType).isRequired,
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
  scrollableLegend: PropTypes.bool,
  translateX: PropTypes.number.isRequired,
  translateY: PropTypes.number.isRequired,
  anchor: PropTypes.oneOf([ANCHOR_TOP, ANCHOR_TOP_RIGHT, ANCHOR_RIGHT, ANCHOR_BOTTOM_RIGHT, ANCHOR_BOTTOM, ANCHOR_BOTTOM_LEFT, ANCHOR_LEFT, ANCHOR_TOP_LEFT, ANCHOR_CENTER]).isRequired,
  direction: PropTypes.oneOf([DIRECTION_ROW, DIRECTION_COLUMN]).isRequired,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  })]).isRequired,
  justify: PropTypes.bool,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemDirection: PropTypes.oneOf([DIRECTION_LEFT_TO_RIGHT, DIRECTION_RIGHT_TO_LEFT, DIRECTION_TOP_TO_BOTTOM, DIRECTION_BOTTOM_TO_TOP]),
  itemsSpacing: PropTypes.number.isRequired,
  itemTextColor: PropTypes.string,
  itemBackground: PropTypes.string,
  itemOpacity: PropTypes.number
}, symbolPropTypes, interactivityPropTypes);
BoxLegendSvg.defaultProps = {
  translateX: 0,
  translateY: 0,
  itemsSpacing: LegendSvg.defaultProps.itemsSpacing,
  padding: LegendSvg.defaultProps.padding
};

var LinePointTooltip = function LinePointTooltip(_ref) {
  var point = _ref.point;
  return React.createElement(BasicTooltip, {
    id: React.createElement("span", null, "x: ", React.createElement("strong", null, point.data.xFormatted), ", y:", ' ', React.createElement("strong", null, point.data.yFormatted)),
    enableChip: true,
    color: point.serieColor
  });
};
LinePointTooltip.propTypes = {
  point: PropTypes.object.isRequired
};
var PointTooltip = memo(LinePointTooltip);

var Chip = function Chip(_ref) {
  var color = _ref.color;
  return React.createElement("span", {
    style: {
      display: 'block',
      width: '12px',
      height: '12px',
      background: color
    }
  });
};
Chip.propTypes = {
  color: PropTypes.string.isRequired
};
var SliceTooltip = function SliceTooltip(_ref2) {
  var slice = _ref2.slice,
      axis = _ref2.axis;
  var otherAxis = axis === 'x' ? 'y' : 'x';
  return React.createElement(TableTooltip, {
    rows: slice.points.map(function (point) {
      return [React.createElement(Chip, {
        key: "chip",
        color: point.serieColor
      }), point.serieId, React.createElement("strong", {
        key: "value"
      }, point.data["".concat(otherAxis, "Formatted")])];
    })
  });
};
SliceTooltip.propTypes = {
  slice: PropTypes.object.isRequired,
  axis: PropTypes.oneOf(['x', 'y']).isRequired
};
var SliceTooltip$1 = memo(SliceTooltip);

function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$9(target, key, source[key]); }); } return target; }
function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonPropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
      y: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
    })).isRequired
  })).isRequired,
  xScale: scalePropType.isRequired,
  xFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  yScale: scalePropType.isRequired,
  yFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'slices', 'points', 'mesh', 'legends']), PropTypes.func])).isRequired,
  curve: lineCurvePropType.isRequired,
  axisTop: axisPropType,
  axisRight: axisPropType,
  axisBottom: axisPropType,
  axisLeft: axisPropType,
  enableGridX: PropTypes.bool.isRequired,
  enableGridY: PropTypes.bool.isRequired,
  gridXValues: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]))]),
  gridYValues: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]))]),
  enablePoints: PropTypes.bool.isRequired,
  pointSymbol: PropTypes.func,
  pointSize: PropTypes.number.isRequired,
  pointColor: PropTypes.any.isRequired,
  pointBorderWidth: PropTypes.number.isRequired,
  pointBorderColor: PropTypes.any.isRequired,
  markers: PropTypes.arrayOf(PropTypes.shape({
    axis: PropTypes.oneOf(['x', 'y']).isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    style: PropTypes.object
  })),
  colors: ordinalColorsPropType.isRequired,
  enableArea: PropTypes.bool.isRequired,
  areaOpacity: PropTypes.number.isRequired,
  areaBlendMode: blendModePropType.isRequired,
  areaBaselineValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  lineWidth: PropTypes.number.isRequired,
  defs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired,
  legends: PropTypes.arrayOf(PropTypes.shape(LegendPropShape$1)).isRequired,
  scrollableLegend: PropTypes.bool,
  isInteractive: PropTypes.bool.isRequired,
  debugMesh: PropTypes.bool.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  enableSlices: PropTypes.oneOf(['x', 'y', false]).isRequired,
  debugSlices: PropTypes.bool.isRequired,
  sliceTooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  enableCrosshair: PropTypes.bool.isRequired,
  crosshairType: crosshairPropTypes.type.isRequired
};
var LinePropTypes = _objectSpread$9({}, commonPropTypes, {
  enablePointLabel: PropTypes.bool.isRequired,
  useMesh: PropTypes.bool.isRequired
}, motionPropTypes);
var LineCanvasPropTypes = _objectSpread$9({
  pixelRatio: PropTypes.number.isRequired
}, commonPropTypes);
var commonDefaultProps = {
  curve: 'linear',
  xScale: {
    type: 'point'
  },
  yScale: {
    type: 'linear',
    min: 0,
    max: 'auto'
  },
  layers: ['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends'],
  axisBottom: {},
  axisLeft: {},
  enableGridX: true,
  enableGridY: true,
  enablePoints: true,
  pointSize: 6,
  pointColor: {
    from: 'color'
  },
  pointBorderWidth: 0,
  pointBorderColor: {
    theme: 'background'
  },
  colors: {
    scheme: 'nivo'
  },
  enableArea: false,
  areaBaselineValue: 0,
  areaOpacity: 0.2,
  areaBlendMode: 'normal',
  lineWidth: 2,
  defs: [],
  legends: [],
  scrollableLegend: false,
  isInteractive: true,
  tooltip: PointTooltip,
  enableSlices: false,
  debugSlices: false,
  sliceTooltip: SliceTooltip$1,
  debugMesh: false,
  enableCrosshair: true,
  crosshairType: 'bottom-left'
};
var LineDefaultProps = _objectSpread$9({}, commonDefaultProps, {
  enablePointLabel: false,
  useMesh: false,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15
});
var LineCanvasDefaultProps = _objectSpread$9({}, commonDefaultProps, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});

function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1(); }
function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$1(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$a(target, key, source[key]); }); } return target; }
function _defineProperty$a(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
var useLineGenerator = function useLineGenerator(_ref) {
  var curve = _ref.curve;
  return useMemo(function () {
    return line().defined(function (d) {
      return d.x !== null && d.y !== null;
    }).x(function (d) {
      return d.x;
    }).y(function (d) {
      return d.y;
    }).curve(curveFromProp(curve));
  }, [curve]);
};
var useAreaGenerator = function useAreaGenerator(_ref2) {
  var curve = _ref2.curve,
      yScale = _ref2.yScale,
      areaBaselineValue = _ref2.areaBaselineValue;
  return useMemo(function () {
    return area().defined(function (d) {
      return d.x !== null && d.y !== null;
    }).x(function (d) {
      return d.x;
    }).y1(function (d) {
      return d.y;
    }).curve(curveFromProp(curve)).y0(yScale(areaBaselineValue));
  }, [curve, yScale, areaBaselineValue]);
};
var usePoints = function usePoints(_ref3) {
  var series = _ref3.series,
      getPointColor = _ref3.getPointColor,
      getPointBorderColor = _ref3.getPointBorderColor,
      formatX = _ref3.formatX,
      formatY = _ref3.formatY;
  return useMemo(function () {
    return series.reduce(function (acc, serie) {
      return [].concat(_toConsumableArray(acc), _toConsumableArray(serie.data.filter(function (datum) {
        return datum.position.x !== null && datum.position.y !== null;
      }).map(function (datum, i) {
        var point = {
          id: "".concat(serie.id, ".").concat(i),
          index: acc.length + i,
          serieId: serie.id,
          serieColor: serie.color,
          x: datum.position.x,
          y: datum.position.y
        };
        point.color = getPointColor(serie);
        point.borderColor = getPointBorderColor(point);
        point.data = _objectSpread$a({}, datum.data, {
          xFormatted: formatX(datum.data.x),
          yFormatted: formatY(datum.data.y)
        });
        return point;
      })));
    }, []);
  }, [series, getPointColor, getPointBorderColor, formatX, formatY]);
};
var useSlices = function useSlices(_ref4) {
  var enableSlices = _ref4.enableSlices,
      points = _ref4.points,
      width = _ref4.width,
      height = _ref4.height;
  return useMemo(function () {
    if (enableSlices === false) return [];
    if (enableSlices === 'x') {
      var map = new Map();
      points.forEach(function (point) {
        if (point.data.x === null || point.data.y === null) return;
        if (!map.has(point.x)) map.set(point.x, [point]);else map.get(point.x).push(point);
      });
      return Array.from(map.entries()).sort(function (a, b) {
        return a[0] - b[0];
      }).map(function (_ref5, i, slices) {
        var _ref6 = _slicedToArray$1(_ref5, 2),
            x = _ref6[0],
            slicePoints = _ref6[1];
        var prevSlice = slices[i - 1];
        var nextSlice = slices[i + 1];
        var x0;
        if (!prevSlice) x0 = x;else x0 = x - (x - prevSlice[0]) / 2;
        var sliceWidth;
        if (!nextSlice) sliceWidth = width - x0;else sliceWidth = x - x0 + (nextSlice[0] - x) / 2;
        return {
          id: x,
          x0: x0,
          x: x,
          y0: 0,
          y: 0,
          width: sliceWidth,
          height: height,
          points: slicePoints.reverse()
        };
      });
    } else if (enableSlices === 'y') {
      var _map = new Map();
      points.forEach(function (point) {
        if (point.data.x === null || point.data.y === null) return;
        if (!_map.has(point.y)) _map.set(point.y, [point]);else _map.get(point.y).push(point);
      });
      return Array.from(_map.entries()).sort(function (a, b) {
        return a[0] - b[0];
      }).map(function (_ref7, i, slices) {
        var _ref8 = _slicedToArray$1(_ref7, 2),
            y = _ref8[0],
            slicePoints = _ref8[1];
        var prevSlice = slices[i - 1];
        var nextSlice = slices[i + 1];
        var y0;
        if (!prevSlice) y0 = y;else y0 = y - (y - prevSlice[0]) / 2;
        var sliceHeight;
        if (!nextSlice) sliceHeight = height - y0;else sliceHeight = y - y0 + (nextSlice[0] - y) / 2;
        return {
          id: y,
          x0: 0,
          x: 0,
          y0: y0,
          y: y,
          width: width,
          height: sliceHeight,
          points: slicePoints.reverse()
        };
      });
    }
  }, [enableSlices, points]);
};
var useLine = function useLine(_ref9) {
  var data = _ref9.data,
      _ref9$xScale = _ref9.xScale,
      xScaleSpec = _ref9$xScale === void 0 ? LineDefaultProps.xScale : _ref9$xScale,
      xFormat = _ref9.xFormat,
      _ref9$yScale = _ref9.yScale,
      yScaleSpec = _ref9$yScale === void 0 ? LineDefaultProps.yScale : _ref9$yScale,
      yFormat = _ref9.yFormat,
      width = _ref9.width,
      height = _ref9.height,
      _ref9$colors = _ref9.colors,
      colors = _ref9$colors === void 0 ? LineDefaultProps.colors : _ref9$colors,
      _ref9$curve = _ref9.curve,
      curve = _ref9$curve === void 0 ? LineDefaultProps.curve : _ref9$curve,
      _ref9$areaBaselineVal = _ref9.areaBaselineValue,
      areaBaselineValue = _ref9$areaBaselineVal === void 0 ? LineDefaultProps.areaBaselineValue : _ref9$areaBaselineVal,
      _ref9$pointColor = _ref9.pointColor,
      pointColor = _ref9$pointColor === void 0 ? LineDefaultProps.pointColor : _ref9$pointColor,
      _ref9$pointBorderColo = _ref9.pointBorderColor,
      pointBorderColor = _ref9$pointBorderColo === void 0 ? LineDefaultProps.pointBorderColor : _ref9$pointBorderColo,
      _ref9$enableSlices = _ref9.enableSlices,
      enableSlices = _ref9$enableSlices === void 0 ? LineDefaultProps.enableSlicesTooltip : _ref9$enableSlices;
  var formatX = useValueFormatter(xFormat);
  var formatY = useValueFormatter(yFormat);
  var getColor = useOrdinalColorScale(colors, 'id');
  var theme = useTheme();
  var getPointColor = useInheritedColor(pointColor, theme);
  var getPointBorderColor = useInheritedColor(pointBorderColor, theme);
  var _useMemo = useMemo(function () {
    return computeXYScalesForSeries(data, xScaleSpec, yScaleSpec, width, height);
  }, [data, xScaleSpec, yScaleSpec, width, height]),
      xScale = _useMemo.xScale,
      yScale = _useMemo.yScale,
      rawSeries = _useMemo.series;
  var series = useMemo(function () {
    return rawSeries.map(function (serie) {
      return _objectSpread$a({}, serie, {
        color: getColor(serie)
      });
    });
  }, [rawSeries, getColor]);
  var points = usePoints({
    series: series,
    getPointColor: getPointColor,
    getPointBorderColor: getPointBorderColor,
    formatX: formatX,
    formatY: formatY
  });
  var slices = useSlices({
    enableSlices: enableSlices,
    points: points,
    width: width,
    height: height
  });
  var lineGenerator = useLineGenerator({
    curve: curve
  });
  var areaGenerator = useAreaGenerator({
    curve: curve,
    yScale: yScale,
    areaBaselineValue: areaBaselineValue
  });
  return {
    lineGenerator: lineGenerator,
    areaGenerator: areaGenerator,
    getColor: getColor,
    series: series,
    xScale: xScale,
    yScale: yScale,
    slices: slices,
    points: points
  };
};

var Areas = function Areas(_ref) {
  var areaGenerator = _ref.areaGenerator,
      areaOpacity = _ref.areaOpacity,
      areaBlendMode = _ref.areaBlendMode,
      lines = _ref.lines;
  var _useMotionConfig = useMotionConfig(),
      animate = _useMotionConfig.animate,
      springConfig = _useMotionConfig.springConfig;
  if (animate !== true) {
    return React.createElement("g", null, lines.slice(0).reverse().map(function (_ref2) {
      var id = _ref2.id,
          data = _ref2.data,
          areaColor = _ref2.color;
      return React.createElement("path", {
        key: id,
        d: areaGenerator(data.map(function (d) {
          return d.position;
        })),
        fill: areaColor,
        fillOpacity: areaOpacity,
        strokeWidth: 0,
        style: {
          mixBlendMode: areaBlendMode
        }
      });
    }));
  }
  return React.createElement("g", null, lines.slice(0).reverse().map(function (_ref3) {
    var id = _ref3.id,
        data = _ref3.data,
        areaColor = _ref3.color;
    return React.createElement(SmartMotion, {
      key: id,
      style: function style(spring) {
        return {
          d: spring(areaGenerator(data.map(function (d) {
            return d.position;
          })), springConfig),
          fill: spring(areaColor, springConfig)
        };
      }
    }, function (style) {
      return React.createElement("path", {
        key: id,
        d: style.d,
        fill: areaColor,
        fillOpacity: areaOpacity,
        strokeWidth: 0,
        style: {
          mixBlendMode: areaBlendMode
        }
      });
    });
  }));
};
Areas.propTypes = {
  areaGenerator: PropTypes.func.isRequired,
  areaOpacity: PropTypes.number.isRequired,
  areaBlendMode: blendModePropType.isRequired,
  lines: PropTypes.arrayOf(PropTypes.object).isRequired
};
var Areas$1 = memo(Areas);

var LinesItem = function LinesItem(_ref) {
  var lineGenerator = _ref.lineGenerator,
      id = _ref.id,
      points = _ref.points,
      color = _ref.color,
      thickness = _ref.thickness;
  var _useMotionConfig = useMotionConfig(),
      animate = _useMotionConfig.animate,
      springConfig = _useMotionConfig.springConfig;
  if (animate !== true) {
    return React.createElement("path", {
      key: id,
      d: lineGenerator(points),
      fill: "none",
      strokeWidth: thickness,
      stroke: color
    });
  }
  return React.createElement(SmartMotion, {
    key: id,
    style: function style(spring) {
      return {
        d: spring(lineGenerator(points), springConfig),
        stroke: spring(color, springConfig)
      };
    }
  }, function (style) {
    return React.createElement("path", {
      key: id,
      d: style.d,
      fill: "none",
      strokeWidth: thickness,
      stroke: style.stroke
    });
  });
};
LinesItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  points: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  lineGenerator: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  thickness: PropTypes.number.isRequired
};
var LinesItem$1 = memo(LinesItem);

var Lines = function Lines(_ref) {
  var lines = _ref.lines,
      lineGenerator = _ref.lineGenerator,
      lineWidth = _ref.lineWidth;
  return lines.map(function (_ref2) {
    var id = _ref2.id,
        data = _ref2.data,
        color = _ref2.color;
    return React.createElement(LinesItem$1, {
      key: id,
      id: id,
      points: data.map(function (d) {
        return d.position;
      }),
      lineGenerator: lineGenerator,
      color: color,
      thickness: lineWidth
    });
  });
};
Lines.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      data: PropTypes.shape({
        x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        y: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
      }).isRequired,
      position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      }).isRequired
    })).isRequired
  })).isRequired,
  lineWidth: PropTypes.number.isRequired,
  lineGenerator: PropTypes.func.isRequired
};
var Lines$1 = memo(Lines);

var SlicesItem = function SlicesItem(_ref) {
  var slice = _ref.slice,
      axis = _ref.axis,
      debug = _ref.debug,
      tooltip = _ref.tooltip,
      isCurrent = _ref.isCurrent,
      setCurrent = _ref.setCurrent;
  var _useTooltip = useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseEnter = useCallback(function (event) {
    showTooltipFromEvent(React.createElement(tooltip, {
      slice: slice,
      axis: axis
    }), event, 'right');
    setCurrent(slice);
  }, [showTooltipFromEvent, tooltip, slice]);
  var handleMouseMove = useCallback(function (event) {
    showTooltipFromEvent(React.createElement(tooltip, {
      slice: slice,
      axis: axis
    }), event, 'right');
  }, [showTooltipFromEvent, tooltip, slice]);
  var handleMouseLeave = useCallback(function () {
    hideTooltip();
    setCurrent(null);
  }, [hideTooltip]);
  return React.createElement("rect", {
    x: slice.x0,
    y: slice.y0,
    width: slice.width,
    height: slice.height,
    stroke: "red",
    strokeWidth: debug ? 1 : 0,
    strokeOpacity: 0.75,
    fill: "red",
    fillOpacity: isCurrent && debug ? 0.35 : 0,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  });
};
SlicesItem.propTypes = {
  slice: PropTypes.object.isRequired,
  axis: PropTypes.oneOf(['x', 'y']).isRequired,
  debug: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isCurrent: PropTypes.bool.isRequired,
  setCurrent: PropTypes.func.isRequired
};
var SlicesItem$1 = memo(SlicesItem);

var Slices = function Slices(_ref) {
  var slices = _ref.slices,
      axis = _ref.axis,
      debug = _ref.debug,
      height = _ref.height,
      tooltip = _ref.tooltip,
      current = _ref.current,
      setCurrent = _ref.setCurrent;
  return slices.map(function (slice) {
    return React.createElement(SlicesItem$1, {
      key: slice.id,
      slice: slice,
      axis: axis,
      debug: debug,
      height: height,
      tooltip: tooltip,
      setCurrent: setCurrent,
      isCurrent: current !== null && current.id === slice.id
    });
  });
};
Slices.propTypes = {
  slices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    points: PropTypes.arrayOf(PropTypes.object).isRequired
  })).isRequired,
  axis: PropTypes.oneOf(['x', 'y']).isRequired,
  debug: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  current: PropTypes.object,
  setCurrent: PropTypes.func.isRequired
};
var Slices$1 = memo(Slices);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var Points = function Points(_ref) {
  var points = _ref.points,
      symbol = _ref.symbol,
      size = _ref.size,
      borderWidth = _ref.borderWidth,
      enableLabel = _ref.enableLabel,
      label = _ref.label,
      labelYOffset = _ref.labelYOffset;
  var theme = useTheme();
  var _useMotionConfig = useMotionConfig(),
      animate = _useMotionConfig.animate,
      springConfig = _useMotionConfig.springConfig;
  var getLabel = getLabelGenerator(label);
  var mappedPoints = points.map(function (point) {
    var mappedPoint = {
      id: point.id,
      x: point.x,
      y: point.y,
      datum: point.data,
      fill: point.color,
      stroke: point.borderColor,
      label: enableLabel ? getLabel(point.data) : null
    };
    return mappedPoint;
  });
  if (animate !== true) {
    return React.createElement("g", null, mappedPoints.map(function (point) {
      return React.createElement(DotsItem, {
        key: point.id,
        x: point.x,
        y: point.y,
        datum: point.datum,
        symbol: symbol,
        size: size,
        color: point.fill,
        borderWidth: borderWidth,
        borderColor: point.stroke,
        label: point.label,
        labelYOffset: labelYOffset,
        theme: theme
      });
    }));
  }
  return React.createElement(TransitionMotion, {
    styles: mappedPoints.map(function (point) {
      return {
        key: point.id,
        data: point,
        style: {
          x: spring(point.x, springConfig),
          y: spring(point.y, springConfig),
          size: spring(size, springConfig)
        }
      };
    })
  }, function (interpolatedStyles) {
    return React.createElement("g", null, interpolatedStyles.map(function (_ref2) {
      var key = _ref2.key,
          style = _ref2.style,
          point = _ref2.data;
      return React.createElement(DotsItem, _extends({
        key: key
      }, style, {
        symbol: symbol,
        datum: point.datum,
        color: point.fill,
        borderWidth: borderWidth,
        borderColor: point.stroke,
        label: point.label,
        labelYOffset: labelYOffset,
        theme: theme
      }));
    }));
  });
};
Points.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object),
  symbol: PropTypes.func,
  size: PropTypes.number.isRequired,
  color: PropTypes.func.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.func.isRequired,
  enableLabel: PropTypes.bool.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  labelYOffset: PropTypes.number
};
Points.defaultProps = {
  enableLabel: false,
  label: 'yFormatted'
};
var Points$1 = memo(Points);

var Mesh = function Mesh(_ref) {
  var points = _ref.points,
      width = _ref.width,
      height = _ref.height,
      margin = _ref.margin,
      setCurrent = _ref.setCurrent,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onClick = _ref.onClick,
      tooltip = _ref.tooltip,
      debug = _ref.debug;
  var _useTooltip = useTooltip(),
      showTooltipAt = _useTooltip.showTooltipAt,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseEnter = useCallback(function (point, event) {
    showTooltipAt(React.createElement(tooltip, {
      point: point
    }), [point.x + margin.left, point.y + margin.top], 'top');
    setCurrent(point);
    onMouseEnter && onMouseEnter(point, event);
  }, [setCurrent, showTooltipAt, tooltip, onMouseEnter, margin]);
  var handleMouseMove = useCallback(function (point, event) {
    showTooltipAt(React.createElement(tooltip, {
      point: point
    }), [point.x + margin.left, point.y + margin.top], 'top');
    setCurrent(point);
    onMouseMove && onMouseMove(point, event);
  }, [setCurrent, showTooltipAt, tooltip, onMouseMove]);
  var handleMouseLeave = useCallback(function () {
    hideTooltip();
    setCurrent(null);
  }, [hideTooltip, setCurrent]);
  var handleClick = useCallback(function (point, event) {
    onClick && onClick(point, event);
  }, [onClick]);
  return React.createElement(Mesh$2, {
    nodes: points,
    width: width,
    height: height,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    debug: debug
  });
};
Mesh.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  debug: PropTypes.bool.isRequired
};
var Mesh$1 = memo(Mesh);

function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$b(target, key, source[key]); }); } return target; }
function _defineProperty$b(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
function _slicedToArray$2(arr, i) { return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _nonIterableRest$2(); }
function _nonIterableRest$2() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$2(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$2(arr) { if (Array.isArray(arr)) return arr; }
var Line = function Line(props) {
  var data = props.data,
      xScaleSpec = props.xScale,
      xFormat = props.xFormat,
      yScaleSpec = props.yScale,
      yFormat = props.yFormat,
      layers = props.layers,
      curve = props.curve,
      areaBaselineValue = props.areaBaselineValue,
      colors = props.colors,
      partialMargin = props.margin,
      width = props.width,
      height = props.height,
      axisTop = props.axisTop,
      axisRight = props.axisRight,
      axisBottom = props.axisBottom,
      axisLeft = props.axisLeft,
      enableGridX = props.enableGridX,
      enableGridY = props.enableGridY,
      gridXValues = props.gridXValues,
      gridYValues = props.gridYValues,
      lineWidth = props.lineWidth,
      enableArea = props.enableArea,
      areaOpacity = props.areaOpacity,
      areaBlendMode = props.areaBlendMode,
      enablePoints = props.enablePoints,
      pointSymbol = props.pointSymbol,
      pointSize = props.pointSize,
      pointColor = props.pointColor,
      pointBorderWidth = props.pointBorderWidth,
      pointBorderColor = props.pointBorderColor,
      enablePointLabel = props.enablePointLabel,
      pointLabel = props.pointLabel,
      pointLabelFormat = props.pointLabelFormat,
      pointLabelYOffset = props.pointLabelYOffset,
      markers = props.markers,
      legends = props.legends,
      scrollableLegend = props.scrollableLegend,
      isInteractive = props.isInteractive,
      useMesh = props.useMesh,
      debugMesh = props.debugMesh,
      onMouseEnter = props.onMouseEnter,
      onMouseMove = props.onMouseMove,
      onMouseLeave = props.onMouseLeave,
      onClick = props.onClick,
      tooltip = props.tooltip,
      enableSlices = props.enableSlices,
      debugSlices = props.debugSlices,
      sliceTooltip = props.sliceTooltip,
      enableCrosshair = props.enableCrosshair,
      crosshairType = props.crosshairType;
  var _useDimensions = useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useLine = useLine({
    data: data,
    xScale: xScaleSpec,
    xFormat: xFormat,
    yScale: yScaleSpec,
    yFormat: yFormat,
    width: innerWidth,
    height: innerHeight,
    colors: colors,
    curve: curve,
    areaBaselineValue: areaBaselineValue,
    pointColor: pointColor,
    pointBorderColor: pointBorderColor,
    enableSlices: enableSlices
  }),
      lineGenerator = _useLine.lineGenerator,
      areaGenerator = _useLine.areaGenerator,
      series = _useLine.series,
      xScale = _useLine.xScale,
      yScale = _useLine.yScale,
      slices = _useLine.slices,
      points = _useLine.points;
  var theme = useTheme();
  var getPointColor = useInheritedColor(pointColor, theme);
  var getPointBorderColor = useInheritedColor(pointBorderColor, theme);
  var _useState = useState(null),
      _useState2 = _slicedToArray$2(_useState, 2),
      currentPoint = _useState2[0],
      setCurrentPoint = _useState2[1];
  var _useState3 = useState(null),
      _useState4 = _slicedToArray$2(_useState3, 2),
      currentSlice = _useState4[0],
      setCurrentSlice = _useState4[1];
  var legendData = useMemo(function () {
    return series.map(function (line) {
      return {
        id: line.id,
        label: line.id,
        color: line.color
      };
    }).reverse();
  }, [series]);
  var layerById = {
    grid: React.createElement(Grid, {
      key: "grid",
      theme: theme,
      width: innerWidth,
      height: innerHeight,
      xScale: enableGridX ? xScale : null,
      yScale: enableGridY ? yScale : null,
      xValues: gridXValues,
      yValues: gridYValues
    }),
    markers: React.createElement(CartesianMarkers, {
      key: "markers",
      markers: markers,
      width: innerWidth,
      height: innerHeight,
      xScale: xScale,
      yScale: yScale,
      theme: theme
    }),
    axes: React.createElement(Axes, {
      key: "axes",
      xScale: xScale,
      yScale: yScale,
      width: innerWidth,
      height: innerHeight,
      theme: theme,
      top: axisTop,
      right: axisRight,
      bottom: axisBottom,
      left: axisLeft
    }),
    areas: null,
    lines: React.createElement(Lines$1, {
      key: "lines",
      lines: series,
      lineGenerator: lineGenerator,
      lineWidth: lineWidth
    }),
    slices: null,
    points: null,
    crosshair: null,
    mesh: null,
    legends: legends.map(function (legend, i) {
      return React.createElement(BoxLegendSvg, _extends$1({
        key: "legend.".concat(i)
      }, legend, {
        containerWidth: innerWidth,
        containerHeight: innerHeight,
        data: legend.data || legendData,
        scrollableLegend: scrollableLegend,
        theme: theme
      }));
    })
  };
  if (enableArea) {
    layerById.areas = React.createElement(Areas$1, {
      key: "areas",
      areaGenerator: areaGenerator,
      areaOpacity: areaOpacity,
      areaBlendMode: areaBlendMode,
      lines: series
    });
  }
  if (isInteractive && enableSlices !== false) {
    layerById.slices = React.createElement(Slices$1, {
      key: "slices",
      slices: slices,
      axis: enableSlices,
      debug: debugSlices,
      height: innerHeight,
      tooltip: sliceTooltip,
      current: currentSlice,
      setCurrent: setCurrentSlice
    });
  }
  if (enablePoints) {
    layerById.points = React.createElement(Points$1, {
      key: "points",
      points: points,
      symbol: pointSymbol,
      size: pointSize,
      color: getPointColor,
      borderWidth: pointBorderWidth,
      borderColor: getPointBorderColor,
      enableLabel: enablePointLabel,
      label: pointLabel,
      labelFormat: pointLabelFormat,
      labelYOffset: pointLabelYOffset
    });
  }
  if (isInteractive && enableCrosshair) {
    if (currentPoint !== null) {
      layerById.crosshair = React.createElement(Crosshair, {
        key: "crosshair",
        width: innerWidth,
        height: innerHeight,
        x: currentPoint.x,
        y: currentPoint.y,
        type: crosshairType
      });
    }
    if (currentSlice !== null) {
      layerById.crosshair = React.createElement(Crosshair, {
        key: "crosshair",
        width: innerWidth,
        height: innerHeight,
        x: currentSlice.x,
        y: currentSlice.y,
        type: enableSlices
      });
    }
  }
  if (isInteractive && useMesh && enableSlices === false) {
    layerById.mesh = React.createElement(Mesh$1, {
      key: "mesh",
      points: points,
      width: innerWidth,
      height: innerHeight,
      margin: margin,
      current: currentPoint,
      setCurrent: setCurrentPoint,
      onMouseEnter: onMouseEnter,
      onMouseMove: onMouseMove,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      tooltip: tooltip,
      debug: debugMesh
    });
  }
  return React.createElement(SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin
  }, layers.map(function (layer, i) {
    if (typeof layer === 'function') {
      return React.createElement(Fragment, {
        key: i
      }, layer(_objectSpread$b({}, props, {
        innerWidth: innerWidth,
        innerHeight: innerHeight,
        series: series,
        slices: slices,
        points: points,
        xScale: xScale,
        yScale: yScale,
        lineGenerator: lineGenerator,
        areaGenerator: areaGenerator
      })));
    }
    return layerById[layer];
  }));
};
Line.propTypes = LinePropTypes;
Line.defaultProps = LineDefaultProps;
var Line$1 = withContainer(Line);

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var ResponsiveLine = function ResponsiveLine(props) {
  return React.createElement(ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React.createElement(Line$1, _extends$2({
      width: width,
      height: height
    }, props));
  });
};

function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$c(target, key, source[key]); }); } return target; }
function _defineProperty$c(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray$3(arr, i) { return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _nonIterableRest$3(); }
function _nonIterableRest$3() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$3(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$3(arr) { if (Array.isArray(arr)) return arr; }
var LineCanvas = function LineCanvas(_ref) {
  var width = _ref.width,
      height = _ref.height,
      partialMargin = _ref.margin,
      pixelRatio = _ref.pixelRatio,
      data = _ref.data,
      xScaleSpec = _ref.xScale,
      yScaleSpec = _ref.yScale,
      curve = _ref.curve,
      layers = _ref.layers,
      colors = _ref.colors,
      lineWidth = _ref.lineWidth,
      enableArea = _ref.enableArea,
      areaBaselineValue = _ref.areaBaselineValue,
      areaOpacity = _ref.areaOpacity,
      enablePoints = _ref.enablePoints,
      pointSize = _ref.pointSize,
      pointColor = _ref.pointColor,
      pointBorderWidth = _ref.pointBorderWidth,
      pointBorderColor = _ref.pointBorderColor,
      enableGridX = _ref.enableGridX,
      gridXValues = _ref.gridXValues,
      enableGridY = _ref.enableGridY,
      gridYValues = _ref.gridYValues,
      axisTop = _ref.axisTop,
      axisRight = _ref.axisRight,
      axisBottom = _ref.axisBottom,
      axisLeft = _ref.axisLeft,
      legends = _ref.legends,
      isInteractive = _ref.isInteractive,
      debugMesh = _ref.debugMesh,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick,
      tooltip = _ref.tooltip;
  var canvasEl = useRef(null);
  var _useDimensions = useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var theme = useTheme();
  var _useState = useState(null),
      _useState2 = _slicedToArray$3(_useState, 2),
      currentPoint = _useState2[0],
      setCurrentPoint = _useState2[1];
  var _useLine = useLine({
    data: data,
    xScale: xScaleSpec,
    yScale: yScaleSpec,
    width: innerWidth,
    height: innerHeight,
    colors: colors,
    curve: curve,
    areaBaselineValue: areaBaselineValue,
    pointColor: pointColor,
    pointBorderColor: pointBorderColor
  }),
      lineGenerator = _useLine.lineGenerator,
      areaGenerator = _useLine.areaGenerator,
      series = _useLine.series,
      xScale = _useLine.xScale,
      yScale = _useLine.yScale,
      points = _useLine.points;
  var _useVoronoiMesh = useVoronoiMesh({
    points: points,
    width: innerWidth,
    height: innerHeight,
    debug: debugMesh
  }),
      delaunay = _useVoronoiMesh.delaunay,
      voronoi = _useVoronoiMesh.voronoi;
  useEffect(function () {
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    layers.forEach(function (layer) {
      if (layer === 'grid' && theme.grid.line.strokeWidth > 0) {
        ctx.lineWidth = theme.grid.line.strokeWidth;
        ctx.strokeStyle = theme.grid.line.stroke;
        enableGridX && renderGridLinesToCanvas(ctx, {
          width: innerWidth,
          height: innerHeight,
          scale: xScale,
          axis: 'x',
          values: gridXValues
        });
        enableGridY && renderGridLinesToCanvas(ctx, {
          width: innerWidth,
          height: innerHeight,
          scale: yScale,
          axis: 'y',
          values: gridYValues
        });
      }
      if (layer === 'axes') {
        renderAxesToCanvas(ctx, {
          xScale: xScale,
          yScale: yScale,
          width: innerWidth,
          height: innerHeight,
          top: axisTop,
          right: axisRight,
          bottom: axisBottom,
          left: axisLeft,
          theme: theme
        });
      }
      if (layer === 'areas' && enableArea === true) {
        ctx.save();
        ctx.globalAlpha = areaOpacity;
        areaGenerator.context(ctx);
        series.forEach(function (serie) {
          ctx.fillStyle = serie.color;
          ctx.beginPath();
          areaGenerator(serie.data.map(function (d) {
            return d.position;
          }));
          ctx.fill();
        });
        ctx.restore();
      }
      if (layer === 'lines') {
        lineGenerator.context(ctx);
        series.forEach(function (serie) {
          ctx.strokeStyle = serie.color;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          lineGenerator(serie.data.map(function (d) {
            return d.position;
          }));
          ctx.stroke();
        });
      }
      if (layer === 'points' && enablePoints === true && pointSize > 0) {
        points.forEach(function (point) {
          ctx.fillStyle = point.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, pointSize / 2, 0, 2 * Math.PI);
          ctx.fill();
          if (pointBorderWidth > 0) {
            ctx.strokeStyle = point.borderColor;
            ctx.lineWidth = pointBorderWidth;
            ctx.stroke();
          }
        });
      }
      if (layer === 'mesh' && debugMesh === true) {
        renderVoronoiToCanvas(ctx, voronoi);
        if (currentPoint) {
          renderVoronoiCellToCanvas(ctx, voronoi, currentPoint.index);
        }
      }
      if (layer === 'legends') {
        var legendData = series.map(function (serie) {
          return {
            id: serie.id,
            label: serie.id,
            color: serie.color
          };
        }).reverse();
        legends.forEach(function (legend) {
          renderLegendToCanvas(ctx, _objectSpread$c({}, legend, {
            data: legend.data || legendData,
            containerWidth: innerWidth,
            containerHeight: innerHeight,
            theme: theme
          }));
        });
      }
    });
  }, [canvasEl, outerWidth, outerHeight, layers, theme, lineGenerator, series, xScale, yScale, enableGridX, gridXValues, enableGridY, gridYValues, axisTop, axisRight, axisBottom, axisLeft, legends, points, enablePoints, pointSize, currentPoint]);
  var getPointFromMouseEvent = useCallback(function (event) {
    var _getRelativeCursor = getRelativeCursor(canvasEl.current, event),
        _getRelativeCursor2 = _slicedToArray$3(_getRelativeCursor, 2),
        x = _getRelativeCursor2[0],
        y = _getRelativeCursor2[1];
    if (!isCursorInRect(margin.left, margin.top, innerWidth, innerHeight, x, y)) return null;
    var pointIndex = delaunay.find(x - margin.left, y - margin.top);
    return points[pointIndex];
  }, [canvasEl, margin, innerWidth, innerHeight, delaunay]);
  var _useTooltip = useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseHover = useCallback(function (event) {
    var point = getPointFromMouseEvent(event);
    setCurrentPoint(point);
    if (point) {
      showTooltipFromEvent(React.createElement(tooltip, {
        point: point
      }), event);
    } else {
      hideTooltip();
    }
  }, [getPointFromMouseEvent, setCurrentPoint, showTooltipFromEvent, hideTooltip, tooltip]);
  var handleMouseLeave = useCallback(function (event) {
    hideTooltip();
    setCurrentPoint(null);
    currentPoint && onMouseLeave && onMouseLeave(currentPoint, event);
  }, [hideTooltip, setCurrentPoint, onMouseLeave]);
  var handleClick = useCallback(function (event) {
    if (onClick) {
      var point = getPointFromMouseEvent(event);
      point && onClick(point, event);
    }
  }, [getPointFromMouseEvent, onClick]);
  return React.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight,
      cursor: isInteractive ? 'auto' : 'normal'
    },
    onMouseEnter: isInteractive ? handleMouseHover : undefined,
    onMouseMove: isInteractive ? handleMouseHover : undefined,
    onMouseLeave: isInteractive ? handleMouseLeave : undefined,
    onClick: isInteractive ? handleClick : undefined
  });
};
LineCanvas.propTypes = LineCanvasPropTypes;
LineCanvas.defaultProps = LineCanvasDefaultProps;
var LineCanvas$1 = withContainer(LineCanvas);

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
var ResponsiveLineCanvas = function ResponsiveLineCanvas(props) {
  return React.createElement(ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React.createElement(LineCanvas$1, _extends$3({
      width: width,
      height: height
    }, props));
  });
};

export { Line$1 as Line, LineCanvas$1 as LineCanvas, LineCanvasDefaultProps, LineCanvasPropTypes, LineDefaultProps, LinePropTypes, ResponsiveLine, ResponsiveLineCanvas, useAreaGenerator, useLine, useLineGenerator, useSlices };
