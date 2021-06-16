/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../@polymer/polymer/lib/utils/async.js";
import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triplat-ds/triplat-ds.js";
import "../../triplat-query/triplat-query.js";
import { TrimixinService, getService } from "./trimixin-service.js";
import { isDateBetween } from "../utils/triutils-date.js";
import { getTriserviceTaskAssignment } from "./triservice-task-assignment.js";
import "./triservice-work-planner.js";
import "./triservice-workgroup.js";

export function getTriservicePeople() {
	return getService(TriservicePeople.is);
};

class TriservicePeople extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-people"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triservice-work-planner current-user="{{_currentUser}}" people-start-date="{{_peopleStartDate}}" people-end-date="{{_peopleEndDate}}"></triservice-work-planner>

					<triservice-workgroup selected-workgroup="{{_selectedWorkgroup}}"></triservice-workgroup>

					<triplat-ds id="membersOfSupervisedTeams" name="membersOfSupervisedTeams" loading="{{_loadingMembers}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter id="workgroupRecordIDFilter" name="workgroupRecordID" operator="equals" value="[[_selectedWorkgroup._id]]"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="membersWorkPlannerDS" name="membersWorkPlanner" loading="{{_loadingMembersWorkPlanner}}" force-server-filtering manual>
						<triplat-ds-context id="membersWorkPlannerDSContext" name="membersOfSupervisedTeams"></triplat-ds-context>
						<triplat-query delay="0">
							<triplat-query-work-planner id="membersWorkPlannerDSQueryWorkPlanner"></triplat-query-work-planner>
						</triplat-query>
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

			denormalizedMembers: {
				type: Array,
				notify: true
			},

			members: {
				type: Array,
				notify: true
			},

			memberSearchFields: {
				type: Object,
				value: {},
				notify: true
			},

			selectedMember: {
				type: Object,
				notify: true
			},

			denormalizedPeopleToAssign: {
				type: Array,
				notify: true
			},

			peopleToAssign: {
				type: Array,
				notify: true
			},

			_currentUser: {
				type: Object
			},

			_peopleStartDate: {
				type: String
			},

			_peopleEndDate: {
				type: String
			},

			_selectedWorkgroup: {
				type: Object,
				observer: "_handleSelectedWorkgroupChanged"
			},

			_loadingMembers: {
				type: Boolean,
				value: false
			},

			_loadingMembersWorkPlanner: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingMembers, _loadingMembersWorkPlanner)",
			"_refreshMembersWorkPlanner(members, _peopleStartDate, _peopleEndDate)"
		]
	}

	ready() {
		super.ready();
		if (this._isRootInstance) {
			var __dictionary__laborClass = "Labor Class";
			var __dictionary__name = "Name";

			let memberSearchFields = {};
			memberSearchFields["name"] = __dictionary__name;
			memberSearchFields["laborClass"] = __dictionary__laborClass;
			this.memberSearchFields = memberSearchFields;
		}
	}

	_handleSelectedWorkgroupChanged(newSelectedWorkgroup, oldSelectedWorkgroup) {
		if (this._isRootInstance) {
			if (newSelectedWorkgroup && newSelectedWorkgroup._id && (!oldSelectedWorkgroup || newSelectedWorkgroup._id != oldSelectedWorkgroup._id)) {
				this.members = null;
				setTimeout(() => {
					this.shadowRoot.querySelector("#membersOfSupervisedTeams").refresh()
						.then(this._returnDataFromResponse.bind(this))
						.then(this._normalizeMemberList.bind(this));
				}, 1);
			}
		}
	}

	_normalizeMemberList(denormalizedMemberList) {
		var result = {
			normalizedMembersById: {},
			normalizedMembers: []
		};
		if (denormalizedMemberList && denormalizedMemberList.length > 0) {
			denormalizedMemberList.reduce(this._normalizeMember.bind(this), result);
		}
		this.members = result.normalizedMembers.length > 0 ? result.normalizedMembers : null;
		this.denormalizedMembers = denormalizedMemberList;
	}

	_normalizeMember(result, member) {
		var normalizedMember = result.normalizedMembersById[member._id];
		if (normalizedMember) {
			if (member.laborClass) {
				normalizedMember.laborClasses.push(member.laborClass);
				normalizedMember._laborClassesTxt += `#-${member.laborClass}-#`;
			}
		} else {
			member.laborClasses = member.laborClass ? [member.laborClass] : [];
			member._laborClassesTxt = member.laborClass ? `#-${member.laborClass}-#` : "";
			result.normalizedMembersById[member._id] = member;
			result.normalizedMembers.push(member);
		}
		return result;
	}

	_refreshMembersWorkPlanner(members, startDate, endDate) {
		if (this._isRootInstance) {
			this._debounceRefreshMembersWorkPlanner = Debouncer.debounce(
				this._debounceRefreshMembersWorkPlanner, 
				microTask,
				() => {
					if ((members && members.length > 0) && (startDate && startDate != "") && (endDate && endDate != "")) {
						this.shadowRoot.querySelector("#membersWorkPlannerDSContext").contextId = members;
						this.shadowRoot.querySelector("#membersWorkPlannerDSQueryWorkPlanner").startDate = startDate;
						this.shadowRoot.querySelector("#membersWorkPlannerDSQueryWorkPlanner").endDate = endDate;
						setTimeout(function() {
							this.shadowRoot.querySelector("#membersWorkPlannerDS").refresh()
								.then(this._returnDataFromResponse.bind(this))
								.then(this._computeMembersAvailability.bind(this, members));
						}.bind(this), 1);
					}
				}
			);
		}
	}

	_computeMembersAvailability(members, membersWorkPlanner) {
		if (!members || members.length == 0 || !membersWorkPlanner || membersWorkPlanner.length == 0) {
			return;
		}
		for (let i = 0; i < members.length; i++) {
			const availability = this._getPeopleAvailability(members[i]._id, membersWorkPlanner);
			this.set(`members.${i}.availability`, availability);
			if (this.selectedMember && this.selectedMember._id == members[i]._id) {
				this.notifyPath("selectedMember.availability");
			}
		}
	}

	_getPeopleAvailability(peopleId, membersWorkPlanner) {
		let availability = {
			availableHours: 0,
			plannedHours: 0,
			plannedTasksQty: 0,
			days: []
		};
		for (let i = 0; i < membersWorkPlanner.length; i++) {
			const dayWorkPlanner = membersWorkPlanner[i];
			if (dayWorkPlanner._contextId == peopleId) {
				availability.availableHours += dayWorkPlanner._availableHours;
				availability.plannedHours += dayWorkPlanner._plannedHours;
				availability.plannedTasksQty += dayWorkPlanner._plannedTasksQty;
				availability.days.push(dayWorkPlanner);
			}
		}
		return availability;
	}

	clientAddTaskToPeopleAvailability(peopleId, allocationDate, allocationHours) {
		if (this._isRootInstance) {
			if (!peopleId) return;
			if (!isDateBetween(allocationDate, this._peopleStartDate, this._peopleEndDate)) return;
			let day = this._getAvailabilityDay(peopleId, allocationDate);
			if (!day) return;
			const memberIndex = this._findMemberIndex(peopleId);
			const people = this.members[memberIndex];
			const oldAvailability = people.availability;
			let availability = {
				availableHours: oldAvailability.availableHours,
				plannedHours: oldAvailability.plannedHours + allocationHours,
				plannedTasksQty: oldAvailability.plannedTasksQty + 1,
				days: oldAvailability.days
			};
			day._plannedHours += allocationHours;
			day._plannedTasksQty += 1;
			this.set(`members.${memberIndex}.availability`, availability);
			if (this.selectedMember && this.selectedMember._id == peopleId) {
				this.notifyPath("selectedMember.availability");
			}
		} else {
			return this._rootInstance.clientAddTaskToPeopleAvailability(peopleId, allocationDate, allocationHours);
		}
	}

	clientRemoveTaskFromPeopleAvailability(peopleId, allocationDate, allocationHours) {
		if (this._isRootInstance) {
			if (!peopleId) return;
			if (!isDateBetween(allocationDate, this._peopleStartDate, this._peopleEndDate)) return;
			const memberIndex = this._findMemberIndex(peopleId);
			const oldAvailability = this.members[memberIndex].availability;
			const dayIndex = this._findAvailabilityDayIndex(oldAvailability, moment.parseZone(allocationDate).format("YYYY-MM-DD"));
			const oldDay = oldAvailability.days[dayIndex];
			
			const day = {
				_availableHours: oldDay._availableHours,
				_date: oldDay._date,
				_plannedHours: oldDay._plannedHours - allocationHours,
				_plannedTasks: oldDay._plannedTasks,
				_plannedTasksQty: oldDay._plannedTasksQty -1,
				_startWorkingTime: oldDay._startWorkingTime,
			};
			oldAvailability.days[dayIndex] = day;
			
			const availability = {
				availableHours: oldAvailability.availableHours,
				plannedHours: oldAvailability.plannedHours - allocationHours,
				plannedTasksQty: oldAvailability.plannedTasksQty - 1,
				days: oldAvailability.days
			};
			
			this.set(`members.${memberIndex}.availability`, availability);
			if (this.selectedMember && this.selectedMember._id == peopleId) {
				this.notifyPath("selectedMember.availability");
			}
		} else {
			return this._rootInstance.clientRemoveTaskFromPeopleAvailability(peopleId, task, day);
		}
	}

	_findMemberIndex(peopleId) {
		return this.members.findIndex((item) => item._id == peopleId);
	}

	_findAvailabilityDayIndex(availability, day) {
		return availability.days.findIndex((item) => moment.parseZone(item._date).format("YYYY-MM-DD") == day);
	}

	clientReflectAllocationHourChangeToPeopleAvailability(hours, oldHours, task) {
		if (this._isRootInstance) {
			if (!task || !hours) return;
			if (!isDateBetween(task.allocatedDate, this._peopleStartDate, this._peopleEndDate)) return;

			let letOldHours = (!oldHours) ? 0 : oldHours;
			const memberIndex = this._findMemberIndex(task.peopleRecordID);
			const oldAvailability = this.members[memberIndex].availability;
			const dayIndex = this._findAvailabilityDayIndex(oldAvailability, moment.parseZone(task.allocatedDate).format("YYYY-MM-DD"));
			const oldDay = oldAvailability.days[dayIndex];

			const day = {
				_availableHours: oldDay._availableHours,
				_date: oldDay._date,
				_plannedHours: (oldDay._plannedHours - letOldHours) + hours,
				_plannedTasks: oldDay._plannedTasks,
				_plannedTasksQty: oldDay._plannedTasksQty,
				_startWorkingTime: oldDay._startWorkingTime,
			};

			const availability = {
				availableHours: oldAvailability.availableHours,
				plannedHours: (oldAvailability.plannedHours - letOldHours) + hours,
				plannedTasksQty: oldAvailability.plannedTasksQty,
				days: oldAvailability.days
			};
			availability.days[dayIndex] = day;

			this.set(`members.${memberIndex}.availability`, availability);

			if (this.selectedMember && this.selectedMember._id == task.peopleRecordID) {
				this.notifyPath("selectedMember.availability");
			}
		} else {
			return this._rootInstance.clientReflectAllocationHourChangeToPeopleAvailability(hours, oldHours, task);
		}
	}

	refreshPeopleToAssign() {
		if (this._isRootInstance) {
			const allocatedPeople = getTriserviceTaskAssignment().allocatedPeople;
			if (!allocatedPeople) {
				this.peopleToAssign = this.members;
				this.denormalizedPeopleToAssign = this.denormalizedMembers;
			} else {
				this.peopleToAssign = 
					this.members
						.filter((member) => allocatedPeople.findIndex((allocation) => allocation.peopleRecordID == member._id) < 0)
						.map((member) => Object.assign({}, member));
				this.denormalizedPeopleToAssign = 
						this.denormalizedMembers
							.filter((member) => allocatedPeople.findIndex((allocation) => allocation.peopleRecordID == member._id) < 0);
			}
		} else {
			return this._rootInstance.refreshPeopleToAssign();
		}
	}

	refreshPeopleToAssignAvailability(startDate, endDate) {
		if (this._isRootInstance) {
			if (this._isRootInstance) {
				this._debounceRefreshPeopleToAssignAvailability = Debouncer.debounce(
					this._debounceRefreshPeopleToAssignAvailability, 
					microTask,
					() => {
						const peopleToAssign = this.peopleToAssign;
						const queryWorkPlanner = this.shadowRoot.querySelector("#membersWorkPlannerDSQueryWorkPlanner");
						if (peopleToAssign && peopleToAssign.length > 0 && 
							startDate && startDate != queryWorkPlanner.startDate && 
							endDate && endDate != queryWorkPlanner.endDate) {

							this.shadowRoot.querySelector("#membersWorkPlannerDSContext").contextId = peopleToAssign;
							queryWorkPlanner.startDate = startDate;
							queryWorkPlanner.endDate = endDate;
							setTimeout(function() {
								this.shadowRoot.querySelector("#membersWorkPlannerDS").refresh()
									.then(this._returnDataFromResponse.bind(this))
									.then(this._computePeopleToAssignAvailability.bind(this, peopleToAssign));
							}.bind(this), 1);
						}
					}
				);
			}
		} else {
			return this._rootInstance.refreshPeopleToAssignAvailability(startDate, endDate);
		}
	}

	_computePeopleToAssignAvailability(peopleToAssign, membersWorkPlanner) {
		if (!peopleToAssign || peopleToAssign.length == 0 || !membersWorkPlanner || membersWorkPlanner.length == 0) {
			return;
		}
		for (let i = 0; i < peopleToAssign.length; i++) {
			const availability = this._getPeopleAvailability(peopleToAssign[i]._id, membersWorkPlanner);
			this.set(`peopleToAssign.${i}.availability`, availability);
		}
	}

	_getAvailabilityDay(personId, allocationDate) {
		let personIndex = this._findMemberIndex(personId);
		let personAvailability = this.members[personIndex].availability;
		let availabilityDayIndex = this._findAvailabilityDayIndex(personAvailability, moment.parseZone(allocationDate).format("YYYY-MM-DD"));
		return personAvailability.days[availabilityDayIndex];
	}

	clientReflectAllocationDateChangeToPeopleAvailability(updatedAllocations, oldAllocations) {
		if (this._isRootInstance) {
			for (let i = 0; i < updatedAllocations.length; i++) {
				this.clientRemoveTaskFromPeopleAvailability(updatedAllocations[i].resource.id, oldAllocations[i].date, oldAllocations[i].hours);
				this.clientAddTaskToPeopleAvailability(updatedAllocations[i].resource.id, updatedAllocations[i].date, updatedAllocations[i].hours);
			}
		} else {
			return this._rootInstance.clientReflectAllocationDateChangeToPeopleAvailability(updatedAllocations, oldAllocations);
		}
	}
};

window.customElements.define(TriservicePeople.is, TriservicePeople);