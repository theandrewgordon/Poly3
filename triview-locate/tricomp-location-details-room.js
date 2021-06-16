/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../triblock-tabs/triblock-tabs.js";
import "../triplat-bim/triplat-bim-model.js";
import "../triplat-bim/triplat-bim-viewer.js";
import "../triplat-ds/triplat-ds.js";
import "../triplat-routing/triplat-route.js";
import "./tristyles-locate-app.js";
import { TriLocationDetailsBehaviorImpl, TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import "./tricomp-floor-directory-card.js";
import "./tripage-location.js";
import "./tripage-key-rooms.js";
import "./tripage-floor-directory.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="shared-app-layout-styles location-details-styles locate-tabs tristyles-theme">

				:host([small-screen-height]) {
					@apply --layout-block;
				}
			
		</style>

		<triplat-ds id="keyRooms" name="keyRooms" data="{{_keyRooms}}" force-server-filtering="">
			<triplat-query>
				<triplat-query-filter name="floorId" operator="equals" value="[[floorRecordId]]" ignore-if-blank=""></triplat-query-filter>
			</triplat-query>
		</triplat-ds>

		<triplat-ds id="floorDirectory" name="peopleLookup" data="{{_floorDirectory}}" loading="{{_loading}}" disable="">
			<triplat-query>
				<triplat-query-scroll-page scroller="[[_scroller]]" size="50" disable-auto-fetch=""></triplat-query-scroll-page>
				<triplat-query-filter name="floorId" operator="equals" value="[[floorRecordId]]" required=""></triplat-query-filter>
			</triplat-query>
		</triplat-ds>

		<triplat-ds id="floorDirectoryCount" name="peopleLookup" query-total-size="{{_floorDirectoryCount}}" force-server-filtering disable count-only>
			<triplat-query>
				<triplat-query-filter name="floorId" operator="equals" value="[[floorRecordId]]" required=""></triplat-query-filter>
			</triplat-query>
		</triplat-ds>

		<triplat-bim-model buildingspec="[[buildingRecordId]]" hasmodel="{{hasBimModel}}" model="{{_bimModel}}">
		</triplat-bim-model>

		<triplat-route id="roomLocationRoute" name="roomLocation" path="/location/:maximize" params="{{_locationRouteParams}}" active="{{_locationRouteActive}}"></triplat-route>
		<triplat-route id="roomKeyRoomsRoute" name="roomKeyRooms" path="/keyRooms/:maximize" params="{{_keyRoomsRouteParams}}" active="{{_keyRoomsRouteActive}}"></triplat-route>
		<triplat-route id="roomFloorDirectoryRoute" name="roomFloorDirectory" path="/floorDirectory/:maximize" active="{{_floorDirectoryRouteActive}}"></triplat-route>
		<triplat-route id="roomBimRoute" name="roomBim" path="/bim/:maximize"></triplat-route>
		
		<triblock-tabs hide-scroll-buttons="" fit-container="[[smallScreenWidth]]">
			<triblock-tab id="locationTab" triplat-route-id="roomLocationRoute" triplat-route-params="[[_minimizedRouteParams]]" label="Location" slot="tab"></triblock-tab>
			<template is="dom-if" if="[[_showKeyRoomTab]]" restamp="">
				<triblock-tab id="keyRoomsTab" triplat-route-id="roomKeyRoomsRoute" triplat-route-params="[[_minimizedRouteParams]]" label="Key Rooms" slot="tab"></triblock-tab>
			</template>
			<template is="dom-if" if="[[_showFloorDirectoryTab]]" restamp="">
				<triblock-tab id="floorDirTab" triplat-route-id="roomFloorDirectoryRoute" triplat-route-params="[[_minimizedRouteParams]]" label="Floor Directory" slot="tab"></triblock-tab>
			</template>
			<template is="dom-if" if="[[hasBimModel]]" restamp="">
				<triblock-tab id="bimTab" triplat-route-id="roomBimRoute" triplat-route-params="[[_minimizedRouteParams]]" label="BIM" slot="tab"></triblock-tab>
			</template>
		</triblock-tabs>

		<triplat-route-selector selected="{{selectedTab}}">
			<iron-pages class="floor-details" selected-attribute="opened">
				<div route="roomLocation">
					<dom-if if="[[_locationRouteActive]]">
						<template>
							<tripage-location id="locationPage" floor-record-id="[[floorRecordId]]" pin-details="[[pinDetails]]" pin-name="[[pinName]]" has-graphic="{{_hasGraphic}}" maximize="[[_computeMaximizeFloorPlan(_locationRouteParams.maximize)]]" on-maximize-location-floor-plan="_handleMaximizeLocationFloorPlan" on-minimize-location-floor-plan="_handleMinimizeLocationFloorPlan" opened="[[_locationRouteActive]]"></tripage-location>
						</template>
					</dom-if>
				</div>

				<div route="roomKeyRooms">
					<dom-if if="[[_keyRoomsRouteActive]]">
						<template>
							<tripage-key-rooms id="keyRoomsPage" floor-record-id="[[floorRecordId]]" pin-details="[[pinDetails]]" pin-name="[[pinName]]" key-rooms="[[_keyRooms]]" maximize="[[_computeMaximizeFloorPlan(_keyRoomsRouteParams.maximize)]]" on-maximize-key-rooms-floor-plan="_handleMaximizeKeyRoomsFloorPlan" on-minimize-key-rooms-floor-plan="_handleMinimizeKeyRoomsFloorPlan" opened="[[_keyRoomsRouteActive]]"></tripage-key-rooms>
						</template>
					</dom-if>
				</div>
				
				<div route="roomFloorDirectory">
					<dom-if if="[[_floorDirectoryRouteActive]]">
						<template>
							<tripage-floor-directory id="floorDirPage" floor-record-id="[[floorRecordId]]" floor-directory="[[_floorDirectory]]" scroller="{{_scroller}}"></tripage-floor-directory>
						</template>
					</dom-if>
				</div>

				<triplat-bim-viewer id="bimViewerPage" route="roomBim" spaceid="[[_computeBimViewerSpaceId(roomRecordId, selectedTab)]]" on-space-changed="_onBimSpaceChanged" features="[[_bimFeatures]]">
				</triplat-bim-viewer>
			</iron-pages>
		</triplat-route-selector>
	`,

    is: "tricomp-location-details-room",

    properties: {
		pinName: {
			type: String
		},

		selectedTab: {
			type: String,
			notify: true
		},

		_floorDirectory: {
			type: Array
		},
		
		hasBimModel: {
			type: Boolean,
			value:false
		},

		_bimModel: {
			type: Object
		},

						
		_bimFeatures: {
			value: function() {
				return {
					selection: false,
					markup: false,
					multiselect: false,
					view: false,
					search: false,
					settings: false,
					camera: false,
					explode: false,
					measure: false,
					modelTree: false,
					properties: false,
					section: false
				};
			}
		},

		_loading: {
			type: Boolean,
			value:false
		},

		_keyRooms: {
			type: Array
		},

		_scroller: {
			type: Object
		}
	},

    observers: [
		"_computeBimModel(_bimModel, selectedTab)"
	],

    behaviors: [
		TriLocationDetailsBehavior
	],

    _handleMaximizeLocationFloorPlan: function(e) {
		e.stopPropagation();
		this.$.roomLocationRoute.navigate({maximize: "max"}, true);
	},

    _handleMinimizeLocationFloorPlan: function(e) {
		e.stopPropagation();
		this.$.roomLocationRoute.navigate({ maximize: "min"}, true);
	},

    _handleMaximizeKeyRoomsFloorPlan: function(e) {
		e.stopPropagation();
		this.$.roomKeyRoomsRoute.navigate({maximize: "max"}, true);
	},

    _handleMinimizeKeyRoomsFloorPlan: function(e) {
		e.stopPropagation();
		this.$.roomKeyRoomsRoute.navigate({ maximize: "min"}, true);
	},

    _computeBimViewerSpaceId: function(roomRecordId, selectedTab) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (selectedTab != "roomBim") {
			return null;
		}

		return roomRecordId && roomRecordId != "-1" ? roomRecordId : null;
	},

    navigateToBimTab: function(routeParams) {
		routeParams.maximize = "min";
		this.$.roomBimRoute.navigate(routeParams);
	},

    _computeBimModel: function(bimModel, selectedTab) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (selectedTab == "roomBim") {
			this.$.bimViewerPage.model = bimModel;
		}
	},

    _onBimSpaceChanged: function(e) {
		var roomId = event.detail._id;
		if (roomId != this.roomRecordId) {
			var routeParams = {};
			routeParams.roomId = roomId;
			routeParams.maximize = "min";
			this.$.roomBimRoute.navigate(routeParams);
		}
	}
});