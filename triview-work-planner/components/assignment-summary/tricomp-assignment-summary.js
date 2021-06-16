/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-button/paper-button.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-security.js";
import "../../styles/tristyles-work-planner.js";
import { TrimixinAssignmentSummary } from "./trimixin-assignment-summary.js";

class TricompAssignmentSummary extends TrimixinAssignmentSummary(PolymerElement) {
	static get is() { return "tricomp-assignment-summary"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.count-container {
					@apply --layout-vertical;
					@apply --layout-end;
				}

				.divider {
					margin: 0px 15px; 
				}
			</style>

			<triservice-task-assignment id="serviceTaskAssignment" selected-tasks="{{_selectedTasks}}" selected-people="{{_selectedPeople}}"
				allocated-people="{{_allocatedPeople}}" is-selected-task-assigned="{{_isSelectedTaskAssigned}}">
			</triservice-task-assignment>

			<triservice-security can-assign="{{_canAssign}}"></triservice-security>
			
			<div class="count-container">
				<div>[[_computeSelectedTasksCount(_selectedTasks.*)]]</div>
				<div>[[_computeSelectedPeopleCount(_selectedPeople.*)]]</div>
			</div>
			<div class="divider"></div>
			<paper-button id="assignBtn" on-tap="_handleAssignTap" primary disabled="[[_disableAssignButton]]">Assign</paper-button>
		`;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/assignment-summary/tricomp-assignment-summary.js");
	}
}

window.customElements.define(TricompAssignmentSummary.is, TricompAssignmentSummary);