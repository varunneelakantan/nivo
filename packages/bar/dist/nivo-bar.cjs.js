'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactMotion = require('react-motion');
var core = require('@nivo/core');
var axes = require('@nivo/axes');
var PropTypes = _interopDefault(require('prop-types'));
var isFunction = _interopDefault(require('lodash/isFunction'));
var isNumber = _interopDefault(require('lodash/isNumber'));
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var min = _interopDefault(require('lodash/min'));
var max = _interopDefault(require('lodash/max'));
var range = _interopDefault(require('lodash/range'));
var d3Scale = require('d3-scale');
var flattenDepth = _interopDefault(require('lodash/flattenDepth'));
var d3Shape = require('d3-shape');
var _uniqBy = _interopDefault(require('lodash/uniqBy'));
var setDisplayName = _interopDefault(require('recompose/setDisplayName'));
var compose = _interopDefault(require('recompose/compose'));
var defaultProps = _interopDefault(require('recompose/defaultProps'));
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var pure = _interopDefault(require('recompose/pure'));
var colors = require('@nivo/colors');
var legends = require('@nivo/legends');
var tooltip = require('@nivo/tooltip');
var annotations = require('@nivo/annotations');

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
      return React__default.createElement("circle", {
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
}(React.PureComponent);
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
      return React__default.createElement("g", {
        transform: "translate(".concat(x, ",").concat(y, ")")
      }, React__default.createElement("path", {
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
}(React.PureComponent);
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
      return React__default.createElement("rect", {
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
}(React.PureComponent);
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
      return React__default.createElement("g", {
        transform: "translate(".concat(x, ",").concat(y, ")")
      }, React__default.createElement("path", {
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
}(React.PureComponent);
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
  var _useState = React.useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      style = _useState2[0],
      setStyle = _useState2[1];
  var theme = core.useTheme();
  var handleClick = React.useCallback(function (event) {
    return onClick && onClick(data, event);
  }, [onClick, data]);
  var handleMouseEnter = React.useCallback(function (event) {
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
  var handleMouseLeave = React.useCallback(function () {
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
  return React__default.createElement("g", {
    transform: "translate(".concat(x, ",").concat(y, ")"),
    style: {
      opacity: style.itemOpacity !== undefined ? style.itemOpacity : opacity
    }
  }, React__default.createElement("rect", {
    width: width,
    height: height,
    fill: style.itemBackground || background,
    style: {
      cursor: isInteractive ? 'pointer' : 'auto'
    },
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }), React__default.createElement(_Symbol, {
    x: symbolX,
    y: symbolY,
    size: style.symbolSize || symbolSize,
    fill: data.fill || data.color,
    borderWidth: style.symbolBorderWidth !== undefined ? style.symbolBorderWidth : symbolBorderWidth,
    borderColor: style.symbolBorderColor || symbolBorderColor
  }), React__default.createElement("text", {
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
  return React__default.createElement("g", {
    transform: "translate(".concat(x, ",").concat(y, ")")
  }, scrollableLegend ? React__default.createElement("foreignObject", {
    width: 180,
    height: containerHeight
  }, React__default.createElement("div", {
    style: {
      height: '100%',
      overflow: 'auto'
    },
    xmlns: "http://www.w3.org/1999/xhtml"
  }, React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    role: "img",
    width: '100%',
    height: "".concat(data.length * itemHeight, "px")
  }, data.map(function (data, i) {
    return React__default.createElement(LegendSvgItem, {
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
  })))) : React__default.createElement(React__default.Fragment, null, data.map(function (data, i) {
    return React__default.createElement(LegendSvgItem, {
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
  return React__default.createElement(LegendSvg, {
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

var getIndexedScale = function getIndexedScale(data, getIndex, range, padding) {
  return d3Scale.scaleBand().rangeRound(range).domain(data.map(getIndex)).padding(padding);
};

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
var getGroupedScale = function getGroupedScale(data, keys, _minValue, _maxValue, range) {
  var allValues = data.reduce(function (acc, entry) {
    return [].concat(_toConsumableArray(acc), _toConsumableArray(keys.map(function (k) {
      return entry[k];
    })));
  }, []);
  var maxValue = _maxValue;
  if (maxValue === 'auto') {
    maxValue = max(allValues);
  }
  var minValue = _minValue;
  if (minValue === 'auto') {
    minValue = min(allValues);
    if (minValue > 0) minValue = 0;
  }
  return d3Scale.scaleLinear().rangeRound(range).domain([minValue, maxValue]);
};
var generateVerticalGroupedBars = function generateVerticalGroupedBars(_ref) {
  var data = _ref.data,
      getIndex = _ref.getIndex,
      keys = _ref.keys,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      reverse = _ref.reverse,
      width = _ref.width,
      height = _ref.height,
      getColor = _ref.getColor,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 0 : _ref$padding,
      _ref$innerPadding = _ref.innerPadding,
      innerPadding = _ref$innerPadding === void 0 ? 0 : _ref$innerPadding;
  var xScale = getIndexedScale(data, getIndex, [0, width], padding);
  var yRange = reverse ? [0, height] : [height, 0];
  var yScale = getGroupedScale(data, keys, minValue, maxValue, yRange);
  var barWidth = (xScale.bandwidth() - innerPadding * (keys.length - 1)) / keys.length;
  var yRef = yScale(0);
  var getY = function getY(d) {
    return d > 0 ? yScale(d) : yRef;
  };
  var getHeight = function getHeight(d, y) {
    return d > 0 ? yRef - y : yScale(d) - yRef;
  };
  if (reverse) {
    getY = function getY(d) {
      return d < 0 ? yScale(d) : yRef;
    };
    getHeight = function getHeight(d, y) {
      return d < 0 ? yRef - y : yScale(d) - yRef;
    };
  }
  var bars = [];
  if (barWidth > 0) {
    keys.forEach(function (key, i) {
      range(xScale.domain().length).forEach(function (index) {
        var x = xScale(getIndex(data[index])) + barWidth * i + innerPadding * i;
        var y = getY(data[index][key]);
        var barHeight = getHeight(data[index][key], y);
        if (barWidth > 0 && barHeight > 0) {
          var barData = {
            id: key,
            value: data[index][key],
            index: index,
            indexValue: getIndex(data[index]),
            data: data[index]
          };
          bars.push({
            key: "".concat(key, ".").concat(barData.indexValue),
            data: barData,
            x: x,
            y: y,
            width: barWidth,
            height: barHeight,
            color: getColor(barData)
          });
        }
      });
    });
  }
  return {
    xScale: xScale,
    yScale: yScale,
    bars: bars
  };
};
var generateHorizontalGroupedBars = function generateHorizontalGroupedBars(_ref2) {
  var data = _ref2.data,
      getIndex = _ref2.getIndex,
      keys = _ref2.keys,
      minValue = _ref2.minValue,
      maxValue = _ref2.maxValue,
      reverse = _ref2.reverse,
      width = _ref2.width,
      height = _ref2.height,
      getColor = _ref2.getColor,
      _ref2$padding = _ref2.padding,
      padding = _ref2$padding === void 0 ? 0 : _ref2$padding,
      _ref2$innerPadding = _ref2.innerPadding,
      innerPadding = _ref2$innerPadding === void 0 ? 0 : _ref2$innerPadding;
  var xRange = reverse ? [width, 0] : [0, width];
  var xScale = getGroupedScale(data, keys, minValue, maxValue, xRange);
  var yScale = getIndexedScale(data, getIndex, [height, 0], padding);
  var barHeight = (yScale.bandwidth() - innerPadding * (keys.length - 1)) / keys.length;
  var xRef = xScale(0);
  var getX = function getX(d) {
    return d > 0 ? xRef : xScale(d);
  };
  var getWidth = function getWidth(d, x) {
    return d > 0 ? xScale(d) - xRef : xRef - x;
  };
  if (reverse) {
    getX = function getX(d) {
      return d < 0 ? xRef : xScale(d);
    };
    getWidth = function getWidth(d, x) {
      return d < 0 ? xScale(d) - xRef : xRef - x;
    };
  }
  var bars = [];
  if (barHeight > 0) {
    keys.forEach(function (key, i) {
      range(yScale.domain().length).forEach(function (index) {
        var x = getX(data[index][key]);
        var y = yScale(getIndex(data[index])) + barHeight * i + innerPadding * i;
        var barWidth = getWidth(data[index][key], x);
        if (barWidth > 0) {
          var barData = {
            id: key,
            value: data[index][key],
            index: index,
            indexValue: getIndex(data[index]),
            data: data[index]
          };
          bars.push({
            key: "".concat(key, ".").concat(barData.indexValue),
            data: barData,
            x: x,
            y: y,
            width: barWidth,
            height: barHeight,
            color: getColor(barData)
          });
        }
      });
    });
  }
  return {
    xScale: xScale,
    yScale: yScale,
    bars: bars
  };
};
var generateGroupedBars = function generateGroupedBars(options) {
  return options.layout === 'vertical' ? generateVerticalGroupedBars(options) : generateHorizontalGroupedBars(options);
};

var getStackedScale = function getStackedScale(data, _minValue, _maxValue, range) {
  var allValues = flattenDepth(data, 2);
  var minValue = _minValue;
  if (minValue === 'auto') {
    minValue = min(allValues);
  }
  var maxValue = _maxValue;
  if (maxValue === 'auto') {
    maxValue = max(allValues);
  }
  return d3Scale.scaleLinear().rangeRound(range).domain([minValue, maxValue]);
};
var generateVerticalStackedBars = function generateVerticalStackedBars(_ref) {
  var data = _ref.data,
      getIndex = _ref.getIndex,
      keys = _ref.keys,
      minValue = _ref.minValue,
      maxValue = _ref.maxValue,
      reverse = _ref.reverse,
      width = _ref.width,
      height = _ref.height,
      getColor = _ref.getColor,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 0 : _ref$padding,
      _ref$innerPadding = _ref.innerPadding,
      innerPadding = _ref$innerPadding === void 0 ? 0 : _ref$innerPadding;
  var stackedData = d3Shape.stack().keys(keys).offset(d3Shape.stackOffsetDiverging)(data);
  var xScale = getIndexedScale(data, getIndex, [0, width], padding);
  var yRange = reverse ? [0, height] : [height, 0];
  var yScale = getStackedScale(stackedData, minValue, maxValue, yRange);
  var bars = [];
  var barWidth = xScale.bandwidth();
  var getY = function getY(d) {
    return yScale(d[1]);
  };
  var getHeight = function getHeight(d, y) {
    return yScale(d[0]) - y;
  };
  if (reverse) {
    getY = function getY(d) {
      return yScale(d[0]);
    };
    getHeight = function getHeight(d, y) {
      return yScale(d[1]) - y;
    };
  }
  if (barWidth > 0) {
    stackedData.forEach(function (stackedDataItem) {
      xScale.domain().forEach(function (index, i) {
        var d = stackedDataItem[i];
        var x = xScale(getIndex(d.data));
        var y = getY(d);
        var barHeight = getHeight(d, y);
        if (innerPadding > 0) {
          y += innerPadding * 0.5;
          barHeight -= innerPadding;
        }
        if (barHeight > 0 || d[1] - d[0] > 0) {
          var barData = {
            id: stackedDataItem.key,
            value: d.data[stackedDataItem.key],
            index: i,
            indexValue: index,
            data: d.data
          };
          bars.push({
            key: "".concat(stackedDataItem.key, ".").concat(index),
            data: barData,
            x: x,
            y: y,
            width: barWidth,
            height: barHeight > 0 ? barHeight : 1,
            color: getColor(barData)
          });
        }
      });
    });
  }
  return {
    xScale: xScale,
    yScale: yScale,
    bars: bars
  };
};
var generateHorizontalStackedBars = function generateHorizontalStackedBars(_ref2) {
  var data = _ref2.data,
      getIndex = _ref2.getIndex,
      keys = _ref2.keys,
      minValue = _ref2.minValue,
      maxValue = _ref2.maxValue,
      reverse = _ref2.reverse,
      width = _ref2.width,
      height = _ref2.height,
      getColor = _ref2.getColor,
      _ref2$padding = _ref2.padding,
      padding = _ref2$padding === void 0 ? 0 : _ref2$padding,
      _ref2$innerPadding = _ref2.innerPadding,
      innerPadding = _ref2$innerPadding === void 0 ? 0 : _ref2$innerPadding;
  var stackedData = d3Shape.stack().keys(keys).offset(d3Shape.stackOffsetDiverging)(data);
  var xRange = reverse ? [width, 0] : [0, width];
  var xScale = getStackedScale(stackedData, minValue, maxValue, xRange);
  var yScale = getIndexedScale(data, getIndex, [height, 0], padding);
  var bars = [];
  var barHeight = yScale.bandwidth();
  var getX = function getX(d) {
    return xScale(d[0]);
  };
  var getWidth = function getWidth(d, x) {
    return xScale(d[1]) - x;
  };
  if (reverse) {
    getX = function getX(d) {
      return xScale(d[1]);
    };
    getWidth = function getWidth(d, y) {
      return xScale(d[0]) - y;
    };
  }
  if (barHeight > 0) {
    stackedData.forEach(function (stackedDataItem) {
      yScale.domain().forEach(function (index, i) {
        var d = stackedDataItem[i];
        var y = yScale(getIndex(d.data));
        var barData = {
          id: stackedDataItem.key,
          value: d.data[stackedDataItem.key],
          index: i,
          indexValue: index,
          data: d.data
        };
        var x = getX(d);
        var barWidth = getWidth(d, x);
        if (innerPadding > 0) {
          x += innerPadding * 0.5;
          barWidth -= innerPadding;
        }
        if (barWidth > 0) {
          bars.push({
            key: "".concat(stackedDataItem.key, ".").concat(index),
            data: barData,
            x: x,
            y: y,
            width: barWidth,
            height: barHeight,
            color: getColor(barData)
          });
        }
      });
    });
  }
  return {
    xScale: xScale,
    yScale: yScale,
    bars: bars
  };
};
var generateStackedBars = function generateStackedBars(options) {
  return options.layout === 'vertical' ? generateVerticalStackedBars(options) : generateHorizontalStackedBars(options);
};

var getLegendDataForKeys = function getLegendDataForKeys(bars, layout, groupMode, reverse) {
  var data = _uniqBy(bars.map(function (bar) {
    return {
      id: bar.data.id,
      label: bar.data.id,
      color: bar.color,
      fill: bar.data.fill
    };
  }), function (_ref) {
    var id = _ref.id;
    return id;
  });
  if (layout === 'vertical' && groupMode === 'stacked' && reverse !== true || layout === 'horizontal' && groupMode === 'stacked' && reverse === true) {
    data.reverse();
  }
  return data;
};
var getLegendDataForIndexes = function getLegendDataForIndexes(bars) {
  return _uniqBy(bars.map(function (bar) {
    return {
      id: bar.data.indexValue,
      label: bar.data.indexValue,
      color: bar.color,
      fill: bar.data.fill
    };
  }), function (_ref2) {
    var id = _ref2.id;
    return id;
  });
};
var getLegendData = function getLegendData(_ref3) {
  var from = _ref3.from,
      bars = _ref3.bars,
      layout = _ref3.layout,
      groupMode = _ref3.groupMode,
      reverse = _ref3.reverse;
  if (from === 'indexes') {
    return getLegendDataForIndexes(bars);
  }
  return getLegendDataForKeys(bars, layout, groupMode, reverse);
};

function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$9(target, key, source[key]); }); } return target; }
function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var BarItem = function BarItem(_ref) {
  var data = _ref.data,
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      borderRadius = _ref.borderRadius,
      color = _ref.color,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      label = _ref.label,
      shouldRenderLabel = _ref.shouldRenderLabel,
      labelColor = _ref.labelColor,
      showTooltip = _ref.showTooltip,
      hideTooltip = _ref.hideTooltip,
      onClick = _ref.onClick,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      tooltip = _ref.tooltip,
      theme = _ref.theme;
  var handleTooltip = function handleTooltip(e) {
    return showTooltip(tooltip, e);
  };
  var handleMouseEnter = function handleMouseEnter(e) {
    onMouseEnter(data, e);
    showTooltip(tooltip, e);
  };
  var handleMouseLeave = function handleMouseLeave(e) {
    onMouseLeave(data, e);
    hideTooltip(e);
  };
  return React__default.createElement("g", {
    transform: "translate(".concat(x, ", ").concat(y, ")")
  }, React__default.createElement("rect", {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    fill: data.fill ? data.fill : color,
    strokeWidth: borderWidth,
    stroke: borderColor,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleTooltip,
    onMouseLeave: handleMouseLeave,
    onClick: onClick
  }), shouldRenderLabel && React__default.createElement("text", {
    x: width / 2,
    y: height / 2,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: _objectSpread$9({}, theme.labels.text, {
      pointerEvents: 'none',
      fill: labelColor
    })
  }, label));
};
BarItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    indexValue: PropTypes.string.isRequired
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  borderRadius: PropTypes.number.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  shouldRenderLabel: PropTypes.bool.isRequired,
  labelColor: PropTypes.string.isRequired,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  getTooltipLabel: PropTypes.func.isRequired,
  tooltipFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  tooltip: PropTypes.element.isRequired,
  theme: PropTypes.shape({
    tooltip: PropTypes.shape({}).isRequired
  }).isRequired
};
var enhance = compose(withPropsOnChange(['data', 'color', 'onClick'], function (_ref2) {
  var data = _ref2.data,
      color = _ref2.color,
      _onClick = _ref2.onClick;
  return {
    onClick: function onClick(event) {
      return _onClick(_objectSpread$9({
        color: color
      }, data), event);
    }
  };
}), withPropsOnChange(['data', 'color', 'theme', 'tooltip', 'getTooltipLabel', 'tooltipFormat'], function (_ref3) {
  var data = _ref3.data,
      color = _ref3.color,
      theme = _ref3.theme,
      tooltip$1 = _ref3.tooltip,
      getTooltipLabel = _ref3.getTooltipLabel,
      tooltipFormat = _ref3.tooltipFormat;
  return {
    tooltip: React__default.createElement(tooltip.BasicTooltip, {
      id: getTooltipLabel(data),
      value: data.value,
      enableChip: true,
      color: color,
      theme: theme,
      format: tooltipFormat,
      renderContent: typeof tooltip$1 === 'function' ? tooltip$1.bind(null, _objectSpread$9({
        color: color,
        theme: theme
      }, data)) : null
    })
  };
}), pure);
var BarItem$1 = enhance(BarItem);

function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$a(target, key, source[key]); }); } return target; }
function _defineProperty$a(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var BarPropTypes = _objectSpread$a({
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexBy: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  getIndex: PropTypes.func.isRequired,
  keys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['grid', 'axes', 'bars', 'markers', 'legends', 'annotations']), PropTypes.func])).isRequired,
  groupMode: PropTypes.oneOf(['stacked', 'grouped']).isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  reverse: PropTypes.bool.isRequired,
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]).isRequired,
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]).isRequired,
  padding: PropTypes.number.isRequired,
  innerPadding: PropTypes.number.isRequired,
  axisTop: axes.axisPropType,
  axisRight: axes.axisPropType,
  axisBottom: axes.axisPropType,
  axisLeft: axes.axisPropType,
  enableGridX: PropTypes.bool.isRequired,
  enableGridY: PropTypes.bool.isRequired,
  gridXValues: PropTypes.arrayOf(PropTypes.number),
  gridYValues: PropTypes.arrayOf(PropTypes.number),
  barComponent: PropTypes.func.isRequired,
  enableLabel: PropTypes.bool.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  labelFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  getLabel: PropTypes.func.isRequired,
  labelSkipWidth: PropTypes.number.isRequired,
  labelSkipHeight: PropTypes.number.isRequired,
  labelTextColor: colors.inheritedColorPropType.isRequired,
  getLabelTextColor: PropTypes.func.isRequired,
  labelLinkColor: colors.inheritedColorPropType.isRequired,
  getLabelLinkColor: PropTypes.func.isRequired,
  colors: colors.ordinalColorsPropType.isRequired,
  colorBy: colors.colorPropertyAccessorPropType.isRequired,
  borderRadius: PropTypes.number.isRequired,
  getColor: PropTypes.func.isRequired
}, core.defsPropTypes, {
  borderWidth: PropTypes.number.isRequired,
  borderColor: colors.inheritedColorPropType.isRequired,
  getBorderColor: PropTypes.func.isRequired,
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  tooltipLabel: PropTypes.func,
  getTooltipLabel: PropTypes.func.isRequired,
  tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  tooltip: PropTypes.func,
  legends: PropTypes.arrayOf(PropTypes.shape(_objectSpread$a({
    dataFrom: PropTypes.oneOf(['indexes', 'keys']).isRequired
  }, legends.LegendPropShape))).isRequired,
  scrollableLegend: PropTypes.bool,
  pixelRatio: PropTypes.number.isRequired
});
var BarDefaultProps = {
  indexBy: 'id',
  keys: ['value'],
  layers: ['grid', 'axes', 'bars', 'markers', 'legends', 'annotations'],
  groupMode: 'stacked',
  layout: 'vertical',
  reverse: false,
  minValue: 'auto',
  maxValue: 'auto',
  padding: 0.1,
  innerPadding: 0,
  axisBottom: {},
  axisLeft: {},
  enableGridX: false,
  enableGridY: true,
  barComponent: BarItem$1,
  enableLabel: true,
  label: 'value',
  labelSkipWidth: 0,
  labelSkipHeight: 0,
  labelLinkColor: 'theme',
  labelTextColor: 'theme',
  colors: {
    scheme: 'nivo'
  },
  colorBy: 'id',
  defs: [],
  fill: [],
  borderRadius: 0,
  borderWidth: 0,
  borderColor: {
    from: 'color'
  },
  isInteractive: true,
  onClick: core.noop,
  onMouseEnter: core.noop,
  onMouseLeave: core.noop,
  legends: [],
  scrollableLegend: false,
  annotations: [],
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
};

var enhance$1 = (function (Component) {
  return compose(defaultProps(BarDefaultProps), core.withTheme(), core.withDimensions(), core.withMotion(), withPropsOnChange(['colors', 'colorBy'], function (_ref) {
    var colors$1 = _ref.colors,
        colorBy = _ref.colorBy;
    return {
      getColor: colors.getOrdinalColorScale(colors$1, colorBy)
    };
  }), withPropsOnChange(['indexBy'], function (_ref2) {
    var indexBy = _ref2.indexBy;
    return {
      getIndex: core.getAccessorFor(indexBy)
    };
  }), withPropsOnChange(['labelTextColor', 'theme'], function (_ref3) {
    var labelTextColor = _ref3.labelTextColor,
        theme = _ref3.theme;
    return {
      getLabelTextColor: colors.getInheritedColorGenerator(labelTextColor, theme)
    };
  }), withPropsOnChange(['labelLinkColor', 'theme'], function (_ref4) {
    var labelLinkColor = _ref4.labelLinkColor,
        theme = _ref4.theme;
    return {
      getLabelLinkColor: colors.getInheritedColorGenerator(labelLinkColor, theme)
    };
  }), withPropsOnChange(['label', 'labelFormat'], function (_ref5) {
    var label = _ref5.label,
        labelFormat = _ref5.labelFormat;
    return {
      getLabel: core.getLabelGenerator(label, labelFormat)
    };
  }), withPropsOnChange(['borderColor', 'theme'], function (_ref6) {
    var borderColor = _ref6.borderColor,
        theme = _ref6.theme;
    return {
      getBorderColor: colors.getInheritedColorGenerator(borderColor, theme)
    };
  }), withPropsOnChange(['tooltipLabel'], function (_ref7) {
    var tooltipLabel = _ref7.tooltipLabel;
    var getTooltipLabel = function getTooltipLabel(d) {
      return "".concat(d.id, " - ").concat(d.indexValue);
    };
    if (typeof tooltipLabel === 'function') {
      getTooltipLabel = tooltipLabel;
    }
    return {
      getTooltipLabel: getTooltipLabel
    };
  }), pure)(Component);
});

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var BarAnnotations = function BarAnnotations(_ref) {
  var bars = _ref.bars,
      annotations$1 = _ref.annotations,
      animate = _ref.animate,
      motionStiffness = _ref.motionStiffness,
      motionDamping = _ref.motionDamping;
  var boundAnnotations = annotations.useAnnotations({
    items: bars,
    annotations: annotations$1,
    getPosition: function getPosition(bar) {
      return {
        x: bar.x + bar.width / 2,
        y: bar.y + bar.height / 2
      };
    },
    getDimensions: function getDimensions(bar, offset) {
      var width = bar.width + offset * 2;
      var height = bar.height + offset * 2;
      return {
        width: width,
        height: height,
        size: Math.max(width, height)
      };
    }
  });
  return boundAnnotations.map(function (annotation, i) {
    return (
      React__default.createElement(annotations.Annotation, _extends({
        key: i
      }, annotation, {
        containerWidth: innerWidth,
        containerHeight: innerHeight,
        animate: animate,
        motionStiffness: motionStiffness,
        motionDamping: motionDamping
      }))
    );
  });
};
BarAnnotations.propTypes = {};

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$b(target, key, source[key]); }); } return target; }
function _defineProperty$b(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var barWillEnterHorizontal = function barWillEnterHorizontal(_ref) {
  var style = _ref.style;
  return {
    x: style.x.val,
    y: style.y.val,
    width: 0,
    height: style.height.val
  };
};
var barWillEnterVertical = function barWillEnterVertical(_ref2) {
  var style = _ref2.style;
  return {
    x: style.x.val,
    y: style.y.val + style.height.val,
    width: style.width.val,
    height: 0
  };
};
var barWillLeaveHorizontal = function barWillLeaveHorizontal(springConfig) {
  return function (_ref3) {
    var style = _ref3.style;
    return {
      x: style.x,
      y: style.y,
      width: reactMotion.spring(0, springConfig),
      height: style.height
    };
  };
};
var barWillLeaveVertical = function barWillLeaveVertical(springConfig) {
  return function (_ref4) {
    var style = _ref4.style;
    return {
      x: style.x,
      y: reactMotion.spring(style.y.val + style.height.val, springConfig),
      width: style.width,
      height: reactMotion.spring(0, springConfig)
    };
  };
};
var Bar = function Bar(props) {
  var data = props.data,
      getIndex = props.getIndex,
      keys = props.keys,
      groupMode = props.groupMode,
      layout = props.layout,
      reverse = props.reverse,
      minValue = props.minValue,
      maxValue = props.maxValue,
      margin = props.margin,
      width = props.width,
      height = props.height,
      outerWidth = props.outerWidth,
      outerHeight = props.outerHeight,
      padding = props.padding,
      innerPadding = props.innerPadding,
      axisTop = props.axisTop,
      axisRight = props.axisRight,
      axisBottom = props.axisBottom,
      axisLeft = props.axisLeft,
      enableGridX = props.enableGridX,
      enableGridY = props.enableGridY,
      gridXValues = props.gridXValues,
      gridYValues = props.gridYValues,
      layers = props.layers,
      barComponent = props.barComponent,
      enableLabel = props.enableLabel,
      getLabel = props.getLabel,
      labelSkipWidth = props.labelSkipWidth,
      labelSkipHeight = props.labelSkipHeight,
      getLabelTextColor = props.getLabelTextColor,
      markers = props.markers,
      theme = props.theme,
      getColor = props.getColor,
      defs = props.defs,
      fill = props.fill,
      borderRadius = props.borderRadius,
      borderWidth = props.borderWidth,
      getBorderColor = props.getBorderColor,
      annotations = props.annotations,
      isInteractive = props.isInteractive,
      getTooltipLabel = props.getTooltipLabel,
      tooltipFormat = props.tooltipFormat,
      tooltip = props.tooltip,
      onClick = props.onClick,
      onMouseEnter = props.onMouseEnter,
      onMouseLeave = props.onMouseLeave,
      legends = props.legends,
      scrollableLegend = props.scrollableLegend,
      animate = props.animate,
      motionStiffness = props.motionStiffness,
      motionDamping = props.motionDamping;
  var options = {
    layout: layout,
    reverse: reverse,
    data: data,
    getIndex: getIndex,
    keys: keys,
    minValue: minValue,
    maxValue: maxValue,
    width: width,
    height: height,
    getColor: getColor,
    padding: padding,
    innerPadding: innerPadding
  };
  var result = groupMode === 'grouped' ? generateGroupedBars(options) : generateStackedBars(options);
  var motionProps = {
    animate: animate,
    motionDamping: motionDamping,
    motionStiffness: motionStiffness
  };
  var springConfig = {
    damping: motionDamping,
    stiffness: motionStiffness
  };
  var willEnter = layout === 'vertical' ? barWillEnterVertical : barWillEnterHorizontal;
  var willLeave = layout === 'vertical' ? barWillLeaveVertical(springConfig) : barWillLeaveHorizontal(springConfig);
  var shouldRenderLabel = function shouldRenderLabel(_ref5) {
    var width = _ref5.width,
        height = _ref5.height;
    if (!enableLabel) return false;
    if (labelSkipWidth > 0 && width < labelSkipWidth) return false;
    if (labelSkipHeight > 0 && height < labelSkipHeight) return false;
    return true;
  };
  var boundDefs = core.bindDefs(defs, result.bars, fill, {
    dataKey: 'data',
    targetKey: 'data.fill'
  });
  return React__default.createElement(core.Container, {
    isInteractive: isInteractive,
    theme: theme,
    animate: animate,
    motionStiffness: motionStiffness,
    motionDamping: motionDamping
  }, function (_ref6) {
    var showTooltip = _ref6.showTooltip,
        hideTooltip = _ref6.hideTooltip;
    var commonProps = {
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      enableLabel: enableLabel,
      labelSkipWidth: labelSkipWidth,
      labelSkipHeight: labelSkipHeight,
      showTooltip: showTooltip,
      hideTooltip: hideTooltip,
      onClick: onClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      theme: theme,
      getTooltipLabel: getTooltipLabel,
      tooltipFormat: tooltipFormat,
      tooltip: tooltip
    };
    var bars;
    if (animate === true) {
      bars = React__default.createElement(reactMotion.TransitionMotion, {
        key: "bars",
        willEnter: willEnter,
        willLeave: willLeave,
        styles: result.bars.map(function (bar) {
          return {
            key: bar.key,
            data: bar,
            style: {
              x: reactMotion.spring(bar.x, springConfig),
              y: reactMotion.spring(bar.y, springConfig),
              width: reactMotion.spring(bar.width, springConfig),
              height: reactMotion.spring(bar.height, springConfig)
            }
          };
        })
      }, function (interpolatedStyles) {
        return React__default.createElement("g", null, interpolatedStyles.map(function (_ref7) {
          var key = _ref7.key,
              style = _ref7.style,
              bar = _ref7.data;
          var baseProps = _objectSpread$b({}, bar, style);
          return React__default.createElement(barComponent, _objectSpread$b({
            key: key
          }, baseProps, commonProps, {
            shouldRenderLabel: shouldRenderLabel(baseProps),
            width: Math.max(style.width, 0),
            height: Math.max(style.height, 0),
            label: getLabel(bar.data),
            labelColor: getLabelTextColor(baseProps, theme),
            borderColor: getBorderColor(baseProps),
            theme: theme
          }));
        }));
      });
    } else {
      bars = result.bars.map(function (d) {
        return React__default.createElement(barComponent, _objectSpread$b({
          key: d.key
        }, d, commonProps, {
          label: getLabel(d.data),
          shouldRenderLabel: shouldRenderLabel(d),
          labelColor: getLabelTextColor(d, theme),
          borderColor: getBorderColor(d),
          theme: theme
        }));
      });
    }
    var layerById = {
      grid: React__default.createElement(axes.Grid, {
        key: "grid",
        width: width,
        height: height,
        xScale: enableGridX ? result.xScale : null,
        yScale: enableGridY ? result.yScale : null,
        xValues: gridXValues,
        yValues: gridYValues
      }),
      axes: React__default.createElement(axes.Axes, {
        key: "axes",
        xScale: result.xScale,
        yScale: result.yScale,
        width: width,
        height: height,
        top: axisTop,
        right: axisRight,
        bottom: axisBottom,
        left: axisLeft
      }),
      bars: bars,
      markers: React__default.createElement(core.CartesianMarkers, {
        key: "markers",
        markers: markers,
        width: width,
        height: height,
        xScale: result.xScale,
        yScale: result.yScale,
        theme: theme
      }),
      legends: legends.map(function (legend, i) {
        var legendData = getLegendData({
          from: legend.dataFrom,
          bars: result.bars,
          layout: layout,
          groupMode: groupMode,
          reverse: reverse
        });
        if (legendData === undefined) return null;
        return React__default.createElement(BoxLegendSvg, _extends$1({
          key: i
        }, legend, {
          containerWidth: width,
          containerHeight: height,
          scrollableLegend: scrollableLegend,
          data: legendData,
          theme: theme
        }));
      }),
      annotations: React__default.createElement(BarAnnotations, _extends$1({
        key: "annotations",
        innerWidth: width,
        innerHeight: height,
        bars: result.bars,
        annotations: annotations
      }, motionProps))
    };
    return React__default.createElement(core.SvgWrapper, {
      width: outerWidth,
      height: outerHeight,
      margin: margin,
      defs: boundDefs,
      theme: theme
    }, layers.map(function (layer, i) {
      if (typeof layer === 'function') {
        return React__default.createElement(React.Fragment, {
          key: i
        }, layer(_objectSpread$b({}, props, result)));
      }
      return layerById[layer];
    }));
  });
};
Bar.propTypes = BarPropTypes;
var Bar$1 = setDisplayName('Bar')(enhance$1(Bar));

function _typeof$4(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }
function _objectSpread$c(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$c(target, key, source[key]); }); } return target; }
function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1(); }
function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$1(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn$4(self, call) { if (call && (_typeof$4(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$4(self); }
function _getPrototypeOf$4(o) { _getPrototypeOf$4 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$4(o); }
function _assertThisInitialized$4(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$4(subClass, superClass); }
function _setPrototypeOf$4(o, p) { _setPrototypeOf$4 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$4(o, p); }
function _defineProperty$c(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var findNodeUnderCursor = function findNodeUnderCursor(nodes, margin, x, y) {
  return nodes.find(function (node) {
    return core.isCursorInRect(node.x + margin.left, node.y + margin.top, node.width, node.height, x, y);
  });
};
var BarCanvas =
function (_Component) {
  _inherits$4(BarCanvas, _Component);
  function BarCanvas() {
    var _getPrototypeOf2;
    var _this;
    _classCallCheck$4(this, BarCanvas);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _possibleConstructorReturn$4(this, (_getPrototypeOf2 = _getPrototypeOf$4(BarCanvas)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _defineProperty$c(_assertThisInitialized$4(_this), "handleMouseHover", function (showTooltip, hideTooltip) {
      return function (event) {
        if (!_this.bars) return;
        var _this$props = _this.props,
            margin = _this$props.margin,
            theme = _this$props.theme,
            tooltip$1 = _this$props.tooltip,
            getTooltipLabel = _this$props.getTooltipLabel,
            tooltipFormat = _this$props.tooltipFormat;
        var _getRelativeCursor = core.getRelativeCursor(_this.surface, event),
            _getRelativeCursor2 = _slicedToArray$1(_getRelativeCursor, 2),
            x = _getRelativeCursor2[0],
            y = _getRelativeCursor2[1];
        var bar = findNodeUnderCursor(_this.bars, margin, x, y);
        if (bar !== undefined) {
          showTooltip(React__default.createElement(tooltip.BasicTooltip, {
            id: getTooltipLabel(bar.data),
            value: bar.data.value,
            enableChip: true,
            color: bar.color,
            theme: theme,
            format: tooltipFormat,
            renderContent: typeof tooltip$1 === 'function' ? tooltip$1.bind(null, _objectSpread$c({
              color: bar.color
            }, bar.data)) : null
          }), event);
        } else {
          hideTooltip();
        }
      };
    });
    _defineProperty$c(_assertThisInitialized$4(_this), "handleMouseLeave", function (hideTooltip) {
      return function () {
        hideTooltip();
      };
    });
    _defineProperty$c(_assertThisInitialized$4(_this), "handleClick", function (event) {
      if (!_this.bars) return;
      var _this$props2 = _this.props,
          margin = _this$props2.margin,
          onClick = _this$props2.onClick;
      var _getRelativeCursor3 = core.getRelativeCursor(_this.surface, event),
          _getRelativeCursor4 = _slicedToArray$1(_getRelativeCursor3, 2),
          x = _getRelativeCursor4[0],
          y = _getRelativeCursor4[1];
      var node = findNodeUnderCursor(_this.bars, margin, x, y);
      if (node !== undefined) onClick(node.data, event);
    });
    return _this;
  }
  _createClass$4(BarCanvas, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.ctx = this.surface.getContext('2d');
      this.draw(this.props);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(props) {
      if (this.props.outerWidth !== props.outerWidth || this.props.outerHeight !== props.outerHeight || this.props.isInteractive !== props.isInteractive || this.props.theme !== props.theme) {
        return true;
      } else {
        this.draw(props);
        return false;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.ctx = this.surface.getContext('2d');
      this.draw(this.props);
    }
  }, {
    key: "draw",
    value: function draw(props) {
      var _this2 = this;
      var data = props.data,
          keys = props.keys,
          getIndex = props.getIndex,
          minValue = props.minValue,
          maxValue = props.maxValue,
          width = props.width,
          height = props.height,
          outerWidth = props.outerWidth,
          outerHeight = props.outerHeight,
          pixelRatio = props.pixelRatio,
          margin = props.margin,
          layout = props.layout,
          reverse = props.reverse,
          groupMode = props.groupMode,
          padding = props.padding,
          innerPadding = props.innerPadding,
          axisTop = props.axisTop,
          axisRight = props.axisRight,
          axisBottom = props.axisBottom,
          axisLeft = props.axisLeft,
          theme = props.theme,
          getColor = props.getColor,
          borderWidth = props.borderWidth,
          getBorderColor = props.getBorderColor,
          legends$1 = props.legends,
          enableGridX = props.enableGridX,
          gridXValues = props.gridXValues,
          enableGridY = props.enableGridY,
          gridYValues = props.gridYValues;
      this.surface.width = outerWidth * pixelRatio;
      this.surface.height = outerHeight * pixelRatio;
      this.ctx.scale(pixelRatio, pixelRatio);
      var options = {
        layout: layout,
        reverse: reverse,
        data: data,
        getIndex: getIndex,
        keys: keys,
        minValue: minValue,
        maxValue: maxValue,
        width: width,
        height: height,
        getColor: getColor,
        padding: padding,
        innerPadding: innerPadding
      };
      var result = groupMode === 'grouped' ? generateGroupedBars(options) : generateStackedBars(options);
      this.bars = result.bars;
      this.ctx.fillStyle = theme.background;
      this.ctx.fillRect(0, 0, outerWidth, outerHeight);
      this.ctx.translate(margin.left, margin.top);
      if (theme.grid.line.strokeWidth > 0) {
        this.ctx.lineWidth = theme.grid.line.strokeWidth;
        this.ctx.strokeStyle = theme.grid.line.stroke;
        enableGridX && axes.renderGridLinesToCanvas(this.ctx, {
          width: width,
          height: height,
          scale: result.xScale,
          axis: 'x',
          values: gridXValues
        });
        enableGridY && axes.renderGridLinesToCanvas(this.ctx, {
          width: width,
          height: height,
          scale: result.yScale,
          axis: 'y',
          values: gridYValues
        });
      }
      this.ctx.strokeStyle = '#dddddd';
      var legendDataForKeys = _uniqBy(result.bars.map(function (bar) {
        return {
          id: bar.data.id,
          label: bar.data.id,
          color: bar.color,
          fill: bar.data.fill
        };
      }).reverse(), function (_ref) {
        var id = _ref.id;
        return id;
      });
      var legendDataForIndexes = _uniqBy(result.bars.map(function (bar) {
        return {
          id: bar.data.indexValue,
          label: bar.data.indexValue,
          color: bar.color,
          fill: bar.data.fill
        };
      }), function (_ref2) {
        var id = _ref2.id;
        return id;
      });
      legends$1.forEach(function (legend) {
        var legendData;
        if (legend.dataFrom === 'keys') {
          legendData = legendDataForKeys;
        } else if (legend.dataFrom === 'indexes') {
          legendData = legendDataForIndexes;
        }
        if (legendData === undefined) return null;
        legends.renderLegendToCanvas(_this2.ctx, _objectSpread$c({}, legend, {
          data: legendData,
          containerWidth: width,
          containerHeight: height,
          itemTextColor: '#999',
          symbolSize: 16
        }));
      });
      axes.renderAxesToCanvas(this.ctx, {
        xScale: result.xScale,
        yScale: result.yScale,
        width: width,
        height: height,
        top: axisTop,
        right: axisRight,
        bottom: axisBottom,
        left: axisLeft,
        theme: theme
      });
      result.bars.forEach(function (bar) {
        var x = bar.x,
            y = bar.y,
            color = bar.color,
            width = bar.width,
            height = bar.height;
        _this2.ctx.fillStyle = color;
        if (borderWidth > 0) {
          _this2.ctx.strokeStyle = getBorderColor(bar);
          _this2.ctx.lineWidth = borderWidth;
        }
        _this2.ctx.beginPath();
        _this2.ctx.rect(x, y, width, height);
        _this2.ctx.fill();
        if (borderWidth > 0) {
          _this2.ctx.stroke();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props3 = this.props,
          outerWidth = _this$props3.outerWidth,
          outerHeight = _this$props3.outerHeight,
          pixelRatio = _this$props3.pixelRatio,
          isInteractive = _this$props3.isInteractive,
          theme = _this$props3.theme;
      return React__default.createElement(core.Container, {
        isInteractive: isInteractive,
        theme: theme,
        animate: false
      }, function (_ref3) {
        var showTooltip = _ref3.showTooltip,
            hideTooltip = _ref3.hideTooltip;
        return React__default.createElement("canvas", {
          ref: function ref(surface) {
            _this3.surface = surface;
          },
          width: outerWidth * pixelRatio,
          height: outerHeight * pixelRatio,
          style: {
            width: outerWidth,
            height: outerHeight
          },
          onMouseEnter: _this3.handleMouseHover(showTooltip, hideTooltip),
          onMouseMove: _this3.handleMouseHover(showTooltip, hideTooltip),
          onMouseLeave: _this3.handleMouseLeave(hideTooltip),
          onClick: _this3.handleClick
        });
      });
    }
  }]);
  return BarCanvas;
}(React.Component);
BarCanvas.propTypes = BarPropTypes;
var BarCanvas$1 = setDisplayName('BarCanvas')(enhance$1(BarCanvas));

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var ResponsiveBar = function ResponsiveBar(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(Bar$1, _extends$2({
      width: width,
      height: height
    }, props));
  });
};

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
var ResponsiveBarCanvas = function ResponsiveBarCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(BarCanvas$1, _extends$3({
      width: width,
      height: height
    }, props));
  });
};

exports.Bar = Bar$1;
exports.BarCanvas = BarCanvas$1;
exports.BarDefaultProps = BarDefaultProps;
exports.BarPropTypes = BarPropTypes;
exports.ResponsiveBar = ResponsiveBar;
exports.ResponsiveBarCanvas = ResponsiveBarCanvas;
