/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import { TriPlatGraphicUtilitiesBehavior } from "../triplat-graphic/triplat-graphic-utilities-behavior.js";
import "../triplat-offline-manager/triplat-ds-offline.js";
import "../triplat-query/triplat-query.js";
import { TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "./triservice-work-task.js";
import "./triservice-work-task-actions.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triservice-work-task-base id="workTaskBaseService"></triservice-work-task-base>
			<triservice-work-task-actions id="workTaskActionsServices"></triservice-work-task-actions>

			<triplat-ds id="assetsListDS" name="assets" filtered-data="{{_assets}}" query-total-size="{{assetsCount}}" force-server-filtering="" manual="">
				<triplat-ds-offline mode="CONTEXT" cache-thumbnails="[[_toArray('picture')]]"></triplat-ds-offline>
				<triplat-ds-context id="assetsListDSContext" name="myTasks"></triplat-ds-context>
				<triplat-query delay="0">
						<triplat-query-sort name="id"></triplat-query-sort>
						<triplat-query-sort name="name"></triplat-query-sort>
						<triplat-query-sort name="location" desc=""></triplat-query-sort>
				</triplat-query>
			</triplat-ds>
			
			<triplat-ds id="assetInstanceDS" name="assets" data="{{_asset}}" manual="">
				<triplat-ds-offline mode="UPDATE"></triplat-ds-offline>
				<triplat-ds-context id="assetInstanceDSContext" name="myTasks"></triplat-ds-context>
				<triplat-ds-instance id="assetInstanceDSInstance"></triplat-ds-instance>
			</triplat-ds>

			<triplat-ds id="documentsDS" name="documents" data="{{documents}}" loading="{{loadingDocuments}}" manual="">
				<triplat-ds-context id="documentsDSTaskContext" name="myTasks"></triplat-ds-context>
				<triplat-ds-context id="documentsDSAssetContext" name="assets"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="assetLookup" name="assetLookup" force-server-filtering loading="{{loadingAssetLookup}}" manual>
				<triplat-query delay="0">
					<triplat-query-filter
						id="barCodeQueryFilter"
						name="barcode"
						operator="equals"
						value="[[assetLookupSearch]]"
					></triplat-query-filter>
				</triplat-query>
			</triplat-ds>
		</template>
	`,

    is: "triservice-asset",

    behaviors: [
		TriPlatGraphicUtilitiesBehavior,
		TriPlatViewBehavior,
		TriTaskServiceBehavior
	],

    properties: {
		online: {
			type: Boolean
		},

		asset: {
			type: Object,
			notify: true
		},

		assets: {
			type: Array,
			notify: true
		},

		assetsCount: {
			type: Number,
			notify: true
		},

		documents: {
			type: Array,
			notify: true
		},

		loadingAsset: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingAssets: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingDocuments: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingAssetLookup: {
			type: Boolean,
			value: false,
			notify: true
		},

		loadingAssetRemoveAction: {
			type: Boolean,
			value: false,
			notify: true
		},

		_asset: {
			type: Object
		},

		_assets: {
			type: Array
		},

		assetLookupSearch: {
			type: String,
			notify: true
		},

		_offlineContext: {
			type: Object,
			value: function () {
				var __dictionary__deleteTaskAsset = "Delete the asset from Task ID {1}.";

				var _messages = {};
				_messages["DELETE_TASK_ASSET"] = __dictionary__deleteTaskAsset;
				
				return _messages;
			}
		}
	},

    _addHasGraphicToAsset: function() {
		var promise = Promise.resolve();

		if (this._asset && this._asset._id) {
			promise = this._checkIfAssetLocationHasGraphic(this._asset);
		}

		return promise.then(function() {
			this.set("asset", this._asset);
		}.bind(this));
	},

    _addHasGraphicToAssets: function() {
		var promises = [];

		if (this._assets && this._assets.length > 0) {
			for (var i = 0; i < this._assets.length; i++) {
				promises.push(this._checkIfAssetLocationHasGraphic(this._assets[i]));
			}
		}

		return Promise.all(promises).then(function() {
			this.set("assets", this._assets);
		}.bind(this));
	},

    _checkIfAssetLocationHasGraphic: function(asset) {
		if (!this.online) {
			asset.hasGraphic = false;
			asset.drawingId = null;
			return Promise.resolve();
		}
		var recordId = "";
		if (asset.parentFloorId && asset.parentFloorId != "") {
			recordId = asset.parentFloorId;
		} else {
			asset.hasGraphic = false;
			asset.drawingId = null;
			return Promise.resolve();
		}
		
		return this.getDrawingId(recordId).then(function(result) {
			asset.hasGraphic = (result) ? true : false;
			asset.drawingId = result;
		}.bind(this));
	},

    refreshTaskAssets: function (taskId, force) {
		if (this._isRootInstance) {
			var assetsListDSContext = this.$$("#assetsListDSContext");
			if (force || this.assets == null || assetsListDSContext.contextId != taskId || this.$$("#assetsListDS").countOnly) {
				this.loadingAssets = true;

				assetsListDSContext.contextId = taskId;
				this.$$("#assetsListDS").countOnly = false;
				return this.$$("#assetsListDS").refresh()
					.then(this._addHasGraphicToAssets.bind(this))
					.then(function() {
						this.loadingAssets = false;

						return this.assets;
					}.bind(this))
					.catch(function(error) {
						this.loadingAssets = false;
						return Promise.reject(error);
					}.bind(this));
			} else {
				return Promise.resolve(this.assets);
			}
		} else {
			return this._rootInstance.refreshTaskAssets(taskId, force);
		}
	},

    countTaskAssets: function (taskId, force) {
		if (this._isRootInstance) {
			var assetsListDSContext = this.$$("#assetsListDSContext");
			if (force || assetsListDSContext.contextId != taskId) {
				this.loadingAssets = true;

				assetsListDSContext.contextId = taskId;
				this.$$("#assetsListDS").countOnly = true;
				return this.$$("#assetsListDS").refresh()
					.then(function(response) {
						this.loadingAssets = false;

						this._returnCountFromResponse(response);
					}.bind(this))
					.catch(function(error) {
						this.loadingAssets = false;
						return Promise.reject(error);
					}.bind(this));
			} else {
				return Promise.resolve(this.assetsCount);
			}
		} else {
			return this._rootInstance.countTaskAssets(taskId, force);
		}
	},

	addAssetToTask: function (taskId, asset) {
		if (this._isRootInstance) {
			var assetsListDSContext = this.$$("#assetsListDSContext");
			if (taskId && asset && asset._id) {
				this.loadingAssets = true;
				assetsListDSContext.contextId = taskId;
				return this.$$("#assetsListDS").addRecord(asset, TriPlatDs.RefreshType.NONE, "actions", "saveWorkTask", { task: taskId })
					.then(response => {
						this.loadingAssets = false;
						this.refreshTaskAssets(taskId, true);
					});
			}
		} else {
			return this._rootInstance.addAssetToTask(taskId, asset);
		}
	},

	removeAsset: function(taskId, assetId) {
		if (this._isRootInstance) {
			this.loadingAssetRemoveAction = true;
			if (assetId) {
				return this.$$("#assetsListDS").removeRecord(
					{ _id: assetId }, TriPlatDs.RefreshType.NONE, null, null, null,
					this._buildOfflineContextMessage("DELETE_TASK_ASSET", this.$$("#workTaskBaseService").getTaskID(taskId)))
					.then(
						function() {
							this.loadingAssetRemoveAction = false;
							var __dictionary__removeAssetSuccess = "Asset removed from the task";
							this._fireToastAlert("success", __dictionary__removeAssetSuccess);
							this.refreshTaskAssets(taskId, true);
						}.bind(this)
					)
					.catch(function(error) {
						this.loadingAssetRemoveAction = false;
						return Promise.reject(error);
					}.bind(this));
			}
		} else {
			return this._rootInstance.removeAsset(taskId, assetId);
		}
	},

    refreshAsset: function(taskId, assetId, force) {
		if(this._isRootInstance) {
			var assetInstanceDSContext = this.$$("#assetInstanceDSContext");
			var assetInstanceDSInstance = this.$$("#assetInstanceDSInstance");

			if (force || this.asset == null || assetInstanceDSContext.contextId != taskId || assetInstanceDSInstance.instanceId != assetId) {
				this.loadingAsset = true;

				assetInstanceDSContext.contextId = taskId;
				assetInstanceDSInstance.instanceId = assetId;
				return this.$$("#assetInstanceDS").refresh()
					.then(this._addHasGraphicToAsset.bind(this))
					.then(function() {
						this.loadingAsset = false;

						return this.asset;
					}.bind(this))
					.catch(function(error) {
						this.loadingAssets = false;
						return Promise.reject(error);
					}.bind(this));
			} else {
				return Promise.resolve(this.asset);
			}
		} else {
			return this._rootInstance.refreshAsset(taskId, assetId, force);
		}
	},

    refreshAssetDocuments: function(taskId, assetId, force) {
		if (this._isRootInstance) {
			var documentsDSAssetContext = this.$$("#documentsDSAssetContext");
			var documentsDSTaskContext = this.$$("#documentsDSTaskContext");
			if (force || this.documents == null || documentsDSTaskContext.contextId != taskId || documentsDSAssetContext != assetId) {
				this.$$("#documentsDS").countOnly = false;
				documentsDSAssetContext.contextId = assetId
				documentsDSTaskContext.contextId = taskId;

				return this.$$("#documentsDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.documents);
			}
		} else {
			return this._rootInstance.refreshAssetDocuments(taskId, assetId, force);
		}
	},

	refreshAssetLookup: function(assetLookupSearch) {
		if (this._isRootInstance) {
			if (assetLookupSearch) {
				return this.shadowRoot.querySelector("#assetLookup").refresh();
			} else {
				return Promise.resolve(null);
			}
		} else {
			return this._rootInstance.refreshAssetLookup(assetLookupSearch);
		}
	}
});