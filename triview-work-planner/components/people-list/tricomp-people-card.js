/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { dom } from "../../../@polymer/polymer/lib/legacy/polymer.dom.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";
import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../../triplat-icon/triplat-icon.js";
import { getTriserviceTaskAssignment } from "../../services/triservice-task-assignment.js";
import "../../styles/tristyles-work-planner.js";
import { formatDate } from "../../utils/triutils-date.js";
import "../people-image/tricomp-people-image.js";
import "../people-capacity/tricomp-people-capacity.js";

class TricompPeopleCard extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-people-card"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					flex-shrink: 0;
				}

				:host(:not([small-layout])) {
					margin-top: -1px;
				}

				.card {
					@apply --layout-vertical;
					padding: 10px 0px;
				}

				.card[dragging-task] {
					pointer-events: none;
				}

				.card:hover {
					transform: translateZ(1px);
				}

				.card[selected][dragging-over]:not([allocated]) {
					border-color: var(--ibm-purple-60);
					border-width: 2px;
					background-color: #EEF6FE !important;
					transform: translateZ(1px);
				}

				:host([small-layout][dir="ltr"]) .card {
					padding-left: 5px;
					padding-right: 15px;
				}
				
				:host([small-layout][dir="rtl"]) .card {
					padding-left: 15px;
					padding-right: 5px;
				}

				.main-content {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				.name-container {
					@apply --layout-flex-3;
					margin: 0px 15px 0px 10px;
				}

				.capacity {
					@apply --layout-flex-5;
				}

				.unassign-container {
					@apply --layout-center;
					@apply --layout-horizontal;
					padding-top: 5px;
				}

				.unassign-button {
					background: transparent !important;
					border: 0 !important;
					color: var(--tri-danger-color) !important;
					flex-direction: row !important;
					font-weight: bold !important;
					padding: 7px 12px !important;
				}
				.unassign-button:hover {
					background: var(--tri-danger-color) !important;
					border: 0 !important;
					color: white !important;
				}
				.unassign-button[disabled] {
					color: var(--tri-primary-content-accent-color) !important;
				}

				.unassign-button iron-icon {
					padding: 0;
					height: 18px;
					width: 18px;
				}
				:host([dir="ltr"]) .unassign-button iron-icon {
					margin-left: 7px;
				}
				:host([dir="rtl"]) .unassign-button iron-icon {
					margin-right: 7px;
				}

				.divider {
					margin: 0px 10px; 
				}

				.allocation-text {
					@apply --layout-flex;
				}
			</style>

			<div class="card" selected\$="[[selected]]" dragging-over\$="[[draggingOver]]"
				dragging-task\$="[[draggingTask]]" allocated\$="[[_isAllocated]]">
				<div class="main-content">
					<paper-checkbox class="checkbox" checked="{{selected}}" disabled="[[!enableSelection]]" on-change="_handleCheckboxChange"></paper-checkbox>
					<tricomp-people-image image="[[people.picture]]" first-name="[[people.firstName]]" last-name="[[people.lastName]]"></tricomp-people-image>
					<div class="name-container">
						<div>[[people.name]]</div>
						<div class="labor-list">
							<dom-repeat items="[[people.laborClasses]]">
								<template>
									<label class="labor">[[_computeLaborText(item, index)]]</label>
								</template>
							</dom-repeat>
						</div>
					</div>
					<tricomp-people-capacity class="capacity" availability="[[people.availability]]"
						small-layout="[[smallLayout]]" medium-layout="{{mediumLayout}}">
					</tricomp-people-capacity>
					<dom-if if="[[!hideExpandButton]]">
						<template>
							<paper-icon-button class="expand-button" icon="ibm-glyphs:expand-open" primary on-tap="_handleOpenTap"></paper-icon-button>
						</template>
					</dom-if>
				</div>
				
				<dom-if if="[[_isAllocated]]">
					<template>
						<iron-collapse opened="[[_ironCollapseOpened]]">
							<div class="unassign-container">
								<paper-button class="unassign-button" on-tap="_unassignMember" disabled="[[_computeDisableUnassignButton(allocation.resourceRecordID, disableUnassign)]]">
									<span>Unassign</span>
									<iron-icon icon="ibm-glyphs:remove"></iron-icon>
								</paper-button>
								<div class="divider"></div>
								<div class="allocation-text"><label>Allocation:</label> [[_formatDate(allocation.allocationDate, currentUser)]]</div>
							</div>
						</iron-collapse>
					</template>
				</dom-if>
			</div>
		`;
	}

	static get properties() {
		return {
			people: {
				type: Object
			},

			draggingTask: {
				type: Boolean
			},

			disableUnassign: {
				type: Boolean,
				value: false
			},

			hideExpandButton: {
				type: Boolean,
				value: false
			},

			noDrop: {
				type: Boolean,
				value: false
			},

			enableSelection: {
				type: Boolean,
				value: false
			},

			selected: {
				type: Boolean,
				value: false
			},

			draggingOver: {
				type: Boolean,
				value: false
			},

			currentUser: {
				type: Object
			},

			allocation: {
				type: Object
			},

			smallLayout: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			mediumLayout: {
				type: Boolean
			},

			_isAllocated: {
				type: Boolean,
				computed: "_computeIsAllocated(allocation)",
			},

			_ironCollapseOpened: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleExpandCollapse(people, allocation.allocationDate, selected)"
		];
	}

	ready() {
		super.ready();
		if (!this.noDrop) this._setupDropZone(this);
	}

	_computeIsAllocated(allocation) {
		return allocation && allocation._id && allocation._id != "";
	}

	_computeLaborText(item, index) {
		return item + (index < this.people.laborClasses.length - 1 ? "," : "");
	}

	_setupDropZone(node) {
		if (!node.ondragenter) node.ondragenter = this._onDragEnter.bind(this);
		if (!node.ondragover) node.ondragover = this._onDragOver.bind(this);
		if (!node.ondragleave) node.ondragleave = this._onDragLeave.bind(this);
		if (!node.ondrop) node.ondrop = this._onDrop.bind(this);
	}

	_changeSelected(newSelected) {
		this._previousSelected = this.selected;
		this.selected = newSelected;
		if (this.selected != this._previousSelected) {
			this._handleCheckboxChange();
		}
	}

	_onDragEnter(event) {
		event.preventDefault();
		if (this._isAllocated) return;
		if (event.dataTransfer.types.indexOf("assign-task") >= 0) {
			this.dispatchEvent(new CustomEvent("dragging-over", { detail: { draggingOver: true }, bubbles: false, composed: false }));
			this._changeSelected(true);
		}
	}

	_onDragLeave(event) {
		event.preventDefault();
		if (this._isAllocated) return;
		this.dispatchEvent(new CustomEvent("dragging-over", { detail: { draggingOver: false }, bubbles: false, composed: false }));
		this._changeSelected(this._previousSelected);
	}

	_onDragOver(event) {
		event.preventDefault();
	}

	_onDrop(event) {
		event.preventDefault();
		if (this._isAllocated) return;
		this.dispatchEvent(
			new CustomEvent(
				"assign-task", 
				{
					bubbles: false, composed: false
				}
			)
		);
		this.dispatchEvent(new CustomEvent("dragging-over", { detail: { draggingOver: false }, bubbles: false, composed: false }));
	}

	_handleOpenTap(event) {
		this.dispatchEvent(
			new CustomEvent(
				"open-people", 
				{
					detail: { people: this.people },
					bubbles: false, composed: false
				}
			)
		);
	}

	_handleCheckboxChange() {
		this.dispatchEvent(
			new CustomEvent(
				"people-selected-changed", 
				{
					detail: { people: this.people, selected: this.selected },
					bubbles: false, composed: false
				}
			)
		);
	}

	_handleExpandCollapse(people, allocatedDate, selected) {
		this._debounceHandleExpandCollapse = Debouncer.debounce(
			this._debounceHandleExpandCollapse, 
			microTask,
			() => {
				this._ironCollapseOpened = allocatedDate && allocatedDate != "" && selected;
			}
		);
	}

	_unassignMember(event) {
		event.stopPropagation();

		let selectedTasks = getTriserviceTaskAssignment().selectedTasks;
		if (selectedTasks.length == 1) {
			const task = selectedTasks[0];
			getTriserviceTaskAssignment().removeAllocatedPeople(task, this.allocation);
		}
	}

	_formatDate(date, currentUser) {
		if (!date || !currentUser) {
			return "";
		}
		return formatDate(date, currentUser._DateFormat, currentUser._Locale);
	}

	_computeDisableUnassignButton(resourceRecordID, disableUnassign) {
		return disableUnassign || !resourceRecordID;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/people-list/tricomp-people-card.js");
	}
}

window.customElements.define(TricompPeopleCard.is, TricompPeopleCard);