/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/paper-button/paper-button.js";
import { getTriroutesWorkPlanner } from "../../routes/triroutes-work-planner.js";

export const TrimixinTaskCard = (superClass) => class extends superClass {
	static get viewFullTaskRowTemplate() {
		return html`
			<style include="tristyles-theme">
				.view-full-task-container {
					@apply --layout-end-justified;
				}

				.view-full-task-btn {
					@apply --layout-horizontal;
					color: var(--tri-primary-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px;
				}

				.view-full-task-btn:hover {
					color: var(--tri-primary-icon-button-hover-color);
				}

				.view-full-task-btn:hover > span {
					text-decoration: underline;
				}

				.view-full-task-btn[pressed] {
					color: var(--tri-primary-icon-button-press-color);
				}
			</style>
			<dom-if if="[[!smallLayout]]">
				<template>
					<div class="horizontal-details view-full-task-container">
						<paper-button class="view-full-task-btn tri-disable-theme" on-tap="_onTapViewFullTask">
							<span>View full task details</span>
						</paper-button>
					</div>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			task: {
				type: Object
			},

			currentUser: {
				type: Object
			},

			disableDrag: {
				type: Boolean,
				value: false
			},

			disablePriority: {
				type: Boolean,
				value: false
			},

			disableDate: {
				type: Boolean,
				value: false
			},

			selected: {
				type: Boolean,
				value: false
			},

			dragImageElement: {
				type: Object
			},

			dragging: {
				type: Boolean,
				value: false
			},

			assignmentStatusField: {
				type: Boolean,
				value: false
			},

			assignButton: {
				type: Boolean,
				value: false
			},

			plannedStartEndField: {
				type: Boolean,
				value: false
			},

			duoOnField: {
				type: Boolean,
				value: false
			},

			timeEstimateField: {
				type: Boolean,
				value: false
			},

			typeFieldMiddle: {
				type: Boolean,
				value: false
			},

			typeFieldLast: {
				type: Boolean,
				value: false
			},

			scrollContainer: {
				type: Object
			},

			smallLayout: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			mediumLayout: {
				type: Boolean,
				value: false
			},

			noSelection: {
				type: Boolean,
				value: false
			},

			focused: {
				type: Boolean,
				reflectToAttribute: true,
				computed: "_computeFocused(_priorityOpened, _workHoursOpened, _plannedStartOpened, _plannedEndOpened)"
			},

			_priorityOpened: {
				type: Boolean
			},

			_workHoursOpened: {
				type: Boolean
			},

			_plannedStartOpened: {
				type: Boolean
			},

			_plannedEndOpened: {
				type: Boolean
			},

			_smallOrMedium: {
				type: Boolean,
				computed: "_isSmallOrMedium(smallLayout, mediumLayout)",
				reflectToAttribute: true
			}
		};
	}

	_initializeSetupDraggable(element) {
		let draggableList = element.shadowRoot.querySelectorAll("[draggable]");
		draggableList.forEach(node => this._setupDraggable(node));
		this.animationConfig = {
			name: "slide-left-animation",
			node: element.$.card,
			timing: {"duration":500,"easing":"cubic-bezier(0.4, 0, 0.2, 1)","fill":"both"}
		};
	}

	_setupDraggable(node) {
		node.ondragstart = this._onDragStart.bind(this);
		node.ondragend = this._onDragEnd.bind(this);
	}

	_changeSelected(newSelected) {
		this._previousSelected = this.selected;
		this.selected = newSelected;
		if (this.selected != this._previousSelected) {
			this._handleCheckboxChange();
		}
	}

	_onDragStart(event) {
		this._changeSelected(true);
		this.dispatchEvent(new CustomEvent("dragging", { detail: { dragging: true }, bubbles: false, composed: false }));
		event.dataTransfer.effectAllowed = "link";
		event.dataTransfer.setData("assign-task", this.task._id);
		event.dataTransfer.setDragImage(this.dragImageElement, 0, 0);
	}

	_onDragEnd(event) {
		this._changeSelected(this._previousSelected);
		this.dispatchEvent(new CustomEvent("dragging", { detail: { dragging: false }, bubbles: false, composed: false }));
	}

	_handleCheckboxChange() {
		this.dispatchEvent(
			new CustomEvent(
				"task-selected-changed", 
				{
					detail: { task: this.task, selected: this.selected },
					bubbles: false, composed: false
				}
			)
		);
	}

	_computeFocused(priorityOpened, workHoursOpened, plannedStartOpened, plannedEndOpened) {
		return priorityOpened || workHoursOpened || plannedStartOpened || plannedEndOpened;
	}

	_computeDraggable(disableDrag) {
		return disableDrag ? false : "true";
	}

	_isSmallOrMedium(smallLayout, mediumLayout) {
		return smallLayout || mediumLayout;
	}

	_onTapViewFullTask() {
		getTriroutesWorkPlanner().openFullTaskRecordOnClassic(this.task._id);
	}
}