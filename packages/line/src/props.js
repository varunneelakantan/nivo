/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import PropTypes from 'prop-types'
import { lineCurvePropType, blendModePropType, motionPropTypes } from '@nivo/core'
import { ordinalColorsPropType } from '@nivo/colors'
import { axisPropType } from '@nivo/axes'
import { scalePropType } from '@nivo/scales'
import { LegendPropShape } from '@nivo/legends'
import { crosshairPropTypes } from '@nivo/tooltip'
import PointTooltip from './PointTooltip'
import SliceTooltip from './SliceTooltip'

const commonPropTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.oneOfType([
                        PropTypes.number,
                        PropTypes.string,
                        PropTypes.instanceOf(Date),
                    ]),
                    y: PropTypes.oneOfType([
                        PropTypes.number,
                        PropTypes.string,
                        PropTypes.instanceOf(Date),
                    ]),
                })
            ).isRequired,
        })
    ).isRequired,

    xScale: scalePropType.isRequired,
    xFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    yScale: scalePropType.isRequired,
    yFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

    layers: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.oneOf([
                'grid',
                'markers',
                'axes',
                'areas',
                'crosshair',
                'lines',
                'slices',
                'points',
                'mesh',
                'legends',
            ]),
            PropTypes.func,
        ])
    ).isRequired,

    curve: lineCurvePropType.isRequired,

    axisTop: axisPropType,
    axisRight: axisPropType,
    axisBottom: axisPropType,
    axisLeft: axisPropType,

    enableGridX: PropTypes.bool.isRequired,
    enableGridY: PropTypes.bool.isRequired,
    gridXValues: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
        ),
    ]),
    gridYValues: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
        ),
    ]),

    enablePoints: PropTypes.bool.isRequired,
    pointSymbol: PropTypes.func,
    pointSize: PropTypes.number.isRequired,
    pointColor: PropTypes.any.isRequired,
    pointBorderWidth: PropTypes.number.isRequired,
    pointBorderColor: PropTypes.any.isRequired,

    markers: PropTypes.arrayOf(
        PropTypes.shape({
            axis: PropTypes.oneOf(['x', 'y']).isRequired,
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            style: PropTypes.object,
        })
    ),

    colors: ordinalColorsPropType.isRequired,

    enableArea: PropTypes.bool.isRequired,
    areaOpacity: PropTypes.number.isRequired,
    areaBlendMode: blendModePropType.isRequired,
    areaBaselineValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.instanceOf(Date),
    ]).isRequired,
    lineWidth: PropTypes.number.isRequired,
    defs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
        })
    ).isRequired,

    legends: PropTypes.arrayOf(PropTypes.shape(LegendPropShape)).isRequired,
    scrollableLegend: PropTypes.bool,
    isInteractive: PropTypes.bool.isRequired,
    debugMesh: PropTypes.bool.isRequired,

    tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

    enableSlices: PropTypes.oneOf(['x', 'y', false]).isRequired,
    debugSlices: PropTypes.bool.isRequired,
    sliceTooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,

    enableCrosshair: PropTypes.bool.isRequired,
    crosshairType: crosshairPropTypes.type.isRequired,
}

export const LinePropTypes = {
    ...commonPropTypes,
    enablePointLabel: PropTypes.bool.isRequired,
    useMesh: PropTypes.bool.isRequired,
    ...motionPropTypes,
}

export const LineCanvasPropTypes = {
    pixelRatio: PropTypes.number.isRequired,
    ...commonPropTypes,
}

const commonDefaultProps = {
    curve: 'linear',

    xScale: {
        type: 'point',
    },
    yScale: {
        type: 'linear',
        min: 0,
        max: 'auto',
    },

    layers: [
        'grid',
        'markers',
        'axes',
        'areas',
        'crosshair',
        'lines',
        'points',
        'slices',
        'mesh',
        'legends',
    ],
    axisBottom: {},
    axisLeft: {},
    enableGridX: true,
    enableGridY: true,

    enablePoints: true,
    pointSize: 6,
    pointColor: { from: 'color' },
    pointBorderWidth: 0,
    pointBorderColor: { theme: 'background' },

    colors: { scheme: 'nivo' },
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
    sliceTooltip: SliceTooltip,
    debugMesh: false,
    enableCrosshair: true,
    crosshairType: 'bottom-left',
}

export const LineDefaultProps = {
    ...commonDefaultProps,
    enablePointLabel: false,
    useMesh: false,
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
}

export const LineCanvasDefaultProps = {
    ...commonDefaultProps,
    pixelRatio:
        global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1,
}
