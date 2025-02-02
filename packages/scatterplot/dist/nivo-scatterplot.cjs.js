'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var core = require('@nivo/core');
var axes = require('@nivo/axes');
var legends = require('@nivo/legends');
var colors = require('@nivo/colors');
var scales = require('@nivo/scales');
var get = _interopDefault(require('lodash/get'));
var isString = _interopDefault(require('lodash/isString'));
var isNumber = _interopDefault(require('lodash/isNumber'));
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var d3Scale = require('d3-scale');
var PropTypes = _interopDefault(require('prop-types'));
var tooltip = require('@nivo/tooltip');
var reactMotion = require('react-motion');
var voronoi = require('@nivo/voronoi');

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
var getNodeSizeGenerator = function getNodeSizeGenerator(size) {
  if (typeof size === 'function') return size;
  if (isNumber(size)) return function () {
    return size;
  };
  if (isPlainObject(size)) {
    if (!isString(size.key)) {
      throw new Error('symbolSize is invalid, key should be a string pointing to the property to use to determine node size');
    }
    if (!Array.isArray(size.values) || size.values.length !== 2) {
      throw new Error('symbolSize is invalid, values spec should be an array containing two values, min and max');
    }
    if (!Array.isArray(size.sizes) || size.sizes.length !== 2) {
      throw new Error('symbolSize is invalid, sizes spec should be an array containing two values, min and max');
    }
    var sizeScale = d3Scale.scaleLinear().domain([size.values[0], size.values[1]]).range([size.sizes[0], size.sizes[1]]);
    return function (d) {
      return sizeScale(get(d, size.key));
    };
  }
  throw new Error('symbolSize is invalid, it should be either a function, a number or an object');
};
var computePoints = function computePoints(_ref) {
  var series = _ref.series,
      formatX = _ref.formatX,
      formatY = _ref.formatY;
  return series.reduce(function (agg, serie) {
    return [].concat(_toConsumableArray(agg), _toConsumableArray(serie.data.map(function (d, i) {
      return {
        index: agg.length + i,
        id: "".concat(serie.id, ".").concat(i),
        x: d.position.x,
        y: d.position.y,
        data: _objectSpread({}, d.data, {
          id: "".concat(serie.id, ".").concat(i),
          serieId: serie.id,
          formattedX: formatX(d.data.x),
          formattedY: formatY(d.data.y)
        })
      };
    })));
  }, []);
};

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } return target; }
function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var useNodeSize = function useNodeSize(size) {
  return React.useMemo(function () {
    return getNodeSizeGenerator(size);
  }, [size]);
};
var useScatterPlot = function useScatterPlot(_ref) {
  var data = _ref.data,
      xScaleSpec = _ref.xScaleSpec,
      xFormat = _ref.xFormat,
      yScaleSpec = _ref.yScaleSpec,
      yFormat = _ref.yFormat,
      width = _ref.width,
      height = _ref.height,
      nodeSize = _ref.nodeSize,
      colors$1 = _ref.colors;
  var _useMemo = React.useMemo(function () {
    return scales.computeXYScalesForSeries(data, xScaleSpec, yScaleSpec, width, height);
  }, [data, xScaleSpec, yScaleSpec, width, height]),
      series = _useMemo.series,
      xScale = _useMemo.xScale,
      yScale = _useMemo.yScale;
  var formatX = core.useValueFormatter(xFormat);
  var formatY = core.useValueFormatter(yFormat);
  var rawNodes = React.useMemo(function () {
    return computePoints({
      series: series,
      formatX: formatX,
      formatY: formatY
    });
  }, [series, formatX, formatY]);
  var getNodeSize = useNodeSize(nodeSize);
  var getColor = colors.useOrdinalColorScale(colors$1, 'serieId');
  var nodes = React.useMemo(function () {
    return rawNodes.map(function (rawNode) {
      return _objectSpread$1({}, rawNode, {
        size: getNodeSize(rawNode.data),
        style: {
          color: getColor(rawNode.data)
        }
      });
    });
  }, [rawNodes, getNodeSize, getColor]);
  var legendData = React.useMemo(function () {
    return series.map(function (serie) {
      return {
        id: serie.id,
        label: serie.id,
        color: getColor({
          serieId: serie.id
        })
      };
    });
  }, [series, getColor]);
  return {
    xScale: xScale,
    yScale: yScale,
    nodes: nodes,
    legendData: legendData
  };
};

