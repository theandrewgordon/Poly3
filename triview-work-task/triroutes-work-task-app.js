/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesWorkTaskApp = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="taskInboxRoute" name="taskInbox" path="/" on-route-active="_onTaskInboxRouteActive"></triplat-route>
		<triplat-route id="newTaskRoute" name="newTask" path="/new/:taskId" on-route-active="_onNewTaskRouteActive"></triplat-route>
		<triplat-route id="taskRoute" name="task" path="/task/:assigned/:taskId" active="{{taskRouteActive}}"></triplat-route>
		<triplat-route id="offlineSettingsRoute" name="offlineSettings" path="/offline" on-route-active="_onOfflineSettingsRouteActive"></triplat-route>
	`,

	is: "triroutes-work-task-app",
	
	properties: {
		taskRouteActive: {
			type: Boolean,
			notify: true
		}
	},

    created: function () {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-work-task-app element";
		}
	},

    navigateHome: function (noReload) {
		if (location.hash === "#!/") {
			if (!noReload) {
				location.reload();
			}
		} else {
			this.$.taskInboxRoute.navigate();
		}
	},

    openTask: function (taskId, unassigned) {
		this.$.taskRoute.navigate({ taskId: taskId, assigned: unassigned ? "unassigned" : "assigned"});
	},

    openNewTask: function(taskId) {
		this.$.newTaskRoute.navigate({ taskId: taskId });
	},

    openOfflineSettings: function() {
		this.$.offlineSettingsRoute.navigate();
	},

    _onTaskInboxRouteActive: function (e) {
		this.fire(
			"route-changed",
			{ active: e.detail.active, pageLabel: null, hasBackButton: false }
		);
	},

    _onOfflineSettingsRouteActive: function (e) {
		var __dictionary__OfflineSettingsPageLabel = "Offline Status";
		this.fire(
			"route-changed",
			{ active: e.detail.active, pageLabel: __dictionary__OfflineSettingsPageLabel, hasBackButton: true }
		);
	},

    _onNewTaskRouteActive: function (e) {
		var __dictionary__newTaskPageLabel = "Draft Work Task";
		this.fire(
			"route-changed",
			{ active: e.detail.active, pageLabel: __dictionary__newTaskPageLabel, hasBackButton: true }
		);
	}
});

TriroutesWorkTaskApp.getInstance = function () {
	return singleton;
};