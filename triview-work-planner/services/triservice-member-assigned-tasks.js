/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { microTask, timeOut } from "../../@polymer/polymer/lib/utils/async.js";
import "../../triplat-ds/triplat-ds.js";
import "../../triplat-query/triplat-query.js";
import { isDateBetween } from "../utils/triutils-date.js";
import "../routes/triroutes-work-planner.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import "./triservice-work-planner.js";
import "./triservice-people.js";
import { getTriserviceWorkTask } from "./triservice-work-task.js";

export function getTriserviceMemberAssignedTasks() {
	return getService(TriserviceMemberAssignedTasks.is);
};

class TriserviceMemberAssignedTasks extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-member-assigned-tasks"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triroutes-work-planner team-assignments-route-active="{{_teamAssignmentsRouteActive}}"></triroutes-work-planner>

					<triservice-work-planner people-start-date="{{_peopleStartDate}}" people-end-date="{{_peopleEndDate}}"></triservice-work-planner>
					<triservice-people selected-member="{{_selectedMember}}"></triservice-people>

					<triplat-ds id="memberAssignedTasksDS" name="memberAssignedTasks" loading="{{_loadingMemberAssignedTasks}}" force-server-filtering manual>
						<triplat-ds-context id="memberAssignedTasksDSContext" name="membersOfSupervisedTeams"></triplat-ds-context>
						<triplat-query delay="0">
							<triplat-query-filter name="allocatedDate" operator="greater than or equals" type="DATE" value="[[_peopleStartDate]]"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="allocatedDate" operator="less than or equals" type="DATE" value="[[_peopleEndDate]]"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-query id="taskQuery" append-filters="[[taskFilters]]" delay="0">
						<triplat-query-sort name="allocatedDate" type="DATE"></triplat-query-sort>
					</triplat-query>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			assignedTasksGroupedByDay: {
				type: Array,
				notify: true
			},

			nonFilteredAssignedTasks: {
				type: Array,
				notify: true
			},

			taskFilters: {
				type: Array,
				notify: true
			},

			_selectedMember: {
				type: Object,
				notify: true
			},

			_peopleStartDate: {
				type: String
			},

			_peopleEndDate: {
				type: String
			},

			_teamAssignmentsRouteActive: {
				type: Boolean,
			},

			_loadingMemberAssignedTasks: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingMemberAssignedTasks)",
			"_handleTaskFiltersChanged(taskFilters.*)",
			"_refreshMemberAssignedTasks(_selectedMember, _peopleStartDate, _peopleEndDate, _teamAssignmentsRouteActive)"
		]
	}

	clientRemoveAssignedTaskFromMember(taskId, memberId) {
		if (this._isRootInstance) {
			if (!this.nonFilteredAssignedTasks) return;
			if (!this._selectedMember || this._selectedMember._id != memberId) return;

			let index = this.nonFilteredAssignedTasks.findIndex((item) => item._id == taskId);
			if (index > -1) {
				this.splice("nonFilteredAssignedTasks", index, 1);
				this._groupAssignedTasksByDay(this.nonFilteredAssignedTasks);
			}
		} else {
			return this._rootInstance.clientRemoveAssignedTaskFromMember(taskId, memberId);
		}
	}

	_clientAddAssignedTaskToMember(task, memberId) {
		if (!task || !this._selectedMember || this._selectedMember._id != memberId) return;

		if (this.nonFilteredAssignedTasks === null || this.nonFilteredAssignedTasks === undefined) {
			this.nonFilteredAssignedTasks = [task];
		} else {
			let index = this.nonFilteredAssignedTasks.findIndex((item) => item._id == task._id);
			if (index < 0) {
				this.push("nonFilteredAssignedTasks", task);
			}
		}
		this._groupAssignedTasksByDay(this.nonFilteredAssignedTasks);
	}

	clientChangeAssignedTaskAllocationDate(task, allocatedDate, memberId) {
		if (this._isRootInstance) {
			let assignedTask = this.nonFilteredAssignedTasks.find((item) => item._id == task._id);
			if (assignedTask) {
				task = assignedTask;
			}
			task.allocatedDate = allocatedDate;

			if (!this._selectedMember || this._selectedMember._id != memberId) return;

			if (isDateBetween(allocatedDate, this._peopleStartDate, this._peopleEndDate)) {
				this._clientAddAssignedTaskToMember(task, memberId);
			} else {
				this.clientRemoveAssignedTaskFromMember(task._id, memberId);
			}
		} else {
			return this._rootInstance.clientChangeAssignedTaskAllocationDate(task, allocatedDate, memberId);
		}
	}

	clientChangeAssignedTaskAllocationHours(taskId, allocatedHours, memberId) {
		if (this._isRootInstance) {
			let task = this.nonFilteredAssignedTasks.find((item) => item._id == taskId);
			if (!task) return;

			task.allocatedHours = allocatedHours;
			if (!this._selectedMember || this._selectedMember._id != memberId) return;

			if (isDateBetween(task.allocatedDate, this._peopleStartDate, this._peopleEndDate)) {
				this._groupAssignedTasksByDay(this.nonFilteredAssignedTasks);
			}
		} else {
			return this._rootInstance.clientChangeAssignedTaskAllocationHours(taskId, allocatedHours, memberId);
		}
	}

	refreshMemberAssignedTasksAfterAssignment(taskId, memberId, allocationDate) {
		if (this._isRootInstance) {
			if (!this._selectedMember || this._selectedMember._id != memberId) return;
			if (!isDateBetween(allocationDate, this._peopleStartDate, this._peopleEndDate)) return;
			if (this.nonFilteredAssignedTasks && this.nonFilteredAssignedTasks.findIndex((item) => item._id == taskId) >= 0) return;

			this._refreshMemberAssignedTasks(this._selectedMember, this._peopleStartDate, this._peopleEndDate, this._teamAssignmentsRouteActive);
		} else {
			return this._rootInstance.refreshMemberAssignedTasksAfterAssignment(taskId, memberId, allocationDate);
		}
	}

	_refreshMemberAssignedTasks(selectedMember, peopleStartDate, peopleEndDate, teamAssignmentsRouteActive) {
		if (this._isRootInstance) {
			this._debounceRefreshMemberAssignedTasks = Debouncer.debounce(
				this._debounceRefreshMemberAssignedTasks, 
				microTask,
				() => {
					if (teamAssignmentsRouteActive && selectedMember && peopleStartDate && peopleEndDate) {
						this.shadowRoot.querySelector("#memberAssignedTasksDSContext").contextId = selectedMember._id;
						this.shadowRoot.querySelector("#memberAssignedTasksDS").refresh()
							.then(this._returnDataFromResponse.bind(this))
							.then(tasks => this.nonFilteredAssignedTasks = getTriserviceWorkTask().processTaskLocationPath(tasks))
							.then(this._groupAssignedTasksByDay.bind(this));
					} else {
						this.shadowRoot.querySelector("#memberAssignedTasksDSContext").contextId = null;
					}
				}
			);
		}
	}

	_handleTaskFiltersChanged() {
		if (this._isRootInstance) {
			this._groupAssignedTasksByDay(this.nonFilteredAssignedTasks);
		}
	}

	_groupAssignedTasksByDay(tasks) {
		this._debounceGroupAssignedTasksByDay = Debouncer.debounce(
			this._debounceGroupAssignedTasksByDay, 
			timeOut.after(5),
			() => {
				let taskQuery = this.shadowRoot.querySelector("#taskQuery");
				taskQuery.data = [];
				taskQuery.data = tasks;
				const sortedTasks = taskQuery.filteredDataOut;

				let tasksByDay = [];
				let currentDay = null;
				for (let i = 0; sortedTasks && i < sortedTasks.length; i++) {
					const task = sortedTasks[i];
					const day = moment.parseZone(task.allocatedDate).format("YYYY-MM-DD");
					if (currentDay && currentDay.day != day) {
						tasksByDay.push(currentDay);
					}
					if (!currentDay || currentDay.day != day) {
						currentDay = {
							day: day,
							tasks: []
						};
					}
					currentDay.tasks.push(task);
				}
				if (currentDay) tasksByDay.push(currentDay);
				this.assignedTasksGroupedByDay = tasksByDay;
			}
		);
	}

	clientUpdateMemberAssignedTaskPriority(taskId, priority) {
		if (this._isRootInstance) {
			let task = this.nonFilteredAssignedTasks.find((item) => item._id == taskId);
			if (!task) return;

			this._clientUpdateTaskProperty(task, "priority", (priority && priority.priority) ? priority.priority : null);
			task.priorityENUS = (priority && priority.priorityENUS) ? priority.priorityENUS : null;
			task.priorityColor = (priority && priority.priorityColor) ? priority.priorityColor : null;
			task.priorityRanking = (priority && priority.priorityRanking) ? priority.priorityRanking : null;

			if (isDateBetween(task.allocatedDate, this._peopleStartDate, this._peopleEndDate)) {
				this._groupAssignedTasksByDay(this.nonFilteredAssignedTasks);
			}
		} else {
			return this._rootInstance.clientUpdateMemberAssignedTaskPriority(taskId, priority);
		}
	}

	_clientUpdateTaskProperty(task, property, value) {
		let taskIndex = this.nonFilteredAssignedTasks.findIndex((item) => item._id == task._id);
		if (taskIndex > -1) this.set(`nonFilteredAssignedTasks.${taskIndex}.${property}`, value);
	}
};

window.customElements.define(TriserviceMemberAssignedTasks.is, TriserviceMemberAssignedTasks);