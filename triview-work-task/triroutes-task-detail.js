/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesTaskDetail = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="taskDetailHomeRoute" name="taskDetailHome" path="/" on-route-active="_onTaskDetailHomeRouteActive"></triplat-route>
		<triplat-route id="taskTimeLogsRoute" name="taskTimeLogs" path="/timelogs"></triplat-route>
		<triplat-route id="taskRequestsRoute" name="taskRequests" path="/requests" on-route-active="_onTaskRequestsRouteActive"></triplat-route>
		<triplat-route id="taskLocationsRoute" name="taskLocations" path="/locations" on-route-active="_onTaskLocationsRouteActive"></triplat-route>
		<triplat-route id="taskAssetsRoute" name="taskAssets" path="/assets" on-route-active="_onTaskAssetsRouteActive"></triplat-route>
		<triplat-route id="taskProceduresRoute" name="taskProcedures" path="/procedures/:rule/:search" on-route-active="_onTaskProceduresRouteActive"></triplat-route>
		<triplat-route id="taskMaterialsRoute" name="taskMaterials" path="/materials"></triplat-route>
		<triplat-route id="taskPeopleRoute" name="taskPeople" path="/people" on-route-active="_onTaskPeopleRouteActive"></triplat-route>
		<triplat-route id="taskCommentsRoute" name="taskComments" path="/comments" on-route-active="_onTaskCommentsRouteActive"></triplat-route>
	`,

    is: "triroutes-task-detail",

    created: function() {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-task-detail element";
		}
	},

    navigateTaskDetailHome: function (replace) {
		this.$.taskDetailHomeRoute.navigate({}, replace);
	},

    openTaskTimeLogs: function (taskId, replace) {
		this.$.taskTimeLogsRoute.navigate({ taskId: taskId }, replace);
	},

    openTaskRequests: function (taskId, replace) {
		this.$.taskRequestsRoute.navigate({ taskId: taskId }, replace);
	},

    openTaskLocations: function (taskId, replace) {
		this.$.taskLocationsRoute.navigate({ taskId: taskId }, replace);
	},

    openTaskAssets: function (taskId, replace) {
		this.$.taskAssetsRoute.navigate({ taskId: taskId }, replace);
	},

    openTaskProcedures: function (taskId, replace, rule, search) {
		var routeParams = { taskId: taskId };
		routeParams.rule = rule ? encodeURIComponent(rule) : "-1";
		routeParams.search = search ? encodeURIComponent(search) : "-1";
		this.$.taskProceduresRoute.navigate(routeParams, replace);
	},

    openTaskMaterials: function (taskId, replace) {
		this.$.taskMaterialsRoute.navigate({ taskId: taskId }, replace);
	},

    openTaskPeople: function (taskId, replace) {
		this.$.taskPeopleRoute.navigate({ taskId: taskId }, replace);
	},

    openTaskComments: function (taskId, replace) {
		this.$.taskCommentsRoute.navigate({ taskId: taskId }, replace);
	},

    _onTaskDetailHomeRouteActive: function(e) {
		var __dictionary__TaskDetailPageLabel = "Work Task";
		this.fire(
			"route-changed",
			{ active: e.detail.active, pageLabel: __dictionary__TaskDetailPageLabel, hasBackButton: true }
		);
	},

    _onTaskRequestsRouteActive: function(e) {
		var __dictionary__TaskRequestsPageLabel = "Requests";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__TaskRequestsPageLabel, hasBackButton: true }
		);
	},

    _onTaskLocationsRouteActive: function(e) {
		var __dictionary__TaskLocationsPageLabel = "Locations";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__TaskLocationsPageLabel, hasBackButton: true }
		);
	},

    _onTaskAssetsRouteActive: function(e) {
		var __dictionary__TaskAssetsPageLabel = "Assets";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__TaskAssetsPageLabel, hasBackButton: true }
		);
	},

    _onTaskProceduresRouteActive: function(e) {
		var __dictionary__TaskProceduresPageLabel = "Procedures";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__TaskProceduresPageLabel, hasBackButton: true }
		);
	},

    _onTaskPeopleRouteActive: function(e) {
		var __dictionary__TaskPeoplePageLabel = "Assigned People";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__TaskPeoplePageLabel, hasBackButton: true }
		);
	},

    _onTaskCommentsRouteActive: function(e) {
		var __dictionary__TaskCommentsPageLabel = "Comments";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: __dictionary__TaskCommentsPageLabel, hasBackButton: true }
		);
	}
});

TriroutesTaskDetail.getInstance = function () {
	return singleton;
};