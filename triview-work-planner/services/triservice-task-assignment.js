/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../@polymer/polymer/lib/utils/async.js";
import { TriPlatDs } from "../../triplat-ds/triplat-ds.js";
import "../../triplat-ds-core/triplat-ds-core.js";
import { getTriroutesWorkPlanner } from "../routes/triroutes-work-planner.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriserviceWorkTask } from "./triservice-work-task.js";
import { getTriservicePeople }  from "./triservice-people.js";
import { getTriserviceMessage }  from "./triservice-message.js";
import { getTriserviceWorkPlanner, CHANGE_NOT_COMPLETED } from "./triservice-work-planner.js";
import { getTriserviceMemberAssignedTasks } from "./triservice-member-assigned-tasks.js";
import { getTriserviceSecurity } from "./triservice-security.js";

export function getTriserviceTaskAssignment() {
	return getService(TriserviceTaskAssignment.is);
};

class TriserviceTaskAssignment extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-task-assignment"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="taskResourceAllocationDS" name="taskResourceAllocation" loading="{{_loadingTaskResource}}" manual>
					</triplat-ds>

					<triplat-ds id="taskResourceAllocationInstanceDS" name="taskResourceAllocation" loading="{{_loadingTaskResourceAllocationInstance}}" manual>
						<triplat-ds-instance id="taskResourceAllocationInstanceDSInstance"></triplat-ds-instance>
					</triplat-ds>

					<triplat-ds id="allocatedPeopleDS" name="allocatedPeople" data="{{allocatedPeople}}" loading="{{_loadingAllocatedPeople}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter id="allocatedPeopleDSTaskIdFilter" name="taskRecordID" operator="equals"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-ds-core id="allocatedPeopleDScore" context="/triWorkPlanner/-1/allocatedPeople" type="GET"></triplat-ds-core>

					<triplat-ds id="resourceDS" name="resource" loading="{{_loadingResource}}" manual>
					</triplat-ds>
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

			draggingTask: {
				type: Boolean,
				value: false,
				notify: true
			},

			selectedTasks: {
				type: Array,
				notify: true
			},

			selectedPeople: {
				type: Array,
				notify: true
			},

			allocatedPeople: {
				type: Array,
				notify: true
			},

			isSelectedTaskAssigned: {
				type: Boolean,
				notify:true
			},

			_loadingTaskResource: {
				type: Boolean,
				value: false
			},

			_loadingTaskResourceAllocationInstance: {
				type: Boolean,
				value: false
			},

			_loadingAllocatedPeople: {
				type: Boolean,
				value: false
			},

			_loadingAllocatedPeopleDSCore: {
				type: Boolean,
				value: false
			},

			_loadingResource: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingTaskResource, _loadingTaskResourceAllocationInstance, _loadingAllocatedPeople, _loadingResource, _loadingAllocatedPeopleDSCore)",
			"_computeIsSelectedTaskAssigned(selectedTasks.*)",
			"_selectAssignedPeople(isSelectedTaskAssigned, allocatedPeople.*)"
		]
	}

	_computeIsSelectedTaskAssigned(selectedTasksChange) {
		if (this._isRootInstance) {
			this._debounceComputeIsSelectedTaskAssigned = Debouncer.debounce(
				this._debounceComputeIsSelectedTaskAssigned, 
				microTask,
				() => {
					let selectedTasks = selectedTasksChange.base;
					this.isSelectedTaskAssigned = selectedTasks && selectedTasks.length == 1 && selectedTasks[0].assignmentStatusENUS == "Assigned";
				}
			);
		}
	}

	_selectAssignedPeople(isSelectedTaskAssigned, allocatedPeopleChange) {
		if (this._isRootInstance) {
			this._debounceSelectAssignedPeople = Debouncer.debounce(
				this._debounceSelectAssignedPeople, 
				microTask,
				() => {
					if (isSelectedTaskAssigned) {
						const allocatedPeople = allocatedPeopleChange.base != null ? allocatedPeopleChange.base : [];
						let previousAllocatedPeopleSelected = this._previousAllocatedPeopleSelected ? this._previousAllocatedPeopleSelected : [];
						let selectedPeopleSet = new Set(this.selectedPeople);
						previousAllocatedPeopleSelected.forEach(item => selectedPeopleSet.delete(item));
						previousAllocatedPeopleSelected = [];
						getTriservicePeople().members.forEach((member) => {
							if (allocatedPeople.findIndex(item => item.peopleRecordID == member._id) >= 0 && !selectedPeopleSet.has(member)) {
								previousAllocatedPeopleSelected.push(member);
								selectedPeopleSet.add(member);
							}
						});
						this.selectedPeople = Array.from(selectedPeopleSet);
						this._previousAllocatedPeopleSelected = previousAllocatedPeopleSelected;
					} else {
						if (this._previousAllocatedPeopleSelected && this._previousAllocatedPeopleSelected.length > 0) {
							let selectedPeopleSet = new Set(this.selectedPeople);
							this._previousAllocatedPeopleSelected.forEach(item => selectedPeopleSet.delete(item));
							this.selectedPeople = Array.from(selectedPeopleSet);
							this._previousAllocatedPeopleSelected = [];
						}
					}
				}
			);
		}
	}

	getSelectedUnallocatedPeople(selectedPeople, allocatedPeople) {
		if (this._isRootInstance) {
			selectedPeople = selectedPeople ? selectedPeople : [];
			allocatedPeople = allocatedPeople ? allocatedPeople : [];
			return selectedPeople.filter( ( people ) => allocatedPeople.findIndex((allocation) => allocation.peopleRecordID == people._id ) < 0 );
		} else {
			return this._rootInstance.getSelectedUnallocatedPeople(selectedPeople, allocatedPeople);
		}
	}

	assignTask(taskList, peopleList) {
		if (this._isRootInstance) {
			if (!Array.isArray(taskList)) {
				taskList = [taskList];
			}
			if (!Array.isArray(peopleList)) {
				peopleList = [peopleList];
			}
			let taskWithoutTimeEstimate = taskList.find(this._taskHasNoTimeEstimate.bind(this));
			if (taskWithoutTimeEstimate) {
				getTriserviceMessage().openCannotAssignTaskWithoutTimeEstimateMessage(taskWithoutTimeEstimate.id);
				return Promise.reject();
			}

			let allocations = [];
			taskList.forEach((task) => {
				let firstDayList = [];
				peopleList.forEach((people) => {
					let day = this._getFirstAvailableDay(people);
					firstDayList.push(day);
					let allocation = this._createAllocation(task, people, day);
					allocations.push(allocation);
				});
			});
			return this._assignTask(allocations, peopleList).then(() => {
				getTriserviceMessage().openTaskAssignedToastMessage(taskList);
				if (getTriserviceSecurity().canUnassign) {
					getTriserviceWorkPlanner().addChangeToUndoList({undo: this._undoTaskAssignment.bind(this, allocations, taskList)});
				}
			});
		} else {
			return this._rootInstance.assignTask(taskList, peopleList);
		}
	}

	_taskHasNoTimeEstimate(task) {
		return !task.workHours || task.workHours <= 0;
	}

	_removeFromSelectedPeople(peopleList) {
		if (!peopleList || peopleList.length == 0) return;
		let selectedPeopleSet = new Set(this.selectedPeople ? this.selectedPeople : []);
		peopleList.forEach(item => selectedPeopleSet.delete(item));
		this.selectedPeople = Array.from(selectedPeopleSet); 
	}

	_assignTask(allocations, peopleToRemoveFromSelected) {
		return this.shadowRoot.querySelector("#taskResourceAllocationDS").createRecord(
			allocations, 
			TriPlatDs.RefreshType.NONE, 
			"actions", 
			"assignTask"
		).then(this._runPostAssignmentEffects.bind(this, allocations, peopleToRemoveFromSelected));
	}

	async _runPostAssignmentEffects(allocations, peopleToRemoveFromSelected, createdRecordIds) {
		const servicePeople = getTriservicePeople();
		const serviceWorkTask = getTriserviceWorkTask();
		const serviceMemberAssignedTasks = getTriserviceMemberAssignedTasks();
		let assignedTaskIds = new Set();
		this._removeFromSelectedPeople(peopleToRemoveFromSelected);
		allocations.forEach((allocation, i) => {
			allocation._id = createdRecordIds[i];
			serviceWorkTask.clientRemoveUnassignedTask({_id: allocation.task.id});
			serviceWorkTask.clientUpdateOverdueTaskAssignmentStatus(allocation.task.id, "Assigned");
			serviceMemberAssignedTasks.refreshMemberAssignedTasksAfterAssignment(allocation.task.id, allocation.resource.id, allocation.date);
			servicePeople.clientAddTaskToPeopleAvailability(allocation.resource.id, allocation.date, allocation.hours);
			assignedTaskIds.add(allocation.task.id);
		});
		await this._clearOrRefreshAllocatedPeopleAfterAssignment(allocations);
		getTriserviceWorkTask().refreshTaskListAfterAssignment(Array.from(assignedTaskIds));
	}

	async _clearOrRefreshAllocatedPeopleAfterAssignment(allocations) {
		const routesWorkPlanner = getTriroutesWorkPlanner();
		const serviceWorkTask = getTriserviceWorkTask();
		if (routesWorkPlanner.assignmentRouteActive && serviceWorkTask.selectedStatus != "unassigned") {
			if (this.selectedTasks && this.selectedTasks.length == 1) {
				 if (this.selectedTasks[0]._id == allocations[0].task.id) {
					await this.refreshAllocatedPeople(this.selectedTasks[0]._id, true);
				}
			} else {
				this._clientClearAllocatedPeople();
			}
		} else {
			this._clientClearAllocatedPeople();
		}
	}

	async _undoTaskAssignment(allocations, taskList) {
		let listOfAllocatedPeopleToRemove = await this.getAllocatedPeopleByTaskAndPeople(
			allocations.map((item) => {
				return {peopleRecordID: item.resource.id, taskRecordID: item.task.id};
			})
		);
		if (this._isResourceInfoMissing(listOfAllocatedPeopleToRemove)) return CHANGE_NOT_COMPLETED;
		return this._removeAllocatedPeople(listOfAllocatedPeopleToRemove) 
					.then(() => getTriserviceMessage().openUndoTaskAssignmentToastMessage(allocations, taskList));
	}

	getAllocatedPeopleByTask(taskId) {
		if (this._isRootInstance) {
			this._loadingAllocatedPeopleDSCore = true;
			let query = {
				page: {
					from: 0,
					size: 1000
				},
				filters: []
			};
			query.filters.push({operator: "equals", name: "taskRecordID", value: taskId });
			let allocatedPeopleDScore = this.shadowRoot.querySelector("#allocatedPeopleDScore");
			allocatedPeopleDScore.query = query;
			return allocatedPeopleDScore.generateRequest()
				.then((response) => {
					this._loadingAllocatedPeopleDSCore = false;
					return this._returnDataFromResponse(response);
				})
				.catch((error) => {
					this._loadingAllocatedPeopleDSCore = false;
					return Promise.reject(error);
				});
		} else {
			return this._rootInstance.getAllocatedPeopleByTask(taskId);
		}
	}

	getAllocatedPeopleByTaskAndPeople(filters) {
		if (this._isRootInstance) {
			this._loadingAllocatedPeopleDSCore = true;
			let query = {
				page: {
					from: 0,
					size: filters.length
				},
				filters: []
			};
			filters.forEach((filter) => {
				if (query.filters.length > 0) {
					query.filters.push({operator: "or"});
				}
				query.filters.push({operator: "open parenthesis"});
				query.filters.push({operator: "equals", name: "taskRecordID", value: filter.taskRecordID });
				query.filters.push({operator: "and"});
				query.filters.push({operator: "equals", name: "peopleRecordID", value: filter.peopleRecordID });
				query.filters.push({operator: "close parenthesis"});
			});
			let allocatedPeopleDScore = this.shadowRoot.querySelector("#allocatedPeopleDScore");
			allocatedPeopleDScore.query = query;
			return allocatedPeopleDScore.generateRequest()
				.then((response) => {
					this._loadingAllocatedPeopleDSCore = false;
					return this._returnDataFromResponse(response);
				})
				.catch((error) => {
					this._loadingAllocatedPeopleDSCore = false;
					return Promise.reject(error);
				});
		} else {
			return this._rootInstance.getAllocatedPeopleByTaskAndPeople(filters);
		}
	}

	async refreshAllocatedPeople(taskId, force) {
		if (this._isRootInstance) {
			const allocatedPeopleDSTaskIdFilter = this.shadowRoot.querySelector("#allocatedPeopleDSTaskIdFilter");
			const allocatedPeople = this.allocatedPeople;
			if (force || allocatedPeople == null || allocatedPeople.length == 0 || 
				allocatedPeopleDSTaskIdFilter.value != taskId || this._isResourceInfoMissing(allocatedPeople)) {
				if (allocatedPeopleDSTaskIdFilter.value != taskId) {
					this.allocatedPeople = [];
				}
				await this._setAllocatedPeopleDSTaskIdFilter(null);
				await this._setAllocatedPeopleDSTaskIdFilter(taskId);
				return this.shadowRoot.querySelector("#allocatedPeopleDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(allocatedPeople);
			}
		} else {
			return this._rootInstance.refreshAllocatedPeople(taskId, force);
		}
	}

	_setAllocatedPeopleDSTaskIdFilter(taskId) {
		return new Promise((resolve) => {
			this.shadowRoot.querySelector("#allocatedPeopleDSTaskIdFilter").value = taskId;
			setTimeout(resolve, 1);
		});
	}

	_isResourceInfoMissing(allocatedPeople) {
		return allocatedPeople.findIndex(people => !people.resourceRecordID) >= 0;
	}

	removeAllocatedPeople(task, allocatedPeopleToRemove) {
		if (this._isRootInstance) {
			return this._removeAllocatedPeople([allocatedPeopleToRemove]).then(() => {
				getTriserviceMessage().openUnassignedPeopleToastMessage(allocatedPeopleToRemove.firstName, task.id);
				if (getTriserviceSecurity().canAssign) {
					getTriserviceWorkPlanner().addChangeToUndoList({undo: this._undoRemoveAllocatedPeople.bind(this, task, allocatedPeopleToRemove)});
				}
				return this.allocatedPeople;
			});
		} else {
			return this._rootInstance.removeAllocatedPeople(task, allocatedPeopleToRemove);
		}
	}

	_removeAllocatedPeople(listOfAllocatedPeopleToRemove) {
		let resources = [];
		let resourceIds = [];
		listOfAllocatedPeopleToRemove.forEach((item) => {
			resources.push({_id: item.resourceRecordID});
			resourceIds.push(item.resourceRecordID);
		});
		this.shadowRoot.querySelector("#resourceDS").data = resources;
		return this.shadowRoot.querySelector("#resourceDS")
			.performAction(resourceIds, TriPlatDs.RefreshType.NONE, "actions", "removeAllocation")
			.then(this._runPostRemoveAllocationEffects.bind(this, listOfAllocatedPeopleToRemove));
	}

	async _runPostRemoveAllocationEffects(listOfAllocatedPeopleToRemove) {
		let taskIdsWithRemovedAllocation = new Set();
		listOfAllocatedPeopleToRemove.forEach((allocatedPeople) => {
			this._clientRemoveFromAllocatedPeople(allocatedPeople.taskRecordID, allocatedPeople.peopleRecordID);
			getTriserviceMemberAssignedTasks().clientRemoveAssignedTaskFromMember(allocatedPeople.taskRecordID, allocatedPeople.peopleRecordID);
			getTriservicePeople().clientRemoveTaskFromPeopleAvailability(
				allocatedPeople.peopleRecordID, 
				allocatedPeople.allocationDate, 
				allocatedPeople.allocationHours
			);
			taskIdsWithRemovedAllocation.add(allocatedPeople.taskRecordID);
		});
		getTriserviceWorkTask().refreshTaskListAfterUnassignment(listOfAllocatedPeopleToRemove);
		for (let taskId of taskIdsWithRemovedAllocation) {
			let allocatedPeople = await this.getAllocatedPeopleByTask(taskId);
			if (allocatedPeople.length == 0) {
				getTriserviceWorkTask().clientRemoveAssignedTask(taskId);
				getTriserviceWorkTask().clientUpdateOverdueTaskAssignmentStatus(taskId, "Unassigned");
			}
		}
	}

	_undoRemoveAllocatedPeople(task, allocatedPeopleRemoved) {
		let allocation = {
			hours: allocatedPeopleRemoved.allocationHours,
			date: allocatedPeopleRemoved.allocationDate,
			dateTime: allocatedPeopleRemoved.allocationDatetime,
			plannedStartDateTime: allocatedPeopleRemoved.allocationPlannedStart,
			resource: { id: allocatedPeopleRemoved.peopleRecordID },
			task: { id: allocatedPeopleRemoved.taskRecordID }
		};
		return this._assignTask([allocation]).then(() => {
			getTriserviceMessage().openUndoUnassignedPeopleToastMessage(allocatedPeopleRemoved.firstName, task.id)
		});
	}

	_clientRemoveFromAllocatedPeople(taskRecordID, peopleRecordID) {
		if (!this.allocatedPeople) return;
		let index = this.allocatedPeople.findIndex((item) => item.peopleRecordID == peopleRecordID && item.taskRecordID == taskRecordID);
		if (index >= 0) {
			this.splice("allocatedPeople", index, 1);
		}
	}

	_createAllocation(task, people, day) {
		const plannedStartDateTime = moment.tz(day._date, "YYYY-MM-DD", this._getTimezoneId(people.timezone));
		const startWorkingTime = day._startWorkingTime.split(":");
		plannedStartDateTime.hour(startWorkingTime[0]);
		plannedStartDateTime.minute(startWorkingTime[1]);
		plannedStartDateTime.second(0);
		plannedStartDateTime.millisecond(0);
		const plannedStartDateTimeISO = plannedStartDateTime.toISOString();
		return {
			hours: task.workHours,
			date: day._date,
			dateTime: plannedStartDateTimeISO,
			plannedStartDateTime: plannedStartDateTimeISO,
			resource: { id: people._id },
			task: { id: task._id }
		};
	}

	_getFirstAvailableDay(people) {
		for (let i = 0; i < people.availability.days.length; i++) {
			if (people.availability.days[i]._availableHours > 0) {
				return people.availability.days[i];
			}
		}
		return people.availability.days[1];//Default to monday
	}

	_getTimezoneId(timezone) {
		if (!timezone) {
			return "Etc/UTC";
		}
		let matches = timezone.match(/\[(.+)\]/);
		return matches && matches.length > 1 ? matches[1] : "Etc/UTC";
	}

	updateAllocatedHours(task, hours, oldHours) {
		if (this._isRootInstance) {
			return this._updateAllocatedHours(task, hours, oldHours).then(() => {
				getTriserviceMessage().openAllocatedHoursUpdatedToastMessage(task.peopleFirstName, task.id);
				getTriserviceWorkPlanner().addChangeToUndoList({undo: this._undoUpdateAllocatedHours.bind(this, task, hours, oldHours)});
			});
		} else {
			return this._rootInstance.updateAllocatedHours(task, hours, oldHours);
		}
	}

	_updateAllocatedHours(task, hours, oldHours) {
		let allocationId = task.allocationId;
		let taskResourceAllocation = {
			_id: allocationId,
			hours: hours
		};
		this.shadowRoot.querySelector("#taskResourceAllocationInstanceDSInstance").instanceId = allocationId;

		let taskResourceAllocationInstanceDS = this.shadowRoot.querySelector("#taskResourceAllocationInstanceDS");
		taskResourceAllocationInstanceDS.data = taskResourceAllocation;
		return taskResourceAllocationInstanceDS.updateRecord(allocationId, TriPlatDs.RefreshType.NONE, "actions", "updateAllocatedHours")
			.then(this._runPostUpdateAllocatedHours.bind(this, hours, oldHours, task));
	}

	_runPostUpdateAllocatedHours(hours, oldHours, task) {
		getTriservicePeople().clientReflectAllocationHourChangeToPeopleAvailability(hours, oldHours, task);
		getTriserviceMemberAssignedTasks().clientChangeAssignedTaskAllocationHours(task._id, hours, task.peopleRecordID);
		this._clientClearAllocatedPeople();
	}

	async _undoUpdateAllocatedHours(task, hours, oldHours) {
		let allocations = await this.getAllocatedPeopleByTaskAndPeople([{peopleRecordID: task.peopleRecordID, taskRecordID: task._id}]);
		if (allocations && allocations.length == 1) {
			task.allocationId = allocations[0]._id;
			return this._updateAllocatedHours(task, oldHours, hours).then(() => {
				getTriserviceMessage().openUndoAllocatedHoursUpdatedToastMessage(task.peopleFirstName, task.id);
			});
		}
		return Promise.resolve();
	}

	_computePlannedStartDate(selectedDate, selectedMember) {
		const memberAvailability = selectedMember.availability;
		const availabilityDayIndex = moment(selectedDate).day();
		const availabilityDay = memberAvailability.days[availabilityDayIndex];
		const plannedStartDateTime = moment.tz(selectedDate, "YYYY-MM-DD", this._getTimezoneId(selectedMember.timezone));
		const startWorkingTime = availabilityDay._startWorkingTime.split(":");
		plannedStartDateTime.hour(startWorkingTime[0]);
		plannedStartDateTime.minute(startWorkingTime[1]);
		plannedStartDateTime.second(0);
		plannedStartDateTime.millisecond(0);
		return plannedStartDateTime.toISOString();
	}

	updateAllocatedDate(task, selectedDate, selectedMember, multiple) {
		if (this._isRootInstance) {
			let updatedAllocations = [];
			let oldAllocations = [];

			const members = getTriservicePeople().members;
			
			for (let i = 0; i < this.allocatedPeople.length; i++) {
				if (!multiple && this.allocatedPeople[i].peopleRecordID != selectedMember._id) continue;
				let currentMember = members.find((item) => item._id == this.allocatedPeople[i].peopleRecordID);
				let plannedStartDateTimeISO = this._computePlannedStartDate(selectedDate, currentMember);
				
				updatedAllocations.push({
					_id: this.allocatedPeople[i]._id,
					date: selectedDate,
					dateTime: plannedStartDateTimeISO,
					plannedStartDateTime: plannedStartDateTimeISO,
					resource: { id: this.allocatedPeople[i].peopleRecordID },
					hours: this.allocatedPeople[i].allocationHours
				});

				oldAllocations.push({
					_id: this.allocatedPeople[i]._id,
					date: this.allocatedPeople[i].allocationDate,
					dateTime: this.allocatedPeople[i].allocationDatetime,
					plannedStartDateTime: this.allocatedPeople[i].allocationPlannedStart,
					resource: { id: this.allocatedPeople[i].peopleRecordID },
					hours: this.allocatedPeople[i].allocationHours
				});
				if (!multiple) break;
			}
			
			return this._updateAllocatedDate(task, updatedAllocations, oldAllocations).then(() => {
				getTriserviceMessage().openAllocatedDateUpdatedToastMessage(selectedMember.firstName, task.id, updatedAllocations.length > 1);
				getTriserviceWorkPlanner().addChangeToUndoList({ undo: this._undoUpdateAllocatedDate.bind(this, task, updatedAllocations, oldAllocations)});
			});
		} else {
			return this._rootInstance.updateAllocatedDate(task, selectedDate, selectedMember, multiple);
		}
	}

	_updateAllocatedDate(task, updatedAllocations, oldAllocations) {
		let taskResourceAllocationDS = this.shadowRoot.querySelector("#taskResourceAllocationDS");
		taskResourceAllocationDS.data = updatedAllocations;
		return taskResourceAllocationDS.updateRecord(
				updatedAllocations.map(allocation => allocation._id), 
				TriPlatDs.RefreshType.NONE, 
				"actions", 
				"updateAllocatedDate")
			.then(this._runPostUpdateAllocatedDate.bind(this, task, updatedAllocations, oldAllocations));
	}

	_runPostUpdateAllocatedDate(task, updatedAllocations, oldAllocations) {
		getTriservicePeople().clientReflectAllocationDateChangeToPeopleAvailability(updatedAllocations, oldAllocations);
		updatedAllocations.forEach((allocation) => getTriserviceMemberAssignedTasks().clientChangeAssignedTaskAllocationDate(task, allocation.date, allocation.resource.id))
		this._clientClearAllocatedPeople();
	}

	async _undoUpdateAllocatedDate(task, updatedAllocations, oldAllocations) {
		let allocatedPeopleToUpdate = await this.getAllocatedPeopleByTaskAndPeople(
			oldAllocations.map((item) => {
				return {peopleRecordID: item.resource.id, taskRecordID: task._id};
			})
		);
		let firstName = null;
		oldAllocations.forEach((oldAllocation) => {
			let allocation = allocatedPeopleToUpdate.find((allocatedPeople) => allocatedPeople.peopleRecordID == oldAllocation.resource.id);
			oldAllocation._id = allocation._id;
			if (!firstName) firstName = allocation.firstName;
		});
		return this._updateAllocatedDate(task, oldAllocations, updatedAllocations).then(() => {
			getTriserviceMessage().openUndoAllocatedDateUpdatedToastMessage(firstName, task.id, oldAllocations.length > 1)
		});
	}

	_clientClearAllocatedPeople() {
		this.allocatedPeople = null;
	}
};

window.customElements.define(TriserviceTaskAssignment.is, TriserviceTaskAssignment);