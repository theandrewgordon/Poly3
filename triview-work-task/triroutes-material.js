/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesMaterial = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="taskMaterialHomeRoute" name="taskMaterialHome" path="/" on-route-active="_onMaterialHomeRouteActive"></triplat-route>
		<triplat-route id="taskMaterialDetailRoute" name="taskMaterialDetail" path="/:materialId" on-route-active="_onMaterialDetailRouteActive" active="{{detailRouteActive}}"></triplat-route>
	`,

    is: "triroutes-material",

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
			throw "Cannot instantiate more than one triroutes-material element";
		}
	},

    openTaskMaterial: function (materialId, taskId) {
		var params = { materialId: materialId };
		if (taskId) {
			params.taskId = taskId;
		}
		this.$.taskMaterialHomeRoute.navigate();
		this.$.taskMaterialDetailRoute.navigate(params);
	},

    _onMaterialHomeRouteActive: function(e) {
		e.stopPropagation();
		if(e.detail.active) {
			var __dictionary__TaskMaterialsPageLabel = "Materials";
			this.fire(
				"route-changed", 
				{ active: e.detail.active, pageLabel: __dictionary__TaskMaterialsPageLabel, hasBackButton: true }
			);
		}
	},

    _onMaterialDetailRouteActive: function(e) {
		e.stopPropagation();
		if(e.detail.active) {
			var __dictionary__MaterialPageLabel = "Material";
			var __dictionary__NewMaterialPageLabel = "Add Material";
			this.fire(
				"route-changed", 
				{ active: e.detail.active, pageLabel: ((e.detail.params.materialId !== "-1") ? __dictionary__MaterialPageLabel : __dictionary__NewMaterialPageLabel), hasBackButton: true }
			);
		}
	}
});

TriroutesMaterial.getInstance = function () {
	return singleton;
};