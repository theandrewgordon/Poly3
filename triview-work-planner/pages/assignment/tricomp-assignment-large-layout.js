/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../components/lock-week/tricomp-lock-week.js"
import "../../components/workgroup-selector/tricomp-workgroup-selector.js";
import "../../components/assignment-summary/tricomp-assignment-summary.js";
import "../../components/task-section/tricomp-task-section.js";
import "../../services/triservice-work-task.js";
import "./tricomp-people-section.js";

class TricompAssignmentLargeLayout extends PolymerElement {
	static get is() { return "tricomp-assignment-large-layout"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.header {
					padding-left: 5%;
					padding-right: 5%;
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.workgroup-selector {
					@apply --layout-flex;
				}

				.main-container {
					@apply --layout-horizontal;
					@apply --layout-flex;
					background-color: var(--ibm-neutral-2);
					padding: 20px 5% 0px 5%;
				}

				.task-section {
					@apply --layout-flex-5;
				}

				.lock-week {
					width: 45px;
					padding-top: 50px;
				}
				.lock-week[invisible] {
					visibility: hidden;
				}

				.people-section {
					@apply --layout-flex-5;
				}
			</style>

			<triservice-work-task selected-status="{{_selectedStatus}}"></triservice-work-task>

			<div class="header">
				<tricomp-workgroup-selector class="workgroup-selector"></tricomp-workgroup-selector>
				<tricomp-assignment-summary></tricomp-assignment-summary>
			</div>

			<div class="main-container">
				<tricomp-task-section class="task-section"></tricomp-task-section>
				<tricomp-lock-week class="lock-week" invisible\$="[[_isOverdueStatus(_selectedStatus)]]"></tricomp-lock-week>
				<tricomp-people-section class="people-section"></tricomp-people-section>
			</div>
		`;
	}

	static get properties() {
		return {
			_selectedStatus: {
				type: String
			}
		};
	}

	_isOverdueStatus(selectedStatus) {
		return selectedStatus && selectedStatus == "overdue";
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/assignment/tricomp-assignment-large-layout.js");
	}
}

window.customElements.define(TricompAssignmentLargeLayout.is, TricompAssignmentLargeLayout);