/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triblock-search-popup/triblock-search.js";
import "../triplat-ds/triplat-ds.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../triapp-location-context/triapp-location-context.js";
import "./tricomp-room-card.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host(:not([small-screen-width])) .search-criteria {
					@apply --layout-horizontal;
					padding: 20px;
				}

				:host([medium-screen-width]) .search-criteria {
					@apply --layout-center;
				}

				:host([small-screen-width]) .search-criteria {
					@apply --layout-vertical;
					padding: 15px 15px 5px 15px;
				}

				.floor-room-search-container {
					@apply --layout-flex;
				}

				:host-context([dir="rtl"]) div .floor-room-search-container {
					padding-right: 20px;
				}

				:host(:not([small-screen-width]):not([medium-screen-width])) .floor-room-search-container {
					@apply --layout-horizontal;
					padding-left: 30px;
				}

				:host([medium-screen-width]) .floor-room-search-container {
					@apply --layout-vertical;
					padding-left: 20px;
				}

				:host(:not([small-screen-width]):not([medium-screen-width])) .floor-search {
					@apply --layout-flex;
					max-width: 280px;
				}

				:host([medium-screen-width]) .floor-search {
					padding-bottom: 10px;
					min-width: 250px;
				}

				:host([small-screen-width]) .floor-search {
					padding-top: 15px;
					padding-bottom: 10px;
				}

				:host(:not([small-screen-width]):not([medium-screen-width])) .room-search {
					@apply --layout-flex;
					max-width: 300px;
					padding-left: 20px;
				}

				:host-context([dir="rtl"]:not([small-screen-width]):not([medium-screen-width])) .room-search {
					padding-right: 20px;
				}

				:host([medium-screen-width]) .room-search {
					min-width: 250px;
				}

				:host([small-screen-width]) #room-search {
					padding-right: 0px;
				}

				:host([medium-screen-width]) #room-search {
					padding-right: 0px;
				}

				triblock-search {
					--triblock-search-paper-input-container-input: {
						padding-bottom: 3px;
					};

					--triblock-search-paper-input-container-label: {
						font-style: italic;
						font-weight: 300;
					};

					--triblock-search-paper-input-container-label-floating: {
						font-size: 18px;
						font-style: normal;
						font-weight: 400;
					};
				}

		</style>

		<triplat-ds id="floorLookup" name="floorLookup" data="{{_floorLookup}}" loading="{{_floorLookupLoading}}" on-ds-get-complete="_handleFloorLookupComplete">
			<triplat-query>
				<triplat-query-scroll-page scroller="{{_floorLookupScroller}}" size="20" disable-auto-fetch=""></triplat-query-scroll-page>
				<triplat-query-filter name="buildingId" operator="equals" value="[[_selectedBuildingId]]" required=""></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-filter name="floorName" operator="contains" value="[[_floorSearchValueFilter]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-sort name="floorName"></triplat-query-sort>
			</triplat-query>
		</triplat-ds>

		<triplat-ds id="roomLookup" name="roomLookup" data="{{_roomLookup}}" loading="{{_roomLookupLoading}}">
			<triplat-query>
				<triplat-query-scroll-page scroller="{{_roomLookupScroller}}" size="20" disable-auto-fetch=""></triplat-query-scroll-page>
				<triplat-query-filter name="buildingId" operator="equals" value="[[_selectedBuildingId]]" required=""></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-filter name="floorId" operator="equals" value="[[selectedFloor._id]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-filter name="roomName" operator="contains" value="[[_roomSearchValue]]"></triplat-query-filter>
				<triplat-query-sort name="roomName"></triplat-query-sort>
			</triplat-query>
		</triplat-ds>
		
		<div class="search-criteria">
			<div class="location-context">
				<triapp-location-context hide-message="" override-building-id="[[overrideBuildingId]]" on-location-changed="_handleLocationChanged" image-width="64" image-height="64" regular-font-size=""></triapp-location-context>
			</div>
			<div class="floor-room-search-container">
				<div class="floor-search">
					<triblock-search id="floorSearchField" label="[[_floorLabel]]" scroller="{{_floorLookupScroller}}" search-value="{{_floorSearchValue}}" search-result="[[_floorLookup]]" loading="[[_floorLookupLoading]]" value-name="floorName" disabled="[[_noBuilding]]" dropdown="" no-search-icon="" select-box="" no-results="[[_noFloors]]" scroll-element-into-view="" alt-dropdown-button="[[_altDropdownFloor]]" on-item-selected="_handleFloorSelected">
						<template>
							<div class="floor-card" style="padding: 5px 0">[[item.floorName]]</div>
						</template>
					</triblock-search>
				</div>
				<div class="room-search" id="room-search">
					<triblock-search id="roomSearchField" label="[[_roomLabel]]" scroller="{{_roomLookupScroller}}" search-value="{{_roomSearchValue}}" search-result="[[_roomLookup]]" loading="[[_roomLookupLoading]]" value-name="roomName" disabled="[[_noBuilding]]" dropdown="" no-search-icon="" scroll-element-into-view="" alt-clear-button="[[_altClearRoom]]" on-item-selected="_handleRoomSelected">
						<template>
							<tricomp-room-card data="[[item]]" search-value="[[_roomSearchValue]]"></tricomp-room-card>
						</template>
					</triblock-search>
				</div>
			</div>
		</div>
	`,

    is: "tricomp-search-room",

    behaviors: [
		TriBlockViewResponsiveBehavior
	],

    properties: {
		selectedFloor: {
			type: Object,
			notify: true
		},

		selectedRoom: {
			type: Object,
			notify: true
		},

		overrideBuildingId: {
			type: String
		},
		
		_floorLabel: {
			type: String,
			value: "",
			computed: "_setFloorLabel(_floorSearchValue)"
		},

		_roomLabel: {
			type: String,
			value: "",
			computed: "_setRoomLabel(_roomSearchValue)"
		},

		_selectedBuildingId: {
			type: String,
			value: ""
		},

		_noBuilding: {
			type: Boolean,
			value: true
		},

		_floorFilterCleaned: {
			type: Boolean,
			value: true
		},

		_roomSearchValue: {
			type: String,
			observer: "_observeRoomSearchValue"
		},

		_floorSearchValue: {
			type: String,
			observer: "_observeFloorSearchValue"
		},

		_altClearRoom: {
			type: String
		},

		_altDropdownFloor: {
			type: String
		},
	},

    observers: [
		"_observeSelectedBuildingId(_selectedBuildingId)",
		"_observeSelectedFloor(selectedFloor)",
		"_observeSelectedRoom(selectedRoom)"
	],

    attached: function() {
		var __dictionary__noFloors = "No floors";
		this.set("_noFloors", __dictionary__noFloors);

		var __dictionary__altClearRoom = "Clear room search";
		var __dictionary__altDropdownFloor = "Select floor";
		this.set("_altClearRoom", __dictionary__altClearRoom);
		this.set("_altDropdownFloor", __dictionary__altDropdownFloor);
	},

    _setFloorLabel: function(value) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var __dictionary__floorLabelEmpty = "Select a floor (optional)";
		var __dictionary__floorLabelFilled = "Floor (optional)";

		if (!value || value === "") {
			return __dictionary__floorLabelEmpty;
		} else {
			return __dictionary__floorLabelFilled;
		}
	},

    _setRoomLabel: function(value) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var __dictionary__roomLabelEmpty = "Room name or number";
		var __dictionary__roomLabelFilled = "Room";

		if (!value || value === "") {
			return __dictionary__roomLabelEmpty;
		} else {
			return __dictionary__roomLabelFilled;
		}
	},

    _observeSelectedBuildingId: function(id) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (id && id !== "") {
			this.set("_noBuilding", false);
		} else {
			this.set("_noBuilding", true);
		}
	},

    _observeFloorSearchValue: function(newFloorSearchValue, oldFloorSearchValue) {
		if (this._floorFilterCleaned) {
			this.set("_floorFilterCleaned", false);
		} else {
			this.set("_floorSearchValueFilter", newFloorSearchValue);
		}

		if (newFloorSearchValue === "" && oldFloorSearchValue) {
			this.set("selectedFloor", {});
		}
	},

    _observeRoomSearchValue: function(newRoomSearchValue, oldRoomSearchValue) {
		if (newRoomSearchValue === "" && oldRoomSearchValue) {
			this.set("selectedRoom", {});
		}
	},

    _observeSelectedFloor: function(floor) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (floor && floor._id) {
			this.$.floorSearchField._searchValue = floor.floorName;

			// Clear the room field if the select floor is different from the room parent floor of the room current selected.
			if (this.selectedRoom && this.selectedRoom._id && (floor._id !== this.selectedRoom.floorId)) {
				this.$.roomSearchField.clearSearch();
			}

			this._clearFloorSearchValueFilter();
		}
	},

    _observeSelectedRoom: function(room) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (room && room._id) {
			this.$.roomSearchField._searchValue = room.roomName;

			// Set the room parent floor as a selected floor, if none floor was selected.
			if (!this.selectedFloor || (this.selectedFloor && (!this.selectedFloor._id || this.selectedFloor._id === ""))) {
				var selectedFloor = {
					_id: room.floorId,
					floorName: room.floorName,
					buildingId: room.buildingId
				};
				this.set("selectedFloor", selectedFloor);

				this._clearFloorSearchValueFilter();
			}

			if (this._selectedBuildingId != room.buildingId) {
				this.set("overrideBuildingId", room.buildingId);
			}
		} else {
			this.$.roomSearchField.clearSearch();
		}
	},

    _handleLocationChanged: function(e) {
		if (e && e.detail && e.detail.building) {
			this.set("_selectedBuildingId", e.detail.building._id);

			// Clear the floor field if the current building is different from the parent building of the selected floor.
			if (this.selectedFloor && this.selectedFloor._id && (this.selectedFloor.buildingId !== this._selectedBuildingId)) {
				this.$.floorSearchField.clearSearch();
				this.set("selectedFloor", { _id: "" });
			}

			// Clear the room field if the current building is different from the parent building of the selected room.
			if (this.selectedRoom && this.selectedRoom._id && (this.selectedRoom.buildingId !== this._selectedBuildingId)) {
				this.$.roomSearchField.clearSearch();
			}
		}
	},

    _handleFloorSelected: function(e) {
		if (e && e.detail && e.detail._id) {
			var selectedFloor = e.detail;
			this.set("selectedFloor", selectedFloor);
		}
	},

    _handleRoomSelected: function(e) {
		if (e && e.detail && e.detail._id) {
			var selectedRoom = e.detail;
			this.set("selectedRoom", selectedRoom);
		}
	},

    _clearFloorSearchValueFilter: function() {
		this.set("_floorSearchValueFilter", "");
		this.set("_floorFilterCleaned", true);
	},

    _handleFloorLookupComplete: function() {
		if(this.$.floorLookup.queryTotalSize == 1 && this.$.floorSearchField._searchValue == "")
			this.set('selectedFloor', this._floorLookup[0]);
	}
});