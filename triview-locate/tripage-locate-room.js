/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

import { TriPlatDs } from "../triplat-ds/triplat-ds.js";

import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { TriLocateAppUtilsBehavior } from "./tribehav-locate-app-utils.js";
import "./tristyles-locate-app.js";
import "./tricomp-search-room.js";
import "./tricomp-location-details-room.js";

Polymer({
    _template: html`
		<style include="shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
				}
				
				.page-header {
					padding: 20px 20px 5px 20px;
				}

				tricomp-location-details-room {
					@apply --layout-flex;
				}
			
		</style>

		<triplat-ds id="roomInstance" name="roomLookup" data="{{_roomInstance}}" manual>
			<triplat-ds-instance id="roomLookupDsInstance"></triplat-ds-instance>
		</triplat-ds>

		<template is="dom-if" if="[[!smallScreenWidth]]">
			<div class="page-header">
				<div class="header-text tri-h2" hidden\$="[[smallScreenWidth]]" aria-label="Locate">Locate Room</div>
			</div>
		</template>

		<tricomp-search-room selected-floor="{{_selectedFloor}}" selected-room="{{_selectedRoom}}" override-building-id="[[overrideBuildingId]]">
		</tricomp-search-room>

		<template is="dom-if" if="[[_floorRecordId]]">
			<tricomp-location-details-room id="locationDetailsRoom" room-record-id="[[_roomRecordId]]" floor-record-id="[[_floorRecordId]]" building-record-id="[[_buildingRecordId]]" pin-details="[[_createRoomPin(_selectedRoom)]]" pin-name="pin-room-function" small-screen-max-height="450px" on-person-selected="_handlePersonSelected"></tricomp-location-details-room>
		</template>
	`,

    is: "tripage-locate-room",

    behaviors: [
		TriBlockViewResponsiveBehavior,
		TriLocateAppUtilsBehavior
	],

    properties: {
		roomRecordId: {
			type: String
		},

		opened: {
			type: Boolean,
			value: false
		},

		overrideBuildingId: {
			type: String
		},

		_floorRecordId: {
			type: String,
			value: ""
		},

		_buildingRecordId: {
			type: String,
			value: ""
		},

		_roomRecordId: {
			type: String,
			value: ""
		},

		_selectedFloor: {
			type: Object,
			value: function() {
				return {};
			}
		},

		_selectedRoom: {
			type: Object
		}
	},

    observers: [
		"_observeRoomInstance(_roomInstance)",
		"_observeSelectedRoom(_selectedRoom)",
		"_handlerRoomRecordIdChanged(opened, roomRecordId)",
		"_handleSelectedFloorRoomChanged(_selectedFloor)",
		"_handleSelectedFloorRoomChanged(_selectedRoom)"
	],

    _handlerRoomRecordIdChanged: function(opened, roomRecordId) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (!opened) {
			return;
		}

		afterNextRender(this, function() {
			if (this._isValidString(roomRecordId)) {
				if (!this._roomInstance || roomRecordId != this._roomInstance._id) {
					this.$.roomLookupDsInstance.instanceId = roomRecordId;
					this.$.roomInstance.refresh();
				}
			} else {
				this._roomInstance = null;
			}
		});
	},

    _observeRoomInstance: function(room) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (room && room._id) {
			this.set("_selectedRoom", room);
		}
	},

    _observeSelectedRoom: function(room) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var routeParams = null;

		if (!room || !room._id) {
			routeParams = { roomId: -1 };
		} else if (this.roomRecordId != room._id) {
			routeParams = { roomId: room._id };
		} else {
			return;
		}

		var locationDetailsRoom = this.$$("#locationDetailsRoom");

		if (locationDetailsRoom && locationDetailsRoom.selectedTab == "roomBim" && locationDetailsRoom.hasBimModel) {
			locationDetailsRoom.navigateToBimTab(routeParams);
		} else {
			this.fire("navigate-locate-room", routeParams);
		}
	},

    _handleSelectedFloorRoomChanged: function() {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var floor = this._selectedFloor;
		var room = this._selectedRoom

		if (floor && floor._id) {
			this._floorRecordId = floor._id;
			this._buildingRecordId = floor.buildingId;
		} else if (room && room._id) {
			this._floorRecordId =  room.floorId;
			this._buildingRecordId = room.buildingId;
		} else {
			this._floorRecordId =  "";
			this._buildingRecordId =  "";
		}

		this._roomRecordId = room && room._id ? room._id : "";
	},

    _createRoomPin: function(room) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var pin = null;

		if (room && room._id) {
			pin =  {
				spaceRecordId: room._id
			}
		}

		return pin;
	},

    _handlePersonSelected: function(e) {
		if (e) {
			var personDetails = e.detail;
			this.fire('navigate-locate-person', { personId: personDetails._id });
		}
	}
});