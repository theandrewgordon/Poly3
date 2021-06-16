/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-search-input/triplat-search-input.js";
import "../../../triplat-query/triplat-query.js";
import "../../styles/tristyles-work-planner.js";
import "../../services/triservice-people.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-work-planner.js";
import "../../services/triservice-security.js";
import "../../routes/triroutes-work-planner.js";
import { TrimixinPeopleList } from "./trimixin-people-list.js";
import "./tricomp-people-card.js";
import "./tricomp-people-sort-header.js";

class TricompPeopleList extends TrimixinPeopleList(PolymerElement) {
	static get is() { return "tricomp-people-list"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				tricomp-people-card[first] {
					margin-top: 0px;
				}

				.list-container {
					@apply --layout-vertical;
				}

				:host(:not([small-layout])) .list-container {
					@apply --layout-flex;
				}

				:host([small-layout]) .list-container {
					flex-shrink: 0;
				}

				.list {
					@apply --layout-vertical;
				}

				:host(:not([small-layout])) .list {
					@apply --layout-flex;
					overflow-y: auto;
				}

				:host([small-layout]) .search-input {
					margin-left: 15px;
					margin-right: 15px;
					margin-bottom: 15px;
					flex-shrink: 0;
				}

				:host([small-layout]) .people-sort-header {
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
				}
			</style>

			<triroutes-work-planner id="routesWorkPlanner"></triroutes-work-planner>

			<triservice-people members="{{_nonFilteredMembers}}" loading="{{_loadingPeople}}" 
				denormalized-members="{{_denormalizedMembers}}" member-search-fields="{{_memberSearchFields}}">
			</triservice-people>

			<triservice-task-assignment id="serviceTaskAssignment" selected-tasks="{{_selectedTasks}}" 
				dragging-task="{{_draggingTask}}" selected-people="{{selectedPeople}}" allocated-people="{{_allocatedPeople}}"
				is-selected-task-assigned="{{_isSelectedTaskAssigned}}">
			</triservice-task-assignment>

			<triservice-work-planner current-user="{{_currentUser}}" medium-layout="{{_mediumLayout}}"></triservice-work-planner>

			<triservice-security can-unassign="{{_canUnassign}}" can-assign="{{_canAssign}}"></triservice-security>

			<triplat-query append-filters="[[_memberFilters]]" data="[[_nonFilteredMembers]]" filtered-data-out="{{_filteredMembers}}">
				<triplat-query-sort name="[[_sortField]]" desc="[[_sortDesc]]"></triplat-query-sort>
			</triplat-query>

			<triplat-search-input id="searchInput"
				class="search-input"
				placeholder="Search"
				data="[[_denormalizedMembers]]"
				aliases="[[_memberSearchFields]]"
				on-append-filters-changed="_handleAppendFiltersChanged"
				search-icon-precede
				scroll-element-into-view>
			</triplat-search-input>

			<dom-if if="[[_isEmpty(_nonFilteredMembers)]]">
				<template>
					<div class="message-placeholder" hidden\$="[[_loadingPeople]]">
						<div aria-label\$="[[_noMembersMessage]]" tabindex="0" aria-live="polite">[[_noMembersMessage]]</div>
					</div>
				</template>
			</dom-if>

			<dom-if if="[[_isNoSearchResults(_nonFilteredMembers, _filteredMembers)]]">
				<template>
					<div class="message-placeholder" hidden\$="[[_loadingPeople]]">
						<div aria-label\$="[[_noPeopleFoundMessage]]" tabindex="0" aria-live="polite">[[_noPeopleFoundMessage]]</div>
					</div>
				</template>
			</dom-if>
			
			<div class="list-container" hidden$="[[_isEmpty(_filteredMembers)]]">
				<tricomp-people-sort-header id="peopleSortHeader" class="people-sort-header"
					sort-field="{{_sortField}}" sort-desc="{{_sortDesc}}" select-all="[[_selectAll]]"
					on-select-all-changed-by-user="_handleSelectAllChanged" disable-select-all="[[!_canAssign]]"
					small-layout="[[smallLayout]]">
				</tricomp-people-sort-header>

				<div class="list">
					<dom-repeat items="[[_filteredMembers]]">
						<template>
							<tricomp-people-card people="[[item]]" first\$="[[_isFirst(index)]]"
								on-open-people="_handleOpenPeople" on-assign-task="_handleAssignTask"
								dragging-task="[[_draggingTask]]" enable-selection="[[_enableSelection(item._allocation, _isSelectedTaskAssigned, _canAssign)]]"
								on-dragging-over="_handleDraggingOver" dragging-over="[[_draggingOver]]"
								current-user="[[_currentUser]]" allocation="[[item._allocation]]"
								selected="[[item.selected]]" on-people-selected-changed="_handlePeopleSelectedChangedEvent"
								disable-unassign="[[!_canUnassign]]" no-drop="[[smallLayout]]" hide-expand-button="[[smallLayout]]"
								small-layout="[[smallLayout]]" medium-layout="[[_mediumLayout]]">
							</tricomp-people-card>
						</template>
					</dom-repeat>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			smallLayout: {
				type: Boolean,
				reflectToAttribute: true
			},

			_mediumLayout: {
				type: Boolean
			},

			_noMembersMessage: {
				type: String,
				value: () => {
					let __dictionary__message =  "No people are assigned to the selected workgroup.";
					return __dictionary__message;
				}
			},

			_draggingTask: {
				type: Boolean
			},

			_selectedTasks: {
				type: Array
			},

			_draggingOverList: {
				type: Array,
				value: () => []
			},

			_draggingOver: {
				type: Boolean,
				value: false
			},

			_allocatedPeople: {
				type: Array
			},

			_currentUser: {
				type: Object
			},

			_isSelectedTaskAssigned: {
				type: Boolean
			},

			_canUnassign: {
				type: Boolean
			},

			_canAssign: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_handleNonFilteredMembersChanged(_nonFilteredMembers)",
			"_computeAllocationForAllMembers(_nonFilteredMembers.*, _allocatedPeople.*, _isSelectedTaskAssigned)"
		]
	}

	_handleNonFilteredMembersChanged(nonFilteredMembers) {
		this.selectedPeople = [];
		this._draggingOverList = [];
		this.$.searchInput.clearSearch();
		this.$.peopleSortHeader.reset();
	}

	_handleOpenPeople(event) {
		this.$.routesWorkPlanner.openTeamAssignments(event.detail.people._id);
	}

	_handleAssignTask(event) {
		if (this._isSelectedTaskAssigned) {
			let selectedUnallocatedPeople = this.$.serviceTaskAssignment.getSelectedUnallocatedPeople(this.selectedPeople, this._allocatedPeople);
			if (selectedUnallocatedPeople.length > 0) this.$.serviceTaskAssignment.assignTask(this._selectedTasks.slice(), selectedUnallocatedPeople);
		} else {
			this.$.serviceTaskAssignment.assignTask(this._selectedTasks.slice(), this.selectedPeople.slice());
		}
		this._draggingOverList = [];
	}

	_handleDraggingOver(event) {
		const peopleIndex = event.model.get("index");
		this._draggingOverList[peopleIndex] = event.detail.draggingOver;
		this._draggingOver = this._draggingOverList.findIndex(item => item) >=0;
	}

	_enableSelection(allocation, isAssignedStatus, canAssign) {
		return canAssign && (!isAssignedStatus || !allocation);
	}

	_computeAllocationForAllMembers(nonFilteredMembersChanges, allocatedPeopleChanges, isSelectedTaskAssigned) {
		if (!isSelectedTaskAssigned && this._nonFilteredMembers) {
			this._nonFilteredMembers.forEach(member => this._clearAllocation(member));
			return;
		}
		if ( nonFilteredMembersChanges.base && 
			(nonFilteredMembersChanges.path == "_nonFilteredMembers" || nonFilteredMembersChanges.path == "_nonFilteredMembers.splices") &&
			(allocatedPeopleChanges.path == "_allocatedPeople" || allocatedPeopleChanges.path == "_allocatedPeople.splices")) {
			this._debounceComputeAllocation = Debouncer.debounce(
				this._debounceComputeAllocation,
				microTask,
				() => {
					nonFilteredMembersChanges.base.forEach(member => this._computeAllocation(member, allocatedPeopleChanges.base));
				}
			);
		}
	}

	_clearAllocation(member) {
		this._computeAllocation(member);
	}

	_computeAllocation(member, allocatedPeople) {
		member._allocation = null;
		if (this._isSelectedTaskAssigned && allocatedPeople) {
			let allocation = allocatedPeople.find((allocation) => allocation.peopleRecordID == member._id);
			if (allocation) member._allocation = allocation;
		}
		if (this._filteredMembers) {
			let filteredMemberIndex = this._filteredMembers.findIndex(item => item._id == member._id);
			this.notifyPath(`_filteredMembers.${filteredMemberIndex}._allocation`);
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/people-list/tricomp-people-list.js");
	}
}

window.customElements.define(TricompPeopleList.is, TricompPeopleList);