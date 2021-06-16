/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-offline-manager/triplat-ds-offline.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triplat-ds name="buildingsForSearchLocation" manual="">
				<triplat-ds-offline id="buildingsForSearchLocationDSOffline" mode="UPDATE"></triplat-ds-offline>
			</triplat-ds>

			<triplat-ds name="lookupBuilding" manual="">
				<triplat-ds-offline id="lookupBuildingDSOffline" mode="UPDATE"></triplat-ds-offline>
			</triplat-ds>
		</template>
	`,

    is: "triservice-app-location-context",

    behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior
	],

    properties: {
		online: {
			type: Boolean
		}
	},

    cacheBuildings: function(buildings) {
		if (this._isRootInstance) {
			return this.$$("#lookupBuildingDSOffline").cacheRecords(true, buildings)
				.then(this._cacheBuildingsWithGeoPosition.bind(this, buildings));
		} else {
			return this._rootInstance.cacheBuildings(buildings);
		}
	},

    _cacheBuildingsWithGeoPosition: function(buildings) {
		var buildingsWithGeo = null;
		if (buildings) {
			buildingsWithGeo = buildings.filter(function(building) {
				return building.latitude != null && building.latitude != 0 && building.longitude != null && building.longitude != 0;
			});
		}
		return this.$$("#buildingsForSearchLocationDSOffline").cacheRecords(true, buildingsWithGeo);
	}
});