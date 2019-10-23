'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var core = require('@nivo/core');
var colors = require('@nivo/colors');
var PropTypes = _interopDefault(require('prop-types'));
var get = _interopDefault(require('lodash/get'));
var isString = _interopDefault(require('lodash/isString'));
var isNumber = _interopDefault(require('lodash/isNumber'));
var d3Force = require('d3-force');
var reactMotion = require('react-motion');

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonPropTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired
  })).isRequired,
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['links', 'nodes']), PropTypes.func])).isRequired,
  linkDistance: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.number]).isRequired,
  repulsivity: PropTypes.number.isRequired,
  distanceMin: PropTypes.number.isRequired,
  distanceMax: PropTypes.number.isRequired,
  iterations: PropTypes.number.isRequired,
  nodeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  nodeBorderWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
  nodeBorderColor: colors.inheritedColorPropType.isRequired,
  linkThickness: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
  linkColor: colors.inheritedColorPropType.isRequired,
  isInteractive: PropTypes.bool.isRequired
};
var NetworkPropTypes = _objectSpread({}, commonPropTypes, core.motionPropTypes);
var NetworkCanvasPropTypes = _objectSpread({
  pixelRatio: PropTypes.number.isRequired
}, commonPropTypes);
var commonDefaultProps = {
  layers: ['links', 'nodes'],
  linkDistance: 30,
  repulsivity: 10,
  distanceMin: 1,
  distanceMax: Infinity,
  iterations: 90,
  nodeBorderWidth: 0,
  nodeBorderColor: {
    from: 'color'
  },
  linkThickness: 1,
  linkColor: {
    from: 'source.color'
  },
  isInteractive: true
};
var NetworkDefaultProps = _objectSpread({}, commonDefaultProps, {
  animate: true,
  motionStiffness: 90,
  motionDamping: 15
});
var NetworkCanvasDefaultProps = _objectSpread({}, commonDefaultProps, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } return target; }
function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var computeForces = function computeForces(_ref) {
  var linkDistance = _ref.linkDistance,
      repulsivity = _ref.repulsivity,
      distanceMin = _ref.distanceMin,
      distanceMax = _ref.distanceMax,
      center = _ref.center;
  var computedLinkDistance;
  if (typeof linkDistance === 'function') {
    computedLinkDistance = linkDistance;
  } else if (isNumber(linkDistance)) {
    computedLinkDistance = linkDistance;
  } else if (isString(linkDistance)) {
    computedLinkDistance = function computedLinkDistance(link) {
      return get(link, linkDistance);
    };
  }
  var linkForce = d3Force.forceLink().id(function (d) {
    return d.id;
  }).distance(computedLinkDistance);
  var chargeForce = d3Force.forceManyBody().strength(-repulsivity).distanceMin(distanceMin).distanceMax(distanceMax);
  var centerForce = d3Force.forceCenter(center[0], center[1]);
  return {
    link: linkForce,
    charge: chargeForce,
    center: centerForce
  };
};
var useNetwork = function useNetwork(_ref2) {
  var nodes = _ref2.nodes,
      links = _ref2.links,
      linkDistance = _ref2.linkDistance,
      repulsivity = _ref2.repulsivity,
      distanceMin = _ref2.distanceMin,
      distanceMax = _ref2.distanceMax,
      center = _ref2.center,
      iterations = _ref2.iterations;
  var _useState = React.useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      currentNodes = _useState2[0],
      setCurrentNodes = _useState2[1];
  var _useState3 = React.useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      currentLinks = _useState4[0],
      setCurrentLinks = _useState4[1];
  React.useEffect(function () {
    var forces = computeForces({
      linkDistance: linkDistance,
      repulsivity: repulsivity,
      distanceMin: distanceMin,
      distanceMax: distanceMax,
      center: center
    });
    var nodesCopy = nodes.map(function (node) {
      return _objectSpread$1({}, node);
    });
    var linksCopy = links.map(function (link) {
      return _objectSpread$1({
        id: "".concat(link.source, ".").concat(link.target)
      }, link);
    });
    var simulation = d3Force.forceSimulation(nodesCopy).force('link', forces.link.links(linksCopy)).force('charge', forces.charge).force('center', forces.center).stop();
    simulation.tick(iterations);
    setCurrentNodes(nodesCopy);
    setCurrentLinks(linksCopy.map(function (link) {
      link.previousSource = currentNodes.find(function (n) {
        return n.id === link.source.id;
      });
      link.previousTarget = currentNodes.find(function (n) {
        return n.id === link.target.id;
      });
      return link;
    }));
    return function () {
      simulation.stop();
    };
  }, [nodes, links, linkDistance, repulsivity, distanceMin, distanceMax, iterations, center[0], center[1]]);
  return [currentNodes, currentLinks];
};
var useNodeColor = function useNodeColor(color) {
  return React.useMemo(function () {
    if (typeof color === 'function') return color;
    return function () {
      return color;
    };
  }, [color]);
};
var useLinkThickness = function useLinkThickness(thickness) {
  return React.useMemo(function () {
    if (typeof thickness === 'function') return thickness;
    return function () {
      return thickness;
    };
  }, [thickness]);
};

