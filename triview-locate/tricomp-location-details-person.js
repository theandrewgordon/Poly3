/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../triblock-tabs/triblock-tabs.js";
import "../triplat-ds/triplat-ds.js";
import "../triplat-routing/triplat-route.js";
import "./tristyles-locate-app.js";
import { TriLocationDetailsBehaviorImpl, TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import "./tricomp-floor-directory-card.js";
import "./tripage-location.js";
import "./tripage-key-rooms.js";
import "./tripage-floor-directory.js";


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

		<triplat-route id="personLocationRoute" name="personLocation" path="/location/:maximize" params="{{_locationRouteParams}}" active="{{_locationRouteActive}}"></triplat-route>
		<triplat-route id="personKeyRoomsRoute" name="personKeyRooms" path="/keyRooms/:maximize" params="{{_keyRoomsRouteParams}}" active="{{_keyRoomsRouteActive}}"></triplat-route>
		<triplat-route id="personFloorDirectoryRoute" name="personFloorDirectory" path="/floorDirectory/:maximize" active="{{_floorDirectoryRouteActive}}"></triplat-route>

		<triblock-tabs hide-scroll-buttons="" fit-container="[[smallScreenWidth]]">
			<triblock-tab id="locationTab" triplat-route-id="personLocationRoute" triplat-route-params="[[_minimizedRouteParams]]" label="Location" slot="tab"></triblock-tab>
			<template is="dom-if" if="[[_showKeyRoomTab]]" restamp="">
				<triblock-tab id="keyRoomsTab" triplat-route-id="personKeyRoomsRoute" triplat-route-params="[[_minimizedRouteParams]]" label="Key Rooms" slot="tab"></triblock-tab>
			</template>
			<template is="dom-if" if="[[_showFloorDirectoryTab]]" restamp="">
				<triblock-tab id="floorDirTab" triplat-route-id="personFloorDirectoryRoute" triplat-route-params="[[_minimizedRouteParams]]" label="Floor Directory" slot="tab"></triblock-tab>
			</template>
		</triblock-tabs>

		<triplat-route-selector>
			<iron-pages class="floor-details" selected-attribute="opened">
				<div route="personLocation">
					<dom-if if="[[_locationRouteActive]]">
						<template>
							<tripage-location floor-record-id="[[floorRecordId]]" pin-details="[[pinDetails]]" maximize="[[_computeMaximizeFloorPlan(_locationRouteParams.maximize)]]" on-maximize-location-floor-plan="_handleMaximizeLocationFloorPlan" on-minimize-location-floor-plan="_handleMinimizeLocationFloorPlan" opened="[[_locationRouteActive]]"></tripage-location>
						</template>
					</dom-if>
				</div>

				<div route="personKeyRooms">
					<dom-if if="[[_keyRoomsRouteActive]]">
						<template>
							<tripage-key-rooms floor-record-id="[[floorRecordId]]" pin-details="[[pinDetails]]" key-rooms="[[_keyRooms]]" maximize="[[_computeMaximizeFloorPlan(_keyRoomsRouteParams.maximize)]]" on-maximize-key-rooms-floor-plan="_handleMaximizeKeyRoomsFloorPlan" on-minimize-key-rooms-floor-plan="_handleMinimizeKeyRoomsFloorPlan" opened="[[_keyRoomsRouteActive]]"></tripage-key-rooms>
						</template>
					</dom-if>
				</div>

				<div route="personFloorDirectory">
					<dom-if if="[[_floorDirectoryRouteActive]]">
						<template>
							<tripage-floor-directory floor-record-id="[[floorRecordId]]" person-record-id="[[personRecordId]]" floor-directory="[[_floorDirectory]]" scroller="{{_scroller}}" on-person-selected="_handlePersonSelected"></tripage-floor-directory>			
						</template>
					</dom-if>
				</div>
			</iron-pages>
		</triplat-route-selector>
	`,

    is: "tricomp-location-details-person",

    behaviors: [
		TriLocationDetailsBehavior
	],

    _handlePersonSelected: function(e) {
		this.$.personFloorDirectoryRoute.navigate({ personId: e.detail._id, maximize: "min"});
	},

    _handleMaximizeLocationFloorPlan: function(e) {
		e.stopPropagation();
		this.$.personLocationRoute.navigate({maximize: "max"}, true);
	},

    _handleMinimizeLocationFloorPlan: function(e) {
		e.stopPropagation();
		this.$.personLocationRoute.navigate({ maximize: "min"}, true);
	},

    _handleMaximizeKeyRoomsFloorPlan: function(e) {
		e.stopPropagation();
		this.$.personKeyRoomsRoute.navigate({maximize: "max"}, true);
	},

    _handleMinimizeKeyRoomsFloorPlan: function(e) {
		e.stopPropagation();
		this.$.personKeyRoomsRoute.navigate({ maximize: "min"}, true);
	}
});