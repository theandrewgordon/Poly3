/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-routing/triplat-route.js";
var singleton = null;

export const TriroutesTaskList = Polymer({
	_template: html`
		<triplat-route id="inProgressRoute" name="inProgress" path="/inprogress" active="{{inProgressRouteActive}}" on-route-active="_onInProgressRouteActive"></triplat-route>
		<triplat-route id="completedRoute" name="completed" path="/completed" active="{{completedRouteActive}}" on-route-active="_onCompletedRouteActive"></triplat-route>
		<triplat-route id="draftRoute" name="draft" path="/draft" active="{{draftRouteActive}}" on-route-active="_onDraftRouteActive"></triplat-route>
		<triplat-route id="unassignedRoute" name="unassigned" path="/unassigned" active="{{unassignedRouteActive}}"></triplat-route>
		<triplat-route id="closedRoute" name="closed" path="/closed" active="{{closedRouteActive}}"></triplat-route>
		`,

	is: "triroutes-task-list",

	properties: {
		inProgressRouteActive: {
			type: Boolean,
			notify: true
		},

		completedRouteActive: {
			type: Boolean,
			notify: true
		},

		draftRouteActive: {
			type: Boolean,
			notify: true
		},

		unassignedRouteActive: {
			type: Boolean,
			notify: true
		},

		closedRouteActive: {
			type: Boolean,
			notify: true
		}
	},

	created: function () {
		if (!singleton) {
			singleton = this;
		} else {
			throw "Cannot instantiate more than one triroutes-task-list element";
		}
	},

	_onInProgressRouteActive: function (e) {
		e.stopPropagation();
		this.fire("inprogress-route-active", { active: e.detail.active });
	},

	_onCompletedRouteActive: function (e) {
		e.stopPropagation();
		this.fire("completed-route-active", { active: e.detail.active });
	},

	_onDraftRouteActive: function (e) {
		e.stopPropagation();
		this.fire("draft-route-active", { active: e.detail.active });
	}
});

TriroutesTaskList.getInstance = function () {
	return singleton;
};