var Node = function Node(_ref) {
  var x = _ref.x,
      y = _ref.y,
      radius = _ref.radius,
      color = _ref.color,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      _ref$scale = _ref.scale,
      scale = _ref$scale === void 0 ? 1 : _ref$scale;
  return React__default.createElement("circle", {
    transform: "translate(".concat(x, ",").concat(y, ") scale(").concat(scale, ")"),
    r: radius,
    fill: color,
    strokeWidth: borderWidth,
    stroke: borderColor
  });
};
Node.propTypes = {
  node: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  scale: PropTypes.number
};
var Node$1 = React.memo(Node);

var willEnter = function willEnter(_ref) {
  var style = _ref.style;
  return {
    x: style.x.val,
    y: style.y.val,
    radius: style.radius.val,
    scale: 0
  };
};
var willLeave = function willLeave(springConfig) {
  return function (_ref2) {
    var style = _ref2.style;
    return {
      x: style.x,
      y: style.y,
      radius: style.radius,
      scale: reactMotion.spring(0, springConfig)
    };
  };
};
var AnimatedNodes = function AnimatedNodes(_ref3) {
  var nodes = _ref3.nodes,
      color = _ref3.color,
      borderWidth = _ref3.borderWidth,
      borderColor = _ref3.borderColor;
  var _useMotionConfig = core.useMotionConfig(),
      springConfig = _useMotionConfig.springConfig;
  return React__default.createElement(reactMotion.TransitionMotion, {
    willEnter: willEnter,
    willLeave: willLeave(springConfig),
    styles: nodes.map(function (node) {
      return {
        key: node.id,
        data: node,
        style: {
          x: reactMotion.spring(node.x, springConfig),
          y: reactMotion.spring(node.y, springConfig),
          radius: reactMotion.spring(node.radius, springConfig),
          scale: reactMotion.spring(1, springConfig)
        }
      };
    })
  }, function (interpolatedStyles) {
    return React__default.createElement(React__default.Fragment, null, interpolatedStyles.map(function (_ref4) {
      var key = _ref4.key,
          style = _ref4.style,
          node = _ref4.data;
      return React__default.createElement(Node$1, {
        key: key,
        node: node,
        x: style.x,
        y: style.y,
        radius: Math.max(style.radius, 0),
        color: color(node),
        borderWidth: borderWidth,
        borderColor: borderColor(node),
        scale: Math.max(style.scale, 0)
      });
    }));
  });
};
AnimatedNodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  color: PropTypes.func.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.func.isRequired
};
var AnimatedNodes$1 = React.memo(AnimatedNodes);

var StaticNodes = function StaticNodes(_ref) {
  var nodes = _ref.nodes,
      color = _ref.color,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor;
  return nodes.map(function (node) {
    return React__default.createElement(Node$1, {
      key: node.id,
      node: node,
      x: node.x,
      y: node.y,
      radius: node.radius,
      color: color(node),
      borderWidth: borderWidth,
      borderColor: borderColor(node)
    });
  });
};
StaticNodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  color: PropTypes.func.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.func.isRequired
};
var StaticNodes$1 = React.memo(StaticNodes);

var Link = function Link(_ref) {
  var sourceX = _ref.sourceX,
      sourceY = _ref.sourceY,
      targetX = _ref.targetX,
      targetY = _ref.targetY,
      thickness = _ref.thickness,
      color = _ref.color;
  return React__default.createElement("line", {
    stroke: color,
    strokeWidth: thickness,
    strokeLinecap: "round",
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY
  });
};
Link.propTypes = {
  link: PropTypes.object.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  thickness: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};
var Link$1 = React.memo(Link);

