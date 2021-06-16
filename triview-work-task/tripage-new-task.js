/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-input/paper-input.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-tooltip/paper-tooltip.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/iron-pages/iron-pages.js";
import "././tricomp-room-search-popup.js";
import { TriValidationBehavior } from "./tribehav-validation.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-routing.js";
import "../triplat-icon/ibm-icons.js";
import { TriplatQuery } from "../triplat-query/triplat-query.js";
import "../triplat-select-input/triplat-select-input.js";
import { TriBlockScrollFieldIntoViewBehavior } from "../triblock-scroll-field-into-view-behavior/triblock-scroll-field-into-view-behavior.js";
import "../triapp-location-context/triapp-location-context.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import { TriNewTaskUnsavedChangesBehavior } from "./tribehav-new-task-unsaved-changes.js";
import "./triservice-new-work-task.js";
import "./triservice-work-task.js";
import "./tristyles-work-task-app.js";
import { TriroutesFloorplan } from "./triroutes-floorplan-selector.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import "../triapp-comments/triapp-comments.js";
import "./tricomp-task-detail-actions.js";
import "./tricomp-task-detail-priority.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-popup tristyles-theme">

				:host {
					@apply --layout-vertical;
				}
				
				.header {
					background-color: var(--ibm-neutral-2);
					@apply --layout-vertical;
					flex-shrink: 0;
				}
				
				.label-actions {
					@apply --layout-horizontal;
					@apply --layout-justified;
					@apply --layout-center;
				}

				:host(:not([_small-layout])) .label-actions {
					padding: 20px 20px 0 20px;
				}

				:host([_small-layout]) .label-actions {
					padding: 15px 15px 0 15px;
				}

				.new-task-label {
					font-weight: bold;
				}

				.task-name {
					--paper-input-container-input-color: var(--ibm-gray-50);
					--paper-input-container-label-floating: {
						font-size: 14px;
						webkit-transform: translateY(-75%) scale(1);
						transform: translateY(-75%) scale(1);
						font-family: var(--tri-font-family);
					};
					--paper-input-container-label: {
						padding-bottom: 4px;
						font-family: var(--tri-font-family);
					};
					--paper-input-container-underline:{
						border-bottom: 2px solid var(--tri-primary-content-label-color)!important;
					};
				}

				:host(:not([_small-layout])) .task-name,
				:host(:not([_small-layout])) .assigned {
					padding-left: 20px;
					padding-right: 20px;
				}

				:host([_small-layout]) .task-name {
					padding-left: 15px;
					padding-right: 15px;
				}
				
				:host(:not([_small-layout])) .header-details {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-top: 12px;
					padding-bottom: 20px;
				}

				:host([_small-layout]) .header-details {
					@apply --layout-vertical;
				}

				:host(:not([_small-layout])) .assigned {
					padding-right: 12px;
					border-right: 1px var(--tri-primary-content-accent-color) solid;
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				:host([_small-layout]) .assigned {
					padding: 10px 15px 10px 15px;
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.assigned-label {
					padding-right: 7px;
					font-size: 14px;
					padding-bottom: 0;
					color: var(--ibm-gray-70) !important;
				}

				.assigned-info-icon {
					padding-left: 5px;
					cursor: pointer;
					color: var(--tri-primary-color);
				}

				:host(:not([_small-layout])) .priority {
					padding-left: 12px;
				}

				:host([_small-layout]) .priority {
					border-top: 1px solid var(--ibm-gray-10);
					border-bottom: 1px solid var(--ibm-gray-10);
					padding-left: 0;
				}

				:host(:not([_small-layout])) .content {
					@apply --layout-flex;
					@apply --layout-horizontal;
				}

				:host([_small-layout]) .content {
					@apply --layout-vertical;
				}

				.left-panel {
					@apply --layout-vertical;
					flex-shrink: 0;
				}

				:host(:not([_small-layout])) .left-panel {
					@apply --layout-flex;
					padding: 17px 20px 0px 20px;
				}

				:host([_small-layout]) .left-panel {
					padding: 15px;
					@apply --layout-flex-none;
				}

				triplat-select-input {
					--paper-input-container-color: var(--ibm-gray-50);
					--triplat-select-input-margin-bottom-when-opened: 400px;
					--triplat-select-input-paper-item-min-height: 48px;
					--paper-input-container-label-floating:{
						font-size:14px;
						webkit-transform: translateY(-75%) scale(1);
						transform: translateY(-75%) scale(1);
						font-family: var(--tri-font-family);
					};
					--paper-input-container-label: {
						padding-bottom: 4px;
						font-family: var(--tri-font-family);
					};
					--paper-input-container-input: {
						font-size: 14px;
						font-family: var(--tri-font-family);
					};
					--paper-input-container-underline:{
						border-bottom: 2px solid var(--tri-primary-content-label-color)!important;
					};
					--triplat-select-input-clear-button: {
						color: var(--ibm-gray-50);
					};
				}

				.right-panel {
					@apply --layout-vertical;
				}

				:host(:not([_small-layout])) .right-panel {
					@apply --layout-flex-2;
					padding: 20px 20px 0 20px;
					border-left: 1px solid var(--ibm-gray-10);
				}
				
				:host([_small-layout]) .right-panel {
					flex-shrink: 0;
					padding: 15px;
					border-top: 1px solid var(--ibm-gray-10);
					@apply --layout-flex-none;
				}

				.description-header {
					font-weight: lighter;
				}

				:host(:not([_small-layout])) .request-service-class-container {
					@apply --layout-horizontal;
					flex-shrink: 0;
				}

				.request-service-class-container {
					@apply --layout-wrap;
				}

				.request-class-select, .service-class-select {
					min-width: 250px;
				}

				:host([dir="ltr"]:not([_small-layout])) .request-class-select {
					padding-right: 40px;
				}

				:host([dir="rtl"]:not([_small-layout])) .request-class-select {
					padding-left: 40px;
				}

				.description-label {
					padding-top: 14px;
					font-weight: lighter;
				}

				textarea {
					margin-top: 6px;
					border: 1px solid var(--ibm-gray-30);
					resize: none;
					outline: none;
					box-shadow: none;
					font-size: inherit;
					font-family: inherit;
					padding: 3px 6px;
					flex-shrink: 0;
				}

				.comments-title {
					margin-bottom: 0.5em;
					font-weight: lighter;
					padding-bottom: 4px;
					padding-top: 20px;
				}

				.comments {
					@apply --layout-horizontal;
					position: relative;
				}

				:host(:not([_small-layout])) .comments {
					@apply --layout-flex;
				}

				:host([_small-layout]) .comments {
					@apply --layout-flex-none;
					padding-bottom: 46px;
				}

				triapp-comments {
					@apply --layout-flex;
				}

				paper-icon-button {
					margin-top: 20px;
					padding: 4px 4px 4px 11px;
					height: 32px;
					width: 43px;
				}

				.room-container {
					@apply --layout-horizontal;
					@apply --layout-start;
				}

				.room-select {
					@apply --layout-flex;
					padding-right: 10px;
				}

				.search-icon {
					border-left: 1px solid var(--ibm-gray-10);
				}
			
		</style>

		<triplat-route name="newTask" params="{{_newTaskParams}}" on-route-active="_onRouteActive" active="{{_routeActive}}"></triplat-route>

		<triroutes-floorplan-selector></triroutes-floorplan-selector>

		<triservice-new-work-task id="newWorkTaskService" draft-task="{{_draftTask}}" loading="{{_loadingNewWorkTaskService}}" floors-for-building="{{_floorsForBuilding}}" selected-building-id="[[_selectedBuilding.id]]" rooms-for-floor="{{_roomsForFloor}}" selected-floor-id="[[_selectedFloor.id]]" service-classes="{{_serviceClasses}}" request-classes="{{_requestClasses}}"></triservice-new-work-task>

		<triservice-work-task id="workTaskService" small-layout="{{_smallLayout}}" comments="{{_comments}}" loading-comments="{{_loadingComments}}"></triservice-work-task>

		<triplat-query data="[[_floorsForBuilding]]" filtered-data-out="{{_filteredFloors}}">
			<triplat-query-filter name="floor" operator="contains" value="[[_floorSearchValue]]" ignore-if-blank=""></triplat-query-filter>
		</triplat-query>

		<triplat-query data="[[_roomsForFloor]]" filtered-data-out="{{_filteredRooms}}">
			<triplat-query-filter name="space" operator="contains" value="[[_roomSearchValue]]" ignore-if-blank=""></triplat-query-filter>
		</triplat-query>

		<triplat-query data="[[_requestClasses]]" filtered-data-out="{{_filteredRequestClasses}}">
			<triplat-query-filter name="path" operator="contains" value="[[_requestClassesSearchValue]]" ignore-if-blank=""></triplat-query-filter>
		</triplat-query>

		<triplat-query data="[[_serviceClasses]]" filtered-data-out="{{_filteredServiceClasses}}">
			<triplat-query-filter name="path" operator="contains" value="[[_serviceClassesSearchValue]]" ignore-if-blank=""></triplat-query-filter>
		</triplat-query>

		<triplat-loading-indicator class="loading-indicator" show="[[_loadingNewWorkTaskService]]"></triplat-loading-indicator>

		<div class="header">
			<div class="label-actions">
				<div class="new-task-label tri-h2">[[_computeHeaderLabel(_newTaskParams)]]&nbsp;[[_draftTask.taskID]]</div>
				<dom-if if="[[_routeActive]]">
					<template>
						<tricomp-task-detail-actions class="actions" small-layout="[[_smallLayout]]" task="[[_draftTask]]" online="[[online]]" auth="[[auth]]" hidden\$="[[!auth.canUpdate]]"></tricomp-task-detail-actions>
					</template>
				</dom-if>
			</div>
			<paper-input class="task-name" label="Name" value="{{_draftTask.taskName}}" placeholder="Enter a brief but descriptive name" maxlength="150"></paper-input>
			<div class="header-details">
				<div class="assigned">
					<div><label class="assigned-label">Assigned to:</label>[[currentUser.fullName]]</div>
					<iron-icon id="assignedInfoIcon" class="assigned-info-icon" icon="ibm:info-moreinfo" aria-label="Assigned to info" tabindex="0" role="img"></iron-icon>
					<paper-tooltip for="assignedInfoIcon" fit-to-visible-bounds="" position="bottom" offset="5" aria-label="Assigned to more info">
						<p>Use the Create Task application to create new self assigned tasks.</p>
						<p>If you want to report an issue for general assignment, use the Service Request application.</p>
					</paper-tooltip>
				</div>
				<dom-if if="[[_routeActive]]">
					<template>
						<tricomp-task-detail-priority small-layout="[[_smallLayout]]" class="priority" task="[[_draftTask]]" priority="{{_draftTask.taskPriority}}" priority-en-us="{{_draftTask.taskPriorityENUS}}" status-en-us="[[_draftTask.statusENUS]]" ignore-ds-update=""></tricomp-task-detail-priority>
					</template>
				</dom-if>
			</div>
		</div>
		<div class="content">
			<div class="left-panel">
				<triapp-location-context id="locationContext" label="Where is the problem?" aria-label="Where is the problem?" hide-message="" on-location-changed="_handleBuildingSelected" change-location-type="icon" regular-font-size="" no-image="" ignore-local-storage="" ignore-primary-location="">
				</triapp-location-context>
				<triplat-select-input class="floor-select" tabindex="0" label="Floor" value="{{_selectedFloor}}" search-value="{{_floorSearchValue}}" value-name="floor" select-src="[[_filteredFloors]]" aria-label="Select floor" disabled="[[_computeDisableShowFloor(_selectedBuilding)]]" scroll-element-into-view="[[_smallLayout]]">
				</triplat-select-input>
				<div class="room-container">
					<triplat-select-input class="room-select" tabindex="0" label="Room" value="{{_selectedRoom}}" search-value="{{_roomSearchValue}}" value-name="space" select-src="[[_filteredRooms]]" aria-label="Select room" disabled="[[_computeDisableShowRoom(_selectedFloor)]]" scroll-element-into-view="[[_smallLayout]]">
					</triplat-select-input>


					<paper-icon-button id="showFloorplanBtn" icon="ibm:floorplan" class="search-icon" primary="" alt="Show floor plan" on-tap="_openFloorPlan" disabled="[[_computeDisableShowFloorplanBtn(_selectedFloor,online)]]" aria-label="Show floor plan">
					</paper-icon-button>

					<paper-tooltip for="showFloorplanBtn" position="right" animation-delay="0" offset="5">Show floor plan</paper-tooltip>
				</div>
			</div>

			<div class="right-panel">
				<div class="description-header tri-h3" aria-label="What best describes the problem?">What best describes the problem?</div>
				<div class="request-service-class-container">
					<triplat-select-input class="request-class-select" label="Request Class" select-src="[[_filteredRequestClasses]]" search-value="{{_requestClassesSearchValue}}" value="{{_draftTask.requestClass}}" value-name="displayName" placeholder="Select a request class" scroll-element-into-view="[[_smallLayout]]"></triplat-select-input>
					<triplat-select-input class="service-class-select" label="Service Class" select-src="[[_filteredServiceClasses]]" search-value="{{_serviceClassesSearchValue}}" value="{{_draftTask.serviceClass}}" value-name="displayName" placeholder="Select a service class" scroll-element-into-view="[[_smallLayout]]"></triplat-select-input>
				</div>
				<div class="description-label">Description</div>
				<textarea id="descriptionField" value="{{_draftTask.description::input}}" rows="4" maxlength="1000" aria-label="Problem Description" placeholder="Write your description of the problem" tri-scroll-into-view=""></textarea>
				<div class="comments-title tri-h3">
					<span>Comments and Photos</span>
				</div>
				<div class="comments">
					<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>
					<dom-if if="[[_routeActive]]">
						<template>
							<triapp-comments id="appComments" current-user="[[currentUser]]" online="[[online]]" comments="[[_comments]]" loading="[[_loadingComments]]" on-add-comment="_handleAddComment" on-error-alert="_handleCommentAlert" small-screen-width="[[_smallLayout]]" disable-screen-size-detection>
							</triapp-comments>
						</template>
					</dom-if>
				</div>
			</div>
		</div>
		<triplat-route-selector no-initial-route="">
			<iron-pages>
				<tricomp-room-search-popup id="roomSelectorPopupTask" small-layout="[[_smallLayout]]" route="taskFloorplanDetail" building="[[_selectedBuilding]]" floor="[[_selectedFloor]]" room="{{_selectedRoom}}">
				</tricomp-room-search-popup>
			</iron-pages>
		</triplat-route-selector>
	`,

    is: "tripage-new-task",

    behaviors: [
	    TriComputeLoadingBehavior,
	    TriNewTaskUnsavedChangesBehavior,
	    TriBlockScrollFieldIntoViewBehavior,
	    TriValidationBehavior,
	    TriDirBehavior
	],

    properties: {
		online: {
			type: Object,
			value: true
		},

		currentUser: Object,

		auth: Object,


		_draftTask: {
			type: Object,
			value: {}
		},

		_selectedBuilding: {
			type: Object,
			notify: true,
			value: { id: "", value: "" }
		},

		_selectedFloor: {
			type: Object,
			notify: true,
			value: { id: "", value: "" },
			observer: "_handleSelectedFloorChanged"
		},

		_selectedRoom: {
			type: Object,
			notify: true,
			value: { id: "", value: "" }
		},

		_comments: Object,

		_floorsForBuilding: Array,
		_roomsForFloor: Array,
		_floorSearchValue: String,
		_roomSearchValue: String,
		_filteredFloors: Array,
		_filteredRooms: Array,

		_serviceClasses: Array,
		_requestClasses: Array,
		_serviceClassesSearchValue: String,
		_requestClassesSearchValue: String,
		_filteredServiceClasses: Array,
		_filteredRequestClasses: Array,

		_newTaskParams: Object,
		_taskParamId: String,

		_loadingNewWorkTaskService: Boolean,
		_loadingComments: Boolean,
		_routeActive: Boolean,

		_smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		'_handleLocationChanged(_selectedBuilding, _selectedFloor, _selectedRoom)',
		'_handleServiceClassChanged(_draftTask.serviceClass)',
		'_handleRequestClassChanged(_draftTask.requestClass)',
		"_setLoadingBlockers(_loadingNewWorkTaskService)",
		"_setValidLoadings(_loadingComments)",
		"_setTaskLocation(_draftTask)",
		"setOriginalTask(_draftTask)"
	],

    _reset: function () {
		this.set('_taskParamId', this._newTaskParams.taskId);
		this.set('_selectedBuilding', { id: "", value: "" });
		this.set('_selectedFloor', { id: "", value: "" });
		this.set('_selectedRoom', { id: "", value: "" });
		this._serviceClassesSearchValue = "";
		this._requestClassesSearchValue = "";
		this.$.newWorkTaskService.refreshRequestClasses();
		this.$.newWorkTaskService.refreshServiceClasses();
		this._initNewComment();
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.locationContext.reload();
				if (this._newTaskParams && this._newTaskParams.taskId) {
					this._reset();
					var taskId = this._newTaskParams.taskId;
					if (taskId != "-1") {
						this._refreshDraftTask(taskId);
					} else {
						this._precreateDraftTask();
					}
				}
			});
		} else {
			if (this._draftTask != null) {
				if (this.computeTaskHasUnsavedChanges(this._draftTask)) {
					this._updateTask().then(() => this._draftTask = null);
				} else if (this._taskParamId == -1 && this.isTaskEmpty(this._draftTask, this._comments)) {
					this._deleteTask().then(() => this._draftTask = null);
				} else {
					this._draftTask = null
				}
			}
		}
	},

    _refreshDraftTask: function (taskId) {
		this.$.newWorkTaskService.refreshTask(taskId)
			.then(this._refreshComments.bind(this));
	},

    _setTaskLocation: function (task) {
		if (!task) {
			return;
		}
		if (task.primaryWorkLocationTypeENUS == "Space") {
			this.$.locationContext.overrideBuildingId = task.parentBuildingId;
			this._selectedBuilding = { id: task.parentBuildingId, value: task.parentBuilding };
			this._selectedFloor = { id: task.parentId, value: task.parentFloor };
			this._selectedRoom = { id: task.primaryWorkLocationId, value: task.primaryWorkLocation };
		} else if (task.primaryWorkLocationTypeENUS == "Floor") {
			this.$.locationContext.overrideBuildingId = task.parentBuildingId;
			this._selectedBuilding = { id: task.parentBuildingId, value: task.parentBuilding };
			this._selectedFloor = { id: task.primaryWorkLocationId, value: task.primaryWorkLocation };
		} else if (task.primaryWorkLocationTypeENUS == "Building") {
			this.$.locationContext.overrideBuildingId = task.primaryWorkLocationId;
			this._selectedBuilding = { id: task.primaryWorkLocationId, value: task.primaryWorkLocation };
		}
	},

    _precreateDraftTask: function () {
		return this.$.newWorkTaskService.precreateDraftTask()
			.then(this._refreshComments.bind(this));
	},

    _refreshComments: function () {
		return this.$.workTaskService.refreshTaskComments(this._draftTask._id);
	},

    _updateTask: function () {
		return this.$.newWorkTaskService.updateTask(this._draftTask);
	},

    _deleteTask: function () {
		return this.$.newWorkTaskService.deleteTask(this._draftTask._id);
	},

    _computeHeaderLabel: function (newTaskParams) {
		var __dictionary__defaultHeaderLabel = "New Work Task";
		var __dictionary__draftHeaderLabel = "Work Task Draft";

		var headerLabel = __dictionary__defaultHeaderLabel;
		if (newTaskParams && newTaskParams.taskId && newTaskParams.taskId != "-1") {
			headerLabel = __dictionary__draftHeaderLabel;
		}
		return headerLabel;
	},

    _handleAddComment: function (e) {
		this.$.workTaskService.createTaskComment(this._draftTask._id, e.detail.comment)
			.then(function (success) {
				this._initNewComment();
			}.bind(this)
			);
	},

    _initNewComment: function () {
		this.shadowRoot.querySelector("#appComments").createNewComment();
	},

    _handleCommentAlert: function (e) {
		this.fire("work-task-alert", { type: "error", title: e.detail });
	},

    _handleBuildingSelected: function (e) {
		var detail = e.detail;
		if (!(detail.building && detail.building._id)) {
			return;
		}
		var newBuilding = detail.building;
		var oldBuildingId = this._selectedBuilding.id ? this._selectedBuilding.id : "-1";

		// Check if the new building is not equal to old building
		if (newBuilding._id != oldBuildingId) {
			var finalBuilding = {
				id: newBuilding._id,
				value: newBuilding.path.match(/([^\\]*)$/)[1]
			};
			this.set('_selectedBuilding', finalBuilding);

			var emptyObj = { id: "", value: "" };
			this.set('_selectedFloor', emptyObj);
			this.set('_selectedRoom', emptyObj);
		}
	},

    _handleLocationChanged: function (building, floor, room) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.debounce("_handleLocationChanged", this._doHandleLocationChanged.bind(this, building, floor, room));
	},

    _doHandleLocationChanged: function (building, floor, room) {
		if (!this._draftTask) {
			return;
		}
		if (room && room.id) {
			if (room.id != this._draftTask.primaryWorkLocationPath.id) {
				this._draftTask.primaryWorkLocationPath = this._findInList(room.id, this._filteredRooms);
				this._draftTask.primaryWorkLocationTypeENUS = "Space";
				this._draftTask.primaryWorkLocationType = "Space";
				this._draftTask.parentBuildingId = building.id;
				this._draftTask.parentBuilding = building.value.match(/([^\\]*)$/)[1];
				this._draftTask.parentId = floor.id;
				this._draftTask.parentFloor = floor.value;
				this._draftTask.primaryWorkLocationId = room.id;
				this._draftTask.primaryWorkLocation = room.value;
				this._draftTask.primaryWorkLocationImage = null;
			}
		} else if (floor && floor.id) {
			if (floor.id != this._draftTask.primaryWorkLocationPath.id) {
				this._draftTask.primaryWorkLocationPath = this._findInList(floor.id, this._filteredFloors);
				this._draftTask.primaryWorkLocationTypeENUS = "Floor";
				this._draftTask.primaryWorkLocationType = "Floor";
				this._draftTask.parentBuildingId = building.id;
				this._draftTask.parentBuilding = building.value.match(/([^\\]*)$/)[1];
				this._draftTask.parentId = null;
				this._draftTask.parentFloor = null;
				this._draftTask.primaryWorkLocationId = floor.id;
				this._draftTask.primaryWorkLocation = floor.value;
				this._draftTask.primaryWorkLocationImage = null;
			}
		} else if (building && building.id) {
			if (building.id != this._draftTask.primaryWorkLocationPath.id) {
				this._draftTask.primaryWorkLocationPath = building;
				this._draftTask.primaryWorkLocationTypeENUS = "Building";
				this._draftTask.primaryWorkLocationType = "Building";
				this._draftTask.parentBuildingId = null;
				this._draftTask.parentBuilding = null;
				this._draftTask.parentId = null;
				this._draftTask.parentFloor = null;
				this._draftTask.primaryWorkLocationId = building.id;
				this._draftTask.primaryWorkLocation = building.value.match(/([^\\]*)$/)[1];
				this._draftTask.primaryWorkLocationImage = null;
			}
		} else {
			this._draftTask.primaryWorkLocationPath = { id: null, value: null };
			this._draftTask.primaryWorkLocationTypeENUS = null;
			this._draftTask.primaryWorkLocationType = null;
			this._draftTask.parentBuildingId = null;
			this._draftTask.parentBuilding = null;
			this._draftTask.parentId = null;
			this._draftTask.parentFloor = null;
			this._draftTask.primaryWorkLocationId = null;
			this._draftTask.primaryWorkLocation = null;
			this._draftTask.primaryWorkLocationImage = null;
		}
	},

    _findInList: function (id, list) {
		if (!list) {
			return { id: id, value: "" };
		}
		var found = list.find(element => element._id == id);
		return { id: id, value: found ? found.path : "" };
	},

    _handleServiceClassChanged: function (serviceClass) {
		if (this._draftTask && serviceClass) {
			this._draftTask.serviceClass = this._revertServiceRequestClassValueFormat(serviceClass);
		}
	},

    _handleRequestClassChanged: function (requestClass) {
		if (this._draftTask && requestClass) {
			this._draftTask.requestClass = this._revertServiceRequestClassValueFormat(requestClass);
		}
	},

    _revertServiceRequestClassValueFormat: function (classKvPair) {
		var result = classKvPair;
		var hyphenAndSpaceRegEx = /^[-\s]+/;
		if (classKvPair && classKvPair.value && hyphenAndSpaceRegEx.test(classKvPair.value)) {
			result.value = result.value.replace(hyphenAndSpaceRegEx, "");
		}
		return result;
	},

    _handleSelectedFloorChanged: function (newSelectedFloor, oldSelectedFloor) {
		if (!newSelectedFloor || !oldSelectedFloor || (newSelectedFloor.id != oldSelectedFloor.id)) {
			this.set('_selectedRoom', { id: "", value: "" });
		}
	},

    _openFloorPlan: function (e) {
		e.stopPropagation();
		TriroutesFloorplan.getInstance().openTaskFloorplan(this._selectedBuilding.id, this._selectedFloor.id, this._draftTask.taskID);
	},

    _computeDisableShowFloorplanBtn: function(floor,online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !this._isValidSelectInputOption(floor) || !online;
	},

    _computeDisableShowFloor: function (building) {
		return !this._isValidSelectInputOption(building);
	},

    _computeDisableShowRoom: function (floor) {
		return !this._isValidSelectInputOption(floor);
	},

    importMeta: getModuleUrl("triview-work-task/tripage-new-task.js")
});