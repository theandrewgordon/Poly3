/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-list/iron-list.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-query/triplat-query.js";
import { getTriroutesWorkPlanner } from "../../routes/triroutes-work-planner.js";
import "../../services/triservice-task-assignment.js";
import "../../services/triservice-work-task.js";
import "../../styles/tristyles-work-planner.js";
import "../../services/triservice-security.js";
import "./tricomp-task-card.js";
import "./tricomp-task-drag-image.js";
import "./tricomp-task-table-card.js";
import { TrimixinTaskList } from "./trimixin-task-list.js";
import "./tricomp-task-sort-header.js";

class TricompUnassignedTaskList extends TrimixinTaskList(PolymerElement) {
	static get is() { return "tricomp-unassigned-task-list"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					position: relative;
				}
			</style>

			<triservice-task-assignment id="taskAssignmentService" selected-tasks="{{_selectedTasks}}" dragging-task="[[_draggingTask]]"></triservice-task-assignment>

			<triservice-work-task unassigned-tasks="{{_nonFilteredTasks}}" loading-unassigned-tasks="{{_loading}}">
			</triservice-work-task>

			<triservice-security 
				can-assign="{{_canAssign}}" 
				can-update-task-priority="{{_canUpdateTaskPriority}}"
				can-update-task-planned-date="{{_canUpdateTaskPlannedDate}}">
			</triservice-security>

			<triplat-query id="taskQuery" append-filters="[[taskFilters]]" filtered-data-out="{{_filteredTasks}}">
				<triplat-query-sort name="[[_sortField]]" desc="[[_sortDesc]]"></triplat-query-sort>
			</triplat-query>

			<dom-if if="[[_isNonFilteredTasksEmpty]]">
				<template>
					<div class="task-message-placeholder">
						<div aria-label\$="[[_noTasksMessage]]" tabindex="0" aria-live="polite">[[_noTasksMessage]]</div>
					</div>
				</template>
			</dom-if>

			<dom-if if="[[_isNoSearchResults]]">
				<template>
					<div class="task-message-placeholder">
						<div aria-label\$="[[_noTaskFoundMessage]]" tabindex="0" aria-live="polite">[[_noTaskFoundMessage]]</div>
					</div>
				</template>
			</dom-if>

			<dom-if if="[[_loading]]">
				<template>
					<div class="task-empty-message-placeholder"></div>
				</template>
			</dom-if>

			<tricomp-task-sort-header id="sortHeader" class="task-sort-header" select-all="[[_selectAll]]" 
				sort-field="{{_sortField}}" sort-desc="{{_sortDesc}}"
				on-select-all-changed-by-user="_handleSelectAllChanged"
				show-undo="[[smallLayout]]" no-sort="[[smallLayout]]"
				table-sort="[[!cardLayout]]" disable-drag="[[_computeDisableDrag(_canAssign, smallLayout)]]">
			</tricomp-task-sort-header>

			<dom-if if="[[cardLayout]]" restamp>
				<template>
					<iron-list id="taskIronList" class="iron-list" as="task" items="[[_filteredTasks]]">
						<template>
							<tricomp-task-card class="task-card"
								task="[[task]]"
								current-user="[[currentUser]]"
								first\$="[[_isFirst(index)]]" 
								selected="[[task.selected]]"
								on-task-selected-changed="_handleTaskSelectedChanged"
								on-task-assign-button-tap="_handleAssignButtonTap"
								disable-drag="[[_computeDisableDrag(_canAssign, smallLayout)]]"
								dragging="[[_draggingTask]]"
								on-dragging="_handleDragging"
								on-neon-animation-finish="_handleAnimationFinish"
								drag-image-element="[[_dragImageElement]]"
								taskid\$="task-[[task._id]]"
								planned-start-end-field
								time-estimate-field
								type-field-last
								scroll-container="[[scrollContainer]]"
								disable-priority="[[!_canUpdateTaskPriority]]"
								disable-date="[[!_canUpdateTaskPlannedDate]]"
								small-layout="[[smallLayout]]"
								medium-layout="[[mediumLayout]]"
								assign-button="[[_computeShowAssignButton(smallLayout, _canAssign, task.assignmentStatusENUS)]]">
							</tricomp-task-card>
						</template>
					</iron-list>
				</template>
			</dom-if>

			<dom-if if="[[!cardLayout]]" restamp>
				<template>
					<iron-list id="taskIronList" class="iron-list" as="task" items="[[_filteredTasks]]">
						<template>
							<tricomp-task-table-card class="task-card"
								task="[[task]]"
								current-user="[[currentUser]]"
								first\$="[[_isFirst(index)]]" 
								selected="[[task.selected]]"
								on-task-selected-changed="_handleTaskSelectedChanged" 
								disable-drag="[[_computeDisableDrag(_canAssign, smallLayout)]]"
								dragging="[[_draggingTask]]"
								on-dragging="_handleDragging"
								on-neon-animation-finish="_handleAnimationFinish"
								drag-image-element="[[_dragImageElement]]"
								taskid\$="task-[[task._id]]"
								planned-start-end-field
								time-estimate-field
								type-field-last
								scroll-container="[[scrollContainer]]"
								disable-priority="[[!_canUpdateTaskPriority]]"
								disable-date="[[!_canUpdateTaskPlannedDate]]"
								small-layout="[[smallLayout]]"
								medium-layout="[[mediumLayout]]"
								assign-button="[[_computeShowAssignButton(smallLayout, _canAssign, task.assignmentStatusENUS)]]"
								on-expanded-changed="_listNotifyResize">
							</tricomp-task-table-card>
						</template>
					</iron-list>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			_noTasksMessage: {
				type: String,
				value: () => {
					let __dictionary__message =  "No unassigned work tasks are planned to start in the selected week for the selected workgroup.";
					return __dictionary__message;
				}
			}
		};
	}

	_handleTaskSelectedChanged(e) {
		if (e.detail.selected) {
			this.push("_selectedTasks", e.detail.task);
		} else {
			this._removeSelectedTask(e.detail.task);
		}
	}

	_handleAssignButtonTap(e) {
		this.$.taskAssignmentService.selectedPeople = [];
		let selectedTasksSet = new Set(this._selectedTasks);
		selectedTasksSet.add(e.detail.task);
		this._selectedTasks = Array.from(selectedTasksSet);
		getTriroutesWorkPlanner().openPeopleList();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-unassigned-task-list.js");
	}
}

window.customElements.define(TricompUnassignedTaskList.is, TricompUnassignedTaskList);