var Node = function Node(_ref) {
  var x = _ref.x,
      y = _ref.y,
      size = _ref.size,
      color = _ref.color,
      blendMode = _ref.blendMode,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick;
  return React__default.createElement("circle", {
    cx: x,
    cy: y,
    r: size / 2,
    fill: color,
    style: {
      mixBlendMode: blendMode
    },
    onMouseEnter: onMouseEnter,
    onMouseMove: onMouseMove,
    onMouseLeave: onMouseLeave,
    onClick: onClick
  });
};
Node.propTypes = {
  node: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  blendMode: core.blendModePropType.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func
};
var Node$1 = React.memo(Node);

var Tooltip = function Tooltip(_ref) {
  var node = _ref.node;
  return React__default.createElement(tooltip.BasicTooltip, {
    id: node.data.serieId,
    value: "x: ".concat(node.data.formattedX, ", y: ").concat(node.data.formattedY),
    enableChip: true,
    color: node.style.color
  });
};
Tooltip.propTypes = {
  node: PropTypes.object.isRequired
};
var Tooltip$1 = React.memo(Tooltip);

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } return target; }
function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonPropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      y: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
    })).isRequired
  })).isRequired,
  xScale: scales.scalePropType.isRequired,
  xFormat: PropTypes.any,
  yScale: scales.scalePropType.isRequired,
  yFormat: PropTypes.any,
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['grid', 'axes', 'nodes', 'markers', 'mesh', 'legends']), PropTypes.func])).isRequired,
  enableGridX: PropTypes.bool.isRequired,
  enableGridY: PropTypes.bool.isRequired,
  axisTop: axes.axisPropType,
  axisRight: axes.axisPropType,
  axisBottom: axes.axisPropType,
  axisLeft: axes.axisPropType,
  nodeSize: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    key: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.number).isRequired
  }), PropTypes.func]).isRequired,
  renderNode: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  colors: colors.ordinalColorsPropType.isRequired,
  blendMode: core.blendModePropType.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  debugMesh: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  markers: PropTypes.arrayOf(PropTypes.shape({
    axis: PropTypes.oneOf(['x', 'y']).isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    style: PropTypes.object
  })),
  legends: PropTypes.arrayOf(PropTypes.shape(legends.LegendPropShape)).isRequired
};
var ScatterPlotPropTypes = _objectSpread$2({}, commonPropTypes, {
  useMesh: PropTypes.bool.isRequired
}, core.motionPropTypes);
var ScatterPlotCanvasPropTypes = _objectSpread$2({}, commonPropTypes, {
  pixelRatio: PropTypes.number.isRequired
});
var commonDefaultProps = {
  xScale: {
    type: 'linear',
    min: 0,
    max: 'auto'
  },
  yScale: {
    type: 'linear',
    min: 0,
    max: 'auto'
  },
  enableGridX: true,
  enableGridY: true,
  axisBottom: {},
  axisLeft: {},
  nodeSize: 9,
  renderNode: Node$1,
  colors: {
    scheme: 'nivo'
  },
  blendMode: 'normal',
  isInteractive: true,
  debugMesh: false,
  tooltip: Tooltip$1,
  markers: [],
  legends: []
};
var ScatterPlotDefaultProps = _objectSpread$2({}, commonDefaultProps, {
  layers: ['grid', 'axes', 'nodes', 'markers', 'mesh', 'legends'],
  useMesh: true,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15
});
var ScatterPlotCanvasDefaultProps = _objectSpread$2({}, commonDefaultProps, {
  layers: ['grid', 'axes', 'nodes', 'mesh', 'legends'],
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});
var NodePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    serieId: PropTypes.string.isRequired,
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    formattedX: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    formattedY: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  style: PropTypes.shape({
    color: PropTypes.string.isRequired
  }).isRequired
});

