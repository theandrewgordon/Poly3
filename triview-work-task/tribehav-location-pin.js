/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { TriPlatGraphicUtilitiesBehavior } from "../triplat-graphic/triplat-graphic-utilities-behavior.js";
import { assertParametersAreDefined } from '../tricore-util/tricore-util.js';

export const TriLocationPinBehaviorImpl = {

	properties: {
		_hasGraphic: {
			type: Boolean,
			notify: true,
			value: false
		}
	},

	_disableLocationIcon: function(hasGraphic, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return !hasGraphic || !online;
	},

	_checkIfLocationHasGraphic: function(location) {
		if (!location) return;
		var recordId = "";
		if (location.typeENUS == "Floor") {
			recordId =  location.id || location._id;
		} else if (location.typeENUS == "Space") {
			recordId = location.parentFloorId;
		} else {
			this.set('_hasGraphic', false);
			return;
		}
		return this.getDrawingId(recordId).then(function(result) {
			this.set('_hasGraphic', (result) ? true: false);
		}.bind(this));
	}
};

export const TriLocationPinBehavior = [TriPlatGraphicUtilitiesBehavior, TriLocationPinBehaviorImpl];