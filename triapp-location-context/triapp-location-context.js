/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-routing/triplat-routing.js";
import "../triplat-icon/ibm-icons.js";
import "../@polymer/paper-spinner/paper-spinner.js";
import "../@polymer/iron-localstorage/iron-localstorage.js";
import "../triplat-search-location/triplat-search-location.js";
import "./tricomp-location-context.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					display: block;
					@apply --layout-vertical;
					background-color: white;
				}

				.container {
					@apply --layout-horizontal;
					@apply --layout-flex;
					display: block;
				}

				.location-container {
					@apply --layout-vertical;
					@apply --layout-center-justified;

					font-size: 18px;
				}

				:host([regular-font-size]) .location-container {
					font-size: 14px;
				}

				.location {
					@apply --layout-horizontal;
					display: block;
				}

				.location-container[disabled] {
					display: none;
				}

				.location-container[disabled] > * {
					display: none;
				}

				.header {
					font-weight: lighter;
					padding-bottom: 5px;
				}

				.title {
					margin-bottom: 15px;
					font-size: 18px;
					font-weight: 300;
					color: var(--tri-primary-content-label-color);
				}

			
		</style>

		<iron-localstorage id="selectedBldgStorage" name="tridata-session" value="{{_tridataSession}}"></iron-localstorage>

		<triplat-ds id="currentUser" name="currentUser" data="{{currentUser}}"></triplat-ds>

		<triplat-ds id="buildingsForSearch" name="buildingsForSearchLocation" data="{{_buildingsForSearch}}" disable=""></triplat-ds>

		<triplat-ds id="lookupBuilding" name="lookupBuilding" data="{{_lookupBuilding}}">
			<triplat-ds-instance instance-id="[[_lookupBuildingId]]"></triplat-ds-instance>
		</triplat-ds>

		<triplat-ds id="primaryBuilding" name="parentBuilding" data="{{_primaryBuilding}}" disable="[[ignorePrimaryLocation]]">
			<triplat-ds-context name="currentUser" context-id="[[currentUser._id]]">
			</triplat-ds-context>
		</triplat-ds>

		<triplat-search-location id="searchLocation" locations="[[_buildingsForSearch]]" closest-location="{{_closestLocation}}" locations-within-threshold="{{withinThreshold}}" threshold="[[locationSearchThresholdDistance]]" disable="[[_computeGeoSearchDisable(_lookupBuildingId, _buildingIdFromLocalStorage, _buildingIdFromLocalStorageLoaded, disabled, _locationType)]]">
		</triplat-search-location>

		<div class="container">
			<div class="location-container" disabled\$="[[!locationSearching]]">
				<paper-spinner active=""></paper-spinner>
			</div>

			<div class="location-container" disabled\$="[[locationSearching]]">
				<template is="dom-if" if="[[label]]">
					<div class="header tri-h3">
						[[label]]
					</div>
				</template>
				<span class="title" hidden\$="[[hideMessage]]">[[_computeLocationMessage(_locationType)]]</span>
				
				<div class="location">
					<tricomp-location-context id="locationContext" search-title="[[searchTitle]]" search-placeholder="[[searchPlaceHolder]]" hide-message="[[!hideMessage]]" building="[[_lookupBuilding]]" image-height="[[imageHeight]]" image-width="[[imageWidth]]" on-select-building="_handleSelectBuilding" change-location-type="[[changeLocationType]]" regular-font-size="[[regularFontSize]]" no-image="[[noImage]]" disabled="[[disabled]]" no-popup="[[noPopup]]" scroller="[[scroller]]" search-value="[[searchValue]]" search-result="{{searchResult}}" loading="{{loading}}">
					</tricomp-location-context>
				</div>
			</div>
		</div>
	`,

    is: "triapp-location-context",
    behaviors: [TriPlatViewBehavior],

    properties: {
		label: String,
		searchTitle: String,
		searchPlaceHolder: String,
		overrideBuildingId: {
			type: Number,
			value: null,
			notify: true
		},
		_buildingIdFromLocalStorage: {
			type: Number,
			value: -1
		},
		_buildingIdFromLocalStorageLoaded: {
			type: Boolean,
			value: false
		},
		_tridataSession: {
			type: Object
		},
		_lookupBuildingId: {
			type: Number,
			value: -1
		},
		hideMessage: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},
		locationSearching: {
			type: Boolean,
			value: true
		},
		locationSearchError: {
			type: Boolean,
			value: null
		},
		locationSearchThresholdDistance: {
			type: Number,
			value: 100
		},
		imageHeight: {
			type: Number,
			value: 82
		},
		imageWidth: {
			type: Number,
			value: 82
		},
		
		changeLocationType: {
			type: String,
			value: "link" // value can be: link or icon
		},
		regularFontSize: {
			type: Boolean,
			value: false
		},
		noImage: {
			type: Boolean,
			value: false
		},

		disabled: {
			type: Boolean,
			value: false
		}, 

		refresh: {
			type: Boolean,
			observer: '_onRefresh'
		},

		_locationType: {
			type: String,
			value: null, //value can be: selected, primary, geo
		},

		_disableGeoLookup: {
			type: Boolean,
			value: true,
			computed: "_computeGeoSearchDisable(_lookupBuildingId, _buildingIdFromLocalStorage, _buildingIdFromLocalStorageLoaded, disabled, _locationType)"
		},

		// If true it will disable the search popup
		noPopup: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
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

		// If `true`, the component will ignore the local storage.
		ignoreLocalStorage: {
			type: Boolean,
			value: false
		},

		// If `true`, the component will ignore the user primary location.
		ignorePrimaryLocation: {
			type: Boolean,
			value: false
		}
	},

    observers: [
		"_onTridataSessionChanged(_tridataSession, ignoreLocalStorage)",
		"_handleClosestLocationChanged(_closestLocation)",
		"_handleUserBuilding(_primaryBuilding, locationSearchError, _closestLocation, _buildingIdFromLocalStorageLoaded, _buildingIdFromLocalStorage, _lookupBuildingId)",
		"_handleBuildingChange(_lookupBuilding)",
		"_handleBuildingForLookup(overrideBuildingId, _buildingIdFromLocalStorage)",
		"_setBuildingIdToStorage(_lookupBuilding, overrideBuildingId, _tridataSession, ignoreLocalStorage)",
		"_setLocationTypeToStorage(_locationType, _tridataSession, ignoreLocalStorage)"
	],

    listeners: {
		"triplat-geo-error": "_handleSearchLocationError",
		"triplat-geo-success": "_handleSearchLocationSuccess",
	},

    _onGeoLocationFound: function() {
		this.$.buildingsForSearch.disable = false;
	},

    _handleBuildingForLookup: function(overrideBuildingId, buildingIdFromLocalStorage) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (overrideBuildingId) {
			this.set("_lookupBuildingId", overrideBuildingId);
		} else if (buildingIdFromLocalStorage) {
			this.set("_lookupBuildingId", buildingIdFromLocalStorage);
		} else {
			this.set("_lookupBuildingId", -1);
		}
	},

    _computeGeoSearchDisable: function(lookupBuildingId, buildingIdFromLocalStorage, buildingIdFromLocalStorageLoaded, disabled, locationType) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		// Disable geo location search if:
		// 		- explicitly disabled in the component
		//		- location from session has not been loaded yet
		//		- there is already a valid location in session or for look up and it is not the user's primary location
		var disableSearch = disabled
							|| !buildingIdFromLocalStorageLoaded
							|| (buildingIdFromLocalStorage && buildingIdFromLocalStorage > 0 && locationType != "primary") 
							|| (lookupBuildingId && lookupBuildingId > 0 && locationType != "primary");

		if (disableSearch) {
			this.set("locationSearching", false);
		} else if (this.$.searchLocation.disable) {
			this.set("locationSearching", true);
		}

		return disableSearch;
	},

    _computeLocationMessage: function(locationType) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var __dictionary__usingPrimaryLocation = "We cannot detect your location. Using your primary location:";
		var __dictionary__usingGeoLocation = "We detected your location:";
		var __dictionary__noLocation = "We cannot detect your location. Select a location:";
		var __dictionary__selectedLocation = "Your selected location:";

		if (locationType) {
			if (locationType == "primary") {
				return __dictionary__usingPrimaryLocation;
			} else if (locationType == "geo") {
				return __dictionary__usingGeoLocation;
			} else if (locationType == "selected") {
				return __dictionary__selectedLocation;
			}
		} else {
			return __dictionary__noLocation;
		}
	},

    _handleSearchLocationError: function(e) {
		if (!this._disableGeoLookup) {
			this._setDoneSearching();
			this.set("locationSearchError", true);
		}
	},

    _handleSearchLocationSuccess: function(e) {
		this._onGeoLocationFound();
		this._setDoneSearching();

		// if this has already been set, don't unset it
		if (this.locationSearchError != true) {
			this.set("locationSearchError", false);
		}
	},

    _setDoneSearching: function() {
		this.set("locationSearching", false);
	},

    _handleBuildingChange: function(building) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.fire("location-changed", {building: building});
	},

    _handleUserBuilding: function(building, locationSearchError, closestLocation,
								  buildingIdFromLocalStorageLoaded, buildingIdFromLocalStorage, lookupBuildingId) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		// only set the user's primary building if:
		// 		- location from session has been loaded
		// 		- and there was no valid location in session or for lookup
		// 		- and there was a locationSearchError or no closest location found from geo lookup
		if (buildingIdFromLocalStorageLoaded 
			&& (!buildingIdFromLocalStorage || buildingIdFromLocalStorage < 1)
			&& (!lookupBuildingId || lookupBuildingId < 1)
			&& (locationSearchError || !closestLocation) && building && building._id) {
			this.set("_locationType", "primary");
			this._setBuilding(building);
		}
	},

    _handleClosestLocationChanged: function(location) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (location == null) {
			return;
		}

		// Detect location within the threshold ?
		if (this.withinThreshold.length > 0) {
			this.set("_locationType", "geo");
			this._setBuilding(location);
		} else {
			this.set("locationSearchError", true);
		}
	},

    _handleSelectBuilding: function(e) {
		if (e && e.detail.building) {
			this.set("overrideBuildingId", null);
			this.set("_locationType", "selected");
			this._setBuilding(e.detail.building);
		}
	},

    _setBuilding: function(building) {
		if (building) {
			var buildingId = building._id ? building._id : building.id;

			// react if it has changed...
			if (buildingId != this._lookupBuildingId) {
				this.set("_lookupBuildingId", buildingId);
				this.set("_buildingIdFromLocalStorage", buildingId);
			}
		} else {
			this.set("_lookupBuildingId", -1);
			this.set("_buildingIdFromLocalStorage", null);
		}
	},

    created: function() {
		if (!Boolean(this.modelAndView)) {
			this.set("modelAndView", "triAppLocationContext");
			this.set("instanceId", -1);
		}
	},

    _onRefresh: function() {
		if (this.refresh) {
			this.set("_buildingIdFromLocalStorageLoaded", false);
			this.set("_buildingIdFromLocalStorage", null);
			this.$.selectedBldgStorage.reload();
		}
	},

    _onTridataSessionChanged: function(tridataSession, ignoreLocalStorage) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (tridataSession) {
			if (tridataSession.locationContextSelectedBuildingId && !ignoreLocalStorage) {
				this.set("_buildingIdFromLocalStorage", tridataSession.locationContextSelectedBuildingId);
			} else {
				this.set("_buildingIdFromLocalStorage", null);
			}

			if (tridataSession.locationContextType && !ignoreLocalStorage) {
				this.set("_locationType", tridataSession.locationContextType);
			} else {
				this.set("_locationType", null);
			}
		} else {
			console.error("TRIRIGA data in session is now invalid.  Logout and log back in to the app.");
		}

		this.set("_buildingIdFromLocalStorageLoaded", true);
	},

    _setBuildingIdToStorage: function(building, overrideBuildingId, tridataSession, ignoreLocalStorage) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		//do not store in session the override building like (someone else or building pass from portal)
		if (!overrideBuildingId && building && building._id && !ignoreLocalStorage) {
			this.set("_tridataSession.locationContextSelectedBuildingId", building._id);
		}
	},

    _setLocationTypeToStorage: function(locationType, tridataSession, ignoreLocalStorage) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (locationType && !ignoreLocalStorage) {
			this.set("_tridataSession.locationContextType", locationType);
		}
	},

    reload: function() {
		this.set("overrideBuildingId", null);
		this.set("_locationType", "selected");
		this.set("_buildingIdFromLocalStorage", null);
		this.$.selectedBldgStorage.reload();
	},

    // Functions to allow enable and disable the building search DS
	enableSearchDs: function() {
		this.$.locationContext._enableDS();
	},

    disableSearchDs: function() {
		this.$.locationContext._disableDS();
	}
});