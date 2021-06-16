/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-button/paper-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../../triblock-popup/triblock-popup.js";
import "../../styles/tristyles-work-planner.js";
import { getTriserviceWorkPlanner } from "../../services/triservice-work-planner.js";
import { getTriserviceTaskAssignment } from "../../services/triservice-task-assignment.js";
import "../week-selector/tricomp-week-selector.js";
import "./tricomp-assign-people-list.js";

class TricompAssignPeoplePopup extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-assign-people-popup"; }

	static get template() {
		return html`
			<style include="work-planner-popup-styles work-planner-shared-styles tristyles-theme">
				.assign-popup {
					@apply --layout-vertical;
					padding: 0px;
					height: 80%;
					min-height: 500px;
				}

				.content {
					@apply --layout-vertical;
					@apply --layout-flex;
					margin: 0px;
					padding: 20px;
				}

				.row {
					@apply --layout-horizontal;
				}

				.week-selector {
					@apply --layout-horizontal;
					@apply --layout-center-justified;
					margin-top: 15px;
				}

				.action-bar {
					@apply --layout-horizontal;
					@apply --layout-center;
					font-size: 14px;
					background-color: var(--tri-footer-background-color);
					color: var(--tri-footer-color);
					padding: 7px 20px;
					margin: 0px;
				}

				.selection-info {
					@apply --layout-horizontal;
					@apply --layout-end-justified;
					@apply --layout-flex;
				}

				.selection-info-txt {
					padding: 0px 20px;
				}

				.deselect-btn {
					@apply --layout-horizontal;
					@apply --layout-start-justified;
					color: var(--tri-info-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px ;
				}

				.deselect-btn:hover {
					color: var(--tri-info-icon-button-hover-color);
				}

				.deselect-btn:hover > span {
					text-decoration: underline;
				}

				.deselect-btn[pressed] {
					color: var(--tri-info-icon-button-press-color);
				}
				
				.deselect-btn[disabled] {
					color: var(--tri-disabled-icon-button-color);
				}

				.divider {
					margin: 0px 20px; 
				}

				.buttons {
					@apply --layout-horizontal;
				}

				:host([dir="ltr"]) .cancel-btn {
					margin-right: 10px;
				}

				:host([dir="ltr"]) .done-btn {
					margin-left: 10px;
				}

				:host([dir="rtl"]) .cancel-btn {
					margin-left: 10px;
				}

				:host([dir="rtl"]) .done-btn {
					margin-right: 10px;
				}
				
				.task-id::after {
					content: ":";
					padding-left: 2px;
					padding-right: 2px;
				}

				.task-id, .task-name {
					font-size: 16px;
					font-weight: 500;
				}

				.title {
					font-size: 22px;
					font-weight: 100;
					color: var(--tri-primary-content-label-color);
					padding: 10px 0px 15px 0px;
				}

				.people-list {
					margin-top: 10px;
					@apply --layout-flex;
				}
			</style>

			<triblock-popup id="assignPopup" class="assign-popup" small-screen-max-width="0px" modal opened="{{opened}}">
				<div class="content">
					<div class="row">
						<div class="task-id">[[task.id]]</div>
						<div class="task-name">[[task.name]]</div>
					</div>
					<div class="title">Add Assignees</div>
					<div class="instructions">Assign people to the task by using the check boxes. When finished, select the Done button.</div>
					<div class="week-selector">
						<tricomp-week-selector start-date="{{_startDate}}" end-Date="{{_endDate}}"></tricomp-week-selector>
					</div>
					<tricomp-assign-people-list id="peopleList" class="people-list" start-date="[[_startDate]]" end-date="[[_endDate]]"
						selected-people="{{_selectedPeople}}" opened="[[opened]]">
					</tricomp-assign-people-list>
				</div>
				<div class="action-bar">
					<div class="selection-info">
						<div class="selection-info-txt">[[_selectedPeopleLength]] Selected</div>
						<paper-button class="deselect-btn tri-disable-theme" on-tap="_handleDeselectAllTap" disabled="[[!_hasSelectedPeople]]">
							<span>Deselect All</span>
						</paper-button>
					</div>
					<div class="divider"></div>
					<div class="buttons">
						<paper-button class="cancel-btn" dialog-dismiss footer-secondary>Cancel</paper-button>
						<paper-button class="done-btn" footer on-tap="_handleDoneTap" disabled="[[!_hasSelectedPeople]]">Done</paper-button>
					</div>
				</div>
			</triblock-popup>
		`;
	}

	static get properties() {
		return {
			task: {
				type: Object
			},

			opened: {
				type: Boolean,
				value: false,
				notify: true
			},

			_selectedPeople: {
				type: Array
			},

			_selectedPeopleLength: {
				type: Number,
				value: 0
			},

			_hasSelectedPeople: {
				type: Boolean,
				value: false
			},

			_startDate: {
				type:String
			},

			_endDate: {
				type:String
			}
		};
	}

	static get observers() {
		return [
			"_computeHasSelectedPeople(_selectedPeople.*)"
		]
	}

	open() {
		document.body.appendChild(this);
		const workPlannerService = getTriserviceWorkPlanner();
		this._startDate = workPlannerService.peopleStartDate;
		this._endDate = workPlannerService.peopleEndDate;
		this.$.peopleList.refresh();
		this.$.assignPopup.open();
	}

	_computeHasSelectedPeople(selectedPeopleChanges) {
		this._selectedPeopleLength = selectedPeopleChanges ? selectedPeopleChanges.base.length : 0;
		this._hasSelectedPeople = this._selectedPeopleLength > 0;
	}

	_handleDeselectAllTap() {
		this._selectedPeople = [];
	}

	_handleDoneTap() {
		let serviceTaskAssignment = getTriserviceTaskAssignment();
		serviceTaskAssignment.assignTask(this.task, this._selectedPeople)
			.then(serviceTaskAssignment.refreshAllocatedPeople.bind(serviceTaskAssignment, this.task._id, true))
			.then(this.$.assignPopup.close.bind(this.$.assignPopup));
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/edit-assignment/tricomp-assign-people-popup.js");
	}
}

window.customElements.define(TricompAssignPeoplePopup.is, TricompAssignPeoplePopup);