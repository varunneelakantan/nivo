'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactMotion = require('react-motion');
var pick = _interopDefault(require('lodash/pick'));
var core = require('@nivo/core');
var colors = require('@nivo/colors');
var d3Hierarchy = require('d3-hierarchy');
var compose = _interopDefault(require('recompose/compose'));
var defaultProps = _interopDefault(require('recompose/defaultProps'));
var withPropsOnChange = _interopDefault(require('recompose/withPropsOnChange'));
var withStateHandlers = _interopDefault(require('recompose/withStateHandlers'));
var pure = _interopDefault(require('recompose/pure'));
var PropTypes = _interopDefault(require('prop-types'));
var tooltip = require('@nivo/tooltip');

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var computeNodePath = function computeNodePath(node, getIdentity) {
  return node.ancestors().map(function (ancestor) {
    return getIdentity(ancestor.data);
  }).join('.');
};
var computeNodes = function computeNodes(_ref) {
  var root = _ref.root,
      pack = _ref.pack,
      leavesOnly = _ref.leavesOnly,
      getIdentity = _ref.getIdentity,
      getColor = _ref.getColor;
  root.each(function (node) {
    node.id = getIdentity(node.data);
    node.path = computeNodePath(node, getIdentity);
  });
  pack(root);
  var nodes = leavesOnly ? root.leaves() : root.descendants();
  nodes = nodes.map(function (node) {
    node.color = getColor(_objectSpread({}, node.data, {
      depth: node.depth
    }));
    node.label = false;
    return node;
  });
  return nodes;
};
var computeZoom = function computeZoom(nodes, currentNodePath, width, height) {
  var currentNode = nodes.find(function (_ref2) {
    var path = _ref2.path;
    return path === currentNodePath;
  });
  if (!currentNode) return nodes;
  var ratio = Math.min(width, height) / (currentNode.r * 2);
  var offsetX = width / 2 - currentNode.x * ratio;
  var offsetY = height / 2 - currentNode.y * ratio;
  return nodes.map(function (node) {
    return _objectSpread({}, node, {
      r: node.r * ratio,
      x: node.x * ratio + offsetX,
      y: node.y * ratio + offsetY
    });
  });
};

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } return target; }
function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var BubbleNode = function BubbleNode(_ref) {
  var node = _ref.node,
      style = _ref.style,
      handlers = _ref.handlers,
      theme = _ref.theme;
  if (style.r <= 0) return null;
  return React__default.createElement("g", {
    transform: "translate(".concat(style.x, ",").concat(style.y, ")")
  }, React__default.createElement("circle", _extends({
    r: style.r
  }, handlers, {
    fill: style.fill ? style.fill : style.color,
    stroke: style.borderColor,
    strokeWidth: style.borderWidth
  })), node.label !== false && React__default.createElement("text", {
    textAnchor: "middle",
    dominantBaseline: "central",
    style: _objectSpread$1({}, theme.labels.text, {
      fill: style.labelTextColor,
      pointerEvents: 'none'
    })
  }, node.label));
};
BubbleNode.propTypes = {
  node: PropTypes.object.isRequired,
  style: PropTypes.shape({
    r: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    fill: PropTypes.string,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired,
    labelTextColor: PropTypes.string.isRequired
  }).isRequired,
  handlers: PropTypes.object.isRequired,
  theme: core.themePropType.isRequired
};

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var BubbleHtmlNode = function BubbleHtmlNode(_ref) {
  var node = _ref.node,
      style = _ref.style,
      handlers = _ref.handlers;
  if (style.r <= 0) return null;
  return React__default.createElement("div", _extends$1({
    id: (node.data && node.data.id ? node.data.id :
    node.id).replace(/[^\w]/gi, '-'),
    style: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: style.color,
      color: style.labelTextColor,
      borderWidth: style.borderWidth,
      borderColor: style.borderColor,
      top: style.y - style.r,
      left: style.x - style.r,
      width: style.r * 2,
      height: style.r * 2,
      borderStyle: 'solid',
      borderRadius: style.r
    }
  }, handlers), node.label !== false && node.label);
};
BubbleHtmlNode.propTypes = {
  node: PropTypes.object.isRequired,
  style: PropTypes.shape({
    r: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    fill: PropTypes.string,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired,
    labelTextColor: PropTypes.string.isRequired
  }).isRequired,
  handlers: PropTypes.object.isRequired
};

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } return target; }
function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonPropTypes = {
  identity: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  colors: colors.ordinalColorsPropType.isRequired,
  colorBy: colors.colorPropertyAccessorPropType.isRequired,
  leavesOnly: PropTypes.bool.isRequired,
  padding: PropTypes.number.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: colors.inheritedColorPropType.isRequired,
  enableLabel: PropTypes.bool.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  labelFormat: PropTypes.string,
  labelTextColor: colors.inheritedColorPropType.isRequired,
  labelSkipRadius: PropTypes.number.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isZoomable: PropTypes.bool.isRequired,
  tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  tooltip: PropTypes.func
};
var BubblePropTypes = _objectSpread$2({}, commonPropTypes, {
  nodeComponent: PropTypes.func.isRequired
}, core.defsPropTypes);
var BubbleHtmlPropTypes = _objectSpread$2({}, commonPropTypes, {
  nodeComponent: PropTypes.func.isRequired
});
var BubbleCanvasPropTypes = _objectSpread$2({}, commonPropTypes, {
  pixelRatio: PropTypes.number.isRequired
});
var commonDefaultProps = {
  identity: 'id',
  leavesOnly: false,
  padding: 1,
  colors: {
    scheme: 'nivo'
  },
  colorBy: 'depth',
  borderWidth: 0,
  borderColor: {
    from: 'color'
  },
  enableLabel: true,
  label: 'id',
  labelTextColor: {
    from: 'color',
    modifiers: [['darker', 1]]
  },
  labelSkipRadius: 8,
  isInteractive: true,
  onClick: core.noop,
  isZoomable: true
};
var BubbleDefaultProps = _objectSpread$2({}, commonDefaultProps, {
  nodeComponent: BubbleNode,
  defs: [],
  fill: []
});
var BubbleHtmlDefaultProps = _objectSpread$2({}, commonDefaultProps, {
  nodeComponent: BubbleHtmlNode
});
var BubbleCanvasDefaultProps = _objectSpread$2({}, commonDefaultProps, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});

