/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triblock-table/triblock-table.js";
import "../triblock-responsive-layout/triblock-responsive-layout.js";
import "../triblock-confirmation-popup/triblock-confirmation-popup.js";
import { TriComputeLoadingBehavior } from "./tribehav-compute-loading.js";
import "./tricomp-task-list-item.js";
import "./tricomp-task-list-location.js";
import "./tricomp-card-and-table-view.js";
import "./tricomp-task-priority.js";
import "./tricomp-task-lifecycle.js";
import "./tricomp-overflow-text.js";
import "./triservice-work-task-base.js";
import "./triservice-work-task-search-by-asset.js";
import "./triservice-work-task-search-by-location.js";
import "./tristyles-task-list.js";

Polymer({
	_template: html`
		<style include="tristyles-theme message-placeholder">

				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
					position: relative;
				}

				.loading-indicator {
					--triplat-loading-indicator-clear-background: transparent;
					--triplat-loading-indicator-container: {
						position: fixed;
					};
				}

				.message-placeholder {
					@apply --layout-center-center;
				}

				.card-layout {
					@apply --layout-wrap;
					@apply --layout-scroll;
					@apply --layout-flex-none;
					background-color: var(--ibm-neutral-2);
					padding: 10px;
				}
				:host([small-layout]) .card-layout {
					padding: 0px;
				}
				:host(:not([embedded])) .card-layout {
					padding-bottom: 51px;
				}

				:host([small-layout]) .card-layout > * {
					@apply --layout-flex-none;
				}

				.task-item {
					margin: 10px;
				}

				:host([small-layout]) .task-item {
					margin: 0px;
				}

				.data-card-and-table-view {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.data-table-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 20px;
				}
				:host([small-layout]) .data-table-container {
					padding: 10px;
				}

				.data-table {
					@apply --layout-flex;
					--tricomp-task-lifecycle-remove-delete: {
						height:22px;
						width:22px;
					};
				}

				.column-center {
					--triblock-table-column-header-flex-alignment: center;
					--triblock-table-column-body-flex-alignment: center;
				}

				.status-readonly {
					color: var(--tri-danger-color);
				}

				.conf-popup-alert .header-warning {
					color: var(--tri-major-warning-color);
					font-weight: 300;
					margin-top: 0px;
				}
			
		</style>

		<triservice-work-task-base id="workTaskBaseService" current-user="{{_currentUser}}" loading-tasks="{{_loadingTasks}}" loading-timer-action="{{_loadingTimerAction}}" loading-delete-task-action="{{_loadingDeleteTaskAction}}" small-layout="{{smallLayout}}"></triservice-work-task-base>

		<triservice-work-task-search-by-asset loading-tasks="{{_loadingTasksByAsset}}"></triservice-work-task-search-by-asset>
		<triservice-work-task-search-by-location loading-tasks="{{_loadingTasksByLocation}}"></triservice-work-task-search-by-location>

		<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>

		<tricomp-card-and-table-view id="dataCardAndTableViewInProgress" small-layout="[[smallLayout]]" medium-layout="[[mediumLayout]]" data="[[data]]" class="data-card-and-table-view" current-layout="{{currentLayout}}" hidden\$="[[!data.length]]">
			<div table-container="" class="data-table-container">
				<triblock-table table-data="" class="data-table" fixed-header="" sort-property="{{sortProperty}}" sort-descending="{{sortDescending}}" sort-type="{{sortType}}" on-row-tap="_handleOpenTask" row-aria-label-callback="[[_computeRowAriaLabelCallback]]" scroller="{{tableScroller}}">
					<triblock-table-column title="ID" property="taskID"></triblock-table-column>
					<triblock-table-column title="Task Name" property="taskName" class="wide">
						<template>
							<tricomp-overflow-text lines="3" text="[[item.taskName]]"></tricomp-overflow-text>
						</template>
					</triblock-table-column>
					<triblock-table-column title="Priority" property="priorityRanking" class="column-center" sortable="" reverse-sort="">
						<template>
							<tricomp-task-priority priority="[[item.taskPriority]]" priority-en-us="[[item.taskPriorityENUS]]" priority-color="[[item.priorityColor]]" icon-only=""></tricomp-task-priority>
						</template>
					</triblock-table-column>
					<triblock-table-column title="Location" property="computedLocation" class="wide" sortable="" hide="[[ignoreLocation]]"></triblock-table-column>
					<triblock-table-column title="Location" property="primaryWorkLocationPath" class="wide" hide="[[!ignoreLocation]]">
						<template>
							<tricomp-task-list-location location-path="[[item.primaryWorkLocationPath]]" location-type-en-us="[[item.primaryWorkLocationTypeENUS]]">
							</tricomp-task-list-location>
						</template>
					</triblock-table-column>
					<triblock-table-column title="Planned Start" property="plannedStart" class="wide" type="DATETIME" sortable="" initial-sort="">
						<template>
							[[formatDateWithTimeZone(item.plannedStart, _currentUser._TimeZoneId, _currentUser._DateTimeFormat, _currentUser._Locale)]]
						</template>
					</triblock-table-column>
					<triblock-table-column title="Status" property="status" type="STRING_WITH_ID" sortable="">
						<template>
							<span class\$="[[_computeStatusClass(item)]]">[[item.status.value]]</span>
						</template>
					</triblock-table-column>
					<triblock-table-column title="Type" property="taskType" type="STRING_WITH_ID" sortable=""></triblock-table-column>
					<triblock-table-column title="State" class="column-center">
						<template>
							<tricomp-task-lifecycle task-item="[[item]]" refresh-task-list="" enable-delete="[[_enableTaskDelete]]" readonly="[[_computeReadOnlyAuth(workTaskAuth)]]"></tricomp-task-lifecycle>
						</template>
					</triblock-table-column>
				</triblock-table>
			</div>

			<triblock-responsive-layout card-container="" class="card-layout" role="listbox" small-screen-width="[[smallLayout]]" disable-screen-size-detection>
				<template is="dom-repeat" card-data="" initial-count="10">
					<tricomp-task-list-item class="task-item" small-layout="[[smallLayout]]" task-item="[[item]]" enable-delete="[[_enableTaskDelete]]" aria-label\$="[[_computeRowAriaLabel(item)]]" auth="[[workTaskAuth]]">
					</tricomp-task-list-item>
				</template>
			</triblock-responsive-layout>
		</tricomp-card-and-table-view>

		<template is="dom-if" if="[[!data.length]]">
			<div class="message-placeholder" hidden\$="[[_loadingTasks]]">
				<div aria-label\$="[[emptyMessage]]" tabindex="0" aria-live="polite">[[emptyMessage]]</div>
			</div>
		</template>
		
		<triblock-confirmation-popup id="confirmDeletePopup" class="conf-popup-alert" on-confirm-tapped="_deleteWorkTask">
			<div class="text" slot="text">
				<div class="tri-h2 header-warning">Confirmation</div>
				<p>Are you sure you want to delete this draft?</p>
			</div>
		</triblock-confirmation-popup>
	`,

	is: "tricomp-task-list-tab-content",

	behaviors: [
		TriComputeLoadingBehavior,
		TriDateUtilities
	],

	properties: {
		data: {
			type: Array
		},

		currentLayout: {
			type: String,
			notify: true
		},

		emptyMessage: {
			type: String
		},

		ignoreLocation: {
			type: Boolean,
			value: false
		},

		sortProperty: {
			type: String,
			notify: true
		},

		sortType: {
			type: String,
			notify: true
		},

		sortDescending: {
			type: Boolean,
			notify: true
		},

		embedded: {
			type: Boolean,
			reflectToAttribute: true
		},

		tableScroller: {
			type: Object,
			notify: true
		},

		workTaskAuth: {
			type: Object
		},

		_currentUser: {
			type: Object
		},

		_loadingDeleteTaskAction: {
			type: Boolean
		},

		_loadingTasks: {
			type: Boolean
		},

		_loadingTasksByAsset: {
			type: Boolean
		},

		_loadingTasksByLocation: {
			type: Boolean
		},

		_loadingTimerAction: {
			type: Boolean
		},

		_enableTaskDelete: {
			type: Boolean,
			value: false
		},

		_taskIdForDelete: {
			type: String
		},

		_computeRowAriaLabelCallback: {
			type: Function,
			value: function () {
				return this._computeRowAriaLabel.bind(this);
			}
		},

		smallLayout: {
			type: Boolean,
			reflectToAttribute: true,
			notify: true
		},

		mediumLayout: {
			type: Boolean,
			notify: true
		}
	},

	observers: [
		"_setValidLoadings(_loadingTasks, _loadingDeleteTaskAction, _loadingTimerAction, _loadingTasksByAsset, _loadingTasksByLocation)",
		"_computeEnableTaskDelete(workTaskAuth)"
	],

	listeners: {
		'draft-delete-tapped': '_handleDraftDeleteTapped'
	},

	toggleLayout: function () {
		this.$.dataCardAndTableViewInProgress.toggleLayout();
	},

	_handleOpenTask: function (e) {
		e.stopPropagation();
		this.fire("open-task", { "taskId": e.detail.item._id, "taskStatus": e.detail.item.statusENUS.value, "taskAssignmentStatusENUS": e.detail.item.assignmentStatusENUS });
	},

	_computeStatusClass: function (task) {
		return (!task || !task.statusENUS ||
			task.statusENUS.value === "Closed" ||
			task.statusENUS.value === "Review In Progress" ||
			task.statusENUS.value === "Routing In Progress") ? "status-readonly" : "";
	},

	_computeEnableTaskDelete: function (workTaskAuth) {
		this._enableTaskDelete = workTaskAuth && workTaskAuth.canDelete;
	},

	_handleDraftDeleteTapped: function (e) {
		e.stopPropagation();
		this.set('_taskIdForDelete', e.detail.taskIdForDelete);
		this.$.confirmDeletePopup.openPopup();
	},

	_deleteWorkTask: function (e) {
		e.stopPropagation();
		this.$.workTaskBaseService.deleteTask(this._taskIdForDelete, true)
			.then(function () {
				this.set('_taskIdForDelete', null);
			}.bind(this));
	},

	_computeRowAriaLabel: function (item) {
		var __dictionary__taskRowAriaLabel1 = "This work task is named";
		var __dictionary__taskRowAriaLabel2 = "with an ID of";
		return __dictionary__taskRowAriaLabel1 + " " + item.taskName + " " + __dictionary__taskRowAriaLabel2 + " " + item.taskID + "."
	},

	_computeReadOnlyAuth: function (auth) {
		return auth.canRead && !auth.canCreate && !auth.canDelete && !auth.canUpdate;
	}
});