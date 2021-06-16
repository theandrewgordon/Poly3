/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../../triplat-graphic/triplat-graphic.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-zoom-slider/triplat-zoom-slider.js";
import { assertParametersAreDefined } from "../../../tricore-util/tricore-util.js";
import { TrimixinService } from "../../services/trimixin-service.js";
import "../../styles/tristyles-carbon-theme.js";
import "./tricomp-floor-plan-legend.js";
import { isEmptyArray } from "../../utils/triutils-utilities.js";

class TricompFloorPlan extends mixinBehaviors([IronResizableBehavior], TrimixinService(PolymerElement)) {
	static get is() { return "tricomp-floor-plan"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.floor-graphic-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					position: relative;
					padding: 10px;
					min-height: 200px;
				}

				.floor-graphic {
					@apply --layout-flex;
					@apply --layout-vertical;
					min-height: 200px;

					user-select: none;
					cursor: default;
					--triplat-graphic-highlight-1: {
						fill: var(--carbon-inverse-support-04);
						fill-opacity: .8;
					};
					--triplat-graphic-highlight-2: {
						fill: var(--carbon-inverse-support-02);
						fill-opacity: .8;
					};
					--triplat-graphic-highlight-3: {
						fill: var(--carbon-inverse-support-01);
						fill-opacity: .8;
					};
					--triplat-graphic-interactive-selected: {
						stroke: var(--carbon-interactive-04);
						stroke-width: 5;
						cursor: pointer;
					};

					--triplat-graphic-selected: {
						fill-opacity: 1;
					}

					--triplat-graphic-interactive-selectable: {
						cursor: pointer;
					}
				}
				.legend {
					position: absolute;
					right: 0px;
					top: 10px;
					z-index: 2;
				}

				.min-max-icon {
					position: absolute;
					right: 0px;
					bottom: 0px;
					padding: 5px;
					background-color: var(--carbon-inverse-01);
					opacity: 0.9;
					border: 1px solid var(--carbon-ui-03);
					color: var(--carbon-interactive-01);
					z-index: 2;
				}

				.graphic-footer-container {
					@apply --layout-vertical;
					position: absolute;
					right: 30px;
					left: 30px;
					bottom: -10px;
					z-index:1;
				}

				.slider {
					@apply --layout-self-center;
					max-width: 280px;
					width: 280px;
					opacity: 0.9;
					background-color: var(--carbon-inverse-01);
					border: 1px solid var(--carbon-ui-03);
					margin-bottom: 10px;
					color: var(--carbon-interactive-01) !important;
					--tri-primary-color: var(--carbon-interactive-01);
					--tri-secondary-color: var(--carbon-interactive-02);
					--tri-primary-icon-button-color: var(--carbon-interactive-01);
				}

				:host([_maximized]) .floor-graphic-container {
					@apply --layout-fit;
					background-color: white;
					z-index: 1;
				}

				.no-data-placeholder {
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --layout-center;
					min-height: 0;
					text-align: center;
				}

				.no-data-placeholder > * {
					@apply --layout-flex;
				}
				
			</style>

			<dom-if if="[[location.hasGraphic]]">
				<template>
					<div class="floor-graphic-container">
						<triplat-graphic id="floorplan" class="floor-graphic" drawing-id="[[location.drawingId]]" svg-loaded="{{_svgLoaded}}" loading="{{_graphicLoading}}">
							<triplat-graphic-highlight class-number="1" highlighted="[[_highlightSpace]]" slot="graphic-highlight"></triplat-graphic-highlight>
							<triplat-graphic-highlight class-number="2" highlighted="[[_highlightAvailableSpaces]]" slot="graphic-highlight"></triplat-graphic-highlight>
							<triplat-graphic-highlight class-number="3" highlighted="[[_highlightUnavailableSpaces]]" slot="graphic-highlight"></triplat-graphic-highlight>
							<triplat-graphic-label label-id="[[_computeGraphicLabelId(labelStyles)]]" slot="graphic-label"></triplat-graphic-label>
							<triplat-graphic-zoomable scale="{{_zoomScale}}" cached slot="graphic-zoomable"></triplat-graphic-zoomable>
							<triplat-graphic-layer-manager turn-off="{{_layersToTurnOff}}" slot="graphic-layer-manager"></triplat-graphic-layer-manager>
							<triplat-graphic-selectable enabled="[[selectable]]" selectable="[[selectableRooms]]" selected="{{selected}}" slot="graphic-selectable"></triplat-graphic-selectable>
						</triplat-graphic>
						<dom-if if="[[showLegend]]">
							<template>
								<tricomp-floor-plan-legend class="legend"></tricomp-floor-plan-legend>
							</template>
						</dom-if>
						<div class="graphic-footer-container">
							<triplat-zoom-slider class="slider" min="0.01" max="1.5" step="0.1" value="{{_zoomScale}}"></triplat-zoom-slider>
						</div>
						<div class="min-max-icon">
							<paper-icon-button on-tap="_handleMinMaxIconTapped" icon="[[_computeMaximizeIcon(_maximized)]]"></paper-icon-button>
						</div>
					</div>
				</template>
			</dom-if>
			<dom-if if="[[_computeShowPlaceholder(location.hasGraphic, _graphicLoading, opened)]]">
				<template>
					<div class="no-data-placeholder">
						<div class="body-short-01">Floor plan not available.</div>
					</div>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			location: {
				type: Object,
				value() {
					return {}
				}
			},

