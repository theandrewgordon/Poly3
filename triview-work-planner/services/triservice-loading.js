/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { TrimixinService } from "./trimixin-service.js";
import "./triservice-work-planner.js";
import "./triservice-workgroup.js";
import "./triservice-work-task.js";
import "./triservice-people.js";
import "./triservice-task-assignment.js";
import "./triservice-member-assigned-tasks.js";
import "./triservice-security.js";

class TriserviceLoading extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-loading"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triservice-work-planner loading="{{_loadingWorkPlanner}}"></triservice-work-planner>
					<triservice-workgroup loading="{{_loadingWorkgroup}}"></triservice-workgroup>
					<triservice-work-task loading="{{_loadingWorkTask}}"></triservice-work-task>
					<triservice-people loading="{{_loadingPeople}}"></triservice-people>
					<triservice-task-assignment loading="{{_loadingTaskAssignment}}"></triservice-task-assignment>
					<triservice-member-assigned-tasks loading="{{_loadingMemberAssignedTasks}}"></triservice-member-assigned-tasks>
					<triservice-security loading="{{_loadingSecurity}}"></triservice-security>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingWorkPlanner: {
				type: Boolean,
				value: false
			},

			_loadingWorkgroup: {
				type: Boolean,
				value: false
			},

			_loadingWorkTask: {
				type: Boolean,
				value: false
			},

			_loadingPeople: {
				type: Boolean,
				value: false
			},

			_loadingTaskAssignment: {
				type: Boolean,
				value: false
			},

			_loadingMemberAssignedTasks: {
				type: Boolean,
				value: false
			},

			_loadingSecurity: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingWorkPlanner, _loadingWorkgroup, _loadingWorkTask, _loadingPeople, _loadingTaskAssignment, _loadingMemberAssignedTasks, _loadingSecurity)"
		]
	}
};

window.customElements.define(TriserviceLoading.is, TriserviceLoading);