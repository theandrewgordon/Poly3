/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-pages/iron-pages.js";
import "../../../@polymer/iron-collapse/iron-collapse.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../week-selector/tricomp-week-selector.js";
import "../workgroup-selector/tricomp-workgroup-selector.js";
import "../task-list/tricomp-assigned-task-list.js";
import "../task-list/tricomp-overdue-task-list.js";
import "../task-list/tricomp-unassigned-task-list.js";
import "../task-list/tricomp-task-search-header.js";
import "../task-status-tab/tricomp-task-status-tab-small.js";
import { getTriroutesWorkPlanner } from "../../routes/triroutes-work-planner.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-work-planner.js";
import "../../services/triservice-work-task.js";
import "../../styles/tristyles-work-planner.js";
import { TrimixinTaskSection } from "./trimixin-task-section.js";

class TricompTaskSectionSmallLayout extends TrimixinTaskSection(PolymerElement) {
	static get is() { return "tricomp-task-section-small-layout"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					--tricomp-dropdown-menu-button: {
						@apply --layout-flex;
						margin-top: 10px;
					};
				}

				.section-container {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				:host(:not([_has-min-screen-height])) .section-container {
					overflow-y: auto;
				}

				.workgroup-container {
					background-color: var(--ibm-neutral-2);
					padding-left: 15px;
					padding-right: 15px;
					min-height: 85px;
					@apply --layout-horizontal;
					@apply --layout-center;
					flex-shrink: 0;
				}

				.workgroup-selector {
					align-items: normal;
					@apply --layout-vertical;
					@apply --layout-justified;
					@apply --layout-flex;
				}

				.scroll-container {
					@apply --layout-vertical;
				}

				:host([_has-min-screen-height]) .scroll-container {
					@apply --layout-flex;
					overflow-y: auto;
				}

				:host(:not([_has-min-screen-height])) .scroll-container {
					flex-shrink: 0;
				}

				:host(:not([_has-min-screen-height])) .task-list {
					display: block;
				}

				.week-selector {
					@apply --layout-self-center;
					margin-top: 5px;
					margin-bottom: 5px;
					flex-shrink: 0;
				}

				.week-selector[invisible] {
					display:none;
				}

				.task-status-tab {
					margin-top: 15px;
					border-top: 1px solid var(--tri-primary-content-accent-color);
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
					flex-shrink: 0;
				}

				.task-list {
					background-color: var(--primary-background-color);
				}

				.search-header {
					margin-left: 15px;
					margin-right: 15px;
					flex-shrink: 0;
				}

				.search-header[first] {
					margin-top: 15px;
				}

				.action-bar {
					@apply --layout-horizontal;
					@apply --layout-center;
					font-size: 14px;
					background-color: var(--tri-footer-background-color);
					color: var(--tri-footer-color);
					padding: 7px 15px;
					margin: 0px;
				}

				.selection-info {
					@apply --layout-horizontal;
					@apply --layout-end-justified;
					@apply --layout-flex;
				}

				.selection-info-txt {
					padding: 0px 10px;
				}

				.deselect-btn {
					@apply --layout-horizontal;
					@apply --layout-start-justified;
					color: var(--tri-info-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px;
				}

				.deselect-btn[pressed] {
					color: var(--tri-info-icon-button-press-color);
				}
				
				.deselect-btn[disabled] {
					color: var(--tri-disabled-icon-button-color);
				}

				.divider {
					margin: 0px 10px; 
				}

				paper-button.assign-to-btn {
					margin: 0px;
				}
			</style>

			<triservice-task-assignment id="taskAssignmentService" selected-tasks="{{_selectedTasks}}">
			</triservice-task-assignment>

			<triservice-work-planner
				current-user="{{_currentUser}}"
				task-start-date="{{_taskStartDate}}"
				task-end-date="{{_taskEndDate}}"
				has-min-screen-height="{{_hasMinScreenHeight}}">
			</triservice-work-planner>

			<triservice-work-task selected-status="{{_selectedStatus}}"></triservice-work-task>

			<triservice-security can-assign="{{_canAssign}}"></triservice-security>
			
			<div id="sectionContainer" class="section-container">
				<div class="workgroup-container">
					<tricomp-workgroup-selector class="workgroup-selector"></tricomp-workgroup-selector>
				</div>
				
				<div id="scrollContainer" class="scroll-container">
					<tricomp-week-selector class="week-selector" start-date="{{_taskStartDate}}" end-Date="{{_taskEndDate}}" 
						invisible\$="[[_isOverdueStatus(_selectedStatus)]]" small-layout>
					</tricomp-week-selector>
					
					<tricomp-task-search-header class="search-header" task-filters="{{_taskFilters}}" 
						first\$="[[_isOverdueStatus(_selectedStatus)]]">
					</tricomp-task-search-header>
				
					<tricomp-task-status-tab-small id="taskStatusTab" class="task-status-tab" selected="{{_selectedStatus}}" on-selected-changed="_handleSelectedStatusChanged">
					</tricomp-task-status-tab-small>

					<iron-pages selected="[[_selectedStatus]]" attr-for-selected="name" selected-attribute="active">
						<tricomp-unassigned-task-list name="unassigned" class="task-list" current-user="[[_currentUser]]" 
							task-filters="[[_taskFilters]]" small-layout scroll-container="[[_scrollContainer]]"
							card-layout>
						</tricomp-unassigned-task-list>

						<tricomp-assigned-task-list name="assigned" class="task-list" current-user="[[_currentUser]]"
							task-filters="[[_taskFilters]]" small-layout scroll-container="[[_scrollContainer]]"
							card-layout>
						</tricomp-assigned-task-list>

						<tricomp-overdue-task-list name="overdue" class="task-list" current-user="[[_currentUser]]"
							task-filters="[[_taskFilters]]" small-layout scroll-container="[[_scrollContainer]]"
							card-layout>
						</tricomp-overdue-task-list>
					</iron-pages>
				</div>
				<iron-collapse opened="[[_hasSelectedTasks]]">
					<div class="action-bar">
						<div class="selection-info">
							<div class="selection-info-txt">[[_selectedTasksLength]] Selected</div>
							<paper-button class="deselect-btn tri-disable-theme" on-tap="_handleDeselectAllTap">
								<span>Deselect All</span>
							</paper-button>
						</div>
						<div class="divider"></div>
						<paper-button class="assign-to-btn" footer on-tap="_handleAssignToTap" disabled="[[!_canAssign]]">Assign To</paper-button>
					</div>
				</iron-collapse>
			</div>
		`;
	}

	static get properties() {
		return {
			_scrollContainer: {
				type: Object
			},

			_selectedTasksLength: {
				tupe: Number,
				value: 0
			},

			_hasSelectedTasks: {
				type: Boolean,
				value: false
			},

			_canAssign: {
				type: Boolean
			},

			_hasMinScreenHeight: {
				type: Boolean,
				observer: "_handleHasMinScreenHeightChanged",
				reflectToAttribute: true
			}
		};
	}

	static get observers() {
		return [
			"_handleSelectedTasksChanges(_selectedTasks.*)"
		]
	}

	ready() {
		super.ready();
		this._handleHasMinScreenHeightChanged(this._hasMinScreenHeight);
	}

	_handleHasMinScreenHeightChanged(hasMinScreenHeight) {
		this._scrollContainer = hasMinScreenHeight ? this.$.scrollContainer : this.$.sectionContainer;
	}

	_handleSelectedTasksChanges(selectedTasksChange) {
		let selectedTasks = selectedTasksChange ? selectedTasksChange.base : null;
		this._selectedTasksLength = selectedTasks ? selectedTasks.length : 0;
		this._hasSelectedTasks = this._selectedTasksLength > 0;
	}

	_handleDeselectAllTap() {
		this._selectedTasks = [];
	}

	_handleAssignToTap() {
		this.$.taskAssignmentService.selectedPeople = [];
		getTriroutesWorkPlanner().openPeopleList();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/assignment/tricomp-task-section-small-layout.js");
	}
}

window.customElements.define(TricompTaskSectionSmallLayout.is, TricompTaskSectionSmallLayout);