var willEnter$1 = function willEnter(_ref) {
  var style = _ref.style,
      data = _ref.data;
  var sourceX = data.previousSource ? data.previousSource.x : style.sourceX.val;
  var sourceY = data.previousSource ? data.previousSource.y : style.sourceY.val;
  return {
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: sourceX,
    targetY: sourceY
  };
};
var AnimatedLinks = function AnimatedLinks(_ref2) {
  var links = _ref2.links,
      linkThickness = _ref2.linkThickness,
      linkColor = _ref2.linkColor;
  var _useMotionConfig = core.useMotionConfig(),
      springConfig = _useMotionConfig.springConfig;
  return React__default.createElement(reactMotion.TransitionMotion, {
    willEnter: willEnter$1,
    styles: links.map(function (link) {
      return {
        key: link.id,
        data: link,
        style: {
          sourceX: reactMotion.spring(link.source.x, springConfig),
          sourceY: reactMotion.spring(link.source.y, springConfig),
          targetX: reactMotion.spring(link.target.x, springConfig),
          targetY: reactMotion.spring(link.target.y, springConfig)
        }
      };
    })
  }, function (interpolatedStyles) {
    return React__default.createElement(React__default.Fragment, null, interpolatedStyles.map(function (_ref3) {
      var key = _ref3.key,
          style = _ref3.style,
          link = _ref3.data;
      return React__default.createElement(Link$1, {
        key: key,
        link: link,
        color: linkColor(link),
        thickness: linkThickness(link),
        sourceX: style.sourceX,
        sourceY: style.sourceY,
        targetX: style.targetX,
        targetY: style.targetY
      });
    }));
  });
};
AnimatedLinks.propTypes = {
  links: PropTypes.array.isRequired,
  linkThickness: PropTypes.func.isRequired,
  linkColor: PropTypes.func.isRequired
};
var AnimatedLinks$1 = React.memo(AnimatedLinks);