var NodeWrapper = function NodeWrapper(_ref) {
  var node = _ref.node,
      NodeComponent = _ref.renderNode,
      x = _ref.x,
      y = _ref.y,
      size = _ref.size,
      color = _ref.color,
      isInteractive = _ref.isInteractive,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick,
      tooltip$1 = _ref.tooltip,
      blendMode = _ref.blendMode;
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseEnter = React.useCallback(function (event) {
    showTooltipFromEvent(React__default.createElement(tooltip$1, {
      node: node
    }), event);
    onMouseEnter && onMouseEnter(node, event);
  }, [node, tooltip$1, showTooltipFromEvent, onMouseEnter]);
  var handleMouseMove = React.useCallback(function (event) {
    showTooltipFromEvent(React__default.createElement(tooltip$1, {
      node: node
    }), event);
    onMouseMove && onMouseMove(node, event);
  }, [node, tooltip$1, showTooltipFromEvent, onMouseMove]);
  var handleMouseLeave = React.useCallback(function (event) {
    hideTooltip();
    onMouseLeave && onMouseLeave(node, event);
  }, [node, hideTooltip, onMouseLeave]);
  var handleClick = React.useCallback(function (event) {
    onClick && onClick(node, event);
  }, [node, onClick]);
  return React__default.createElement(NodeComponent, {
    node: node,
    x: x,
    y: y,
    size: size,
    color: color,
    blendMode: blendMode,
    onMouseEnter: isInteractive ? handleMouseEnter : undefined,
    onMouseMove: isInteractive ? handleMouseMove : undefined,
    onMouseLeave: isInteractive ? handleMouseLeave : undefined,
    onClick: isInteractive && onClick ? handleClick : undefined
  });
};
NodeWrapper.propTypes = {
  node: NodePropType.isRequired,
  renderNode: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  blendMode: core.blendModePropType.isRequired
};
var NodeWrapper$1 = React.memo(NodeWrapper);

var AnimatedNodes = function AnimatedNodes(_ref) {
  var nodes = _ref.nodes,
      renderNode = _ref.renderNode,
      isInteractive = _ref.isInteractive,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick,
      tooltip = _ref.tooltip,
      blendMode = _ref.blendMode;
  var _useMotionConfig = core.useMotionConfig(),
      springConfig = _useMotionConfig.springConfig;
  return React__default.createElement(reactMotion.TransitionMotion, {
    styles: nodes.map(function (node) {
      return {
        key: node.id,
        data: node,
        style: {
          x: reactMotion.spring(node.x, springConfig),
          y: reactMotion.spring(node.y, springConfig),
          size: reactMotion.spring(node.size, springConfig)
        }
      };
    })
  }, function (interpolatedStyles) {
    return React__default.createElement(React__default.Fragment, null, interpolatedStyles.map(function (_ref2) {
      var key = _ref2.key,
          style = _ref2.style,
          node = _ref2.data;
      return React__default.createElement(NodeWrapper$1, {
        key: key,
        node: node,
        renderNode: renderNode,
        x: style.x,
        y: style.y,
        size: style.size,
        color: node.style.color,
        isInteractive: isInteractive,
        onMouseEnter: onMouseEnter,
        onMouseMove: onMouseMove,
        onMouseLeave: onMouseLeave,
        onClick: onClick,
        tooltip: tooltip,
        blendMode: blendMode
      });
    }));
  });
};
AnimatedNodes.propTypes = {
  nodes: PropTypes.arrayOf(NodePropType).isRequired,
  renderNode: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  blendMode: core.blendModePropType.isRequired
};
var AnimatedNodes$1 = React.memo(AnimatedNodes);

var StaticNodes = function StaticNodes(_ref) {
  var nodes = _ref.nodes,
      renderNode = _ref.renderNode,
      isInteractive = _ref.isInteractive,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick,
      tooltip = _ref.tooltip,
      blendMode = _ref.blendMode;
  return nodes.map(function (node) {
    return React__default.createElement(NodeWrapper$1, {
      key: node.id,
      node: node,
      renderNode: renderNode,
      x: node.x,
      y: node.y,
      size: node.size,
      color: node.style.color,
      isInteractive: isInteractive,
      onMouseEnter: onMouseEnter,
      onMouseMove: onMouseMove,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      tooltip: tooltip,
      blendMode: blendMode
    });
  });
};
StaticNodes.propTypes = {
  nodes: PropTypes.arrayOf(NodePropType).isRequired,
  renderNode: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  blendMode: core.blendModePropType.isRequired
};
var StaticNodes$1 = React.memo(StaticNodes);

