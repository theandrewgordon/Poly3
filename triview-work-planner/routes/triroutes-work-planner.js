/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triplat-routing/triplat-route.js";
import "../../tricore-url/tricore-url.js";
import { closeAllDropdowns } from "../components/dropdown/trimixin-dropdown.js";
import { TrimixinService, getService } from "../services/trimixin-service.js";
import { getTriserviceTaskAssignment } from "../services/triservice-task-assignment.js";
import { getTriserviceWorkgroup } from "../services/triservice-workgroup.js";
import { getTriserviceWorkPlanner } from "../services/triservice-work-planner.js";

export function getTriroutesWorkPlanner() {
	return getService(TriroutesWorkPlanner.is);
};

class TriroutesWorkPlanner extends TrimixinService(PolymerElement) {
	static get is() { return "triroutes-work-planner"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<tricore-url id="tricoreUrl"></tricore-url>
					<triplat-route id="assignmentRoute" name="assignment" path="/" on-route-active="_onAssignmentRouteActive" active="{{assignmentRouteActive}}"></triplat-route>
					<triplat-route id="teamAssignmentsRoute" name="teamAssignments" path="/teamAssignments/:workgroupId/:peopleId" on-route-active="_onTeamAssignmentsRouteActive" params="{{teamAssignmentsParams}}"  active="{{teamAssignmentsRouteActive}}"></triplat-route>
					<triplat-route id="peopleListRoute" name="peopleList" path="/peopleList" on-route-active="_onPeopleListRouteActive" active="{{peopleListRouteActive}}"></triplat-route>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			teamAssignmentsParams: {
				type: Object,
				notify: true
			},

			assignmentRouteActive: {
				type: Boolean,
				notify: true
			},

			teamAssignmentsRouteActive: {
				type: Boolean,
				notify: true
			},

			peopleListRouteActive: {
				type: Boolean,
				notify: true
			}
		};
	}

	openAssignment() {
		if (this._isRootInstance) {
			if (!location.hash || location.hash === "#!/") {
				location.reload();
			} else {
				this.shadowRoot.querySelector("#assignmentRoute").navigate();
			}
		} else {
			this._rootInstance.openAssignment();
		}
	}

	openTeamAssignments(peopleId, replaceUrl) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#teamAssignmentsRoute").navigate({ workgroupId: getTriserviceWorkgroup().selectedWorkgroup._id, peopleId: peopleId}, replaceUrl);
		} else {
			this._rootInstance.openTeamAssignments(peopleId, replaceUrl);
		}
	}

	openPeopleList() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#peopleListRoute").navigate();
		} else {
			this._rootInstance.openPeopleList();
		}
	}

	openFullTaskRecordOnClassic(taskId) {
		if (this._isRootInstance) {
			if (!taskId) return;
			let url = this.shadowRoot.querySelector("#tricoreUrl").getUrl(`/WebProcess.srv?objectId=750000&actionId=750011&specId=${taskId}`);
			window.open(url, "_blank");
		} else {
			this._rootInstance.openFullTaskRecordOnClassic(taskId);
		}
	}

	_onAssignmentRouteActive(e) {
		if (e.detail.active) {
			if (!getTriserviceWorkPlanner().smallLayout) {
				getTriserviceWorkPlanner().clearUndoList();
			}
			closeAllDropdowns();
		}
		this.dispatchEvent(
			new CustomEvent(
				"route-changed", 
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: false },
					bubbles: true, composed: true
				}
			)
		);
	}

	_onTeamAssignmentsRouteActive(e) {
		if (e.detail.active) {
			getTriserviceWorkPlanner().clearUndoList();
			if (getTriserviceWorkPlanner().smallLayout) {
				setTimeout(() => this.openAssignment());
			}
			closeAllDropdowns();
		}
		this.dispatchEvent(
			new CustomEvent(
				"route-changed", 
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: false },
					bubbles: true, composed: true
				}
			)
		);
	}

	_onPeopleListRouteActive(e) {
		if (e.detail.active) {
			if (!getTriserviceWorkPlanner().smallLayout || !getTriserviceTaskAssignment().selectedTasks || getTriserviceTaskAssignment().selectedTasks.length == 0) {
				setTimeout(() => this.openAssignment());
			}
		}
		var __dictionary__page_label = "Assign task to"; 
		this.dispatchEvent(
			new CustomEvent(
				"route-changed", 
				{
					detail: { active: e.detail.active, pageLabel: __dictionary__page_label, hasBackButton: true },
					bubbles: true, composed: true
				}
			)
		);
	}
};

window.customElements.define(TriroutesWorkPlanner.is, TriroutesWorkPlanner);