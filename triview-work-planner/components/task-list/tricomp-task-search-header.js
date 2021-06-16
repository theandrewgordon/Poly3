/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { root } from "../../../@polymer/polymer/lib/utils/path.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-search-input/triplat-search-input.js";

import "../../styles/tristyles-work-planner.js";

class TricompTaskSearchHeader extends PolymerElement {
	static get is() { return "tricomp-task-search-header"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}
			</style>

			<triservice-work-task unassigned-tasks="{{_unassignedTasks}}" assigned-tasks="{{_assignedTasks}}" overdue-tasks="{{_overdueTasks}}"
				selected-status="{{_selectedStatus}}" task-search-fields="{{_taskSearchFields}}">
			</triservice-work-task>

			<triplat-search-input id="searchInput"
				class="search-input"
				placeholder="Search"
				data="[[_nonFilteredTasks]]"
				aliases="[[_taskSearchFields]]"
				on-append-filters-changed="_handleAppendFiltersChanged"
				search-icon-precede
				scroll-element-into-view>
			</triplat-search-input>
		`;
	}

	static get properties() {
		return {
			taskFilters: {
				type: Array,
				notify: true
			},

			_unassignedTasks: {
				type:Array
			},

			_assignedTasks: {
				type:Array 
			},

			_overdueTasks: {
				type:Array 
			},

			_nonFilteredTasks: {
				type:Array
			},

			_taskSearchFields: {
				type: Object
			},

			_selectedStatus: {
				type: String
			}
		};
	}

	static get observers() {
		return [
			"_handleTasksChanges(_unassignedTasks.*, _selectedStatus)",
			"_handleTasksChanges(_assignedTasks.*, _selectedStatus)",
			"_handleTasksChanges(_overdueTasks.*, _selectedStatus)"
		]
	}

	_handleTasksChanges(tasksChange, selectedStatus) {
		let rootPath = root(tasksChange.path);
		if (rootPath.replace("_", "").replace("Tasks", "") == selectedStatus) {
			this.notifyPath(tasksChange.path.replace(rootPath, "_nonFilteredTasks"), tasksChange.value);
		}
	}

	_handleAppendFiltersChanged(e) {
		let appendFilterChange = e.detail;
		
		if (!appendFilterChange.path) {
			let appendFilters = appendFilterChange.value;
			appendFilters.forEach(filter => this._addDescriptionUniversalFilter(filter));
			this.taskFilters = appendFilters;
		} else if (appendFilterChange.path == "appendFilters.splices") {
			var indexSplice = appendFilterChange.value.indexSplices[0];
			for (let i = 0; indexSplice.addedCount > 0 && i < indexSplice.addedCount; i++) {
				const filter = indexSplice.object[indexSplice.index + i];
				this._addDescriptionUniversalFilter(filter)
			}
			this.notifyPath(appendFilterChange.path.replace("appendFilters", "taskFilters"), appendFilterChange.value);
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

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-task-search-header.js");
	}
}

window.customElements.define(TricompTaskSearchHeader.is, TricompTaskSearchHeader);