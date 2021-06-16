/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "./triservice-resource.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triservice-work-task-base id="workTaskBaseService"></triservice-work-task-base>
			<triservice-resource id="resourceService"></triservice-resource>
		</template>
	`,

    is: "triservice-work-task-actions",

    behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior
	],

    properties: {
		online: {
			type: Boolean
		},

		_offlineContext: {
			type: Object,
			value: function () {
				var __dictionary__completeTask = "Complete the Task ID {1}.";
				var __dictionary__reopenTask = "Reopen the Task ID {1}.";
				var __dictionary__closeTask = "Close the Task ID {1}.";
				var __dictionary__resumeTask = "Resume the Task ID {1}.";
				var __dictionary__holdPerRequester = "Put the Task ID {1} on hold per requester.";
				var __dictionary__holdForParts = "Put the Task ID {1} on hold for parts.";
				var __dictionary__acceptTask  = "Accept the unassigned Task ID {1}.";

				var _messages = {};
				_messages["COMPLETE_TASK"] = __dictionary__completeTask;
				_messages["REOPEN_TASK"] = __dictionary__reopenTask;
				_messages["CLOSE_TASK"] = __dictionary__closeTask;
				_messages["RESUME_TASK"] = __dictionary__resumeTask;
				_messages["HOLD_TASK_PER_REQUESTER"] = __dictionary__holdPerRequester;
				_messages["HOLD_TASK_FOR_PARTS"] = __dictionary__holdForParts;
				_messages["ACCEPT_TASK"] = __dictionary__acceptTask;

				return _messages;
			}
		}
	},

    get baseService() {
		return this.$$("#workTaskBaseService");
	},

    get resourceService() {
		return this.$$("#resourceService");
	},

    get myTaskDS() {
		return this.baseService.myTaskDS;
	},

    get unassignedTaskDS() {
		return this.baseService.unassignedTaskDS;
	},

    get myTaskDSOffline() {
		return this.baseService.myTaskDSOffline;
	},

    reopenTask: function(taskId, reason) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doReopenTask.bind(this, reason));
		} else {
			return this._rootInstance.reopenTask(taskId, reason);
		}
	},

    _doReopenTask: function(reason, task) {
		task.taskReIssueReason = reason;
		if (!this.online) {
			var __dictionary__active = "Active";
			task.status.value = __dictionary__active;
			task.statusENUS.value = "Active";
		}
		return this.myTaskDS.updateRecord(
				task, TriPlatDs.RefreshType.SERVER, "actions", "reopen", null, 
				this._buildOfflineContextMessage("REOPEN_TASK", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__reopenTaskStatusSuccess = "Task reopened";
					this._fireToastAlert("success", __dictionary__reopenTaskStatusSuccess);
				}.bind(this)
			);
	},

    completeTask: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doCompleteTask.bind(this));
		} else {
			return this._rootInstance.completeTask(taskId);
		}
	},

    _doCompleteTask: function(task) {
		if (!this.online) {
			var __dictionary__routingInProgress = "Routing In Progress";
			task.status.value = __dictionary__routingInProgress;
			task.statusENUS.value = "Routing In Progress";
		}
		return this.myTaskDS.updateRecord(
			task, TriPlatDs.RefreshType.SERVER, "actions", "complete", null,
			this._buildOfflineContextMessage("COMPLETE_TASK", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__completeTaskSuccess = "Task marked as completed";
					this._fireToastAlert("success", __dictionary__completeTaskSuccess);
				}.bind(this)
			);
	},

    closeTask: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doCloseTask.bind(this));
		} else {
			return this._rootInstance.closeTask(taskId);
		}
	},

    _doCloseTask: function(task) {
		if (!this.online) {
			var __dictionary__closed = "Closed";
			task.status.value = __dictionary__closed;
			task.statusENUS.value = "Closed";
		}
		return this.myTaskDS.updateRecord(
			task, TriPlatDs.RefreshType.SERVER, "actions", "close", null,
			this._buildOfflineContextMessage("CLOSE_TASK", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__closeTaskSuccess = "Task closed";
					this._fireToastAlert("success", __dictionary__closeTaskSuccess);
				}.bind(this)
			);
	},

    resumeTask: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doResumeTask.bind(this));
		} else {
			return this._rootInstance.resumeTask(taskId);
		}
	},

    _doResumeTask: function(task) {
		if (!this.online) {
			var __dictionary__active = "Active";
			task.status.value = __dictionary__active;
			task.statusENUS.value = "Active";
		}
		return this.myTaskDS.updateRecord(
			task, TriPlatDs.RefreshType.SERVER, "actions", "resume", null,
			this._buildOfflineContextMessage("RESUME_TASK", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__resumeTaskSuccess = "Task resumed";
					this._fireToastAlert("success", __dictionary__resumeTaskSuccess);
				}.bind(this)
			);
	},

    holdTaskPerRequester: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doHoldTaskPerRequester.bind(this));
		} else {
			return this._rootInstance.holdTaskPerRequester(taskId);
		}
	},

    _doHoldTaskPerRequester: function(task) {
		if (!this.online) {
			var __dictionary__holdPerRequester = "Hold per Requester";
			task.status.value = __dictionary__holdPerRequester;
			task.statusENUS.value = "Hold per Requester";
		}
		return this.myTaskDS.updateRecord(
			task, TriPlatDs.RefreshType.SERVER, "actions", "holdPerRequester", null,
			this._buildOfflineContextMessage("HOLD_TASK_PER_REQUESTER", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__holdPerRequesterSuccess = "Task put on hold per requester";
					this._fireToastAlert("success", __dictionary__holdPerRequesterSuccess);
				}.bind(this)
			);
	},

    holdTaskForParts: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doHoldTaskForParts.bind(this));
		} else {
			return this._rootInstance.holdTaskForParts(taskId);
		}
	},

    _doHoldTaskForParts: function(task) {
		if (!this.online) {
			var __dictionary__holdForParts = "Hold for Parts";
			task.status.value = __dictionary__holdForParts;
			task.statusENUS.value = "Hold for Parts";
		}
		return this.myTaskDS.updateRecord(
			task, TriPlatDs.RefreshType.SERVER, "actions", "holdForParts", null,
			this._buildOfflineContextMessage("HOLD_TASK_FOR_PARTS", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__holdForPartsSuccess = "Task put on hold for parts";
					this._fireToastAlert("success", __dictionary__holdForPartsSuccess);
				}.bind(this)
			);
	},

    assignTaskToCurrentUser: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshUnassignedTask(taskId)
				.then(this._doAssignTaskToCurrentUser.bind(this));
		} else {
			return this._rootInstance.assignTaskToCurrentUser(taskId);
		}
	},

    _doAssignTaskToCurrentUser: function(task) {
		if (!this.online) {
			task.assignmentStatusENUS = "Accepted";
		}
		return this.unassignedTaskDS.updateRecord(
			task, TriPlatDs.RefreshType.NONE, "actions", "assignToCurrentUser", null,
			this._buildOfflineContextMessage("ACCEPT_TASK", task.taskID))
			.then(this.resourceService.cacheResourceForCurrentUser.bind(this.resourceService, task._id))
			.then(this.resourceService.refreshResources.bind(this.resourceService, task._id, true))
			.then(this._cacheAssignedTask.bind(this, task))
			.then(
				function() {
					var __dictionary__acceptTaskSuccess = "Task accepted";
					this._fireToastAlert("success", __dictionary__acceptTaskSuccess);
				}.bind(this)
			);
	},

    _cacheAssignedTask: function(task) {
		if (this.online) {
			return Promise.resolve();
		}
		return this.myTaskDSOffline.cacheRecords(false, task);
	}
});