var StaticLinks = function StaticLinks(_ref) {
  var links = _ref.links,
      linkThickness = _ref.linkThickness,
      linkColor = _ref.linkColor;
  return links.map(function (link) {
    return React__default.createElement(Link$1, {
      key: link.id,
      link: link,
      color: linkColor(link),
      thickness: linkThickness(link),
      sourceX: link.source.x,
      sourceY: link.source.y,
      targetX: link.target.x,
      targetY: link.target.y
    });
  });
};
StaticLinks.propTypes = {
  links: PropTypes.array.isRequired,
  linkThickness: PropTypes.func.isRequired,
  linkColor: PropTypes.func.isRequired
};
var StaticLinks$1 = React.memo(StaticLinks);

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } return target; }
function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1(); }
function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$1(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
var Network = function Network(props) {
  var width = props.width,
      height = props.height,
      partialMargin = props.margin,
      rawNodes = props.nodes,
      rawLinks = props.links,
      linkDistance = props.linkDistance,
      repulsivity = props.repulsivity,
      distanceMin = props.distanceMin,
      distanceMax = props.distanceMax,
      iterations = props.iterations,
      layers = props.layers,
      nodeColor = props.nodeColor,
      nodeBorderWidth = props.nodeBorderWidth,
      nodeBorderColor = props.nodeBorderColor,
      linkThickness = props.linkThickness,
      linkColor = props.linkColor;
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useMotionConfig = core.useMotionConfig(),
      animate = _useMotionConfig.animate;
  var theme = core.useTheme();
  var getColor = useNodeColor(nodeColor);
  var getBorderColor = colors.useInheritedColor(nodeBorderColor, theme);
  var getLinkThickness = useLinkThickness(linkThickness);
  var getLinkColor = colors.useInheritedColor(linkColor, theme);
  var _useNetwork = useNetwork({
    nodes: rawNodes,
    links: rawLinks,
    linkDistance: linkDistance,
    repulsivity: repulsivity,
    distanceMin: distanceMin,
    distanceMax: distanceMax,
    iterations: iterations,
    center: [innerWidth / 2, innerHeight / 2]
  }),
      _useNetwork2 = _slicedToArray$1(_useNetwork, 2),
      nodes = _useNetwork2[0],
      links = _useNetwork2[1];
  var layerById = {
    links: React__default.createElement(animate === true ? AnimatedLinks$1 : StaticLinks$1, {
      key: 'links',
      links: links,
      linkThickness: getLinkThickness,
      linkColor: getLinkColor
    }),
    nodes: React__default.createElement(animate === true ? AnimatedNodes$1 : StaticNodes$1, {
      key: 'nodes',
      nodes: nodes,
      color: getColor,
      borderWidth: nodeBorderWidth,
      borderColor: getBorderColor
    })
  };
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin
  }, layers.map(function (layer, i) {
    if (typeof layer === 'function') {
      return React__default.createElement(React.Fragment, {
        key: i
      }, layer(_objectSpread$2({}, props, {
        innerWidth: innerWidth,
        innerHeight: innerHeight,
        nodes: nodes,
        links: links
      })));
    }
    return layerById[layer];
  }));
};
Network.propTypes = NetworkPropTypes;
Network.defaultProps = NetworkDefaultProps;
var Network$1 = core.withContainer(Network);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var ResponsiveNetwork = function ResponsiveNetwork(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(Network$1, _extends({
      width: width,
      height: height
    }, props));
  });
};

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } return target; }
function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray$2(arr, i) { return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _nonIterableRest$2(); }
function _nonIterableRest$2() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$2(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$2(arr) { if (Array.isArray(arr)) return arr; }
var NetworkCanvas = function NetworkCanvas(props) {
  var width = props.width,
      height = props.height,
      partialMargin = props.margin,
      pixelRatio = props.pixelRatio,
      rawNodes = props.nodes,
      rawLinks = props.links,
      linkDistance = props.linkDistance,
      repulsivity = props.repulsivity,
      distanceMin = props.distanceMin,
      distanceMax = props.distanceMax,
      iterations = props.iterations,
      layers = props.layers,
      nodeColor = props.nodeColor,
      nodeBorderWidth = props.nodeBorderWidth,
      nodeBorderColor = props.nodeBorderColor,
      linkThickness = props.linkThickness,
      linkColor = props.linkColor,
      isInteractive = props.isInteractive;
  var canvasEl = React.useRef(null);
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useNetwork = useNetwork({
    nodes: rawNodes,
    links: rawLinks,
    linkDistance: linkDistance,
    repulsivity: repulsivity,
    distanceMin: distanceMin,
    distanceMax: distanceMax,
    iterations: iterations,
    center: [innerWidth / 2, innerHeight / 2]
  }),
      _useNetwork2 = _slicedToArray$2(_useNetwork, 2),
      nodes = _useNetwork2[0],
      links = _useNetwork2[1];
  var theme = core.useTheme();
  var getNodeColor = useNodeColor(nodeColor);
  var getBorderColor = colors.useInheritedColor(nodeBorderColor, theme);
  var getLinkThickness = useLinkThickness(linkThickness);
  var getLinkColor = colors.useInheritedColor(linkColor, theme);
  React.useEffect(function () {
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    layers.forEach(function (layer) {
      if (layer === 'links') {
        links.forEach(function (link) {
          ctx.strokeStyle = getLinkColor(link);
          ctx.lineWidth = getLinkThickness(link);
          ctx.beginPath();
          ctx.moveTo(link.source.x, link.source.y);
          ctx.lineTo(link.target.x, link.target.y);
          ctx.stroke();
        });
      } else if (layer === 'nodes') {
        nodes.forEach(function (node) {
          ctx.fillStyle = getNodeColor(node);
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
          ctx.fill();
          if (nodeBorderWidth > 0) {
            ctx.strokeStyle = getBorderColor(node);
            ctx.lineWidth = nodeBorderWidth;
            ctx.stroke();
          }
        });
      } else if (typeof layer === 'function') {
        layer(ctx, _objectSpread$3({}, props, {
          nodes: nodes,
          links: links
        }));
      }
    });
  }, [canvasEl, outerWidth, outerHeight, layers, theme, nodes, links, getNodeColor, nodeBorderWidth, getBorderColor, getLinkThickness, getLinkColor]);
  return React__default.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight,
      cursor: isInteractive ? 'auto' : 'normal'
    }
  });
};
NetworkCanvas.propTypes = NetworkCanvasPropTypes;
NetworkCanvas.defaultProps = NetworkCanvasDefaultProps;
var NetworkCanvas$1 = core.withContainer(NetworkCanvas);

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var ResponsiveNetworkCanvas = function ResponsiveNetworkCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(NetworkCanvas$1, _extends$1({
      width: width,
      height: height
    }, props));
  });
};

exports.Network = Network$1;
exports.NetworkCanvas = NetworkCanvas$1;
exports.NetworkCanvasDefaultProps = NetworkCanvasDefaultProps;
exports.NetworkCanvasPropTypes = NetworkCanvasPropTypes;
exports.NetworkDefaultProps = NetworkDefaultProps;
exports.NetworkPropTypes = NetworkPropTypes;
exports.ResponsiveNetwork = ResponsiveNetwork;
exports.ResponsiveNetworkCanvas = ResponsiveNetworkCanvas;
exports.useLinkThickness = useLinkThickness;
exports.useNetwork = useNetwork;
exports.useNodeColor = useNodeColor;
