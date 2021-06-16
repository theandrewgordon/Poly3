/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { assertParametersAreDefined } from '../tricore-util/tricore-util.js';

export const TriLocationDetailsBehavior = {

	properties : {
		/*
		 * If true, the application is running on a iOS device.
		 */
		_isIOS: {
			type: Boolean,
			value: function() {
				var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
				return iOS;
			}
		}
	},

	_locationBuilding: function(item) {
		if (item && item.typeENUS === "Building") {
			return item.name;
		} else if (item && (item.typeENUS === "Floor" || item.typeENUS === "Space")) {
			return item.parentBuilding;
		} else {
			return "";
		}
	},

	_locationFloor: function(item) {
		if (item && item.typeENUS === "Floor") {
			return item.name;
		} else if (item && item.typeENUS === "Space") {
			return item.parentFloor;
		} else {
			return "";
		}
	},

	_locationRoom: function(item) {
		if (item && item.typeENUS === "Space") {
			return item.name;
		} else {
			return "";
		}
	},

	_locationAlternative: function(item) {
		if (item && item.typeENUS !== "Building" && item.typeENUS !== "Floor" && item.typeENUS !== "Space") {
			return item.name;
		} else {
			return "";
		}
	},

	_computeDisableDirections: function(item) {
		if (!item) {
			return true;
		}
		if ((this._areCoordsValid(item.latitude, item.longitude) || item.address) ||
			(this._areBuildingCoordsValid(item) || item.buildingAddress)) {
			return false;
		}

		return true;
	},

	_areBuildingCoordsValid: function(location) {
		return this._areCoordsValid(location.buildingLatitude, location.buildingLongitude);
	},

	_areCoordsValid: function(latitude, longitude) {
		return latitude && latitude !== 0 && 
			longitude && longitude !== 0;
	},

	_setCurrentSelectedLocation: function(location) {
		var selectedLocation = {};
		if (this._areCoordsValid(location.latitude, location.longitude)) {
			selectedLocation.latitude  = location.latitude;
			selectedLocation.longitude = location.longitude; 
		} else if (this._areBuildingCoordsValid(location)) {
			selectedLocation.latitude  = location.buildingLatitude;
			selectedLocation.longitude = location.buildingLongitude; 
		} else {
			selectedLocation.address = location.address ? 
				encodeURI(location.address) :
				encodeURI(location.buildingAddress);
		}
		return selectedLocation;
	},

	_buildMapLink: function(location) {
		if (this._computeDisableDirections(location)) {
			return "";
		} else {
			var selectedLocation = this._setCurrentSelectedLocation(location);

			if (this._isIOS) {
				return this._buildAppleMapsUrl(selectedLocation);
			} else {
				return this._buildGoogleMapsUrl(selectedLocation);
			}
		}
	},

	_buildGoogleMapsUrl: function(selectedLocation) {
		var apiUrl = "https://www.google.com/maps/dir/?api=1";
		return this._buildMapsUrl(apiUrl, "destination", "travelmode=driving", selectedLocation);
	},

	_buildAppleMapsUrl: function(selectedLocation) {
		var apiUrl = "http://maps.apple.com/?";
		return this._buildMapsUrl(apiUrl, "daddr", "dirflg=d", selectedLocation);
	},

	_buildMapsUrl: function(apiUrl, destParam, travelMode, selectedLocation) {
		var url = [apiUrl];

		var destination = this._areCoordsValid(selectedLocation.latitude, selectedLocation.longitude) ?
			selectedLocation.latitude + "," + selectedLocation.longitude :
			selectedLocation.address;
		url.push(destParam + "=" + destination);
		url.push(travelMode);

		return url.join("&");
	},

	_disableLocationIcon: function(hasGraphic, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return !hasGraphic || !online;
	}
};