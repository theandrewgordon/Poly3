/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-offline-manager/triplat-ds-offline.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triplat-ds id="resourcesListDS" name="resources" on-data-changed="_handleResourcesListChanged" query-total-size="{{resourcesCount}}" loading="{{_loadingResources}}" manual="">
				<triplat-ds-offline id="resourcesListDSOffline" mode="CONTEXT" cache-thumbnails="[[_toArray('picture')]]"></triplat-ds-offline>
				<triplat-ds-context id="resourcesListDSContext" name="myTasks"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="myLaborClassesDS" name="myLaborClasses" data="{{_myLaborClasses}}" loading="{{_loadingMyLaborClasses}}" manual="">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>
		</template>
	`,

    is: "triservice-resource",

    behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior
	],

    properties: {
		online: {
			type: Boolean
		},

		currentUser: {
			type: Object
		},

		loadingResources: {
			type: Boolean,
			value: false,
			notify: true
		},

		resources: {
			type: Array,
			notify: true
		},

		resourcesCount: {
			type: Number,
			notify: true
		},

		_myLaborClasses: {
			type: Array
		},

		_loadingResources: {
			type: Boolean,
			value: false
		},

		_loadingMyLaborClasses: {
			type: Boolean,
			value: false
		}
	},

    observers: [
		"_computeLoadingResources(_loadingResources, _loadingMyLaborClasses)"
	],

    _computeLoadingResources: function(loadingResources, loadingMyLaborClasses) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		this.loadingResources = loadingResources || loadingMyLaborClasses;
	},

    refreshResources: function (taskId, force) {
		if (this._isRootInstance) {
			var resourcesListDSContext = this.$$("#resourcesListDSContext");
			if (force || this.resources == null || resourcesListDSContext.contextId != taskId || this.$$("#resourcesListDS").countOnly) {
				resourcesListDSContext.contextId = taskId;
				this.$$("#resourcesListDS").countOnly = false;
				return this.$$("#resourcesListDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.resources);
			}
		} else {
			return this._rootInstance.refreshResources(taskId, force);
		}
	},

    _refreshMyLaborClasses: function () {
		if (!this._myLaborClasses) {
			return this.$$("#myLaborClassesDS").refresh().then(this._returnDataFromResponse.bind(this));
		} else {
			return Promise.resolve(this._myLaborClasses);
		}
	},

    cacheResourceForCurrentUser: function (taskId) {
		if (this._isRootInstance) {
			if (this.online) {
				return Promise.resolve();
			}
			var resourcesListDSContext = this.$$("#resourcesListDSContext");
			resourcesListDSContext.contextId = taskId;
			var resource = {name: this.currentUser.fullName, picture: this.currentUser.image};
			return this._refreshMyLaborClasses().then(function(myLaborClasses) {
				resource.labors = {};
				resource.labors.data = myLaborClasses;
				return this.$$("#resourcesListDSOffline").cacheRecords(false, resource);
			}.bind(this));
		} else {
			return this._rootInstance.cacheResourceForCurrentUser(taskId);
		}
	},

    countResources: function (taskId, force) {
		if (this._isRootInstance) {
			var resourcesListDSContext = this.$$("#resourcesListDSContext");
			if (force || resourcesListDSContext.contextId != taskId) {
				resourcesListDSContext.contextId = taskId;
				this.$$("#resourcesListDS").countOnly = true;
				return this.$$("#resourcesListDS").refresh().then(this._returnCountFromResponse.bind(this));
			} else {
				return Promise.resolve(this.resourcesCount);
			}
		} else {
			return this._rootInstance.countResources(taskId, force);
		}
	},

    _handleResourcesListChanged: function() {
		var resources = this.$$("#resourcesListDS").data;
		if (resources) {
			for (var i = 0; i < resources.length; i++) {
				if (resources[i].labors && resources[i].labors.data) {
					resources[i].laborClass = this._laborsToLaborClass(resources[i].labors.data);
				} else {
					resources[i].laborClass = "";
				}
			}
		}
		this.resources = resources;
	},

    _laborsToLaborClass: function(labors) {
		if (!labors) {
			return "";
		}
		return labors.map(function(labor) {
			return labor.laborClass}
		).join(", ");
	}
});