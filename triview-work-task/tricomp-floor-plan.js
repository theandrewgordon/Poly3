/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-graphic/triplat-graphic.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-zoom-slider/triplat-zoom-slider.js";
import "./tristyles-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.floor-graphic-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 10px;
					min-height: 0;
				}

				.floor-graphic {
					@apply --layout-flex;
					@apply --layout-vertical;

					user-select: none;
					cursor: default;
					--triplat-graphic-highlight-1: {
						fill: #41D6C3;
						fill-opacity: .8;
					}
					--triplat-graphic-interactive-selectable: {
						cursor: pointer;
					}
					--triplat-graphic-selectable: {
						fill: white;
						fill-opacity: 1;
					}
					--triplat-graphic-interactive-selected: {
						stroke: var(--tri-primary-dark-color);
						stroke-width: 10px;
					}
				}
				
				.min-max-icon {
					position: absolute;
					right: 15px;
					bottom: 15px;
					padding: 5px;
					background-color: var(--ibm-neutral-2);
					opacity: 0.9;
					border: 1px solid var(--tri-body-background-color);
					color: var(--tri-primary-color);
					@apply --tricomp-floor-plan-expand-icon;
				}

				.graphic-footer-container {
					@apply --layout-vertical;
					position: absolute;
					right: 0;
					left: 0;
					bottom: 0;
					z-index:1;
					@apply --tricomp-floor-plan-footer-container;
				}

				.slider {
					@apply --layout-self-center;
					max-width: 280px;
					opacity: 0.9;
					background-color: var(--ibm-neutral-2);
					border: 1px solid var(--ibm-gray-10);
					margin-bottom: 10px;
				}

				:host([small-layout][_maximized]) .floor-graphic-container {
					@apply --layout-fit;
					background-color: white;
					z-index: 1;
				}

				.no-data-placeholder {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 10px;
					min-height: 0;
					text-align: center;
				}

				:host(:not([small-layout])) .no-data-placeholder {
					padding-top: 75px;
				}

				:host([small-layout]) .no-data-placeholder {
					padding-top: 50px;
				}
			
		</style>

		<template is="dom-if" if="[[online]]">
			<div class="floor-graphic-container" hidden\$="[[!location.hasGraphic]]">
				<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>

				<triplat-graphic id="floorplan" class="floor-graphic" drawing-id="[[location.drawingId]]" svg-loaded="{{_svgLoaded}}" loading="{{_loading}}">
					<triplat-graphic-highlight highlighted="[[_highlightSpace]]" slot="graphic-highlight"></triplat-graphic-highlight>
					<triplat-graphic-label id="graphicLabel" label-id="[[_computeGraphicLabelId(labelStyles)]]" slot="graphic-label"></triplat-graphic-label>
					<triplat-graphic-zoomable scale="{{_zoomScale}}" cached="" slot="graphic-zoomable"></triplat-graphic-zoomable>
					<triplat-graphic-pin icon="pin-room-function" pins="[[_computeGraphicPin(location, locationId)]]" record-id-attr-name="_id" slot="graphic-pin"></triplat-graphic-pin>
				</triplat-graphic>
				<div class="min-max-icon" hidden\$="[[!smallLayout]]">
					<paper-icon-button on-tap="_handleMinMaxIconTapped" icon="[[_computeMaximizeIcon(_maximized)]]"></paper-icon-button>
				</div>
				<div class="graphic-footer-container" hidden\$="{{smallLayout}}">
					<triplat-zoom-slider class="slider" min="0.01" max="1.5" step="0.1" value="{{_zoomScale}}"></triplat-zoom-slider>
				</div>
			</div>
			<div class="no-data-placeholder" hidden\$="[[location.hasGraphic]]">
				<div hidden\$="[[_loading]]">Floor plan not available.</div>
			</div>
		</template>
		<template is="dom-if" if="[[!online]]">
			<div class="no-data-placeholder">
				<div>Floor plan not available in offline mode.</div>
			</div>
		</template>
	`,

    is: "tricomp-floor-plan",

    behaviors: [
		IronResizableBehavior
	],

    properties: {

		location: {
			type: Object,
			value: function() {
				return {}
			}
		},

		locationId: {
			type: String
		},

		labelStyles: {
			type: Array,
			value: function() {
				return [];
			}
		},

		_maximized: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		opened: {
			type: Boolean
		},

		online: {
			type: Boolean,
			value: false
		},

		_svgLoaded: Boolean,
		_zoomScale: Number,
		_highlightSpace: Object,

		_loading: {
			type: Boolean
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		'_setHighlightSpace(locationId, location.typeENUS)',
		'_handleGraphicChange(opened, location.hasGraphic, _svgLoaded)',
		'_handleMaximizeChange(_maximized, opened, location.hasGraphic, _svgLoaded)'
	],

    _setHighlightSpace: function(locationId, type) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (locationId && type == "Space") {
			this.set('_highlightSpace', { _id: locationId });
		} else {
			this.set('_highlightSpace', { _id: "" });
		}
	},

    _handleGraphicChange: function (opened, hasGraphic, svgLoaded) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened && hasGraphic && svgLoaded) {
			this.$$("#floorplan").refreshViewBox();
		}
	},

    _handleMaximizeChange: function(maximized, opened, hasGraphic, svgLoaded) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened && hasGraphic && svgLoaded) {
			afterNextRender(this, function () {
				this.notifyResize();
			});
		}
	},

    _computeGraphicPin: function(location, locationId) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (locationId && location && location.typeENUS == "Space") {
			if (location._id == locationId)
				return location;
			else
				return { _id: locationId};
		}
	},

    _computeGraphicLabelId: function (labelStyles) {
		if (labelStyles && labelStyles.length > 0) {
			return labelStyles[0]._id;
		}
	},

    _handleMinMaxIconTapped: function() {
		this.set('_maximized', !this._maximized);
	},

    _computeMaximizeIcon: function(maximized){
		return maximized ? "ibm-glyphs:minimize" : "ibm-glyphs:maximize";
	},

});