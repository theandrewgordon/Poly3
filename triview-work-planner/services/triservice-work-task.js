/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../@polymer/polymer/lib/utils/async.js";
import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { TriPlatDs } from "../../triplat-ds/triplat-ds.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import "../routes/triroutes-work-planner.js";
import { isDateBetween } from "../utils/triutils-date.js";
import { getTriserviceMessage } from "./triservice-message.js";
import { getTriserviceMemberAssignedTasks } from "./triservice-member-assigned-tasks.js";
import { getTriserviceTaskAssignment } from "./triservice-task-assignment.js";
import "./triservice-work-planner.js";
import "./triservice-workgroup.js";

export function getTriserviceWorkTask() {
	return getService(TriserviceWorkTask.is);
};

class TriserviceWorkTask extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-work-task"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triroutes-work-planner assignment-route-active="{{_assignmentRouteActive}}" team-assignments-route-active="{{_teamAssignmentsRouteActive}}"></triroutes-work-planner>

					<triservice-work-planner id="workPlannerService"
						current-user="{{_currentUser}}"
						assignment-status="{{_assignmentStatus}}"
						task-start-date="{{_taskStartDate}}"
						task-end-date="{{_taskEndDate}}"
						small-layout="{{_smallLayout}}">
					</triservice-work-planner>

					<triservice-workgroup selected-workgroup="{{_selectedWorkgroup}}"></triservice-workgroup>

					<triplat-ds id="taskPrioritiesDS" name="taskPriorities" data="{{taskPriorities}}" loading="{{_loadingTaskPriorities}}" manual></triplat-ds>

					<triplat-ds id="workTaskDS" name="workTask" loading="{{_loadingWorkTask}}" manual>
						<triplat-ds-instance id="workTaskDSInstance"></triplat-ds-instance>
					</triplat-ds>

					<triplat-ds id="unassignedTasksDS" name="unassignedTasks" loading="{{loadingUnassignedTasks}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter name="organizationRecordId" operator="equals" value="[[_selectedWorkgroup._id]]"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="plannedStart" operator="greater than or equals" type="DATE_TIME" value="[[_filterStartDate]]"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="plannedStart" operator="less than" type="DATE_TIME" value="[[_filterEndDate]]"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="assignedTasksDS" name="assignedTasks" loading="{{loadingAssignedTasks}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter name="organizationRecordId" operator="equals" value="[[_selectedWorkgroup._id]]"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="plannedStart" operator="greater than or equals" type="DATE_TIME" value="[[_filterStartDate]]"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="plannedStart" operator="less than" type="DATE_TIME" value="[[_filterEndDate]]"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="overdueTasksDS" name="allTasks" loading="{{loadingOverdueTasks}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter name="organizationRecordId" operator="equals" value="[[_selectedWorkgroup._id]]"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="plannedEnd" operator="less than" type="DATE_TIME" value="[[_filterEndDate]]"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			taskPriorities: {
				type: Array,
				notify: true
			},

			unassignedTasks: {
				type: Array,
				notify: true
			},

			assignedTasks: {
				type: Array,
				notify: true
			},

			overdueTasks: {
				type: Array,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			selectedStatus: {
				type: Boolean,
				notify: true
			},

			taskSearchFields: {
				type: Object,
				value: {},
				notify: true
			},

			_currentUser: {
				type: Object
			},

			_assignmentStatus: {
				type: Array
			},

			_assignmentRouteActive: {
				type: Boolean,
				observer: "_handleAssignmentRouteActiveChanged"
			},

			_teamAssignmentsRouteActive: {
				type: Boolean,
			},

			_taskStartDate: {
				type: String
			},

			_taskEndDate: {
				type: String
			},

			_selectedWorkgroup: {
				type: Object
			},

			_filterStartDate: {
				type: String,
				value: ""
			},

			_filterEndDate: {
				type: String,
				value: ""
			},

			_smallLayout: {
				type: Boolean,
			},

			_loadingTaskPriorities: {
				type: Boolean,
				value: false
			},

			_loadingWorkTask: {
				type: Boolean,
				value: false
			},

			loadingUnassignedTasks: {
				type: Boolean,
				value: false,
				notify: true
			},

			loadingAssignedTasks: {
				type: Boolean,
				value: false,
				notify: true
			},

			loadingOverdueTasks: {
				type: Boolean,
				value: false,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			"_refreshUnassignedTasks(_currentUser, _selectedWorkgroup, _taskStartDate, _taskEndDate)",
			"_refreshAssignedTasks(_currentUser, _selectedWorkgroup, _taskStartDate, _taskEndDate)",
			"_refreshOverdueTasks(_currentUser, _selectedWorkgroup)",
			"_handleLoadingChanged(_loadingTaskPriorities, _loadingWorkTask, loadingUnassignedTasks, loadingAssignedTasks, loadingOverdueTasks)"
		]
	}

	ready() {
		super.ready();
		if (this._isRootInstance) {
			var __dictionary__id = "ID";
			var __dictionary__building = "Building";
			var __dictionary__floor = "Floor";
			var __dictionary__space = "Space";
			var __dictionary__name = "Name";
			var __dictionary__priority = "Priority";
			var __dictionary__requestClass = "Request Class";
			var __dictionary__serviceClass = "Service Class";
			var __dictionary__type = "Type";

			let taskSearchFields = {};
			taskSearchFields["id"] = __dictionary__id;
			taskSearchFields["_building"] = __dictionary__building;
			taskSearchFields["_floor"] = __dictionary__floor;
			taskSearchFields["_space"] = __dictionary__space;
			taskSearchFields["name"] = __dictionary__name;
			taskSearchFields["priority"] = __dictionary__priority;
			taskSearchFields["requestClass"] = __dictionary__requestClass;
			taskSearchFields["serviceClass"] = __dictionary__serviceClass;
			taskSearchFields["type"] = __dictionary__type;
			this.taskSearchFields = taskSearchFields;
			this.selectedStatus = "unassigned";
		}
	}

	refreshTaskPriorities(force) {
		if (this._isRootInstance) {
			if (force || this.taskPriorities == null || this.taskPriorities.length == 0) {
				return this.shadowRoot.querySelector("#taskPrioritiesDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.taskPriorities);
			}
		} else {
			return this._rootInstance.refreshTaskPriorities(force);
		}
	}

	_refreshUnassignedTasks(currentUser, selectedWorkgroup, taskStartDate, taskEndDate) {
		if (this._isRootInstance) {
			if (!this._assignmentRouteActive) {
				return;
			}
			this._debounceRefreshUnassignedTasksChanged = Debouncer.debounce(
				this._debounceRefreshUnassignedTasksChanged, 
				microTask,
				async () => {
					if (!this._isEmptyObj(currentUser) && !this._isEmptyObj(selectedWorkgroup) && (taskStartDate && taskStartDate != "") && (taskEndDate && taskEndDate != "") && this.selectedStatus == "unassigned") {
						await this._setFilterDates("", "");
						await this._setFilterDates(
							this._filterStartDate = moment.tz(moment(taskStartDate).utc().format("YYYY-MM-DD"), currentUser._TimeZoneId).toISOString(),
							this._filterEndDate = moment.tz(moment(taskEndDate).utc().add(1, "days").format("YYYY-MM-DD"), currentUser._TimeZoneId).toISOString()
						);
						this.shadowRoot.querySelector("#unassignedTasksDS").refresh()
							.then(this._returnDataFromResponse.bind(this))
							.then(tasks => this.unassignedTasks = this.processTaskLocationPath(tasks));
					}
				}
			);
		}
	}

	processTaskLocationPath(tasks) {
		if (this._isRootInstance) {
			if (!tasks) return tasks;
			tasks.forEach((task) => {
				if (task.locationPath && task.locationPath != "" && task.locationTypeENUS && task.locationTypeENUS != "") {
					let locationArray = task.locationPath.trim().split("\\");
					let length = locationArray.length;

					switch (task.locationTypeENUS) {
						case "Building":
							task._building = locationArray[length - 1] ? locationArray[length - 1] : "";
							task._location = task._building;
							break;

						case "Floor":
							task._building = locationArray[length - 2] ? locationArray[length - 2] : "";
							task._floor = locationArray[length - 1] ? locationArray[length - 1] : "";
							task._location = `${task._building}, ${task._floor}`;
							break;

						case "Space":
							task._building = locationArray[length - 3] ? locationArray[length - 3] : "";
							task._floor = locationArray[length - 2] ? locationArray[length - 2] : "";
							task._space = locationArray[length - 1] ? locationArray[length - 1] : "";
							task._location = `${task._building}, ${task._floor}, ${task._space}`;
							break;
						default:
							task._location = locationArray[length - 1] ? locationArray[length - 1] : "";
							break;
					}
				}
			});
			return tasks;
		} else {
			return this._rootInstance.processTaskLocationPath(tasks);
		}
	}

	_refreshAssignedTasks(currentUser, selectedWorkgroup, taskStartDate, taskEndDate) {
		if (this._isRootInstance) {
			if (!this._assignmentRouteActive) {
				return;
			}
			this._debounceRefreshAssignedTasksChanged = Debouncer.debounce(
				this._debounceRefreshAssignedTasksChanged, 
				microTask,
				async () => {
					if (!this._isEmptyObj(currentUser) && !this._isEmptyObj(selectedWorkgroup) && (taskStartDate && taskStartDate != "") && (taskEndDate && taskEndDate != "") && this.selectedStatus == "assigned") {
						await this._setFilterDates("", "");
						await this._setFilterDates(
							this._filterStartDate = moment.tz(moment(taskStartDate).utc().format("YYYY-MM-DD"), currentUser._TimeZoneId).toISOString(),
							this._filterEndDate = moment.tz(moment(taskEndDate).utc().add(1, "days").format("YYYY-MM-DD"), currentUser._TimeZoneId).toISOString()
						);
						this.shadowRoot.querySelector("#assignedTasksDS").refresh()
							.then(this._returnDataFromResponse.bind(this))
							.then(tasks => this.assignedTasks = this.processTaskLocationPath(tasks));
					}
				}
			);
		}
	}

	_refreshOverdueTasks(currentUser, selectedWorkgroup) {
		if (this._isRootInstance) {
			if (!this._assignmentRouteActive) {
				return;
			}
			this._debounceRefreshOverdueTasksChanged = Debouncer.debounce(
				this._debounceRefreshOverdueTasksChanged,
				microTask,
				async () => {
					if (!this._isEmptyObj(currentUser) && !this._isEmptyObj(selectedWorkgroup) && this.selectedStatus == "overdue") {
						const todayDate = moment().utc().toISOString();
						await this._setFilterDates("", "");
						await this._setFilterDates(
							this._filterStartDate = "",
							this._filterEndDate = todayDate
						);
						this.shadowRoot.querySelector("#overdueTasksDS").refresh()
							.then(this._returnDataFromResponse.bind(this))
							.then(tasks => this.overdueTasks = this.processTaskLocationPath(tasks));
					}
				}
			);
		}
	}

	_setFilterDates(startDate, endDate) {
		return new Promise((resolve) => {
			this._filterStartDate = startDate;
			this._filterEndDate = endDate;
			setTimeout(resolve, 1);
		});
	}

	clientRemoveUnassignedTask(task) {
		if (this._isRootInstance) {
			if (!task || !this.unassignedTasks) return;
			let index = this.unassignedTasks.findIndex((item) => item._id == task._id);
			if (index >= 0) {
				this.splice("unassignedTasks", index, 1);
			}
		} else {
			return this._rootInstance.clientRemoveUnassignedTask(task);
		}
	}

	async refreshTaskListAfterAssignment(assignedTaskIds) {
		if (this._isRootInstance) {
			if (this._assignmentRouteActive && this.selectedStatus == "assigned") {
				for (let i = 0; i < assignedTaskIds.length; i++) {
					if (this.assignedTasks.findIndex(task => task._id == assignedTaskIds[i]) < 0) {
						await this._refreshAssignedTasks(
							this._currentUser, 
							this._selectedWorkgroup, 
							this._taskStartDate, 
							this._taskEndDate);
						break;
					}
				}
			}
			
		} else {
			return this._rootInstance.refreshTaskListAfterAssignment(assignedTaskIds);
		}
	}

	refreshTaskListAfterUnassignment(listOfAllocatedPeopleToRemove) {
		if (this._isRootInstance) {
			return this._refreshUnassignedTasks(
				this._currentUser, 
				this._selectedWorkgroup, 
				this._taskStartDate, 
				this._taskEndDate);
		} else {
			return this._rootInstance.refreshTaskListAfterUnassignment(listOfAllocatedPeopleToRemove);
		}
	}

	clientRemoveAssignedTask(taskId) {
		if (this._isRootInstance) {
			if (!taskId || !this.assignedTasks) return;
			let index = this.assignedTasks.findIndex((item) => item._id == taskId);
			if (index >= 0) {
				this.splice("assignedTasks", index, 1);
			}
		} else {
			return this._rootInstance.clientRemoveAssignedTask(taskId);
		}
	}

	clientUpdateOverdueTaskAssignmentStatus(taskId, status) {
		if (this._isRootInstance) {
			if (!this._assignmentStatus || this._assignmentStatus.length == 0 || !taskId || !this.overdueTasks || (!status || status == "")) return;
			let statusObj = this._assignmentStatus.find((item) => item.nameENUS == status);
			let index = this.overdueTasks.findIndex((item) => item._id == taskId);
			if (index >= 0) {
				this.set(`overdueTasks.${index}.assignmentStatus`, statusObj.name);
				this.set(`overdueTasks.${index}.assignmentStatusENUS`, statusObj.nameENUS);
			}
		} else {
			return this._rootInstance.clientUpdateOverdueTaskAssignmentStatus(taskId, status);
		}
	}

	_isEmptyObj(object) {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}

	updateTaskPriority(task, priority, oldPriority) {
		if (this._isRootInstance) {
			return this._updateTaskPriority(task, priority).then(() => {
				getTriserviceMessage().openTaskPriorityUpdatedToastMessage(task.id);
				this.shadowRoot.querySelector("#workPlannerService").addChangeToUndoList({undo: this._undoUpdateTaskPriority.bind(this, task, oldPriority)});
			});
		} else {
			return this._rootInstance.updateTaskPriority(task, priority, oldPriority);
		}
	}

	_updateTaskPriority(task, priority) {
		let params = {
			priority: (priority && priority._id) ? priority._id : null
		};
		this.shadowRoot.querySelector("#workTaskDSInstance").instanceId = task._id;
		this.shadowRoot.querySelector("#workTaskDS").data = task;
		return this.shadowRoot.querySelector("#workTaskDS")
			.performAction(task._id, TriPlatDs.RefreshType.NONE, "actions", "changePriority", params)
			.then(this._runPostUpdateTaskPriorityEffects.bind(this, task, priority));
	}

	_runPostUpdateTaskPriorityEffects(task, priority) {
		if (this._assignmentRouteActive) {
			this._clientUpdateTaskListPriority(task, priority);
		}
		if (this._teamAssignmentsRouteActive) {
			getTriserviceMemberAssignedTasks().clientUpdateMemberAssignedTaskPriority(task._id, priority);
		}
	}

	_clientUpdateTaskListPriority(task, priority) {
		let taskList = "";
		if (this.selectedStatus == "unassigned" && this.unassignedTasks && this.unassignedTasks.length > 0) {
			taskList = "unassignedTasks";
		}
		if (this.selectedStatus == "assigned" && this.assignedTasks && this.assignedTasks.length > 0) {
			taskList = "assignedTasks";
		}
		if (this.selectedStatus == "overdue" && this.overdueTasks && this.overdueTasks.length > 0) {
			taskList = "overdueTasks";
		}
		if (taskList != "") {
			this._clientUpdateTaskProperty(taskList, task, "priority", ((priority && priority.priority) ? priority.priority : null));
			this._clientUpdateTaskProperty(taskList, task, "priorityENUS", ((priority && priority.priorityENUS) ? priority.priorityENUS : null));
			this._clientUpdateTaskProperty(taskList, task, "priorityColor", ((priority && priority.priorityColor) ? priority.priorityColor : null));
			this._clientUpdateTaskProperty(taskList, task, "priorityRanking", ((priority && priority.priorityRanking) ? priority.priorityRanking : null));
		}
	}

	_clientUpdateTaskProperty(taskList, task, property, value) {
		let taskIndex = this.get(`${taskList}`).findIndex((item) => item._id == task._id);
		if (taskIndex > -1) this.set(`${taskList}.${taskIndex}.${property}`, value);
	}

	_undoUpdateTaskPriority(task, oldPriority) {
		return this._updateTaskPriority(task, oldPriority).then(() => {
			getTriserviceMessage().openUndoTaskPriorityUpdatedToastMessage(task.id)
		});
	}

	updatePlannedWorkingHours(task, hours, oldHours) {
		if (this._isRootInstance) {
			return this._updatePlannedWorkingHours(task, hours).then(() => {
				getTriserviceMessage().openPlannedWorkingHoursUpdatedToastMessage(task.id);
				this.shadowRoot.querySelector("#workPlannerService").addChangeToUndoList({undo: this._undoUpdatePlannedWorkingHours.bind(this, task, oldHours)});
			});
		} else {
			return this._rootInstance.updatePlannedWorkingHours(task, hours, oldHours);
		}
	}

	_updatePlannedWorkingHours(task, hours) {
		let workTask = {
			_id: task._id,
			plannedWorkingHours: hours,
			plannedWorkingDays: 0
		}
		this.shadowRoot.querySelector("#workTaskDSInstance").instanceId = workTask._id;
		this.shadowRoot.querySelector("#workTaskDS").data = workTask;
		return this.shadowRoot.querySelector("#workTaskDS")
			.updateRecord(workTask._id, TriPlatDs.RefreshType.SERVER, "actions", "updatePlannedDateAndTime")
			.then(function() {
				let updatedTask = this.shadowRoot.querySelector("#workTaskDS").data;
				this._runPostUpdatePlannedWorkingHoursEffects(updatedTask);
			}.bind(this))
	}

	_runPostUpdatePlannedWorkingHoursEffects(task) {
		this._clientUpdateTaskPlannedStartPlannedEndWorkHours(task);
	}

	_clientUpdateTaskPlannedStartPlannedEndWorkHours(task) {
		let taskList = "";

		if (this.selectedStatus == "unassigned") {
			taskList = "unassignedTasks";
			if (this.unassignedTasks && this.unassignedTasks.length > 0 && !isDateBetween(task.plannedStart, this._filterStartDate, this._filterEndDate)) {
				taskList = "";
				this.clientRemoveUnassignedTask(task);
			}
		}
		if (this.selectedStatus == "assigned") {
			taskList = "assignedTasks";
			if (this.assignedTasks && this.assignedTasks.length > 0 && !isDateBetween(task.plannedStart, this._filterStartDate, this._filterEndDate)) {
				taskList = "";
				this.clientRemoveAssignedTask(task);
			}
		}
		if (this.selectedStatus == "overdue") {
			taskList = "overdueTasks";
			let todayDate = moment().utc();
			let plannedEndMoment = moment(task.plannedEnd);
			if (this.overdueTasks && this.overdueTasks.length > 0 && !plannedEndMoment.isBefore(todayDate)) {
				taskList = "";
				this._clientRemoveOverdueTask(task);
			}
		}
		if (taskList != "") {
			let taskIndex = this.get(`${taskList}`).findIndex((item) => item._id == task._id);
			if (taskIndex < 0) {
				this.refreshTasksOfCurrentTab();
			} else {
				this._clientUpdateTaskProperty(taskList, task, "plannedStart", task.plannedStart);
				this._clientUpdateTaskProperty(taskList, task, "plannedEnd", task.plannedEnd);
				this._clientUpdateTaskProperty(taskList, task, "workHours", task.workHours);
			}
		}
	}

	_handleAssignmentRouteActiveChanged(assignmentRouteActive) {
		if (assignmentRouteActive) {
			if (this.selectedStatus == "") this.selectedStatus = this._previousSelectedStatus;
			if (!this._smallLayout) {
				this.refreshTasksOfCurrentTab();
			} else if (this.selectedStatus == "assigned" || this.selectedStatus == "overdue") {
				getTriserviceTaskAssignment().selectedTasks = [];
			}
		} else {
			this._previousSelectedStatus = this.selectedStatus;
			this.selectedStatus = "";
		}
	}

	refreshTasksOfCurrentTab() {
		if (this._isRootInstance) {
			if (this.selectedStatus == "unassigned") {
				this._refreshUnassignedTasks(this._currentUser, this._selectedWorkgroup, this._taskStartDate, this._taskEndDate);
			}
			if (this.selectedStatus == "assigned") {
				this._refreshAssignedTasks(this._currentUser, this._selectedWorkgroup, this._taskStartDate, this._taskEndDate);
			}
			if (this.selectedStatus == "overdue") {
				this._refreshOverdueTasks(this._currentUser, this._selectedWorkgroup);
			}
		} else {
			return this._rootInstance.refreshTasksOfCurrentTab();
		}
	}

	_undoUpdatePlannedWorkingHours(task, oldHours) {
		return this._updatePlannedWorkingHours(task, oldHours).then(() => {
			getTriserviceMessage().openUndoPlannedWorkingHoursUpdatedToastMessage(task.id)
		});
	}

	_clientRemoveOverdueTask(task) {
		if (!task || !this.overdueTasks) return;
		let index = this.overdueTasks.findIndex((item) => item._id == task._id);
		if (index >= 0) {
			this.splice("overdueTasks", index, 1);
		}
	}

	updatePlannedStart(task, datetime, oldDatetime) {
		if (this._isRootInstance) {
			return this._updatePlannedStart(task, datetime).then(() => {
				getTriserviceMessage().openPlannedStartUpdatedToastMessage(task.id);
				this.shadowRoot.querySelector("#workPlannerService").addChangeToUndoList({undo: this._undoUpdatePlannedStart.bind(this, task, oldDatetime)});
			});
		} else {
			return this._rootInstance.updatePlannedStart(task, datetime, oldDatetime);
		}
	}

	_updatePlannedStart(task, datetime) {
		let workTask = {
			_id: task._id,
			plannedStart: datetime,
			plannedLastModified: "Start"
		}
		this.shadowRoot.querySelector("#workTaskDSInstance").instanceId = workTask._id;
		this.shadowRoot.querySelector("#workTaskDS").data = workTask;
		return this.shadowRoot.querySelector("#workTaskDS")
			.updateRecord(workTask._id, TriPlatDs.RefreshType.SERVER, "actions", "updatePlannedDateAndTime")
			.then(function() {
				let updatedTask = this.shadowRoot.querySelector("#workTaskDS").data;
				this._runPostUpdatePlannedWorkingHoursEffects(updatedTask);
			}.bind(this))
	}

	_undoUpdatePlannedStart(task, oldDatetime) {
		return this._updatePlannedStart(task, oldDatetime).then(() => {
			getTriserviceMessage().openUndoPlannedStartUpdatedToastMessage(task.id)
		});
	}

	updatePlannedEnd(task, datetime, oldDatetime) {
		if (this._isRootInstance) {
			return this._updatePlannedEnd(task, datetime).then(() => {
				getTriserviceMessage().openPlannedEndUpdatedToastMessage(task.id);
				this.shadowRoot.querySelector("#workPlannerService").addChangeToUndoList({undo: this._undoUpdatePlannedEnd.bind(this, task, oldDatetime)});
			});
		} else {
			return this._rootInstance.updatePlannedEnd(task, datetime, oldDatetime);
		}
	}

	_updatePlannedEnd(task, datetime) {
		let workTask = {
			_id: task._id,
			plannedEnd: datetime,
			plannedLastModified: "End"
		}
		this.shadowRoot.querySelector("#workTaskDSInstance").instanceId = workTask._id;
		this.shadowRoot.querySelector("#workTaskDS").data = workTask;
		return this.shadowRoot.querySelector("#workTaskDS")
			.updateRecord(workTask._id, TriPlatDs.RefreshType.SERVER, "actions", "updatePlannedDateAndTime")
			.then(function() {
				let updatedTask = this.shadowRoot.querySelector("#workTaskDS").data;
				this._runPostUpdatePlannedWorkingHoursEffects(updatedTask);
			}.bind(this))
	}

	_undoUpdatePlannedEnd(task, oldDatetime) {
		return this._updatePlannedEnd(task, oldDatetime).then(() => {
			getTriserviceMessage().openUndoPlannedEndUpdatedToastMessage(task.id)
		});
	}
};

window.customElements.define(TriserviceWorkTask.is, TriserviceWorkTask);