var props = /*#__PURE__*/Object.freeze({
    BubblePropTypes: BubblePropTypes,
    BubbleHtmlPropTypes: BubbleHtmlPropTypes,
    BubbleCanvasPropTypes: BubbleCanvasPropTypes,
    BubbleDefaultProps: BubbleDefaultProps,
    BubbleHtmlDefaultProps: BubbleHtmlDefaultProps,
    BubbleCanvasDefaultProps: BubbleCanvasDefaultProps
});

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } return target; }
function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonEnhancers = [core.withHierarchy(), core.withDimensions(), core.withTheme(), withPropsOnChange(['colors', 'colorBy'], function (_ref) {
  var colors$1 = _ref.colors,
      colorBy = _ref.colorBy;
  return {
    getColor: colors.getOrdinalColorScale(colors$1, colorBy)
  };
}), withPropsOnChange(['width', 'height', 'padding'], function (_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      padding = _ref2.padding;
  return {
    pack: d3Hierarchy.pack().size([width, height]).padding(padding)
  };
}), withPropsOnChange(['identity'], function (_ref3) {
  var identity = _ref3.identity;
  return {
    getIdentity: core.getAccessorFor(identity)
  };
}),
withPropsOnChange(['borderColor', 'theme'], function (_ref4) {
  var borderColor = _ref4.borderColor,
      theme = _ref4.theme;
  return {
    getBorderColor: colors.getInheritedColorGenerator(borderColor, theme)
  };
}),
withPropsOnChange(['label', 'labelFormat'], function (_ref5) {
  var label = _ref5.label,
      labelFormat = _ref5.labelFormat;
  return {
    getLabel: core.getLabelGenerator(label, labelFormat)
  };
}), withPropsOnChange(['labelTextColor', 'theme'], function (_ref6) {
  var labelTextColor = _ref6.labelTextColor,
      theme = _ref6.theme;
  return {
    getLabelTextColor: colors.getInheritedColorGenerator(labelTextColor, theme)
  };
}),
withStateHandlers(function (_ref7) {
  var _ref7$currentNodePath = _ref7.currentNodePath,
      currentNodePath = _ref7$currentNodePath === void 0 ? null : _ref7$currentNodePath;
  return {
    currentNodePath: currentNodePath
  };
}, {
  zoomToNode: function zoomToNode(_ref8) {
    var currentNodePath = _ref8.currentNodePath;
    return function (path) {
      if (path === currentNodePath) return {
        currentNodePath: null
      };
      return {
        currentNodePath: path
      };
    };
  }
}), withPropsOnChange(['root', 'pack', 'leavesOnly', 'getIdentity', 'getColor'], function (_ref9) {
  var root = _ref9.root,
      pack = _ref9.pack,
      leavesOnly = _ref9.leavesOnly,
      getIdentity = _ref9.getIdentity,
      getColor = _ref9.getColor;
  var nodes = computeNodes({
    root: root,
    pack: pack,
    leavesOnly: leavesOnly,
    getIdentity: getIdentity,
    getColor: getColor
  });
  return {
    nodes: nodes
  };
}), withPropsOnChange(['enableLabel', 'nodes', 'getLabel', 'labelSkipRadius'], function (_ref10) {
  var enableLabel = _ref10.enableLabel,
      nodes = _ref10.nodes,
      getLabel = _ref10.getLabel,
      labelSkipRadius = _ref10.labelSkipRadius;
  if (!enableLabel) return;
  var nodesWithLabel = nodes.map(function (node) {
    if (node.height !== 0 || labelSkipRadius > 0 && node.r < labelSkipRadius) return node;
    return _objectSpread$3({}, node, {
      label: getLabel(node)
    });
  });
  return {
    nodes: nodesWithLabel
  };
}), withPropsOnChange(['nodes', 'isZoomable', 'currentNodePath'], function (_ref11) {
  var nodes = _ref11.nodes,
      isZoomable = _ref11.isZoomable,
      currentNodePath = _ref11.currentNodePath,
      width = _ref11.width,
      height = _ref11.height;
  if (currentNodePath && isZoomable) {
    return {
      nodes: computeZoom(nodes, currentNodePath, width, height)
    };
  }
})];
var svgEnhancers = [withPropsOnChange(['nodes', 'defs', 'fill'], function (_ref12) {
  var nodes = _ref12.nodes,
      defs = _ref12.defs,
      fill = _ref12.fill;
  return {
    defs: core.bindDefs(defs, nodes, fill, {
      targetKey: 'fill'
    })
  };
})];
var enhance = (function (Component) {
  var implPropTypes = props["".concat(Component.displayName, "PropTypes")];
  var implDefaultProps = props["".concat(Component.displayName, "DefaultProps")];
  Component.propTypes = implPropTypes;
  switch (Component.displayName) {
    case 'Bubble':
      return compose.apply(void 0, [defaultProps(implDefaultProps)].concat(commonEnhancers, svgEnhancers, [core.withMotion(), pure]))(Component);
    case 'BubbleHtml':
      return compose.apply(void 0, [defaultProps(implDefaultProps)].concat(commonEnhancers, [core.withMotion(), pure]))(Component);
    case 'BubbleCanvas':
      return compose.apply(void 0, [defaultProps(implDefaultProps)].concat(commonEnhancers, [pure]))(Component);
  }
  return Component;
});

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$4(target, key, source[key]); }); } return target; }
function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var nodeWillEnter = function nodeWillEnter(_ref) {
  var data = _ref.data;
  return _objectSpread$4({
    scale: 0,
    r: 0,
    x: data.x,
    y: data.y
  }, colors.interpolateColor(data.color));
};
var nodeWillLeave = function nodeWillLeave(springConfig) {
  return function (_ref2) {
    var data = _ref2.data;
    return _objectSpread$4({
      scale: reactMotion.spring(0, springConfig),
      r: reactMotion.spring(0, springConfig),
      x: reactMotion.spring(data.x, springConfig),
      y: reactMotion.spring(data.y, springConfig)
    }, colors.interpolateColor(data.color, springConfig));
  };
};

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$5(target, key, source[key]); }); } return target; }
function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var getNodeHandlers = function getNodeHandlers(node, _ref) {
  var isInteractive = _ref.isInteractive,
      onClick = _ref.onClick,
      showTooltip = _ref.showTooltip,
      hideTooltip = _ref.hideTooltip,
      isZoomable = _ref.isZoomable,
      zoomToNode = _ref.zoomToNode,
      theme = _ref.theme,
      tooltipFormat = _ref.tooltipFormat,
      tooltip$1 = _ref.tooltip;
  if (!isInteractive) return {};
  var handleTooltip = function handleTooltip(e) {
    showTooltip(React__default.createElement(tooltip.BasicTooltip, {
      id: node.id,
      value: node.value,
      enableChip: true,
      color: node.color,
      theme: theme,
      format: tooltipFormat,
      renderContent: typeof tooltip$1 === 'function' ? tooltip$1.bind(null, _objectSpread$5({
        node: node
      }, node)) : null
    }), e);
  };
  var clickHandler = onClick;
  if (isZoomable) {
    clickHandler = function clickHandler(event) {
      onClick(node, event);
      zoomToNode(node.path);
    };
  } else {
    clickHandler = function clickHandler(event) {
      onClick(node, event);
    };
  }
  return {
    onMouseEnter: handleTooltip,
    onMouseMove: handleTooltip,
    onMouseLeave: hideTooltip,
    onClick: clickHandler
  };
};

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$6(target, key, source[key]); }); } return target; }
function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var Bubble = function Bubble(_ref) {
  var nodes = _ref.nodes,
      nodeComponent = _ref.nodeComponent,
      margin = _ref.margin,
      outerWidth = _ref.outerWidth,
      outerHeight = _ref.outerHeight,
      theme = _ref.theme,
      borderWidth = _ref.borderWidth,
      getBorderColor = _ref.getBorderColor,
      defs = _ref.defs,
      getLabelTextColor = _ref.getLabelTextColor,
      animate = _ref.animate,
      motionStiffness = _ref.motionStiffness,
      motionDamping = _ref.motionDamping,
      isInteractive = _ref.isInteractive,
      onClick = _ref.onClick,
      tooltipFormat = _ref.tooltipFormat,
      tooltip = _ref.tooltip,
      isZoomable = _ref.isZoomable,
      zoomToNode = _ref.zoomToNode;
  var springConfig = {
    stiffness: motionStiffness,
    damping: motionDamping
  };
  var getHandlers = function getHandlers(node, showTooltip, hideTooltip) {
    return getNodeHandlers(node, {
      isInteractive: isInteractive,
      onClick: onClick,
      showTooltip: showTooltip,
      hideTooltip: hideTooltip,
      isZoomable: isZoomable,
      zoomToNode: zoomToNode,
      theme: theme,
      tooltipFormat: tooltipFormat,
      tooltip: tooltip
    });
  };
  return React__default.createElement(core.Container, {
    isInteractive: isInteractive,
    theme: theme,
    animate: animate,
    motionStiffness: motionStiffness,
    motionDamping: motionDamping
  }, function (_ref2) {
    var showTooltip = _ref2.showTooltip,
        hideTooltip = _ref2.hideTooltip;
    return React__default.createElement(core.SvgWrapper, {
      width: outerWidth,
      height: outerHeight,
      margin: margin,
      defs: defs,
      theme: theme
    }, !animate && React__default.createElement("g", null, nodes.map(function (node) {
      return React__default.createElement(nodeComponent, {
        key: node.path,
        node: node,
        style: _objectSpread$6({}, pick(node, ['scale', 'r', 'x', 'y', 'color']), {
          fill: node.fill,
          borderWidth: borderWidth,
          borderColor: getBorderColor(node),
          labelTextColor: getLabelTextColor(node)
        }),
        handlers: getHandlers(node, showTooltip, hideTooltip),
        theme: theme
      });
    })), animate && React__default.createElement(reactMotion.TransitionMotion, {
      willEnter: nodeWillEnter,
      willLeave: nodeWillLeave(springConfig),
      styles: nodes.map(function (node) {
        return {
          key: node.path,
          data: node,
          style: _objectSpread$6({
            scale: reactMotion.spring(1, springConfig),
            r: reactMotion.spring(node.r, springConfig),
            x: reactMotion.spring(node.x, springConfig),
            y: reactMotion.spring(node.y, springConfig),
            opacity: reactMotion.spring(1, springConfig)
          }, colors.interpolateColor(node.color, springConfig))
        };
      })
    }, function (interpolatedStyles) {
      return React__default.createElement("g", null, interpolatedStyles.map(function (_ref3) {
        var style = _ref3.style,
            node = _ref3.data;
        style.color = colors.getInterpolatedColor(style);
        return React__default.createElement(nodeComponent, {
          key: node.path,
          node: node,
          style: _objectSpread$6({}, style, {
            fill: node.fill,
            borderWidth: borderWidth,
            borderColor: getBorderColor(style),
            labelTextColor: getLabelTextColor(style)
          }),
          handlers: getHandlers(node, showTooltip, hideTooltip),
          theme: theme
        });
      }));
    }));
  });
};
Bubble.displayName = 'Bubble';
var enhancedBubble = enhance(Bubble);
enhancedBubble.displayName = 'Bubble';

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var ResponsiveBubble = function ResponsiveBubble(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(enhancedBubble, _extends$2({
      width: width,
      height: height
    }, props));
  });
};

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$7(target, key, source[key]); }); } return target; }
function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var BubbleHtml = function BubbleHtml(_ref) {
  var nodes = _ref.nodes,
      nodeComponent = _ref.nodeComponent,
      margin = _ref.margin,
      outerWidth = _ref.outerWidth,
      outerHeight = _ref.outerHeight,
      theme = _ref.theme,
      borderWidth = _ref.borderWidth,
      getBorderColor = _ref.getBorderColor,
      getLabelTextColor = _ref.getLabelTextColor,
      animate = _ref.animate,
      motionStiffness = _ref.motionStiffness,
      motionDamping = _ref.motionDamping,
      isInteractive = _ref.isInteractive,
      onClick = _ref.onClick,
      isZoomable = _ref.isZoomable,
      zoomToNode = _ref.zoomToNode,
      tooltipFormat = _ref.tooltipFormat,
      tooltip = _ref.tooltip;
  var springConfig = {
    stiffness: motionStiffness,
    damping: motionDamping
  };
  var getHandlers = function getHandlers(node, showTooltip, hideTooltip) {
    return getNodeHandlers(node, {
      isInteractive: isInteractive,
      onClick: onClick,
      showTooltip: showTooltip,
      hideTooltip: hideTooltip,
      isZoomable: isZoomable,
      zoomToNode: zoomToNode,
      theme: theme,
      tooltipFormat: tooltipFormat,
      tooltip: tooltip
    });
  };
  return React__default.createElement(core.Container, {
    isInteractive: isInteractive,
    theme: theme,
    animate: animate,
    motionStiffness: motionStiffness,
    motionDamping: motionDamping
  }, function (_ref2) {
    var showTooltip = _ref2.showTooltip,
        hideTooltip = _ref2.hideTooltip;
    return React__default.createElement("div", {
      style: {
        position: 'relative',
        width: outerWidth,
        height: outerHeight
      }
    }, !animate && React__default.createElement("div", {
      style: {
        position: 'absolute',
        top: margin.top,
        left: margin.left
      }
    }, nodes.map(function (node) {
      return React__default.createElement(nodeComponent, {
        key: node.path,
        node: node,
        style: _objectSpread$7({}, pick(node, ['scale', 'r', 'x', 'y', 'color']), {
          borderWidth: borderWidth,
          borderColor: getBorderColor(node),
          labelTextColor: getLabelTextColor(node)
        }),
        handlers: getHandlers(node, showTooltip, hideTooltip)
      });
    })), animate && React__default.createElement(reactMotion.TransitionMotion, {
      willEnter: nodeWillEnter,
      willLeave: nodeWillLeave(springConfig),
      styles: nodes.map(function (node) {
        return {
          key: node.path,
          data: node,
          style: _objectSpread$7({
            scale: reactMotion.spring(1, springConfig),
            r: reactMotion.spring(node.r, springConfig),
            x: reactMotion.spring(node.x, springConfig),
            y: reactMotion.spring(node.y, springConfig),
            opacity: reactMotion.spring(1, springConfig)
          }, colors.interpolateColor(node.color, springConfig))
        };
      })
    }, function (interpolatedStyles) {
      return React__default.createElement("div", {
        style: {
          position: 'absolute',
          top: margin.top,
          left: margin.left
        }
      }, interpolatedStyles.map(function (_ref3) {
        var style = _ref3.style,
            node = _ref3.data;
        style.color = colors.getInterpolatedColor(style);
        return React__default.createElement(nodeComponent, {
          key: node.path,
          node: node,
          style: _objectSpread$7({}, style, {
            borderWidth: borderWidth,
            borderColor: getBorderColor(style),
            labelTextColor: getLabelTextColor(style)
          }),
          handlers: getHandlers(node, showTooltip, hideTooltip)
        });
      }));
    }));
  });
};
BubbleHtml.displayName = 'BubbleHtml';
var enhancedBubbleHtml = enhance(BubbleHtml);
enhancedBubbleHtml.displayName = 'BubbleHtml';

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
var ResponsiveBubbleHtml = function ResponsiveBubbleHtml(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(enhancedBubbleHtml, _extends$3({
      width: width,
      height: height
    }, props));
  });
};

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var BubbleCanvas =
function (_Component) {
  _inherits(BubbleCanvas, _Component);
  function BubbleCanvas() {
    _classCallCheck(this, BubbleCanvas);
    return _possibleConstructorReturn(this, _getPrototypeOf(BubbleCanvas).apply(this, arguments));
  }
  _createClass(BubbleCanvas, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.ctx = this.surface.getContext('2d');
      this.draw(this.props);
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
      var _this = this;
      var nodes = props.nodes,
          pixelRatio = props.pixelRatio,
          margin = props.margin,
          outerWidth = props.outerWidth,
          outerHeight = props.outerHeight,
          theme = props.theme,
          borderWidth = props.borderWidth,
          getBorderColor = props.getBorderColor,
          enableLabel = props.enableLabel,
          getLabel = props.getLabel,
          labelSkipRadius = props.labelSkipRadius,
          getLabelTextColor = props.getLabelTextColor;
      this.surface.width = outerWidth * pixelRatio;
      this.surface.height = outerHeight * pixelRatio;
      this.ctx.scale(pixelRatio, pixelRatio);
      this.ctx.fillStyle = theme.background;
      this.ctx.fillRect(0, 0, outerWidth, outerHeight);
      this.ctx.translate(margin.left, margin.top);
      nodes.forEach(function (node) {
        _this.ctx.save();
        if (borderWidth > 0) {
          _this.ctx.strokeStyle = getBorderColor(node);
          _this.ctx.lineWidth = borderWidth;
        }
        _this.ctx.beginPath();
        _this.ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
        _this.ctx.fillStyle = node.color;
        _this.ctx.fill();
        if (borderWidth > 0) {
          _this.ctx.stroke();
        }
      });
      if (enableLabel) {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = "".concat(theme.labels.text.fontSize, "px ").concat(theme.labels.text.fontFamily);
        nodes.filter(function (_ref) {
          var r = _ref.r;
          return r > labelSkipRadius;
        }).forEach(function (node) {
          var label = getLabel(node);
          var labelTextColor = getLabelTextColor(node);
          _this.ctx.fillStyle = labelTextColor;
          _this.ctx.fillText(label, node.x, node.y);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
          outerWidth = _this$props.outerWidth,
          outerHeight = _this$props.outerHeight,
          pixelRatio = _this$props.pixelRatio,
          isInteractive = _this$props.isInteractive,
          theme = _this$props.theme;
      return React__default.createElement(core.Container, {
        isInteractive: isInteractive,
        theme: theme,
        animate: false
      }, function () {
        return React__default.createElement("canvas", {
          ref: function ref(surface) {
            _this2.surface = surface;
          },
          width: outerWidth * pixelRatio,
          height: outerHeight * pixelRatio,
          style: {
            width: outerWidth,
            height: outerHeight
          }
        });
      });
    }
  }]);
  return BubbleCanvas;
}(React.Component);
BubbleCanvas.displayName = 'BubbleCanvas';
var enhancedBubbleCanvas = enhance(BubbleCanvas);
enhancedBubbleCanvas.displayName = 'BubbleCanvas';

function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
var ResponsiveBubbleCanvas = function ResponsiveBubbleCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(enhancedBubbleCanvas, _extends$4({
      width: width,
      height: height
    }, props));
  });
};

exports.Bubble = enhancedBubble;
exports.BubbleCanvas = enhancedBubbleCanvas;
exports.BubbleCanvasDefaultProps = BubbleCanvasDefaultProps;
exports.BubbleCanvasPropTypes = BubbleCanvasPropTypes;
exports.BubbleDefaultProps = BubbleDefaultProps;
exports.BubbleHtml = enhancedBubbleHtml;
exports.BubbleHtmlDefaultProps = BubbleHtmlDefaultProps;
exports.BubbleHtmlPropTypes = BubbleHtmlPropTypes;
exports.BubblePropTypes = BubblePropTypes;
exports.ResponsiveBubble = ResponsiveBubble;
exports.ResponsiveBubbleCanvas = ResponsiveBubbleCanvas;
exports.ResponsiveBubbleHtml = ResponsiveBubbleHtml;
