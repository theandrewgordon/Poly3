/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { dom } from "../../../@polymer/polymer/lib/legacy/polymer.dom.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../components/week-selector/tricomp-week-selector.js";
import "../../components/people-list/tricomp-people-list.js";
import { TrimixinAssignmentSummary } from "../../components/assignment-summary/trimixin-assignment-summary.js";
import "../../routes/triroutes-work-planner.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-security.js";
import "../../services/triservice-work-planner.js";
import "../../styles/tristyles-work-planner.js";

class TripagePeopleList extends TrimixinAssignmentSummary(mixinBehaviors([TriDirBehavior], PolymerElement)) {
	static get is() { return "tripage-people-list"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
				}

				:host(:not([_has-min-screen-height])) {
					overflow-y: auto;
				}

				.main-container {
					@apply --layout-vertical;
					flex-shrink: 0;
				}

				:host([_has-min-screen-height]) .main-container {
					@apply --layout-flex;
					overflow-y: auto;
				}

				.week-selector {
					@apply --layout-self-center;
					margin-top: 5px;
					margin-bottom: 5px;
					flex-shrink: 0;
				}

				.people-list {
					flex-shrink:0;
				}

				:host([_has-min-screen-height]) .people-list {
					@apply --layout-flex;
				}

				.action-bar {
					@apply --layout-vertical;
					flex-shrink: 0;
					font-size: 14px;
					background-color: var(--tri-footer-background-color);
					color: var(--tri-footer-color);
					padding: 0px 15px;
					margin: 0px;
				}

				.selection-info {
					@apply --layout-horizontal;
					@apply --layout-center;
					height: 60px
				}

				.selected-task-btn {
					@apply --layout-horizontal;
					color: var(--tri-info-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px ;
				}

				:host([dir="ltr"]) .selected-task {
					@apply --layout-horizontal;
					@apply --layout-end-justified;
					padding-right: 10px;
				}

				:host([dir="ltr"]) .selected-people {
					padding-left: 10px;
				}
				
				:host([dir="rtl"]) .selected-task {
					@apply --layout-horizontal;
					@apply --layout-start-justified;
					padding-left: 10px;
				}

				:host([dir="rtl"]) .selected-people  {
					padding-right: 10px;
					text-align: end;
				}

				.selected-task, .selected-people {
					@apply --layout-flex;
				}

				.buttons {
					@apply --layout-horizontal;
					@apply --layout-center;
					height: 65px
				}

				.buttons > paper-button {
					@apply --layout-flex;
				}

				.dropdown-content {
					@apply --layout-vertical;
					padding: 0px 10px 15px 10px;
					background-color: var(--primary-background-color);
					border: 1px solid var(--ibm-gray-30);
					box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
					border-radius: 4px;
				}

				iron-dropdown {
					max-width: 80%;
				}

				.task-info {
					padding-top: 15px;
				}

				.arrow:after, .arrow:before {
					border: solid transparent;
					content: " ";
					height: 0;
					width: 0;
					position: absolute;
					pointer-events: none;
					top: 100%;
					margin-top: -1px;
					left: 30%;
				}

				.arrow:after {
					border-width: 10px;
					margin-left: 1px;
					border-top-color: var(--primary-background-color);
				}

				.arrow:before {
					border-width: 11px;
					border-top-color: var(--ibm-gray-30);
				}

				.close-button {
					position: absolute;
					top: -11px;
					z-index: 999;
					height: 22px;
					width: 22px;
					--paper-icon-button: {
						padding: 0px;
					};
				}

				:host([dir="ltr"]) .close-button {
					right: -11px;
				}

				:host([dir="rtl"]) .close-button {
					left: -11px;
				}

				.close-button[focused] {
					color: var(--tri-primary-icon-button-hover-color);
				}
			</style>

			<triroutes-work-planner id="routesWorkPlanner" people-list-route-active="{{_peopleListRouteActive}}">
			</triroutes-work-planner>

			<triservice-work-planner people-start-date="{{_peopleStartDate}}" people-end-date="{{_peopleEndDate}}" has-min-screen-height="{{_hasMinScreenHeight}}">
			</triservice-work-planner>

			<triservice-task-assignment id="serviceTaskAssignment" selected-tasks="{{_selectedTasks}}" selected-people="{{_selectedPeople}}"
				allocated-people="{{_allocatedPeople}}" is-selected-task-assigned="{{_isSelectedTaskAssigned}}">
			</triservice-task-assignment>

			<triservice-security can-assign="{{_canAssign}}"></triservice-security>
			
			<div class="main-container">
				<tricomp-week-selector class="week-selector" start-date="{{_peopleStartDate}}" end-Date="{{_peopleEndDate}}" small-layout></tricomp-week-selector>
				<tricomp-people-list class="people-list" small-layout></tricomp-member-task-list>
			</div>

			<div class="action-bar">
				<div id="selectionInfo" class="selection-info">
					<div class="selected-task">
						<paper-button id="selectedTaskBtn" class="selected-task-btn tri-disable-theme" on-tap="_handleTaskInfoTap">
							<span>[[_computeSelectedTask(_selectedTasks.*)]]</span>
						</paper-button>
					</div>
					<div class="divider"></div>
					<div class="selected-people">[[_computeSelectedPeopleCount(_selectedPeople.*)]]</div>
				</div>
				
				<div class="buttons">
					<paper-button footer-secondary on-tap="_handleCancelTap">Cancel</paper-button>
					<paper-button footer on-tap="_handleAssignTap" disabled="[[_disableAssignButton]]">Assign</paper-button>
				</div>
			</div>

			<iron-dropdown id="tasksDropdown" allow-outside-scroll horizontal-align="center" vertical-align="bottom" 
				vertical-offset="50" horizontal-offset="0"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]" 
				scroll-action="cancel" on-iron-overlay-opened="_handleDropdownOpened" on-iron-overlay-canceled="_onDropdownCanceled">

