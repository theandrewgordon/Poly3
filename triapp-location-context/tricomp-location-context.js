/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-image/triplat-image.js";
import "../triblock-search-popup/triblock-search-popup.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-button/paper-button.js";
import "./tricomp-location-card.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">


				:host {
					flex: 1;
				}
				
				:host([small-screen]) .location-image {
					margin-right: 12px;
				}
				
				:host([medium-screen-width]) .search-icon {
					padding: 4px 2px 4px 2px;
					min-width: 30px;
				}

				.location-container {
					@apply --layout-horizontal;
					@apply --layout-justified;
					@apply --layout-center;
				}

				.image-info {
					@apply --layout-horizontal;
					@apply --layout-start;
				}

				.location-info {
					@apply --layout-vertical;
					@apply --layout-justified;
					@apply --layout-self-stretch;
					@apply --layout-start;
					padding-right: 5px;
					color: var(--tri-primary-color-100);
				}
				.location-info-center {
					@apply --layout-center-justified;
				}

				.building {
					font-size: 22px;
				}
				:host([small-screen-width]) .building {
					font-size: 18px;
				}

				.regular-building {
					font-size: 14px;
					font-weight: bold;
				}

				.location-image {
					margin-right: 20px;
					--triplat-image-placeholder-icon: {
						height: 64px;
						width: 64px;
					};
				}

				.change-location {
					background-color: transparent !important;
					color: var(--tri-primary-color) !important;
					font-size: 14px;
					margin: 0 !important;
					padding: 0 !important;
				}

				paper-icon-button {
					margin-top: 15px;
					padding: 4px 4px 4px 11px;
					height: 32px;
					width: 43px;
				}

				.search-icon {
					border-left: 1px solid var(--ibm-gray-10);
				}

			
		</style>

		<triplat-ds id="lookupBuildingSearch" name="lookupBuilding" filtered-data="{{searchResult}}" loading="{{_lookupBuildingLoading}}" disable="">
			<triplat-query>
				<triplat-query-scroll-page scroller="[[_scroller]]" size="50" disable-auto-fetch=""></triplat-query-scroll-page>
				<triplat-query-filter name="building" operator="contains" value="{{_searchValue}}"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="city" operator="contains" value="{{_searchValue}}"></triplat-query-filter>
				<triplat-query-sort name="building"></triplat-query-sort>
				<triplat-query-sort name="city"></triplat-query-sort>
			</triplat-query>
		</triplat-ds>

		<div id="locationContainer" class="location-container" on-tap="_changeLocation">
			<div class="image-info">
				<triplat-image class="location-image" src="[[building.picture]]" width="[[imageWidth]]" height="[[imageHeight]]" sizing="cover" placeholder-icon="ibm:buildings" hidden="[[noImage]]" thumbnail="" role="img" aria-label="Building"></triplat-image>

				<div class\$="[[_computeLocationInfoClass(changeLocationType)]]">
					<tricomp-alert-message warning="" hidden\$="[[_hideNoLocationMessage(hideMessage, building)]]">
						<div>[[_noLocationDetectedErrorMessage]]</div>
					</tricomp-alert-message>
					
					<div>
						<div class\$="[[_computeBuildingClass(regularFontSize)]]">{{_computeBuildingName(building.building)}}</div>
						<div class="city">
							{{building.city}}<template is="dom-if" if="{{building.stateProvince}}">, </template>{{building.stateProvince}}<template is="dom-if" if="{{building.country}}">, </template>{{building.country}}
						</div>
					</div>
					<paper-button id="changeLocationLink" hidden\$="[[!_isLinkType(changeLocationType, disabled)]]" class="tri-link change-location" aria-label="Change location">Change location</paper-button>
				</div>
			</div>
			<paper-icon-button id="changeLocationIcon" hidden\$="[[!_isIconType(changeLocationType, disabled)]]" icon="ibm-glyphs:search" class="search-icon" primary="" on-tap="_changeLocation" role="button" alt="Search locations"></paper-icon-button>
		</div>
		
		<!-- Use \`dom-if\` to avoid the popup when \`noPopup\` is set to true -->
		<template is="dom-if" if="[[!noPopup]]">
			<triblock-search-popup id="searchBuildingPopup" title="[[searchTitle]]" placeholder="[[searchPlaceholder]]" scroller="{{_scroller}}" search-value="{{_searchValue}}" search-result="[[searchResult]]" loading="[[_lookupBuildingLoading]]" on-iron-overlay-opened="_enableDS" on-iron-overlay-closed="_disableDS" on-search-item-selected="_buildingSelected" row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
				<template>
					<tricomp-location-card data="[[item]]" search-value="[[_searchValue]]"></tricomp-location-card>
				</template>
			</triblock-search-popup>
		</template>
	`,

    is: "tricomp-location-context",
    behaviors: [TriBlockViewResponsiveBehavior],

    properties: {
		searchTitle: String,
		searchPlaceholder: String,
		building: {
			type: Object
		},
		// link vs icon
		changeLocationType: {
			type: String,
			value: "link"
		},
		showClear: {
			type: Boolean,
			value: false
		},
		imageHeight: {
			type: Number,
			value: 82
		},
		imageWidth: {
			type: Number,
			value: 82
		},
		regularFontSize: {
			type: Boolean,
			value: false
		},
		hideMessage: Boolean,
		_noLocationDetectedErrorMessage: {
			type: String,
			value: function(){
				var __dictionary__noLocationMessage = "We cannot detect your location. Select a location:";
				return __dictionary__noLocationMessage;
			}
		},
		noImage: {
			type: Boolean,
			value: false
		},

		disabled: {
			type: Boolean,
			value: false
		},

		// If true it will disable the search popup
		noPopup: {
			type: Boolean,
			value: false
		},

		// Scroller object to allow the scroll pagination in the building search
		scroller: {
			type: Object
		},

		// Search string for the building search
		searchValue: {
			type: String
		},

		// Search results from the building search
		searchResult: {
			type: Array,
			notify: true
		},

		// Loading from the building search
		loading: {
			type: Boolean,
			value: false,
			notify: true
		},

		_computeRowAriaLabelCallback: {
			type: Function,
			value: function() {
				return this._computeRowAriaLabel.bind(this);
			}
		}
	},

    observers: [
		"_observeScroller(scroller)",
		"_observeSearchValue(searchValue)",
		"_observeLoading(_lookupBuildingLoading)"
	],

    _changeLocation: function() {
		if (!this.disabled) {
			// When `noPopup` is true fire an event instead of open the popup
			if (!this.noPopup) {
				this.$$("#searchBuildingPopup").open();
			} else {
				this.fire("open-search-without-popup");
			}
		}
	},

    _computeBuildingName: function(bldgName) {
		return bldgName;
	},

    _enableDS: function() {
		this.$.lookupBuildingSearch.disable = false;
	},

    _disableDS: function() {
		this.$.lookupBuildingSearch.disable = true;
	},

    _buildingSelected: function(e) {
		var emptyObj = {id: "", value:""};
		var newBuilding = e.detail;
		var oldBuilding = (this.building) ? this.building : emptyObj;

		// Check if the new building is not equal to old building
		if (newBuilding._id != oldBuilding._id) {
			var finalBuilding = {
				id: newBuilding._id,
				value: newBuilding.building
			};

			this.fire("select-building", {building: finalBuilding});
		}
	},

    _isLinkType: function(type, disabled) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !disabled && type == "link";
	},

    _isIconType: function(type, disabled) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !disabled && type == "icon";
	},

    _computeLocationInfoClass: function(changeLocationType) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (changeLocationType === "icon") ? "location-info location-info-center" : "location-info";
	},

    _computeBuildingClass: function(regularFontSize) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !regularFontSize ? "building" : "regular-building";
	},

    _hideNoLocationMessage: function(hideMessage, building) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return hideMessage
				|| (Boolean(building) && building._id);
	},

    // Observers to support `noPopup`
	// In this case data will come and go to an external component
	_observeScroller: function(scroller) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (this.noPopup) {
			this.set("_scroller", scroller);
		}
	},

    _observeSearchValue: function(searchValue) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (this.noPopup) {
			this.set("_searchValue", searchValue);
		}
	},

    _observeLoading: function(loading) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (this.noPopup) {
			this.set("loading", loading);
		}
	},

    _computeRowAriaLabel: function(item) {
		var __dictionary__taskRowAriaLabel1 = "This building is named";
		return __dictionary__taskRowAriaLabel1 + " " + item.building;
	}
});