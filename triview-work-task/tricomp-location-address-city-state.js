/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<div hidden\$="[[!_displaySection(_address, _city, _state)]]">
			[[_address]]<span hidden\$="[[!_displayComma(_address, _city)]]">,</span>
			<span hidden\$="[[!_city]]">[[_city]]</span><span hidden\$="[[!_displayComma(_city, _state)]]">,</span>
			<span hidden\$="[[!_state]]">[[_state]]</span>
		</div>
	`,

    is: "tricomp-location-address-city-state",

    properties: {
		location: {
			type: Object
		},

		_address: {
			type: String,
			value: "",
			computed: "_computeValue(_location.address, _location.buildingAddress)"
		},

		_city: {
			type: String,
			value: "",
			computed: "_computeValue(_location.city, _location.buildingCity)"
		},

		_location: {
			type: Object,
			computed: "_computeLocation(location)"
		},

		_state: {
			type: String,
			value: "",
			computed: "_computeValue(_location.state, _location.buildingState)"
		}
	},

    _computeLocation: function(location) {
		if (!location) {
			return {
				address: "",
				city: "",
				state: "",
				buildingAddress: "",
				buildingCity: "",
				buildingState: ""
			}
		} else {
			return location;
		}
	},

    _computeValue: function(value, buildingValue) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return value ? value : buildingValue;
	},

    _displaySection: function(address, city, state) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (address && address != "") || (city && city != "") || (state && state != "");
	},

    _displayComma: function(value1, value2) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return value1 && value1 != "" && value2 && value2 != "";
	}
});