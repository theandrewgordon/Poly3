/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import { TriplatQuery } from "../triplat-query/triplat-query.js";
import "../triplat-offline-manager/triplat-ds-offline.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triservice-work-task-base id="workTaskBaseService" small-layout="{{smallLayout}}"></triservice-work-task-base>

			<triplat-ds id="requestInstanceDS" name="requests" data="{{request}}" loading="{{loadingRequest}}" manual="">
				<triplat-ds-context id="requestInstanceDSContext" name="myTasks"></triplat-ds-context>
				<triplat-ds-instance id="requestInstanceDSInstance"></triplat-ds-instance>
			</triplat-ds>

			<triplat-ds id="requestsListDS" name="requests" data="{{requests}}" query-total-size="{{requestsCount}}" loading="{{loadingRequests}}" force-server-filtering="" manual="">
				<triplat-ds-offline mode="CONTEXT" cache-thumbnails="[[_toArray('requestedByPicture','requestedForPicture')]]"></triplat-ds-offline>
				<triplat-ds-context id="requestsListDSContext" name="myTasks"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="prioritiesListDS" name="taskPriorities" data="{{priorities}}" loading="{{_loadingPriorities}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>

			<triplat-ds id="materialsListDS" name="materials" data="{{materials}}" query-total-size="{{materialsCount}}" loading="{{loadingMaterials}}" manual="">
				<triplat-ds-offline mode="CONTEXT"></triplat-ds-offline>
				<triplat-ds-context id="materialsListDSContext" name="myTasks"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="materialInstanceDS" name="materials" data="{{material}}" loading="{{loadingMaterial}}" manual="">
				<triplat-ds-offline mode="UPDATE"></triplat-ds-offline>
				<triplat-ds-context id="materialInstanceDSContext" name="myTasks"></triplat-ds-context>
				<triplat-ds-instance id="materialInstanceDSInstance"></triplat-ds-instance>
			</triplat-ds>

			<triplat-ds id="reissueReasonsListDS" name="taskReissueReasons" data="{{_reissueReasons}}" loading="{{_loadingReissueReasons}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>

			<triplat-query data="[[_reissueReasons]]" filtered-data-out="{{filteredReissueReasons}}">
				<triplat-query-filter name="value" operator="contains" value="[[reissueReasonsSearchValue]]" ignore-if-blank=""></triplat-query-filter>
			</triplat-query>

			<triplat-ds id="commentsDS" name="comments" filtered-data="{{comments}}" query-total-size="{{commentsCount}}" loading="{{loadingComments}}" force-server-filtering="" manual="">
				<triplat-ds-offline mode="CONTEXT" cache-image-fields="[[_computeImageFieldsToCache(_isIOS, 'photo')]]" cache-thumbnails="[[_toArray('photo', 'submitterImage')]]"></triplat-ds-offline>
				<triplat-ds-context id="commentsDSContext" name="myTasks"></triplat-ds-context>
				<triplat-query delay="0">
					<triplat-query-sort name="createdDateTime" desc="" type="DATE_TIME"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="spaceLabelStylesDS" name="spaceLabelStyles" data="{{spaceLabelStyles}}" force-server-filtering="" loading="{{_loadingGraphicLabelStyles}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
				<triplat-query>
					<triplat-query-filter name="id" operator="equals" value="triSpaceClass002"></triplat-query-filter>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="currenciesDS" name="currencies" data="{{currencies}}" loading="{{_loadingCurrencies}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>

			<triplat-ds id="quantitiesDS" name="quantities" filtered-data="{{quantities}}" loading="{{_loadingQuantities}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
				<triplat-query delay="0">
					<triplat-query-sort name="_UOM_Display_Value"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="applicationSettings" name="applicationSettings" data="{{applicationSettings}}" loading="{{_loadingApplicationSettings}}">
			</triplat-ds>

		</template>
	`,

    is: "triservice-work-task",

    behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior
	],

    properties: {
		smallLayout: {
			type: Boolean,
			notify: true
		},

		online: {
			type: Boolean
		},

		applicationSettings: {
			type: Object,
			notify: true
		},

		request: {
			type: Object,
			notify: true
		},

		requests: {
			type: Array,
			notify: true
		},

		requestsCount: {
			type: Number,
			notify: true
		},

		comments: {
			type: Object,
			notify: true
		},

		commentsCount: {
			type: Number,
			notify: true
		},

		material: {
			type: Object,
			notify: true
		},

		materials: {
			type: Array,
			notify: true
		},

		materialsCount: {
			type: Number,
			notify: true
		},

		priorities: {
			type: Array,
			notify: true
		},

		_reissueReasons: {
			type: Array,
			notify: true
		},

		currencies: {
			type: Array,
			notify: true
		},

		quantities: {
			type: Array,
			notify: true
		},

		filteredReissueReasons: {
			type: Array,
			notify: true
		},

		reissueReasonsSearchValue: {
			type: String,
			notify: true,
			value: ""
		},

		spaceLabelStyles: {
			type: String,
			notify: true
		},

		loading: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingComments: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingMaterial: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingMaterialRemoveAction: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingMaterials: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingRequest: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingRequests: {
			type: Boolean,
			value: false,
			notify: true
		},

		_loadingPriorities: {
			type: Boolean,
			value: false
		},

		_loadingReissueReasons: {
			type: Boolean,
			value: false
		},

		_loadingGraphicLabelStyles: {
			type: Boolean,
			value: false
		},

		_loadingCurrencies: {
			type: Boolean,
			value: false
		},

		_loadingQuantities: {
			type: Boolean,
			value: false
		},

		_loadingApplicationSettings: {
			type: Boolean,
			value: false
		},

		 _isIOS: {
			type: Boolean,
			value: function() {
				var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
				return iOS;
			}
		},

		_offlineContext: {
			type: Object,
			value: function () {
				var __dictionary__createTaskComment = "Add the comment for Task ID {1}.";
				var __dictionary__updateTaskPriority = "Update the priority for Task ID {1}.";
				var __dictionary__updateTaskResolution = "Update the resolution for Task ID {1}.";
				var __dictionary__updateTaskMaterial = "Update the material for Task ID {1}.";
				var __dictionary__addTaskMaterial = "Add the material for Task ID {1}.";
				var __dictionary__deleteTaskMaterial = "Delete the material from Task ID {1}.";

				var _messages = {};
				_messages["CREATE_TASK_COMMENT"] = __dictionary__createTaskComment;
				_messages["UPDATE_TASK_PRIORITY"] = __dictionary__updateTaskPriority;
				_messages["UPDATE_TASK_RESOLUTION"] = __dictionary__updateTaskResolution;
				_messages["UPDATE_TASK_MATERIAL"] = __dictionary__updateTaskMaterial;
				_messages["ADD_TASK_MATERIAL"] = __dictionary__addTaskMaterial;
				_messages["DELETE_TASK_MATERIAL"] = __dictionary__deleteTaskMaterial;
				
				return _messages;
			}
		}
	},

    observers: [
		"_computeLoading(_loadingPriorities, _loadingReissueReasons, _loadingGraphicLabelStyles, _loadingCurrencies, _loadingQuantities, _loadingApplicationSettings)"
	],

    get baseService() {
		return this.$$("#workTaskBaseService");
	},

    get myTaskDS() {
		return this.baseService.myTaskDS;
	},

    _computeLoading: function(loadingPriorities, loadingReissueReasons, loadingGraphicLabelStyles, loadingCurrencies, loadingQuantities, loadingApplicationSettings) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.loading = loadingPriorities || loadingReissueReasons || loadingGraphicLabelStyles || loadingCurrencies || loadingQuantities || loadingApplicationSettings;
	},

    refreshRequest: function (taskId, requestId, force) {
		if (this._isRootInstance) {
			var requestInstanceDSContext = this.$$("#requestInstanceDSContext");
			var requestInstanceDSInstance = this.$$("#requestInstanceDSInstance");
			
			if (force || this.request == null || requestInstanceDSContext.contextId != taskId || requestInstanceDSInstance.instanceId != requestId) {
				requestInstanceDSContext.contextId = taskId;
				requestInstanceDSInstance.instanceId = requestId;
				return this.$$("#requestInstanceDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.request);
			}
		} else {
			return this._rootInstance.refreshRequest(taskId, requestId, force);
		}
	},

    refreshRequests: function (taskId, force) {
		if (this._isRootInstance) {
			var requestsListDSContext = this.$$("#requestsListDSContext");
			if (force || this.requests == null || requestsListDSContext.contextId != taskId || this.$$("#requestsListDS").countOnly) {
				requestsListDSContext.contextId = taskId;
				this.$$("#requestsListDS").countOnly = false;
				return this.$$("#requestsListDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.requests);
			}
		} else {
			return this._rootInstance.refreshRequests(taskId, force);
		}
	},

    countRequests: function (taskId, force) {
		if (this._isRootInstance) {
			var requestsListDSContext = this.$$("#requestsListDSContext");
			if (force || requestsListDSContext.contextId != taskId) {
				requestsListDSContext.contextId = taskId;
				this.$$("#requestsListDS").countOnly = true;
				return this.$$("#requestsListDS").refresh().then(this._returnCountFromResponse.bind(this));
			} else {
				return Promise.resolve(this.requestsCount);
			}
		} else {
			return this._rootInstance.countRequests(taskId, force);
		}
	},

    refreshTaskComments: function (taskId, force) {
		if (this._isRootInstance) {
			var commentsDSContext = this.$$("#commentsDSContext");
			if (force || this.comments == null || commentsDSContext.contextId != taskId || this.$$("#commentsDS").countOnly) {
				commentsDSContext.contextId = taskId;
				this.$$("#commentsDS").countOnly = false;
				return this.$$("#commentsDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.comments);
			}
		} else {
			return this._rootInstance.refreshTaskComments(taskId, force);
		}
	},

    countTaskComments: function (taskId, force) {
		if (this._isRootInstance) {
			var commentsDSContext = this.$$("#commentsDSContext");
			if (force || commentsDSContext.contextId != taskId) {
				commentsDSContext.contextId = taskId;
				this.$$("#commentsDS").countOnly = true;
				return this.$$("#commentsDS").refresh().then(this._returnCountFromResponse.bind(this));
			} else {
				return Promise.resolve(this.commentsCount);
			}
		} else {
			return this._rootInstance.countTaskComments(taskId, force);
		}
	},

    createTaskComment: function(taskId, comment){
		if(this._isRootInstance){
			return this.$$('#commentsDS').createRecord(comment, TriPlatDs.RefreshType.SERVER,
					"defaultActions","create", null,
					this._buildOfflineContextMessage("CREATE_TASK_COMMENT", this.baseService.getTaskID(taskId)))
				.then(
					function() {
						var __dictionary__createTaskCommentSuccess = "Comment created";
						this._fireToastAlert("success", __dictionary__createTaskCommentSuccess);
					}.bind(this)
				);
		} else {
			return this._rootInstance.createTaskComment(taskId, comment);
		}
	},

    refreshMaterial: function (taskId, materialId, force) {
		if (this._isRootInstance) {
			var materialInstanceDSContext = this.$$("#materialInstanceDSContext");
			var materialInstanceDSInstance = this.$$("#materialInstanceDSInstance");
			
			if (force || this.material == null || materialInstanceDSContext.contextId != taskId || materialInstanceDSInstance.instanceId != materialId) {
				materialInstanceDSContext.contextId = taskId;
				materialInstanceDSInstance.instanceId = materialId;
				return this.$$("#materialInstanceDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.material);
			}
		} else {
			return this._rootInstance.refreshMaterial(taskId, materialId, force);
		}
	},

    refreshMaterials: function(taskId, force) {
		if (this._isRootInstance) {
			var materialsListDSContext = this.$$("#materialsListDSContext");
			if (force || this.materials == null || materialsListDSContext.contextId != taskId || this.$$("#materialsListDS").countOnly) {
				materialsListDSContext.contextId = taskId;
				this.$$("#materialsListDS").countOnly = false;
				return this.$$("#materialsListDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.materials);
			}
		} else {
			return this._rootInstance.refreshMaterials(taskId, force);
		}
	},

    countMaterials: function(taskId, force) {
		if (this._isRootInstance) {
			var materialsListDSContext = this.$$("#materialsListDSContext");
			if (force || materialsListDSContext.contextId != taskId) {
				materialsListDSContext.contextId = taskId;
				this.$$("#materialsListDS").countOnly = true;
				return this.$$("#materialsListDS").refresh().then(this._returnCountFromResponse.bind(this));
			} else {
				return Promise.resolve(this.materialsCount);
			}
		} else {
			return this._rootInstance.countMaterials(taskId, force);
		}
	},

    updateMaterial: function(taskId, material) {
		if(this._isRootInstance) {
			if (!this.online) {
				var uomMatch = this._getMatchingUOM(material.quantityUOM);
				material.quantityUOMDisplay = uomMatch ? uomMatch._UOM_Display_Value : null;
			}
			material.mobileUpdate = true;
			material.quantityMobile = material.quantity;
			material.rateMobile = material.rate.value;
			material.actualCostMobile = material.actualCost.value;
			this.material = material;
			return this.$$("#materialInstanceDS").updateRecord(
					material._id, TriPlatDs.RefreshType.SERVER, "actions", "save", null,
					this._buildOfflineContextMessage("UPDATE_TASK_MATERIAL", this.baseService.getTaskID(taskId)))
				.then(this.refreshMaterials.bind(this, taskId, true))
				.then(
					function() {
						var __dictionary__updateMaterialSuccess = "Material updated";
						this._fireToastAlert("success", __dictionary__updateMaterialSuccess);
					}.bind(this)
				);
		} else {
			return this._rootInstance.updateMaterial(taskId, material);
		}
	},

    addMaterial: function(taskId, material) {
		if(this._isRootInstance) {
			if (!this.online) {
				var uomMatch = this._getMatchingUOM(material.quantityUOM);
				material.quantityUOMDisplay = uomMatch ? uomMatch._UOM_Display_Value : null;
			}
			this.material = material;
			material.mobileUpdate = true;
			material.quantityMobile = material.quantity;
			material.rateMobile = material.rate.value;
			material.actualCostMobile = material.actualCost.value;
			return this.$$("#materialsListDS").createRecord(
					material, TriPlatDs.RefreshType.SERVER, "actions", "create", null,
					this._buildOfflineContextMessage("ADD_TASK_MATERIAL", this.baseService.getTaskID(taskId)))
				.then(
					function() {
						var __dictionary__addMaterialSuccess = "Material added to the task";
						this._fireToastAlert("success", __dictionary__addMaterialSuccess);
					}.bind(this)
				);
		} else {
			return this._rootInstance.addMaterial(taskId, material);
		}
	},

    updateTaskPriority: function(taskId, priority) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doUpdateTaskPriority.bind(this, priority));
		} else {
			return this._rootInstance.updateTaskPriority(taskId, priority);
		}
	},

    _doUpdateTaskPriority: function(priority, task) {
		task.taskPriorityENUS = priority.name;
		task.taskPriority = priority.value;
		task.priorityRanking = priority.ranking;
		return this.myTaskDS.updateRecord(
				task._id, TriPlatDs.RefreshType.SERVER, null, null, null,
				this._buildOfflineContextMessage("UPDATE_TASK_PRIORITY", this.baseService.getTaskID(task._id)))
			.then(
				function() {
					var __dictionary__updateTaskPrioritySuccess = "Task priority updated";
					this._fireToastAlert("success", __dictionary__updateTaskPrioritySuccess);
				}.bind(this)
			);
	},

    removeMaterial: function(taskId, materialId) {
		if (this._isRootInstance) {
			this.loadingMaterialRemoveAction = true;
			if (materialId) {
				return this.$$("#materialsListDS").deleteRecord(
					materialId, TriPlatDs.RefreshType.SERVER, null, null, null,
					this._buildOfflineContextMessage("DELETE_TASK_MATERIAL", this.baseService.getTaskID(taskId)))
					.then(
						function() {
							this.loadingMaterialRemoveAction = false;
							var __dictionary__removeMaterialSuccess = "Material removed from the task";
							this._fireToastAlert("success", __dictionary__removeMaterialSuccess);
						}.bind(this)
					)
					.catch(function(error) {
						this.loadingMaterialRemoveAction = false;
						return Promise.reject(error);
					}.bind(this));
			}
		} else {
			return this._rootInstance.removeMaterial(taskId, materialId);
		}
	},

    updateTaskResolution: function(taskId) {
		if (this._isRootInstance) {
			return this.baseService.refreshTask(taskId)
				.then(this._doUpdateTaskResolution.bind(this));
		} else {
			return this._rootInstance.updateTaskResolution(taskId);
		}
	},

    _doUpdateTaskResolution: function(task) {
		return this.myTaskDS.updateRecord(
				task._id, TriPlatDs.RefreshType.SERVER, null, null, null,
				this._buildOfflineContextMessage("UPDATE_TASK_RESOLUTION", task._id))
			.then(
				function() {
					var __dictionary__updateTaskResolution = "Task resolution updated";
					this._fireToastAlert("success", __dictionary__updateTaskResolution);
				}.bind(this)
			);
	},

    _getMatchingUOM: function(uom) {
		return this.quantities.find(function(q) {
			return q._UOM_Value == uom;
		});
	},

    _computeImageFieldsToCache: function() {
		var imageFieldsToCache = new Array(arguments.length - 1);
		var isIOS = arguments[0];
		if (isIOS) {
			return null;
		}
		for (var i = 1; i < arguments.length; ++i) {
			imageFieldsToCache.push(arguments[i]);
		}
		return imageFieldsToCache;

	}
});