/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-graphic/triplat-graphic.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-zoom-slider/triplat-zoom-slider.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import "./tristyles-locate-app.js";

Polymer({
    _template: html`
		<style include="shared-locate-app-styles shared-graphic-styles tristyles-theme">


				:host {
					@apply --layout-vertical;
					position: relative;
					height: 100%;
				}

				.floor-graphic-container {
					@apply --layout-flex;
					@apply --layout-relative;
					@apply --layout-vertical;
					margin: 5px;
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

				.page-main {
					@apply --layout-vertical;
					@apply --layout-flex;
					@apply --layout-center;
					background-color: var(--tri-primary-content-background-color);
					box-sizing: border-box; 
				}

				.page-wrap {
					@apply --layout-vertical;
					@apply --layout-flex;
					width: 100%;
				}

				:host(:not([small-screen-width])) .empty-placeholder {
					padding-top: 75px;
				}

				:host([small-screen-width]) .empty-placeholder {
					padding-top: 50px;
				}

				:host([small-screen-width][maximize]) {
					@apply --layout-fit;
					background-color: white;
					z-index: 1;
				}

			
		</style>

		<triplat-loading-indicator show="[[graphicLoading]]"></triplat-loading-indicator>
		<triplat-ds id="allSpaceLabelStyle" name="allSpaceLabelStyle" data="{{_spaceLabelStyles}}" force-server-filtering="" loading="{{_loadingGraphicLabels}}">
			<triplat-query>
				<triplat-query-filter name="ID" operator="equals" value="triSpaceClass002">
				</triplat-query-filter>
			</triplat-query>
		</triplat-ds>

		<div class="page-main">
			<div class="page-wrap">
				<div class="floor-graphic-container" hidden\$="[[!_hasGraphic]]">
					<triplat-graphic id="floorplan" class="floor-graphic" record-id="[[floorRecordId]]" has-graphic="{{_hasGraphic}}" svg-loaded="{{_svgLoaded}}">
						<triplat-graphic-highlight highlighted="[[_highlightSpace]]" slot="graphic-highlight"></triplat-graphic-highlight>
						<triplat-graphic-label id="graphicLabel" label-id="[[_computeLabelId(_spaceLabelStyles.*)]]" slot="graphic-label">
						</triplat-graphic-label>
						<triplat-graphic-zoomable scale="{{_zoomScale}}" cached="" slot="graphic-zoomable"></triplat-graphic-zoomable>
						<triplat-graphic-pin icon="[[pinName]]" pins="[[pinDetails]]" record-id-attr-name="spaceRecordId" slot="graphic-pin"></triplat-graphic-pin>
						<triplat-graphic-layer-manager turn-off="{{_layersToTurnOff}}" slot="graphic-layer-manager"></triplat-graphic-layer-manager>
					</triplat-graphic>
					<div class="min-max-icon" hidden\$="[[!smallScreenWidth]]">
						<paper-icon-button class="minMaxIcon" on-tap="_handleMinMaxIconTapped" icon="[[_computeMaximizeIcon(maximize)]]"></paper-icon-button>
					</div>
				</div>

				<div class="graphic-footer-container" hidden\$="{{_hideZoomSlider(_hasGraphic, smallScreenWidth)}}">
					<triplat-zoom-slider class="slider" min="0.01" max="1.5" step="0.1" value="{{_zoomScale}}">
					</triplat-zoom-slider>
				</div>
 
				<div class="page-main empty-placeholder" hidden\$="[[_hasGraphic]]">
					<div>Floor plan not available.</div>
				</div>

			</div>
		</div>
	`,

    is: "tripage-location",

    behaviors: [
		TriBlockViewResponsiveBehavior,
		IronResizableBehavior
	],

    properties: {
		floorRecordId: String,
		
		/* 
		 * Must contain spaceRecordId property
		 */
		pinDetails: Object,

		maximize: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},
		
		pinName: {
			type: String,
			value: "pin-person"
		},

		_hasGraphic: {
			type: Boolean,
			notify: true,
		},

		opened: {
			type: Boolean,
			value: false
		},

		_svgLoaded: {
			type: Boolean
		},

		_layersToTurnOff: {
			type: Array,
			value() {
				return ['NAME']
			}
		}
	},

    observers: [
		"_setHighlightSpace(pinDetails)",
		"_handleGraphicChange(opened, _hasGraphic, _svgLoaded)",
		"_handleMaximizeChange(maximize, opened, _hasGraphic, _svgLoaded)",
	],

    _setHighlightSpace: function(pinDetails){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (pinDetails) {
			this.set('_highlightSpace', { _id: pinDetails.spaceRecordId });
		} else {
			this.set('_highlightSpace', { _id: "" });
		}
	},

    _computeLabelId: function (change) {
		var labelId = null;
		if (change.base && change.base.length > 0) {
			return change.base[0]._id;
		}
		return labelId;
	},

    _hideZoomSlider: function(hasGraphic, smallScreenWidth){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !smallScreenWidth ? !hasGraphic : true;
	},

    _handleMinMaxIconTapped: function(){
		var isMaximize= !this.maximize;
		if(isMaximize){
			this.fire("maximize-location-floor-plan");
		}else {
			this.fire("minimize-location-floor-plan");
		}
	},

    _computeMaximizeIcon: function(maximize){
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return maximize ? "ibm-glyphs:minimize" : "ibm-glyphs:maximize";
	},

    _handleGraphicChange: function (opened, hasGraphic, svgLoaded) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened && hasGraphic && svgLoaded) {
			this.$.floorplan.refreshViewBox();
		}
	},

    _handleMaximizeChange: function(maximize, opened, hasGraphic, svgLoaded) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened && hasGraphic && svgLoaded) {
			afterNextRender(this, function () {
				this.notifyResize();
			});
		}
	}
});