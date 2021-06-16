/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-query/triplat-query.js";

Polymer({
	_template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triservice-work-task-base id="workTaskBaseService" time-log="{{timeLog}}" loading-tasks="{{loadingTasks}}" loading-time-log="{{loadingTimeLog}}" loading-time-logs="{{loadingTimeLogs}}" loading-timer-action="{{loadingTimerAction}}"></triservice-work-task-base>

			<triplat-ds id="timeCategoriesDS" name="timeCategories" filtered-data="{{filteredTimeCategories}}" loading="{{loadingTimeCategories}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
				<triplat-query>
					<triplat-query-filter name="name" operator="contains" value="{{searchTimeCategory}}" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-sort name="name"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>
		</template>
	`,

	is: "triservice-time-log",

	behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior,
		TriDateUtilities
	],

	properties: {
		online: {
			type: Boolean
		},

		loadingTasks: {
			type: Boolean,
			notify: true
		},

		loadingTimeLog: {
			type: Boolean,
			notify: true
		},

		loadingTimeLogAction: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingTimeLogs: {
			type: Boolean,
			notify: true
		},

		loadingTimerAction: {
			type: Boolean,
			notify: true
		},

		timeLog: {
			type: Object,
			notify: true
		},

		filteredTimeCategories: {
			type: Object,
			notify: true
		},

		loadingTimeCategories: {
			type: Boolean,
			value: false
		},

		searchTimeCategory: {
			type: String,
			notify: true,
			value: ""
		},

		_offlineContext: {
			type: Object,
			value: function () {
				var __dictionary__addTaskTimeLog = "Add the time log on {2} for Task ID {1}.";
				var __dictionary__updateTaskTimeLog = "Update the time log on {2} for Task ID {1}.";
				var __dictionary__deleteTaskTimeLog = "Delete the time log on {2} for Task ID {1}.";

				var _messages = {};
				_messages["ADD_TASK_TIME_LOG"] = __dictionary__addTaskTimeLog;
				_messages["UPDATE_TASK_TIME_LOG"] = __dictionary__updateTaskTimeLog;
				_messages["DELETE_TIME_LOG"] = __dictionary__deleteTaskTimeLog;

				return _messages;
			}
		}
	},

	get baseService() {
		return this.$$("#workTaskBaseService");
	},

	get currentUser() {
		return this.baseService.currentUser;
	},

	get timeLogListDS() {
		return this.baseService.timeLogListDS;
	},

	get timeLogListDSContext() {
		return this.baseService.timeLogListDSContext;
	},

	get timeLogInstanceDS() {
		return this.baseService.timeLogInstanceDS;
	},

	get timeLogInstanceDSContext() {
		return this.baseService.timeLogInstanceDSContext;
	},

	refreshTaskTimeLog: function (taskId, timeLogId, force) {
		if (this._isRootInstance) {
			return this.baseService.refreshTaskTimeLog(taskId, timeLogId, force);
		} else {
			return this._rootInstance.refreshTaskTimeLog(taskId, timeLogId, force);
		}
	},

	addTaskTimeLog: function(taskId, timeLog) {
		if (this._isRootInstance) {
			this.loadingTimeLogAction = true;
			if (!this.online) {
				timeLog.hours = this.baseService.computeDuration(timeLog.plannedStart, timeLog.plannedEnd);
				timeLog.profileId = this.currentUser._id;
				timeLog.personName = this.currentUser.fullName;
			}
			timeLog.date = timeLog.plannedStart;
			var formattedDate = this.formatDateWithTimeZone(timeLog.date, this.currentUser._TimeZoneId, this.currentUser._DateFormat, this.currentUser._Locale);
			this.timeLogListDSContext.contextId = taskId;
			if (timeLog.timeCategorySystemRecordID && timeLog.timeCategorySystemRecordID != "") {
				var parameter = { timeCategory: timeLog.timeCategorySystemRecordID };
			}
			return this.timeLogListDS.createRecord(
					timeLog, TriPlatDs.RefreshType.SERVER, "defaultActions", "create", parameter,
					this._buildOfflineContextMessage("ADD_TASK_TIME_LOG", this.baseService.getTaskID(taskId), formattedDate))
				.then(this.baseService.applyTimeLogChangesToTask.bind(this.baseService, taskId, timeLog))
				.then(this.baseService.refreshTask.bind(this.baseService, taskId, true))
				.then(
					function() {
						this.loadingTimeLogAction = false;
						var __dictionary__addTaskTimeLogSuccess = "Time log added";
						this._fireToastAlert("success", __dictionary__addTaskTimeLogSuccess);
					}.bind(this)
				)
				.catch(function(error) {
					this.loadingTimeLogAction = false;
					return Promise.reject(error);
				}.bind(this));
		} else {
			return this._rootInstance.addTaskTimeLog(taskId, timeLog);
		}
	},

	updateTaskTimeLog: function(taskId, timeLog) {
		if (this._isRootInstance) {
			this.loadingTimeLogAction = true;
			if (!this.online) {
				timeLog.hours = this.baseService.computeDuration(timeLog.plannedStart, timeLog.plannedEnd);
			}
			timeLog.date = timeLog.plannedStart != null ? timeLog.plannedStart : timeLog.date;
			this.timeLogInstanceDSContext.contextId = taskId;
			this.baseService.timeLog = timeLog;
			var formattedDate = this.formatDateWithTimeZone(timeLog.date, this.currentUser._TimeZoneId, this.currentUser._DateFormat, this.currentUser._Locale);
			if (timeLog.timeCategorySystemRecordID && timeLog.timeCategorySystemRecordID != "") {
				var parameter = { timeCategory: timeLog.timeCategorySystemRecordID };
			}
			return this.timeLogInstanceDS.updateRecord(
					timeLog._id, TriPlatDs.RefreshType.SERVER, "defaultActions", "edit", parameter,
					this._buildOfflineContextMessage("UPDATE_TASK_TIME_LOG", this.baseService.getTaskID(taskId), formattedDate))
				.then(this.baseService.applyTimeLogChangesToTask.bind(this.baseService, taskId, timeLog))
				.then(this.baseService.refreshTask.bind(this.baseService, taskId, true))
				.then(
					function() {
						this.loadingTimeLogAction = false;
						var __dictionary__updateTaskTimeLogSuccess = "Time log updated";
						this._fireToastAlert("success", __dictionary__updateTaskTimeLogSuccess);
					}.bind(this)
				)
				.catch(function(error) {
					this.loadingTimeLogAction = false;
					return Promise.reject(error);
				}.bind(this));
		} else {
			return this._rootInstance.updateTaskTimeLog(taskId, timeLog);
		}
	},

	removeTaskTimeLog: function(taskId, timeEntryId, timeEntryPlannedStart) {
		if (this._isRootInstance) {
			if (timeEntryId) {
				var formattedDate = this.formatDateWithTimeZone(timeEntryPlannedStart, this.currentUser._TimeZoneId, this.currentUser._DateFormat, this.currentUser._Locale);
				return this.timeLogListDS.deleteRecord(
					timeEntryId, TriPlatDs.RefreshType.SERVER, null, null, null,
					this._buildOfflineContextMessage("DELETE_TIME_LOG", this.baseService.getTaskID(taskId), formattedDate))
					.then(
						function() {
							var __dictionary__removeTimeLogSuccess = "Time log removed";
							this._fireToastAlert("success", __dictionary__removeTimeLogSuccess);
						}.bind(this)
					);
			}
		} else {
			return this._rootInstance.removeTaskTimeLog(taskId, timeEntryId, timeEntryPlannedStart);
		}
	}
});