				<div class="dropdown-content arrow" slot="dropdown-content">
					<dom-repeat as="task" id="selectedTasksDomRepeat">
						<template>
							<div class="task-info">[[task.id]] - [[task.name]]</div>
						</template>
					</dom-repeat>
					<paper-icon-button class="close-button" icon="ibm-glyphs:popup-close-filled" on-tap="_handleCloseDropdown" alt="Close"></paper-icon-button>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			_routeParams: {
				type: Object
			},

			_peopleStartDate: {
				type:String
			},

			_peopleEndDate: {
				type:String
			},

			_peopleListRouteActive: {
				type: Boolean
			},

			_hasMinScreenHeight: {
				type: Boolean,
				reflectToAttribute: true
			}
		};
	}

	_computeSelectedTask(selectedTasksChange)  {
		let size = selectedTasksChange && selectedTasksChange.base ? selectedTasksChange.base.length : 0;
		let message;
		if (size > 1) {
			var __dictionary__multipleTasks ="{1} tasks selected";
			message = __dictionary__multipleTasks.replace("{1}", size);
		} else if (size == 1) {
			var taskId = selectedTasksChange.base[0].id;
			var __dictionary__multipleTasks = "Task {1}";
			message = __dictionary__multipleTasks.replace("{1}", taskId);
		} else {
			var __dictionary__noTask = "No task selected";
			message = __dictionary__noTask;
		}
		return message;
	}

	_handleCancelTap() {
		window.history.back();
	}

	_handleAssignTap(e) {
		let assignPromise = super._handleAssignTap(e);
		if (assignPromise) {
			assignPromise.then(() => window.history.back());
		}
	}

	_handleTaskInfoTap() {
		if (!this.$.tasksDropdown.opened) {
			this.$.tasksDropdown.positionTarget = this.$.selectionInfo;
			this.$.selectedTasksDomRepeat.items = [];
			this.$.selectedTasksDomRepeat.items = this._selectedTasks;
			setTimeout(() => this.$.tasksDropdown.open(), 10);
		} else {
			this.$.tasksDropdown.close();
		}
	}

	_handleDropdownOpened(e) {
		this.$.tasksDropdown.notifyResize();
	}

	_onDropdownCanceled(event) {
		var uiEvent = event.detail;
		var trigger = this.$.selectedTaskBtn;
		var path = dom(uiEvent).path;

		if (path && path.indexOf(trigger) > -1) {
			event.preventDefault();
		}
	}

	_handleCloseDropdown(event) {
		this.$.tasksDropdown.close();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/people-list/tripage-people-list.js");
	}
}

window.customElements.define(TripagePeopleList.is, TripagePeopleList);