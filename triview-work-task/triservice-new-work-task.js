/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import { TriplatQuery } from "../triplat-query/triplat-query.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "./triservice-location.js";
import "./triservice-app-location-context.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triplat-ds id="newTaskDs" name="myTasks" loading="{{_loadingNewTask}}" manual="">
				<triplat-ds-offline mode="UPDATE"></triplat-ds-offline>
			</triplat-ds>

			<triservice-work-task-base id="workTaskBaseService" my-task="{{draftTask}}" loading-tasks="{{_loadingDraftTask}}"></triservice-work-task-base>
			<triservice-location id="locationService"></triservice-location>
			<triservice-app-location-context id="appLocationContextService"></triservice-app-location-context>

			<triplat-ds id="buildingLookupDs" name="buildingLookup" manual="">
				<triplat-ds-offline id="buildingLookupDsOffline" mode="UPDATE" cache-thumbnails="[[_toArray('picture')]]"></triplat-ds-offline>
			</triplat-ds>

			<triplat-ds id="floorLookupDs" name="floorLookup" filtered-data="{{floorsForBuilding}}" loading="{{_loadingFloorsForBuilding}}" force-server-filtering="">
				<triplat-ds-offline mode="CONTEXT"></triplat-ds-offline>
				<triplat-ds-context name="buildingLookup" context-id="[[selectedBuildingId]]"></triplat-ds-context>
				<triplat-query delay="0">
					<triplat-query-sort name="floor"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="requestClassesDs" name="requestClasses" loading="{{_loadingRequestClasses}}" manual="">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>

			<triplat-ds id="serviceClassesDs" name="serviceClasses" loading="{{_loadingServiceClasses}}" manual="">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>

			<triplat-ds id="defaultTaskTypeDS" name="defaultTaskType" data="{{defaultTaskType}}" loading="{{_loadingDefaultTaskType}}" manual="">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>
		</template>
	`,

    is: "triservice-new-work-task",

    behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior,
		TriDateUtilities
	],

    properties: {
		online: {
			type: Boolean
		},

		currentUser: {
			type: Object
		},

		loading: {
			type: Boolean,
			notify: true,
			value: false
		},

		draftTask: {
			type: Object,
			notify: true
		},

		selectedBuildingId: {
			type: String,
			notify: true,
			value: ""
		},

		selectedFloorId:  {
			type: String,
			notify: true,
			value: ""
		},

		floorsForBuilding: {
			type: String,
			notify: true
		},

		roomsForFloor: {
			type: String,
			notify: true
		},

		requestClasses: {
			type: String,
			notify: true
		},

		serviceClasses: {
			type: String,
			notify: true
		},

		defaultTaskType: {
			type: String,
			notify: true
		},

		_loadingNewTask: {
			type: Boolean,
			value: false
		},

		_loadingDraftTask: {
			type: Boolean,
			value: false
		},

		_loadingFloorsForBuilding: {
			type: Boolean,
			value: false
		},

		_loadingRequestClasses: {
			type: Boolean,
			value: false
		},

		_loadingServiceClasses: {
			type: Boolean,
			value: false
		},

		_loadingDefaultTaskType: {
			type: Boolean,
			value: false
		},

		_offlineContext: {
			type: Object,
			value: function () {
				var __dictionary__createDraftTask = "Pre-create the draft work task.";
				var __dictionary__saveDraftTask = "Save the draft Task ID {1}."; 

				var _messages = {};
				_messages["CREATE_DRAFT_TASK"] = __dictionary__createDraftTask;
				_messages["SAVE_DRAFT_TASK"] = __dictionary__saveDraftTask;

				return _messages;
			}
		}
	},

    observers: [
		"_computeLoading(_loadingNewTask, _loadingDraftTask, _loadingFloorsForBuilding, _loadingRequestClasses, _loadingServiceClasses, _loadingDefaultTaskType)",
		"_loadRoomsForFloor(floorsForBuilding, selectedFloorId)"
	],

    get baseService() {
		return this.$$("#workTaskBaseService");
	},

    get myTaskDS() {
		return this.baseService.myTaskDS;
	},

    get appLocationContextService() {
		return this.$$("#appLocationContextService");
	},

    _computeLoading: function(loadingNewTask, loadingDraftTask, loadingFloorsForBuilding,
		loadingRequestClasses, loadingServiceClasses, loadingDefaultTaskType) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.set('loading', loadingNewTask || loadingDraftTask || loadingFloorsForBuilding 
			|| loadingRequestClasses || loadingServiceClasses || loadingDefaultTaskType);
	},

    refreshTask: function(taskId) {
		if (this._isRootInstance) {
			return this._doRefreshTask(taskId);
		} else {
			return this._rootInstance.refreshTask(taskId);
		}
	},

    _doRefreshTask: function(taskId) {
		return this.baseService.refreshTask(taskId, true)
			.then(result => {
				this.draftTask = result;
			});
	},

    precreateDraftTask: function() {
		if (this._isRootInstance) {
			return this._getEmptyTask().then(this._doPrecreateDraftTask.bind(this));
		} else {
			return this._rootInstance.precreateDraftTask();
		}
	},

    _doPrecreateDraftTask: function(task) {
		var newTaskDs = this.$$("#newTaskDs");
		if (!this.online) {
			var currentDateTime = this.getCurrentDatetime();
			task.plannedStart = currentDateTime;
			task.assignmentStatusENUS = "Assigned";
			task.currency = this.currentUser._Currency;
			task.description = null;
			task.modifiedDateTime = currentDateTime;
			task.createdById = "" + this.currentUser._id;
			task.taskTypeENUS = "Corrective";
			task.createdDate = currentDateTime;
			task.primaryWorkLocationPath = {id: null, value: null};
			task.primaryWorkLocationTypeENUS = null;
			task.primaryWorkLocationType = null;
			task.parentBuildingId = null;
			task.parentBuilding = null;
			task.parentId = null;
			task.parentFloor = null;
			task.primaryWorkLocationId = null;
			task.primaryWorkLocation = null;
			task.primaryWorkLocationImage = null;
			task.requestClass = {id: null, value: null};
			task.serviceClass = {id: null, value: null};
			task.taskID = "";
			task.createdBy = {
				id: this.currentUser._id,
				value: this.currentUser.lastName + ", " + this.currentUser.firstName + " - " + this.currentUser.id
			};
			task.statusENUS = {
				id: -1,
				value: "Draft"
			};
			var __dictionary__draft = "Draft";
			task.status = {
				id: -1,
				value: __dictionary__draft
			};
			task.taskPriority = "";
			task.taskPriorityENUS = "";
		}
		return newTaskDs.createRecord(
					task, TriPlatDs.RefreshType.SERVER, "actions", "precreateDraft", null,
					this._buildOfflineContextMessage("CREATE_DRAFT_TASK"))
			.then(function(newId) {
				return this.refreshTask(newId);
			}.bind(this)
		);
	},

    _getEmptyTask: function() {
		return this.refreshDefaultTaskType().then(function(taskType) {
			var defaultTaskType = { id: taskType._id, value: taskType.name };
			return { taskType: defaultTaskType };
		}.bind(this));
	},

    updateTask: function(task) {
		if (this._isRootInstance) {
			return this._doUpdateTask(task);
		} else {
			return this._rootInstance.updateTask(task);
		}
	},

    _doUpdateTask: function(task) {
		return this.myTaskDS.updateRecord(
				task._id, TriPlatDs.RefreshType.SERVER, null, null, null,
				this._buildOfflineContextMessage("SAVE_DRAFT_TASK", this.baseService.getTaskID(task._id)))
			.then(this.baseService.refreshInProgressAndCompletedTasks.bind(this.baseService))
			.then(function() {
				var __dictionary__updateTaskSuccess = "Work task draft saved";
				this._fireToastAlert("success", __dictionary__updateTaskSuccess);
			}.bind(this)
		);
	},

    activateTask: function(task) {
		if (this._isRootInstance) {
			return this._doActivateTask(task);
		} else {
			return this._rootInstance.activateTask(task);
		}
	},

    _doActivateTask: function(task) {
		if (!this.online) {
			var __dictionary__reviewInProgress = "Review In Progress";
			task.status.value = __dictionary__reviewInProgress;
			task.statusENUS.value = "Review In Progress";
		}
		return this.myTaskDS.updateRecord(task._id, TriPlatDs.RefreshType.SERVER, "actions", "activate")
			.then(function() {
				var __dictionary__activateTaskSuccess = "Work task submitted";
				this._fireToastAlert("success", __dictionary__activateTaskSuccess);
			}.bind(this)
		);
	},

    deleteTask: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.deleteTask(taskId)
				.then(result => {
					this.draftTask = result;
				});
		} else {
			return this._rootInstance.deleteTask(taskId);
		}
	},

    refreshDefaultTaskType: function() {
		if (this._isRootInstance) {
			if (this.defaultTaskType && this.defaultTaskType._id) {
				return Promise.resolve(this.defaultTaskType);
			}
			return this.$$("#defaultTaskTypeDS").refresh().then(this._returnDataFromResponse.bind(this));
		} else {
			return this._rootInstance.refreshDefaultTaskType();
		}
	},

    refreshRequestClasses: function() {
		if (this._isRootInstance) {
			if (this.requestClasses && this.requestClasses.length > 0) {
				return Promise.resolve(this.requestClasses);
			}
			return this.$$("#requestClassesDs").refresh()
				.then(this._returnDataFromResponse.bind(this))
				.then(this._addDisplayNamePropertyToClasses.bind(this))
				.then(this.set.bind(this, "requestClasses"));
		} else {
			return this._rootInstance.refreshRequestClasses();
		}
	},

    refreshServiceClasses: function() {
		if (this._isRootInstance) {
			if (this.serviceClasses && this.serviceClasses.length > 0) {
				return Promise.resolve(this.serviceClasses);
			}
			return this.$$("#serviceClassesDs").refresh()
				.then(this._returnDataFromResponse.bind(this))
				.then(this._addDisplayNamePropertyToClasses.bind(this))
				.then(this.set.bind(this, "serviceClasses"));
		} else {
			return this._rootInstance.refreshServiceClasses();
		}
	},

    _addDisplayNamePropertyToClasses: function(classes) {
		var resultClasses = classes;
		for (var sc = 0; sc < resultClasses.length; sc++) {
			var srClass = resultClasses[sc];
			var splitString = srClass.path.split("\\");
			var depth = splitString.length - 4;

			var result = "";
			for (var i = 0; i < depth; i++) {
				result+= "--";
				if (i == depth - 1) {
					result += " ";
				}
			}
			result += splitString[splitString.length - 1];
			resultClasses[sc].displayName = result;
		}
		return resultClasses;
	},

    cacheMyTasksBuildings: function() {
		if (this._isRootInstance) {
			return this.$$("#locationService").refreshMyTasksBuildings()
				.then(function(myTasksBuildings) {
					return this.$$("#buildingLookupDsOffline").cacheRecords(true, myTasksBuildings)
						.then(this.appLocationContextService.cacheBuildings.bind(this.appLocationContextService, myTasksBuildings));
				}.bind(this));
		} else {
			return this._rootInstance.cacheMyTasksBuildings();
		}
	},

    _loadRoomsForFloor: function() {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.debounce("_loadRoomsForFloor", function() {
			if (!this.selectedFloorId || !this.floorsForBuilding) {
				this.roomsForFloor = [];
			} else {
				var selectedFloor = this.floorsForBuilding.find(function(floor) {
					return floor._id == this.selectedFloorId;
				}.bind(this));
				this.roomsForFloor = selectedFloor ? selectedFloor.roomLookup.data : [];
			}
		}.bind(this));
	}
});