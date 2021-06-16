/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triblock-search-popup/triblock-image-info-card.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "./tristyles-work-task-app.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import "./tricomp-location-address-city-state.js";
import "./tricomp-location-map-link.js";
import "./tricomp-procedure-icon-count.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
					box-sizing: border-box;
					width: 100%;
				}

				.location-data {
					@apply --layout-horizontal;
					@apply --layout-top;
				}

				:host([small-layout]) .location-data {
					@apply --layout-center;
				}

				.location-details {
					min-width: 0;
				}
				
				:host([small-layout]) .location-details {
					@apply --layout-flex-10;
					min-width: 0;
				}

				.location-icons {
					@apply --layout-horizontal;
				}

				triblock-image-info-card {
					--triblock-image-info-card-image-container: {
						border-radius: 0;
					};

					--triblock-image-info-card-placeholder-icon: {
						height: 29px;
						width: 29px;
					};

					--triblock-image-info-card-detail-container: {
						padding-right: 0.5em;
					}
				}

				.location-icons .divider {
					height: 24px;
					margin: 8px 0;
				}

				.icons-divider {
					height: 25px;
					margin: 8px 10px;
					align-self: center;
					@apply --tricomp-location-detail-card-divider-icon-divider;
				}

				.map-center-align {
					@apply --layout-flex;
					@apply --layout-vertical;
					@apply --layout-center-justified;
				}
			
		</style>

		<triblock-image-info-card data="[[location]]" placeholder-icon="[[_computePlaceholderIcon(location)]]" cache-image="" thumbnail="" aria-label="Primary location">
			<div class="location-data">
				<div class="location-details">
					<template is="dom-if" if="[[location.isPrimary]]" restamp="">
						<label class="small">Primary location</label>
					</template>
					<div hidden\$="[[!_hideAlternativeLocation(_alternativeLocation)]]">
						<div>[[_locationBuilding(location)]]</div>
						<tricomp-location-address-city-state location="[[location]]" hidden\$="[[!showAddress]]"></tricomp-location-address-city-state>
						<div>
							<span hidden\$="[[!floor]]">[[_locationFloor(location)]]</span>
							<span hidden\$="[[!_locationRoom(location)]]"> |
								<b>[[_locationRoom(location)]]</b>
							</span>
						</div>
					</div>
					<div hidden\$="[[_hideAlternativeLocation(_alternativeLocation)]]">
						<div>[[_locationAlternative(location)]]</div>
						<tricomp-location-address-city-state location="[[location]]" hidden\$="[[!showAddress]]"></tricomp-location-address-city-state>
					</div>
				</div>
				<div class="divider icons-divider" hidden\$="[[smallLayout]]"></div>
				<div class="location-icons">
					<tricomp-procedure-icon-count task-id="[[taskId]]" hidden\$="[[hideProcedureCount]]" class="procedure-count" item="[[location]]"></tricomp-procedure-icon-count>
					<template is="dom-if" if="[[showPinIcon]]">
						<paper-icon-button primary="" icon="ibm-glyphs:location" disabled="[[_disableLocationIcon(location.hasGraphic, online)]]" alt="Open floor plan">
						</paper-icon-button>
					</template>
					<div class="divider" hidden\$="[[!_displayDivider(showPinIcon, showDirectionsIcon)]]"></div>
					<div class="map-center-align">
						<template is="dom-if" if="[[showDirectionsIcon]]">
							<tricomp-location-map-link location="[[location]]" map-link="[[mapLink]]"></tricomp-location-map-link>
						</template>
					</div>
				</div>
			</div>
		</triblock-image-info-card>
	`,

    is: "tricomp-location-detail-card",

    behaviors: [
		TriLocationDetailsBehavior
	],

    properties: {
		location: {
			type: Object,
			value: function () {
				return {
					picture: ""
				};
			}
		},

		mapLink: {
			type: String,
			value: ""
		},

		online: {
			type: Boolean
		},

		showAddress: {
			type: Boolean,
			value: false
		},

		showPinIcon: {
			type: Boolean,
			value: false
		},

		showDirectionsIcon: {
			type: Boolean,
			value: false
		},

		_alternativeLocation: {
			type: String,
			value: "",
			computed: "_computeAlternativeLocation(location)"
		},

		hideProcedureCount: {
			type: Boolean,
			value: false
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    _hideAlternativeLocation: function (location) {
		return !location || location == "";
	},

    _computeAlternativeLocation: function (location) {
		var location = this._locationAlternative(location);
		return (location && location != "") ? location : "";
	},

    _computePlaceholderIcon: function (location) {
		return (location && location.typeENUS == "Building") ? "ibm:buildings" : "ibm-glyphs:room-function";
	},

    _displayDivider: function (showPinIcon, showDirectionsIcon) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return showPinIcon && showDirectionsIcon;
	}
});