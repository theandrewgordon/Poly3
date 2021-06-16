/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

import "../triplat-ds/triplat-ds.js";
import "../triplat-query/triplat-query.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";

import { TriTaskSearchBehavior } from "./tribehav-task-search.js";
import { TriTaskServiceBehavior } from "./tribehav-task-service.js";
import "./triservice-work-task-base.js";

Polymer({
	_template: html`
		<template is="dom-if" if="[[_isRootInstance]]">
			<triservice-work-task-base id="workTaskBaseService"></triservice-work-task-base>

			<triplat-ds id="assetsAssociatedToMyInprogressTasksDS" name="assetsAssociatedToMyInProgressTasks" filtered-data="{{myTasksRequestedAssets}}" loading="{{_loadingMyTasksRequestedAssets}}" force-server-filtering manual>
				<triplat-query delay="0">
					<triplat-query-filter name="name" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="id" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="equals" value="[[scannedData]]" ignore-if-blank>
					</triplat-query-filter>
				</triplat-query>
			</triplat-ds>
			<triplat-ds id="assetsAssociatedToMyCompletedTasksDS" name="assetsAssociatedToMyCompletedTasks" filtered-data="{{myTasksRequestedAssets}}" loading="{{_loadingMyTasksRequestedAssets}}" force-server-filtering manual>
				<triplat-query delay="0">
					<triplat-query-filter name="name" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="id" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="equals" value="[[scannedData]]" ignore-if-blank>
					</triplat-query-filter>
				</triplat-query>
			</triplat-ds>
			<triplat-ds id="assetsAssociatedToMyDraftTasksDS" name="assetsAssociatedToMyDraftTasks" filtered-data="{{myTasksRequestedAssets}}" loading="{{_loadingMyTasksRequestedAssets}}" force-server-filtering manual>
				<triplat-query delay="0">
					<triplat-query-filter name="name" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="id" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="equals" value="[[scannedData]]" ignore-if-blank>
					</triplat-query-filter>
				</triplat-query>
			</triplat-ds>
			<triplat-ds id="assetsAssociatedToMyClosedTasksDS" name="assetsAssociatedToMyClosedTasks" filtered-data="{{myTasksRequestedAssets}}" loading="{{_loadingMyTasksRequestedAssets}}" force-server-filtering manual>
				<triplat-query delay="0">
					<triplat-query-filter name="name" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="id" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="equals" value="[[scannedData]]" ignore-if-blank>
					</triplat-query-filter>
				</triplat-query>
			</triplat-ds>
			<triplat-ds id="assetsAssociatedToMyUnassignedTasksDS" name="assetsAssociatedToMyUnassignedTasks" filtered-data="{{myTasksRequestedAssets}}" loading="{{_loadingMyTasksRequestedAssets}}" force-server-filtering manual>
				<triplat-query delay="0">
					<triplat-query-filter name="name" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="id" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="contains" value="[[_assetsSearch]]" ignore-if-blank>
					</triplat-query-filter>
					<triplat-query-or></triplat-query-or>
					<triplat-query-filter name="barCode" operator="equals" value="[[scannedData]]" ignore-if-blank>
					</triplat-query-filter>
				</triplat-query>
			</triplat-ds> 

			<triplat-ds id="myInProgressTasksDS" name="myTasksAssociatedToAsset" filtered-data="{{myInProgressTasks}}" loading="{{_loadingMyInProgressTasks}}" force-server-filtering manual on-ds-get-complete="_handleMyInProgressTasksGet">
				<triplat-ds-context name="assetsAssociatedToMyInProgressTasks" context-id="[[selectedSearchItem._id]]"></triplat-ds-context>
				<triplat-query delay="0">
					<triplat-query-open-paren></triplat-query-open-paren>
						<triplat-query-filter name="statusENUS" operator="equals" type="STRING_WITH_ID" value="Active" ignore-if-blank></triplat-query-filter> 
						<triplat-query-or></triplat-query-or>
						<triplat-query-filter name="statusENUS" operator="starts with" type="STRING_WITH_ID" value="Hold" ignore-if-blank></triplat-query-filter> 
					<triplat-query-close-paren></triplat-query-close-paren>
					<triplat-query-and></triplat-query-and>
					<triplat-query-open-paren></triplat-query-open-paren>
					<triplat-query-filter name="taskTypeENUS" operator="equals" value="[[_selectedTaskType]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-close-paren></triplat-query-close-paren>
					<triplat-query-and></triplat-query-and>
					<triplat-query-open-paren></triplat-query-open-paren>
					<triplat-query-filter name="createdById" operator="equals" value="[[_currentUserId]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-close-paren></triplat-query-close-paren>
					<triplat-query-sort name="[[sortField]]" desc="[[sortDesc]]" type="[[sortType]]"></triplat-query-sort>
					<triplat-query-sort name="plannedStart" desc type="DATE_TIME"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="myCompletedTasksDS" name="myTasksAssociatedToAsset" filtered-data="{{myCompletedTasks}}" loading="{{_loadingMyCompletedTasks}}" force-server-filtering manual on-ds-get-complete="_handleMyCompletedTasksGet">
				<triplat-ds-context name="assetsAssociatedToMyCompletedTasks" context-id="[[selectedSearchItem._id]]"></triplat-ds-context> 
				<triplat-query delay="0">
					<triplat-query-open-paren></triplat-query-open-paren>
						<triplat-query-filter name="statusENUS" operator="equals" type="STRING_WITH_ID" value="Completed"></triplat-query-filter>
						<triplat-query-or></triplat-query-or>
						<triplat-query-filter name="statusENUS" operator="equals" type="STRING_WITH_ID" value="Routing In Progress"></triplat-query-filter>
					<triplat-query-close-paren></triplat-query-close-paren>
					<triplat-query-and></triplat-query-and>
					<triplat-query-filter name="taskTypeENUS" operator="equals" value="[[_selectedTaskType]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-and></triplat-query-and>
					<triplat-query-filter name="createdById" operator="equals" value="[[_currentUserId]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-sort name="[[sortField]]" desc="[[sortDesc]]" type="[[sortType]]"></triplat-query-sort>
					<triplat-query-sort name="plannedStart" desc type="DATE_TIME"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="myDraftTasksDS" name="myTasksAssociatedToAsset" filtered-data="{{myDraftTasks}}" loading="{{_loadingMyDraftTasks}}" force-server-filtering manual on-ds-get-complete="_handleMyDraftTasksGet">
				<triplat-ds-context name="assetsAssociatedToMyDraftTasks" context-id="[[selectedSearchItem._id]]"></triplat-ds-context> 
				<triplat-query delay="0"> 
					<triplat-query-open-paren></triplat-query-open-paren> 
						<triplat-query-filter name="statusENUS" operator="equals" type="STRING_WITH_ID" value="Draft"></triplat-query-filter>
						<triplat-query-or></triplat-query-or>
						<triplat-query-filter name="statusENUS" operator="equals" type="STRING_WITH_ID" value="Review In Progress"></triplat-query-filter>
					<triplat-query-close-paren></triplat-query-close-paren>
					<triplat-query-and></triplat-query-and>
					<triplat-query-filter name="taskTypeENUS" operator="equals" value="[[_selectedTaskType]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-and></triplat-query-and>
					<triplat-query-filter name="createdById" operator="equals" value="[[_currentUserId]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-sort name="[[sortField]]" desc="[[sortDesc]]" type="[[sortType]]"></triplat-query-sort>
					<triplat-query-sort name="plannedStart" desc type="DATE_TIME"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="unassignedTaskListDS" name="unassignedTasksAssociatedToAssetForMyTeam" filtered-data="{{unassignedTasks}}" loading="{{_loadingMyunassingedTasks}}" force-server-filtering manual on-ds-get-complete="_handleUnassignedTasksGet">
				<triplat-ds-context name="assetsAssociatedToMyUnassignedTasks" context-id="[[selectedSearchItem._id]]"></triplat-ds-context> 
				<triplat-query delay="0"> 
					<triplat-query-open-paren></triplat-query-open-paren>
					<triplat-query-filter name="taskTypeENUS" operator="equals" value="[[_selectedTaskType]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-and></triplat-query-and>
					<triplat-query-filter name="assignmentStatusENUS" operator="equals" value="Unassigned"></triplat-query-filter>
					<triplat-query-and></triplat-query-and>
					<triplat-query-close-paren></triplat-query-close-paren>
					<triplat-query-and></triplat-query-and>
					<triplat-query-filter name="createdById" operator="equals" value="[[_currentUserId]]" ignore-if-blank></triplat-query-filter>
					<triplat-query-sort name="[[sortField]]" desc="[[sortDesc]]" type="[[sortType]]"></triplat-query-sort>
					<triplat-query-sort name="plannedStart" desc type="DATE_TIME"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-ds id="myClosedTasksDS" name="myTasksAssociatedToAsset" filtered-data="{{myClosedTasks}}" loading="{{_loadingMyClosedTasks}}" force-server-filtering manual on-ds-get-complete="_handleMyClosedTasksGet">
				<triplat-ds-context name="assetsAssociatedToMyClosedTasks" context-id="[[selectedSearchItem._id]]"></triplat-ds-context>
					<triplat-query delay="300">
						<triplat-query-filter name="statusENUS" operator="equals" type="STRING_WITH_ID" value="Closed"></triplat-query-filter>
						<triplat-query-and></triplat-query-and>
						<triplat-query-filter name="taskTypeENUS" operator="equals" value="[[_selectedTaskType]]" ignore-if-blank></triplat-query-filter>
						<triplat-query-and></triplat-query-and>
						<triplat-query-filter name="createdById" operator="equals" value="[[_currentUserId]]" ignore-if-blank></triplat-query-filter>
						<triplat-query-sort name="[[sortField]]" desc="[[sortDesc]]" type="[[sortType]]"></triplat-query-sort>
						<triplat-query-sort name="plannedStart" desc type="DATE_TIME"></triplat-query-sort>
					</triplat-query>
				</triplat-ds>
			</triplat-ds>
		</template>
	`,

	is: "triservice-work-task-search-by-asset",

	behaviors: [
		TriPlatViewBehavior,
		TriTaskSearchBehavior,
		TriTaskServiceBehavior
	],

	properties: {

		scannedData: {
			type: String,
			notify: true
		},

		assetsSearch: {
			type: String,
			notify: true,
			value: ""
		},

		_assetsSearch: {
			type: String
		},

		taskFilter: {
			type: String,
			notify: true,
			value: "all"
		},

		sortField: {
			type: String,
			notify: true,
			value: "plannedStart"
		},

		sortDesc: {
			type: Boolean,
			notify: true,
			value: false
		},

		sortType: {
			type: String,
			notify: true,
			value: "DATE_TIME"
		},

		myTasksRequestedAssets: {
			type: Array,
			notify: true
		},

		selectedSearchItem:  {
			type: Object,
			notify: true
		},

		myInProgressTasks: {
			type: Array,
			notify: true
		},

		myCompletedTasks: {
			type: Array,
			notify: true
		},

		myDraftTasks: {
			type: Array,
			notify: true
		},

		unassignedTasks: {
			type: Array,
			notify: true
		},

		myClosedTasks: {
			type: Array,
			notify: true,
			value: []
		},

		disableMyInProgress: {
			type: Boolean,
			value: true,
			notify: true
		},

		disableMyCompleted: {
			type: Boolean,
			value: true,
			notify: true
		},

		disableMyDraft: {
			type: Boolean,
			value: true,
			notify: true
		},

		disableMyUnassigned: {
			type: Boolean,
			value: true,
			notify: true
		},

		disableMyClosed: {
			type: Boolean,
			value: true,
			notify: true
		},

		loadingTasks: {
			type: Boolean,
			value: false,
			notify: true
		},

		_loadingMyTasksRequestedAssets: {
			type: Boolean,
			value: false
		},

		_loadingMyInProgressTasks: {
			type: Boolean,
			value: false
		},

		_loadingMyCompletedTasks: {
			type: Boolean,
			value: false
		},

		_loadingMyDraftTasks: {
			type: Boolean,
			value: false
		},

		_loadingMyunassingedTasks: {
			type: Boolean,
			value: false
		},

		_loadingMyClosedTasks: {
			type: Boolean,
			value: false
		}
	},

	observers: [
		"_computeLoadingTasks(_loadingMyTasksRequestedAssets, _loadingMyInProgressTasks, _loadingMyCompletedTasks, _loadingMyDraftTasks, _loadingMyunassingedTasks, _loadingMyClosedTasks)",
		"_handleAssetsSearchChanged(assetsSearch, _serviceReady)",
		"_handleTaskFilterChanged(taskFilter, _serviceReady)",
		"_onSearchTaskAssets(assetsSearch, disableMyInProgress, disableMyCompleted, disableMyDraft, disableMyUnassigned, disableMyClosed)",
		"_onFilterTasksByAssets(selectedSearchItem, disableMyInProgress, disableMyCompleted, disableMyDraft, disableMyUnassigned, disableMyClosed)",
		"_computeNameIdBarcode(myTasksRequestedAssets)"
	],

	get baseService() {
		return this.$$("#workTaskBaseService");
	},

	get currentUser() {
		return this.baseService.currentUser;
	},

	_onSearchTaskAssets: function(assetsSearch, disableMyInProgress, disableMyCompleted, disableMyDraft, disableMyUnassigned, disableMyClosed) {
		if (this._isRootInstance) {
			this.debounce("_debounceRefreshAssets", function() {
				if(assetsSearch && !this.selectedSearchItem) {
					if (!disableMyInProgress) {
						this.$$("#assetsAssociatedToMyInprogressTasksDS").refresh();
					} else if(!disableMyCompleted) {
						this.$$("#assetsAssociatedToMyCompletedTasksDS").refresh();
					} else if(!disableMyDraft) {
						this.$$("#assetsAssociatedToMyDraftTasksDS").refresh();
					} else if(!disableMyUnassigned) {
						this.$$("#assetsAssociatedToMyUnassignedTasksDS").refresh();
					} else if(!disableMyClosed) {
						this.$$("#assetsAssociatedToMyClosedTasksDS").refresh();
					}
				}
			}.bind(this), 300);
		}
	},

	_onFilterTasksByAssets: function(selectedSearchItem, disableMyInProgress, disableMyCompleted, disableMyDraft, disableMyUnassigned, disableMyClosed) {
		if (this._isRootInstance) {
			if (!(disableMyInProgress && disableMyCompleted && disableMyDraft && disableMyUnassigned && disableMyClosed) && selectedSearchItem && selectedSearchItem._id && selectedSearchItem._id != "") {
				this.refreshTasks(selectedSearchItem);
			}
		}
	},

	refreshTasks: function(selectedSearchItem) {
		if (this._isRootInstance) {
			if(selectedSearchItem)
				this._handleRefreshTasks(!this.disableMyInProgress, !this.disableMyCompleted, !this.disableMyDraft, !this.disableMyUnassigned, !this.disableMyClosed);
		} else {
			this._rootInstance.refreshTasks(selectedSearchItem);
		}
	},

	_handleRefreshTasks: function(inProgressRouteActive, completedRouteActive, draftRouteActive, unassignedRouteActive, closedRouteActive) {
		if (this._isRootInstance) {
			if(inProgressRouteActive)
				this.$$("#myInProgressTasksDS").refresh();
			else if(completedRouteActive)
				this.$$("#myCompletedTasksDS").refresh();
			else if(draftRouteActive)
				this.$$("#myDraftTasksDS").refresh();
			else if(unassignedRouteActive)
				this.$$("#unassignedTaskListDS").refresh();
			else if(closedRouteActive)
				this.$$("#myClosedTasksDS").refresh();
		}
	},

	_handleAssetsSearchChanged: function(assetsSearch, serviceReady) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (!this._isRootInstance || !serviceReady) {
			return;
		}

		this.debounce("_debounceAssetsSearch", function() {
			this._assetsSearch = assetsSearch;
		}.bind(this));
	},

	_computeNameIdBarcode: function(myTasksRequestedAssets) {
		if(this._isRootInstance && myTasksRequestedAssets) {
			myTasksRequestedAssets.forEach(asset => {
				let id = asset.id ? ", " + asset.id : "";
				let barCode = asset.barCode ? ", " + asset.barCode : "";
				asset.computedAsset = asset.name + id + barCode;
			});
		}
	},

	_computeLoadingTasks: function(loadingMyTasksRequestedAssets, loadingMyInProgressTasks, loadingMyCompletedTasks, loadingMyDraftTasks, loadingMyunassingedTasks, loadingMyClosedTasks) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		this.loadingTasks = loadingMyTasksRequestedAssets || loadingMyInProgressTasks || loadingMyCompletedTasks || loadingMyDraftTasks || loadingMyunassingedTasks || loadingMyClosedTasks;
	},

	_handleMyInProgressTasksGet: function() {
		if (this._isRootInstance) {
			this._modifyNoPriorityForSorting(this.myInProgressTasks);
			this._addLocationToTasks(this.myInProgressTasks);
		}
	},

	_handleMyCompletedTasksGet: function() {
		if (this._isRootInstance) {
			this._modifyNoPriorityForSorting(this.myCompletedTasks);
			this._addLocationToTasks(this.myCompletedTasks);
		}
	},

	_handleMyDraftTasksGet: function() {
		if (this._isRootInstance) {
			this._modifyNoPriorityForSorting(this.myDraftTasks);
			this._addLocationToTasks(this.myDraftTasks);
		}
	},

	_handleMyClosedTasksGet: function() {
		if (this._isRootInstance) {
			this._modifyNoPriorityForSorting(this.myClosedTasks);
		}
	},

	_handleUnassignedTasksGet: function() {
		if (this._isRootInstance) {
			this._modifyNoPriorityForSorting(this.unassignedTasks);
			this._addLocationToTasks(this.unassignedTasks);
		}
	}
});