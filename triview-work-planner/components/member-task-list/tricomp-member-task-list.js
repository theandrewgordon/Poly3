/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { timeOut } from "../../../@polymer/polymer/lib/utils/async.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../../triplat-search-input/triplat-search-input.js";
import "../../routes/triroutes-work-planner.js";
import "../../services/triservice-people.js";
import "../../services/triservice-work-planner.js";
import "../../services/triservice-member-assigned-tasks.js";
import "../../services/triservice-security.js";
import "../../services/triservice-work-task.js";
import "../../styles/tristyles-work-planner.js";
import "../../components/undo-button/tricomp-undo-button.js";
import "./tricomp-member-task-card.js";
import "./tricomp-member-task-list-header.js";

class TricompMemberTaskList extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-member-task-list"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					overflow-y: auto;
				}

				:host([dir="ltr"]) {
					padding: 15px 40px 0px 20px;
				}

				:host([dir="rtl"]) {
					padding: 15px 2px 0px 40px;
				}

				.search-row {
					@apply --layout-horizontal;
					@apply --layout-center;
					flex-shrink: 0;
				}

				:host([dir="ltr"]) .search-row, :host([dir="ltr"]) .day-header {
					padding-right: 10px;
				}

				:host([dir="rtl"]) .search-row, :host([dir="rtl"]) .day-header {
					padding-left: 10px;
				}

				.search-input {
					@apply --layout-flex;
				}

				.divider {
					background-color: var(--tri-primary-content-accent-color);
					width: 2px;
					height: 20px;
					margin: 0px 5px; 
				}

				.day-header {
					padding-top: 30px;
					padding-bottom: 10px;
				}

				:host > tricomp-member-task-card:last-of-type {
					padding-bottom: 15px;
				}
			</style>

			<triservice-work-task task-search-fields="{{_taskSearchFields}}"></triservice-work-task>
			<triroutes-work-planner team-assignments-route-active="{{_teamAssignmentsRouteActive}}"></triroutes-work-planner>
			<triservice-work-planner current-user="{{_currentUser}}"></triservice-work-planner>
			<triservice-people selected-member="{{_selectedMember}}"></triservice-people>
			<triservice-member-assigned-tasks 
				assigned-tasks-grouped-by-day="{{_assignedTasksGroupedByDay}}"
				non-filtered-assigned-tasks="{{_nonFilteredAssignedTasks}}"
				task-filters="[[_taskFilters]]"
				loading="{{_loadingAssignedTasks}}">
			</triservice-member-assigned-tasks>
			<triservice-security 
				can-update-allocated-date="{{_canUpdateAllocatedDate}}" 
				can-update-allocated-hours="{{_canUpdateAllocatedHours}}"
				can-update-task-priority="{{_canUpdateTaskPriority}}">
			</triservice-security>

			<div class="search-row">
				<triplat-search-input id="searchInput"
					class="search-input"
					placeholder="Search"
					data="[[_nonFilteredAssignedTasks]]"
					aliases="[[_taskSearchFields]]"
					on-append-filters-changed="_handleAppendFiltersChanged"
					search-icon-precede>
				</triplat-search-input>
				<div class="divider"></div>
				<tricomp-undo-button></tricomp-undo-button>
			</div>

			<dom-if if="[[_isNonFilteredTasksEmpty]]">
				<template>
					<div class="message-placeholder" hidden\$="[[_loadingAssignedTasks]]">
						<div aria-label\$="[[_noAssignedTasksMessage]]" tabindex="0" aria-live="polite">[[_noAssignedTasksMessage]]</div>
					</div>
				</template>
			</dom-if>

			<dom-if if="[[_isNoSearchResults]]">
				<template>
					<div class="message-placeholder">
						<div aria-label\$="[[_noTaskFoundMessage]]" tabindex="0" aria-live="polite">[[_noTaskFoundMessage]]</div>
					</div>
				</template>
			</dom-if>
			
			<dom-repeat items="[[_assignedTasksGroupedByDay]]" as="dayTaskList">
				<template>
					<tricomp-member-task-list-header 
						class="day-header" day="[[dayTaskList.day]]" 
						current-user="[[_currentUser]]" availability="[[_selectedMember.availability]]"
						team-assignments-route-active="[[_teamAssignmentsRouteActive]]">
					</tricomp-member-task-list-header>
					<dom-repeat items="[[dayTaskList.tasks]]" as="task" index-as="taskIndex" mutable-data>
						<template>
							<tricomp-member-task-card task="[[task]]" current-user="[[_currentUser]]" 
								fit-into="[[_thisElement]]"
								disable-allocated-date="[[!_canUpdateAllocatedDate]]"
								disable-allocated-hours="[[!_canUpdateAllocatedHours]]"
								disable-priority="[[!_canUpdateTaskPriority]]">
							</tricomp-member-task-card>
						</template>
					</dom-repeat>
				</template>
			</dom-repeat>
		`;
	}
	static get properties() {
		return {
			_currentUser: {
				type: Object
			},

			_assignedTasksGroupedByDay: {
				type: Array
			},

			_nonFilteredAssignedTasks: {
				type: Array
			},

			_taskSearchFields: {
				type: Object
			},

			_taskFilters: {
				type: Array
			},

			_isNoSearchResults: {
				type: Boolean,
				value: true
			},

			_selectedMember: {
				type: Object
			},

			_loadingAssignedTasks: {
				type: Boolean
			},

			_teamAssignmentsRouteActive: {
				type: Boolean
			},

			_noAssignedTasksMessage: {
				type: String,
				computed: "_computeNoAssignedTasksMessage(_selectedMember)"
			},

			_noTaskFoundMessage: {
				type: String,
				value: () => {
					let __dictionary__message =  "No work tasks are available.";
					return __dictionary__message;
				}
			},

			_thisElement: {
				type: Object
			},

			_isNonFilteredTasksEmpty: {
				type: Boolean,
				value: false
			},

			_canUpdateAllocatedDate: {
				type: Boolean,
				value: false
			},

			_canUpdateAllocatedHours: {
				type: Boolean,
				value: false
			},

			_canUpdateTaskPriority: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleNonFilteredAssignedTasksChanged(_nonFilteredAssignedTasks.*)",
			"_computeIsNoSearchResults(_isNonFilteredTasksEmpty, _assignedTasksGroupedByDay)",
		]
	}

	ready() {
		super.ready();
		this._thisElement = this;
	}

	_computeNoAssignedTasksMessage(selectedMember) {
		let name = selectedMember ? selectedMember.name : "";
		let __dictionary__NoAssignedTasksMessage = "No work tasks are assigned to {1} in the selected week.";
		return __dictionary__NoAssignedTasksMessage.replace("{1}", name);
	}

	_handleNonFilteredAssignedTasksChanged(nonFilteredAssignedTasksChanges) {
		this._isNonFilteredTasksEmpty = !nonFilteredAssignedTasksChanges || !nonFilteredAssignedTasksChanges.base || nonFilteredAssignedTasksChanges.base.length == 0;
	}

	_handleAppendFiltersChanged(e) {
		let appendFilterChange = e.detail;
		
		if (!appendFilterChange.path) {
			let appendFilters = appendFilterChange.value;
			appendFilters.forEach(filter => this._addDescriptionUniversalFilter(filter));
			this._taskFilters = appendFilters;
		} else if (appendFilterChange.path == "appendFilters.splices") {
			var indexSplice = appendFilterChange.value.indexSplices[0];
			for (let i = 0; indexSplice.addedCount > 0 && i < indexSplice.addedCount; i++) {
				const filter = indexSplice.object[indexSplice.index + i];
				this._addDescriptionUniversalFilter(filter)
			}
			this.notifyPath(appendFilterChange.path.replace("appendFilters", "_taskFilters"), appendFilterChange.value);
		}
	}

	_addDescriptionUniversalFilter(filter) {
		if (filter.isUniversal && filter.filters.length > 0) {
			let newFilter = Object.assign({}, filter.filters[0]);
			newFilter.name = "description";
			newFilter.isStringWithId = false;
			newFilter.appendWithAnd = false;
			filter.filters.push(newFilter);
		}
	}

	_computeIsNoSearchResults(isNonFilteredTasksEmpty, assignedTasksGroupedByDay) {
		this._debounceComputeIsNoSearchResults = Debouncer.debounce(
			this._debounceComputeIsNoSearchResults,
			timeOut.after(100),
			() => {
				this._isNoSearchResults = !isNonFilteredTasksEmpty && (!assignedTasksGroupedByDay || assignedTasksGroupedByDay.length == 0);
			}
		);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/member-task-list/tricomp-member-task-list.js");
	}
}

window.customElements.define(TricompMemberTaskList.is, TricompMemberTaskList);