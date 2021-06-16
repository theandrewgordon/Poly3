/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import { TriPlatGraphicUtilitiesBehavior } from "../triplat-graphic/triplat-graphic-utilities-behavior.js";

export const TriLocationDetailsBehaviorImpl = {
    properties: {
		roomRecordId: String,
		floorRecordId: String,
		buildingRecordId: String,
		personRecordId: String,
		pinDetails: Object,

		_hasGraphic: {
			type: Boolean
		},
		
		_locationRouteParams: {
			type: Object
		},

		_keyRoomsRouteParams: {
			type: Object
		},

		_minimizedRouteParams: {
			type: Object,
			value: function() {
				return { maximize: "min" };
			}
		},

		_showKeyRoomTab: {
			type: Boolean,
			value: false
		},

		_showFloorDirectoryTab: {
			type: Boolean,
			value: false
		},

		_keyRooms: Array,
		_floorDirectory: Array,
		_floorDirectoryCount: Number,
		_locationRouteActive: Boolean,
		_keyRoomsRouteActive: Boolean,
		_floorDirectoryRouteActive: Boolean

	},

    observers: [
		'_observeFloorRecordId(floorRecordId)',
		'_keyRoomsChanged(_keyRooms, _hasGraphic)',
		'_floorDirectoryChanged(_floorDirectoryCount)'
	],

	ready: function() {
		this.hasGraphic(this.floorRecordId).then((success) => {
			this.set("_hasGraphic", success);
		})
	},

    _observeFloorRecordId: function(floor) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (floor && floor !== "") {
			this.$.floorDirectory.disable = false;
			this.$.floorDirectoryCount.disable = false;
		} else if (!floor || floor === "") {
			this.$.floorDirectory.disable = true;
			this.$.floorDirectoryCount.disable = true;
		}
	},

    _keyRoomsChanged: function(keyRooms, hasGraphic) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		// Key Rooms tab should be hidden when there's no graphic
		this._showKeyRoomTab = keyRooms && keyRooms.length > 0 && hasGraphic ? true : false;
	},

    _floorDirectoryChanged: function(floorDirectoryCount) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this._showFloorDirectoryTab = floorDirectoryCount > 0 ? true : false;
	},

    _computeMaximizeFloorPlan: function (maximize) {
		return maximize == "max"
	},

    importMeta: getModuleUrl("triview-locate/tribehav-location-details.js")
};

export const TriLocationDetailsBehavior = [ TriLocationDetailsBehaviorImpl, TriBlockViewResponsiveBehavior, TriPlatGraphicUtilitiesBehavior ];