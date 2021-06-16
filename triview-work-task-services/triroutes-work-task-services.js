/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-routing/triplat-route.js";
import { TriroutesWorkTaskApp } from "../triview-work-task/triroutes-work-task-app.js";
var singleton = null;

export const TriroutesWorkTaskServices = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="workTaskServicesRoute" name="workTaskServices" path="/" on-route-active="_onWorkTaskServicesRouteActive">
		</triplat-route>
		<triplat-route id="workTaskRoute" name="workTask" path="/workTask"></triplat-route>
		<triplat-route id="locateRoute" name="locate" path="/locate" on-route-active="_onLocateRouteActive">
		</triplat-route>
		<triplat-route id="portalOfflineSettingsRoute" name="portalOfflineSettings" path="/offline" on-route-active="_onOfflineSettingsRouteActive"></triplat-route>
	`,

    is: "triroutes-work-task-services",

    created: function() {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-work-task-services element";
		}
	},

    navigateHome: function () {
		if (location.hash === "#!/") {
			location.reload();
		} else {
			this.$.workTaskServicesRoute.navigate();
		}
	},

    navigateLocate: function () {
		this.$.locateRoute.navigate();
	},

    openNewTask: function(taskId) {
		TriroutesWorkTaskApp.getInstance().openNewTask(taskId);
	},

    openTask: function (taskId, unassigned) {
		TriroutesWorkTaskApp.getInstance().openTask(taskId, unassigned);
	},

    openOfflineSettings: function() {
		this.$.portalOfflineSettingsRoute.navigate();
	},

    _onWorkTaskServicesRouteActive: function(e) {
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: null, hasBackButton: false }
		);
	},

    _onLocateRouteActive: function(e) {
		var __dictionary__LocatePageLabel = "Locate";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__LocatePageLabel, hasBackButton: true }
		);
	},

    _onOfflineSettingsRouteActive: function (e) {
		var __dictionary__OfflineSettingsPageLabel = "Offline Status";
		this.fire(
			"route-changed",
			{ active: e.detail.active, pageLabel: __dictionary__OfflineSettingsPageLabel, hasBackButton: true }
		);
	}
});

TriroutesWorkTaskServices.getInstance = function () {
	return singleton;
};