var Mesh = function Mesh(_ref) {
  var nodes = _ref.nodes,
      width = _ref.width,
      height = _ref.height,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onClick = _ref.onClick,
      tooltip$1 = _ref.tooltip,
      debug = _ref.debug;
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseEnter = React.useCallback(function (node, event) {
    showTooltipFromEvent(React__default.createElement(tooltip$1, {
      node: node
    }), event);
    onMouseEnter && onMouseEnter(node, event);
  }, [showTooltipFromEvent, tooltip$1, onMouseEnter]);
  var handleMouseMove = React.useCallback(function (node, event) {
    showTooltipFromEvent(React__default.createElement(tooltip$1, {
      node: node
    }), event);
    onMouseMove && onMouseMove(node, event);
  }, [showTooltipFromEvent, tooltip$1, onMouseMove]);
  var handleMouseLeave = React.useCallback(function () {
    hideTooltip();
  }, [hideTooltip]);
  var handleClick = React.useCallback(function (node, event) {
    onClick && onClick(node, event);
  }, [onClick]);
  return React__default.createElement(voronoi.Mesh, {
    nodes: nodes,
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
  nodes: PropTypes.arrayOf(NodePropType).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  debug: PropTypes.bool.isRequired
};
var Mesh$1 = React.memo(Mesh);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } return target; }
function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var ScatterPlot = function ScatterPlot(props) {
  var data = props.data,
      xScaleSpec = props.xScale,
      xFormat = props.xFormat,
      yScaleSpec = props.yScale,
      yFormat = props.yFormat,
      width = props.width,
      height = props.height,
      partialMargin = props.margin,
      layers = props.layers,
      colors = props.colors,
      blendMode = props.blendMode,
      nodeSize = props.nodeSize,
      renderNode = props.renderNode,
      enableGridX = props.enableGridX,
      enableGridY = props.enableGridY,
      axisTop = props.axisTop,
      axisRight = props.axisRight,
      axisBottom = props.axisBottom,
      axisLeft = props.axisLeft,
      isInteractive = props.isInteractive,
      useMesh = props.useMesh,
      debugMesh = props.debugMesh,
      onMouseEnter = props.onMouseEnter,
      onMouseMove = props.onMouseMove,
      onMouseLeave = props.onMouseLeave,
      onClick = props.onClick,
      tooltip = props.tooltip,
      markers = props.markers,
      legends$1 = props.legends;
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var theme = core.useTheme();
  var _useMotionConfig = core.useMotionConfig(),
      animate = _useMotionConfig.animate;
  var _useScatterPlot = useScatterPlot({
    data: data,
    xScaleSpec: xScaleSpec,
    xFormat: xFormat,
    yScaleSpec: yScaleSpec,
    yFormat: yFormat,
    width: innerWidth,
    height: innerHeight,
    nodeSize: nodeSize,
    colors: colors
  }),
      xScale = _useScatterPlot.xScale,
      yScale = _useScatterPlot.yScale,
      nodes = _useScatterPlot.nodes,
      legendData = _useScatterPlot.legendData;
  var customLayerProps = React.useMemo(function () {
    return _objectSpread$3({}, props, {
      xScale: xScale,
      yScale: yScale,
      nodes: nodes,
      margin: margin,
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      outerWidth: outerWidth,
      outerHeight: outerHeight
    });
  }, [xScale, yScale, nodes, margin, innerWidth, innerHeight, outerWidth, outerHeight]);
  var Nodes = animate ? AnimatedNodes$1 : StaticNodes$1;
  var layerById = {
    grid: React__default.createElement(axes.Grid, {
      key: "grid",
      width: innerWidth,
      height: innerHeight,
      xScale: enableGridX ? xScale : null,
      yScale: enableGridY ? yScale : null
    }),
    axes: React__default.createElement(axes.Axes, {
      key: "axes",
      xScale: xScale,
      yScale: yScale,
      width: innerWidth,
      height: innerHeight,
      top: axisTop,
      right: axisRight,
      bottom: axisBottom,
      left: axisLeft
    }),
    nodes: React__default.createElement(Nodes, {
      key: 'nodes',
      nodes: nodes,
      renderNode: renderNode,
      isInteractive: isInteractive,
      onMouseEnter: onMouseEnter,
      onMouseMove: onMouseMove,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      tooltip: tooltip,
      blendMode: blendMode
    }),
    markers: React__default.createElement(core.CartesianMarkers, {
      key: "markers",
      markers: markers,
      width: innerWidth,
      height: innerHeight,
      xScale: xScale,
      yScale: yScale
    }),
    mesh: null,
    legends: legends$1.map(function (legend, i) {
      return React__default.createElement(legends.BoxLegendSvg, _extends({
        key: i
      }, legend, {
        containerWidth: innerWidth,
        containerHeight: innerHeight,
        data: legendData,
        theme: theme
      }));
    })
  };
  if (isInteractive === true && useMesh === true) {
    layerById.mesh = React__default.createElement(Mesh$1, {
      key: "mesh",
      nodes: nodes,
      width: innerWidth,
      height: innerHeight,
      onMouseEnter: onMouseEnter,
      onMouseMove: onMouseMove,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      tooltip: tooltip,
      debug: debugMesh
    });
  }
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin,
    theme: theme
  }, layers.map(function (layer, i) {
    if (layerById[layer] !== undefined) {
      return layerById[layer];
    }
    if (typeof layer === 'function') {
      return React__default.createElement(React.Fragment, {
        key: i
      }, React__default.createElement(layer, customLayerProps));
    }
    throw new Error("Unknown layer (".concat(layer, ")"));
  }));
};
ScatterPlot.propTypes = ScatterPlotPropTypes;
ScatterPlot.defaultProps = ScatterPlotDefaultProps;
var ScatterPlot$1 = React.memo(core.withContainer(ScatterPlot));

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var ResponsiveScatterPlot = function ResponsiveScatterPlot(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(ScatterPlot$1, _extends$1({
      width: width,
      height: height
    }, props));
  });
};

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$4(target, key, source[key]); }); } return target; }
function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var ScatterPlotCanvas = function ScatterPlotCanvas(props) {
  var data = props.data,
      xScaleSpec = props.xScale,
      xFormat = props.xFormat,
      yScaleSpec = props.yScale,
      yFormat = props.yFormat,
      width = props.width,
      height = props.height,
      partialMargin = props.margin,
      pixelRatio = props.pixelRatio,
      layers = props.layers,
      colors = props.colors,
      nodeSize = props.nodeSize,
      renderNode = props.renderNode,
      enableGridX = props.enableGridX,
      gridXValues = props.gridXValues,
      enableGridY = props.enableGridY,
      gridYValues = props.gridYValues,
      axisTop = props.axisTop,
      axisRight = props.axisRight,
      axisBottom = props.axisBottom,
      axisLeft = props.axisLeft,
      isInteractive = props.isInteractive,
      debugMesh = props.debugMesh,
      onMouseEnter = props.onMouseEnter,
      onMouseMove = props.onMouseMove,
      onMouseLeave = props.onMouseLeave,
      onClick = props.onClick,
      tooltip$1 = props.tooltip,
      legends$1 = props.legends;
  var canvasEl = React.useRef(null);
  var theme = core.useTheme();
  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentNode = _useState2[0],
      setCurrentNode = _useState2[1];
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useScatterPlot = useScatterPlot({
    data: data,
    xScaleSpec: xScaleSpec,
    xFormat: xFormat,
    yScaleSpec: yScaleSpec,
    yFormat: yFormat,
    width: innerWidth,
    height: innerHeight,
    nodeSize: nodeSize,
    colors: colors
  }),
      xScale = _useScatterPlot.xScale,
      yScale = _useScatterPlot.yScale,
      nodes = _useScatterPlot.nodes,
      legendData = _useScatterPlot.legendData;
  var _useVoronoiMesh = voronoi.useVoronoiMesh({
    points: nodes,
    width: innerWidth,
    height: innerHeight,
    debug: debugMesh
  }),
      delaunay = _useVoronoiMesh.delaunay,
      voronoi$1 = _useVoronoiMesh.voronoi;
  var customLayerProps = React.useMemo(function () {
    return _objectSpread$4({}, props, {
      xScale: xScale,
      yScale: yScale,
      nodes: nodes,
      margin: margin,
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      outerWidth: outerWidth,
      outerHeight: outerHeight
    });
  }, [xScale, yScale, nodes, margin, innerWidth, innerHeight, outerWidth, outerHeight]);
  React.useEffect(function () {
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    layers.forEach(function (layer) {
      if (layer === 'grid') {
        ctx.lineWidth = theme.grid.line.strokeWidth;
        ctx.strokeStyle = theme.grid.line.stroke;
        enableGridX && axes.renderGridLinesToCanvas(ctx, {
          width: innerWidth,
          height: innerHeight,
          scale: xScale,
          axis: 'x',
          values: gridXValues
        });
        enableGridY && axes.renderGridLinesToCanvas(ctx, {
          width: innerWidth,
          height: innerHeight,
          scale: yScale,
          axis: 'y',
          values: gridYValues
        });
      } else if (layer === 'axes') {
        axes.renderAxesToCanvas(ctx, {
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
      } else if (layer === 'nodes') {
        nodes.forEach(function (node) {
          renderNode(ctx, node);
        });
      } else if (layer === 'mesh') {
        if (debugMesh === true) {
          voronoi.renderVoronoiToCanvas(ctx, voronoi$1);
          if (currentNode) {
            voronoi.renderVoronoiCellToCanvas(ctx, voronoi$1, currentNode.index);
          }
        }
      } else if (layer === 'legends') {
        legends$1.forEach(function (legend) {
          legends.renderLegendToCanvas(ctx, _objectSpread$4({}, legend, {
            data: legendData,
            containerWidth: innerWidth,
            containerHeight: innerHeight,
            theme: theme
          }));
        });
      } else if (typeof layer === 'function') {
        layer(ctx, customLayerProps);
      } else {
        throw new Error("Invalid layer: ".concat(layer));
      }
    });
  }, [canvasEl, innerWidth, innerHeight, outerWidth, outerHeight, margin.top, margin.left, pixelRatio, renderNode, layers, customLayerProps, theme, xScale, yScale, nodes, enableGridX, enableGridY, axisTop, axisRight, axisBottom, axisLeft, legends$1, legendData, debugMesh, voronoi$1, currentNode]);
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var getNodeFromMouseEvent = React.useCallback(function (event) {
    var _getRelativeCursor = core.getRelativeCursor(canvasEl.current, event),
        _getRelativeCursor2 = _slicedToArray(_getRelativeCursor, 2),
        x = _getRelativeCursor2[0],
        y = _getRelativeCursor2[1];
    if (!core.isCursorInRect(margin.left, margin.top, innerWidth, innerHeight, x, y)) return null;
    var nodeIndex = delaunay.find(x - margin.left, y - margin.top);
    return nodes[nodeIndex];
  }, [canvasEl, margin, innerWidth, innerHeight, delaunay]);
  var handleMouseHover = React.useCallback(function (event) {
    var node = getNodeFromMouseEvent(event);
    setCurrentNode(node);
    if (node) {
      showTooltipFromEvent(React__default.createElement(tooltip$1, {
        node: node
      }), event);
      if (currentNode && currentNode.id !== node.id) {
        onMouseLeave && onMouseLeave(currentNode, event);
        onMouseEnter && onMouseEnter(node, event);
      }
      if (!currentNode) {
        onMouseEnter && onMouseEnter(node, event);
      }
      onMouseMove && onMouseMove(node, event);
    } else {
      hideTooltip();
      currentNode && onMouseLeave && onMouseLeave(currentNode, event);
    }
  }, [getNodeFromMouseEvent, currentNode, setCurrentNode, showTooltipFromEvent, hideTooltip, tooltip$1, onMouseEnter, onMouseMove, onMouseLeave]);
  var handleMouseLeave = React.useCallback(function (event) {
    hideTooltip();
    setCurrentNode(null);
    currentNode && onMouseLeave && onMouseLeave(currentNode, event);
  }, [hideTooltip, currentNode, setCurrentNode, onMouseLeave]);
  var handleClick = React.useCallback(function (event) {
    if (onClick) {
      var node = getNodeFromMouseEvent(event);
      node && onClick(node, event);
    }
  }, [getNodeFromMouseEvent, onClick]);
  return React__default.createElement("canvas", {
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
ScatterPlotCanvas.propTypes = ScatterPlotCanvasPropTypes;
ScatterPlotCanvas.defaultProps = _objectSpread$4({}, ScatterPlotCanvasDefaultProps, {
  renderNode: function renderNode(ctx, node) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = node.style.color;
    ctx.fill();
  }
});
var ScatterPlotCanvas$1 = React.memo(core.withContainer(ScatterPlotCanvas));

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var ResponsiveScatterPlotCanvas = function ResponsiveScatterPlotCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(ScatterPlotCanvas$1, _extends$2({
      width: width,
      height: height
    }, props));
  });
};

exports.NodePropType = NodePropType;
exports.ResponsiveScatterPlot = ResponsiveScatterPlot;
exports.ResponsiveScatterPlotCanvas = ResponsiveScatterPlotCanvas;
exports.ScatterPlot = ScatterPlot$1;
exports.ScatterPlotCanvas = ScatterPlotCanvas$1;
exports.ScatterPlotCanvasDefaultProps = ScatterPlotCanvasDefaultProps;
exports.ScatterPlotCanvasPropTypes = ScatterPlotCanvasPropTypes;
exports.ScatterPlotDefaultProps = ScatterPlotDefaultProps;
exports.ScatterPlotPropTypes = ScatterPlotPropTypes;
exports.useScatterPlot = useScatterPlot;
