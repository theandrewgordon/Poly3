/* IBM Confidential‌ - OCO Source Floorplan - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesFloorplan = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="taskFloorplanDetailRoute" name="taskFloorplanDetail" path="/room/:buildingId/:floorId" on-route-active="_onFloorplanDetailRouteActive" active="{{detailRouteActive}}"></triplat-route>
	`,

    is: "triroutes-floorplan-selector",

    properties: {
		detailRouteActive: {
			type: Boolean,
			notify: true
		}
	},

    created: function() {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-floorplan element";
		}
	},

    openTaskFloorplan: function (buildingId,floorId, taskId) {
		var params = { buildingId: buildingId , floorId: floorId };
		if (taskId) {
			params.taskId = taskId;
		}
		this.$.taskFloorplanDetailRoute.navigate(params);
	},

    _onFloorplanDetailRouteActive: function(e) {
		e.stopPropagation();
		if(e.detail.active) {
			var __dictionary__FloorplanPageLabel = "Open Floorplan";
			this.fire(
				"route-changed", 
				{ active: e.detail.active, pageLabel: __dictionary__FloorplanPageLabel, hasBackButton: true }
			);
		}
	}
});

TriroutesFloorplan.getInstance = function () {
	return singleton;
};