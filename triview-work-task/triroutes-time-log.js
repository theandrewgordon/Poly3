/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesTimeLog = Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<triplat-route id="taskTimeLogHomeRoute" name="taskTimeLogHome" path="/" on-route-active="_onTaskTimeLogHomeRouteActive"></triplat-route>
		<triplat-route id="timeLogDetailRoute" name="timeLogDetail" path="/:timeId" on-route-active="_onTimeLogDetailRouteActive" active="{{detailRouteActive}}"></triplat-route>
	`,

    is: "triroutes-time-log",

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
			throw "Cannot instantiate more than one triroutes-time-log element";
		}
	},

    openTimeLogDetail: function (timeId, taskId) {
		var params = { timeId: timeId };
		if (taskId) {
			params.taskId = taskId;
		}
		this.$.timeLogDetailRoute.navigate(params);
	},

    _onTaskTimeLogHomeRouteActive: function(e) {
		var __dictionary__TaskTimePageLabel = "Time log";
		this.fire(
			"route-changed",
			{ active: e.detail.active, pageLabel: __dictionary__TaskTimePageLabel, hasBackButton: true }
		);
	},

    _onTimeLogDetailRouteActive: function(e) {
		e.stopPropagation();
		var __dictionary__TimeLogPageLabel = "Edit time log";
		var __dictionary__NewTimeLogPageLabel = "Add time log";
		this.fire(
			"route-changed", 
			{ active: e.detail.active, pageLabel: ((e.detail.params.timeId !== "-1") ? __dictionary__TimeLogPageLabel : __dictionary__NewTimeLogPageLabel), hasBackButton: true }
		);
	}
});

TriroutesTimeLog.getInstance = function () {
	return singleton;
};