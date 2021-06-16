/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../triplat-graphic/triplat-graphic.js";
import "../triplat-graphic/triplat-graphic-selectable.js";
import "../triplat-graphic/triplat-graphic-zoomable.js";
import { TriplatHighlightLayers } from "../triplat-graphic/triplat-graphic-highlight.js";
import "../triplat-graphic/triplat-graphic-label.js";
import "../triplat-zoom-slider/triplat-zoom-slider.js";
import "././triservice-work-task.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				triplat-graphic {
					padding: 5px 15px 5px 15px;
					@apply --layout-vertical;
					@apply --layout-flex;
					user-select: none;
					cursor: default;
					--triplat-graphic-highlight-1: {
						fill: var(--tri-success-color);
						fill-opacity: 1;
					}
					--triplat-graphic-interactive-selectable: {
						cursor: pointer;
					}
					--triplat-graphic-selectable: {
						fill: white;
						fill-opacity: 1;
					}
					--triplat-graphic-interactive-selected: {
						stroke: var(--tri-primary-color);
						stroke-width: 10px;
					}
				}

				.slider-container {
					@apply --layout-vertical;
					@apply --layout-center;
				}

				.slider {
					max-width: 280px;
				}

				.instruction {
					padding:3px 15px 3px 15px;
				}
			
		</style>

		<triservice-work-task id="spaceLabelStylesService" space-label-styles="{{_spaceLabelStyles}}">
		</triservice-work-task>

		<div class="instruction">
			You can pan or zoom on the floor plan.
		</div>

		<triplat-graphic id="graphic" record-id="[[floorId]]" has-graphic="{{hasGraphic}}" svg-loaded="{{_svgLoaded}}" drawing-id-loading="{{_drawingIdLoading}}" svg-aria-label="[[svgAriaLabel]]">
			<triplat-graphic-zoomable scale="{{_zoomScale}}" cached="" slot="graphic-zoomable"></triplat-graphic-zoomable>
			<triplat-graphic-highlight highlighted="[[currentRoom]]" slot="graphic-highlight">
			</triplat-graphic-highlight>
			<triplat-graphic-selectable selectable="[[_selectableSpaces]]" selected="{{selectedSpace}}" slot="graphic-selectable">
			</triplat-graphic-selectable>
			<triplat-graphic-label id="graphicLabel" label-id="[[_computeLabelId(_spaceLabelStyles.*)]]" slot="graphic-label">
			</triplat-graphic-label>
		</triplat-graphic>
		<div class="slider-container">
			<triplat-zoom-slider class="slider" min="0.01" max="1.5" step="0.1" value="{{_zoomScale}}">
			</triplat-zoom-slider>
		</div>
	`,

    is: "tricomp-room-floorplan-selector",

    properties: {
		roomsList: {
			type: Array
		},

		floorId: {
			type: String
		},

		selectedSpace: {
			type: Object,
			notify: true
		},

		currentRoom: {
			type: Object
		},

		loading: {
			type: Boolean,
			notify: true,
			readOnly: true,
			value: false
		},

		hasGraphic: {
			type: Boolean,
			value: false,
			notify: true
		},

		svgAriaLabel: {
			type: String,
			value: ""
		},

		_selectableSpaces: {
			type: Array
		},

		_spaceLabelStyles: {
			type: Array
		},

		_drawingIdLoading: {
			type: Boolean,
			value: false
		},

		_svgLoaded: {
			type: Boolean,
			value: false
		},

		_zoomScale: {
			type: Number,
			value: 1.0
		}
	},

    observers: [
		"_computeLoading(_drawingIdLoading, _svgLoaded, hasGraphic)",
		"_computeSelectableSpaces(roomsList, currentRoom)"
	],

    _computeLabelId: function (change) {
		var labelId = null;
		if (change.base && change.base.length > 0) {
			return change.base[0]._id;
		}
		return labelId;
	},

    _computeLoading: function (drawingIdLoading, svgLoaded, hasGraphic) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this._setLoading(drawingIdLoading || (hasGraphic && !svgLoaded));
	},

    _computeSelectableSpaces: function(roomsList, currentRoom) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this._selectableSpaces = roomsList;
	}
});