			locationId: {
				type: String
			},

			labelStyles: {
				type: Array,
				value() {
					return [];
				}
			},

			availableRooms: {
				type: Array	
			},

			unavailableRooms: {
				type: Array	
			},

			addedRooms: {
				type: Array
			},

			selectableRooms: {
				type: Array
			},

			selectable: {
				type: Boolean
			},

			selected: {
				type: Object,
				notify: true,
				observer: '_handleSelectedChanged'
			},

			_maximized: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			opened: {
				type: Boolean
			},

			showLegend: {
				type: Boolean,
			},

			_svgLoaded: Boolean,
			_zoomScale: Number,
			_highlightSpace: Object,
			_highlightAvailableSpaces: Array,
			_highlightUnavailableSpaces: Array,

			_graphicLoading: {
				type: Boolean
			},

			_layersToTurnOff: {
				type: Array,
				value() {
					return ['NAME']
				}
			}
		}
	}

	static get observers() {
		return [
			'_handleLoadingChanged(_graphicLoading)',
			'_setHighlightSpace(locationId, location.typeENUS)',
			'_setHighlightAddedSpaces(addedRooms, location.typeENUS)',
			'_setHighlightAvailableSpaces(availableRooms, location.typeENUS)',
			'_setHighlightUnavailableSpaces(unavailableRooms, location.typeENUS)',
			'_handleGraphicChange(opened, location.hasGraphic, _svgLoaded)',
			'_handleMaximizeChange(_maximized, opened, location.hasGraphic, _svgLoaded)'
		];
	}

	_setHighlightSpace(locationId, type) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (locationId && type == "Space") {
			this.set('_highlightSpace', { _id: locationId });
		} else {
			this.set('_highlightSpace', { _id: "" });
		}
	}

	_setHighlightAddedSpaces(rooms, type) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (!isEmptyArray(rooms) && type === "Floor") {
			this.set('_highlightSpace', rooms);
		}
	}

	_setHighlightAvailableSpaces(rooms, type) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (rooms && rooms.length > 0 && type === "Floor") {
			this.set('_highlightAvailableSpaces', rooms);
		}
	}

	_setHighlightUnavailableSpaces(rooms, type) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (rooms && rooms.length > 0 && type === "Floor") {
			this.set('_highlightUnavailableSpaces', rooms);
		}
	}

	_handleGraphicChange(opened, hasGraphic, svgLoaded) {
		if (opened && hasGraphic && svgLoaded) {
			this.shadowRoot.querySelector("#floorplan").refreshViewBox();
		}
	}

	_handleMaximizeChange(maximized, opened, hasGraphic, svgLoaded) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (opened && hasGraphic && svgLoaded) {
			afterNextRender(this, function () {
				this.notifyResize();
			});
		}
	}

	_computeGraphicLabelId(labelStyles) {
		if (labelStyles && labelStyles.length > 0) {
			return labelStyles[0]._id;
		}
	}

	_handleMinMaxIconTapped() {
		this.set('_maximized', !this._maximized);
	}

	_computeMaximizeIcon(maximized){
		return maximized ? "ibm-glyphs:minimize" : "ibm-glyphs:maximize";
	}

	_handleSelectedChanged() {
		this.shadowRoot.querySelector("#floorplan").refreshViewBox();
	}

	_computeShowPlaceholder(hasGraphic, graphicLoading, opened) {
		return !hasGraphic && !graphicLoading && opened;
	}
};

window.customElements.define(TricompFloorPlan.is, TricompFloorPlan);