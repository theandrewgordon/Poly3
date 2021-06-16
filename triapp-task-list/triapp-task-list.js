/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-tooltip/paper-tooltip.js";
import "../triplat-auth-check/triplat-auth-check.js";
import "../triplat-icon/ibm-icons.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-routing/triplat-route-selector.js";
import "../triblock-tabs/triblock-tabs.js";
import "../triblock-tabs/triblock-tab-nav-layout.js";
import "./tricomp-search.js";
import "./tricomp-task-list-header.js";
import "./tricomp-task-list-filter.js";
import "./tricomp-task-list-sort.js";
import "./tricomp-task-list-tab-content.js";
import { TriroutesTaskList } from "./triroutes-task-list.js";
import "./tripage-bar-code-scanner.js";
import "./tripage-qr-code-scanner.js";
import "./triroutes-task-list-base.js";
import "./triservice-work-task-base.js";
import "./triservice-work-task-search-by-asset.js";
import "./triservice-work-task-search-by-location.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "./tristyles-task-list.js";


Polymer({
	_template: html`
		<style include="tristyles-theme message-placeholder">

				:host {
					@apply --layout-vertical;
					overflow-y: auto;
				}

				.app-list-content {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.tab-content {
					@apply --layout-vertical;
					@apply --layout-flex;
					border-top: 1px solid var(--tri-primary-content-accent-color);
				}

				.message-placeholder {
					@apply --layout-flex;
				}

				triplat-route-selector, iron-pages {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.header {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				#inProgress, 
				#completed, 
				#draft, 
				#unassigned, 
				#closed {
					@apply --layout-flex;
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
				}

				:host([_current-layout="card"]) .tab-content {
					background-color: var(--ibm-neutral-2);
				}

				:host([_current-layout="table"]) .tab-content {
					background-color: white;
				}

				:host([_current-layout="table"]) #inProgress,
				:host([_current-layout="table"]) #completed,
				:host([_current-layout="table"]) #draft,
				:host([_current-layout="table"]) #closed,
				:host([_current-layout="table"]) #unassigned {
					background-color: white;
				}

				triblock-tabs {
					--triblock-tabs-background-color: white;
					--triblock-tab-background-color: white;
					--triblock-tab-unselected-background-color: white;
					background-color: white;
					padding-left: 20px;
					padding-right: 20px;
					flex-shrink: 0;
					@apply --layout-flex;
					--triblock-tab-focused-tricontent: {
						outline: 1px solid var(--tri-primary-color-40);
					};
				}

				:host([_small-layout]) triblock-tabs {
					padding-left: 0px;
					padding-right: 0px;
				}

				:host([_small-layout]) > .action-bar-space {
					max-height: 55px;
				}

				.header-title {
					@apply --layout-flex;
				}

				.header-icon {
					flex-shrink: 0;
					height: 44px;
					width: 44px;
					margin-right: 12px;
					@apply --layout-flex-1;
				}

				:host(:not([_small-layout])) tricomp-search {
					margin: 15px 20px 20px 20px;
				}
		</style>

		<triservice-work-task-base id="workTaskBaseService" 
			small-layout="{{_smallLayout}}" medium-layout="{{_mediumLayout}}" model-and-view="triWorkTask" instance-id="-1" online="[[online]]" 
			loading-tasks="{{_loadingTasks}}" my-in-progress-tasks="{{_myInProgressTasks}}" my-completed-tasks="{{_myCompletedTasks}}" 
			my-draft-tasks="{{_myDraftTasks}}" my-closed-tasks="{{_myClosedTasks}}" unassigned-tasks="{{_unassignedTasks}}" 
			task-filter="[[_taskFilterByTask]]" sort-field="[[_sortFieldByTask]]" sort-desc="[[_sortDescByTask]]" sort-type="[[_sortTypeByTask]]" 
			disable-my-closed="[[_disableMyClosed]]" task-search="[[_taskSearch]]" tasks-scroller="[[_scroller]]">
		</triservice-work-task-base>

		<triservice-work-task-search-by-asset id="workTaskSearchByAssetService" 
			model-and-view="triWorkTask" instance-id="-1" 
			assets-search="[[_assetsSearch]]" 
			scanned-data="[[_scannedData]]" 
			my-tasks-requested-assets="{{_searchResultsFromAsset}}" 
			selected-search-item="[[_selectedAssetSearchItem]]" 
			my-in-progress-tasks="{{_myInProgressTasks}}" 
			my-completed-tasks="{{_myCompletedTasks}}" 
			my-draft-tasks="{{_myDraftTasks}}" 
			unassigned-tasks="{{_unassignedTasks}}" 
			my-closed-tasks="{{_myClosedTasks}}" 
			sort-field="[[_sortFieldByAsset]]" 
			sort-desc="[[_sortDescByAsset]]" 
			sort-type="[[_sortTypeByAsset]]" 
			task-filter="[[_taskFilterByAsset]]" 
			disable-my-in-progress="[[_disableAssetMyInProgress]]" 
			disable-my-completed="[[_disableAssetMyCompleted]]" 
			disable-my-draft="[[_disableAssetMyDraft]]" 
			disable-my-unassigned="[[_disableAssetMyUnassigned]]" 
			disable-my-closed="[[_disableAssetMyClosed]]">
		</triservice-work-task-search-by-asset>

		<triservice-work-task-search-by-location id="workTaskSearchByLocationService" 
			model-and-view="triWorkTask" instance-id="-1" 
			locations-search="[[_locationSearch]]" 
			scanned-data="[[_scannedData]]" 
			my-tasks-requested-locations-with-primary="{{_searchResultsFromLocation}}" 
			selected-search-item="[[_selectedLocationSearchItem]]" 
			my-in-progress-tasks="{{_myInProgressTasks}}" 
			my-completed-tasks="{{_myCompletedTasks}}" 
			my-draft-tasks="{{_myDraftTasks}}" 
			unassigned-tasks="{{_unassignedTasks}}" 
			my-closed-tasks="{{_myClosedTasks}}" 
			sort-field="[[_sortFieldByLocation]]" 
			sort-desc="[[_sortDescByLocation]]" 
			sort-type="[[_sortTypeByLocation]]" 
			task-filter="[[_taskFilterByLocation]]" 
			disable-my-in-progress="[[_disableMyInProgressLocationsSearch]]" 
			disable-my-completed="[[_disableMyCompletedLocationsSearch]]" 
			disable-my-draft="[[_disableMyDraftLocationsSearch]]" 
			disable-unassigned="[[_disableUnassignedLocationsSearch]]" 
			disable-my-closed="[[_disableMyClosedLocationsSearch]]">
		</triservice-work-task-search-by-location>

		<triplat-auth-check app-name="workTask" auth="{{_workTaskAuth}}"></triplat-auth-check>

		<triroutes-task-list on-inprogress-route-active="_handleInprogressAndCompletedRouteActive" on-completed-route-active="_handleInprogressAndCompletedRouteActive" on-draft-route-active="_handleInprogressAndCompletedRouteActive" in-progress-route-active="{{_inProgressRouteActive}}" completed-route-active="{{_completedRouteActive}}" unassigned-route-active="{{_unassignedRouteActive}}" draft-route-active="{{_draftRouteActive}}" closed-route-active="{{_closedRouteActive}}">
		</triroutes-task-list>

		<triroutes-task-list-base bar-code-scan-active="{{_barCodeScanRouteActive}}" qr-code-scan-active="{{_qrCodeScanRouteActive}}" ></triroutes-task-list-base>

		<triplat-route-selector>
			<iron-pages>
				<div class="app-list-content" route="home">
					<div class="header">
						<tricomp-task-list-header class="header-title" small-layout="[[_smallLayout]]" auth="[[_workTaskAuth]]" show-new-task-button="[[showNewTaskButton]]"></tricomp-task-list-header>
					</div>
					<div class="header">
						<triblock-tabs id="tabs" selected="{{_selectedTab}}" hide-scroll-buttons="[[!_smallLayout]]" fit-container="[[_smallLayout]]">
							<triblock-tab id="inProgressTab" triplat-route-id="inProgressRoute" label="In Progress" slot="tab">
							</triblock-tab>
							<triblock-tab id="completedTab" triplat-route-id="completedRoute" label="Completed" slot="tab">
							</triblock-tab>
							<triblock-tab id="draftTab" triplat-route-id="draftRoute" label="Draft" slot="tab">
							</triblock-tab>
							<triblock-tab id="unassignedTab" triplat-route-id="unassignedRoute" label="Unassigned" slot="tab">
							</triblock-tab>
							<triblock-tab id="closedTab" triplat-route-id="closedRoute" label="Closed" slot="tab">
							</triblock-tab>
						</triblock-tabs>
						<paper-icon-button id="layoutToggleButton" hidden\$="[[_computeHideToggle(_smallLayout, _mediumLayout)]]" aria-label="Toggle task list layout" noink primary class="header-icon" icon="{{_computeLayoutIcon(_currentLayout)}}" on-tap="_onLayoutToggleTap"></paper-icon-button>
						<paper-tooltip for="layoutToggleButton" fit-to-visible-bounds position="bottom" offset="5">[[_computeLayoutToggleButtonTooltip(_currentLayout)]]</paper-tooltip>
					</div>
					<div class="tab-content" hidden\$="[[!_showTabContent]]">
						<tricomp-search hide-input-content="[[!_showListContent]]" 
							id="searchBy" online="[[online]]" 
							record-id="{{_recordId}}" 
							scroll-container="[[_scrollContainer]]" 
							scanned-data="{{_scannedData}}" 
							search-results="[[_searchResults]]" 
							selected-search-type="{{_selectedSearchType}}" 
							selected-item="{{_selectedSearchItem}}" 
							small-layout="[[_smallLayout]]" 
							value="{{_searchValue}}">
						</tricomp-search>
						<tricomp-task-list-filter selected="{{_taskFilter}}" small-layout="[[_smallLayout]]" hidden\$="[[_computeFilterHidden(_draftRouteActive, _showListContent)]]" aria-label="Task filter"></tricomp-task-list-filter>
						<tricomp-task-list-sort id="taskListSortBy" small-layout="[[_smallLayout]]" hidden\$="{{_computeSortHidden(_currentLayout, _showListContent)}}" ignore-location="[[!_disableMyClosed]]"></tricomp-task-list-sort>
						<triplat-route-selector hidden\$="[[!_showListContent]]">
							<iron-pages>
								<div id="inProgress" route="inProgress">
									<tricomp-task-list-tab-content id="inProgressTabContent" small-layout="[[_smallLayout]]" medium-layout="[[_mediumLayout]]" data="[[_myInProgressTasks]]" current-layout="{{_currentLayout}}" empty-message="[[_zeroInProgressMessage]]" sort-property="{{_sortField}}" sort-descending="{{_sortDesc}}" sort-type="{{_sortType}}" embedded="[[!showNewTaskButton]]" work-task-auth="[[_workTaskAuth]]">
									</tricomp-task-list-tab-content>
								</div>
								<div id="completed" route="completed">
									<tricomp-task-list-tab-content  data="[[_myCompletedTasks]]" small-layout="[[_smallLayout]]" medium-layout="[[_mediumLayout]]" current-layout="{{_currentLayout}}" empty-message="[[_zeroCompletedMessage]]" sort-property="{{_sortField}}" sort-descending="{{_sortDesc}}" sort-type="{{_sortType}}" embedded="[[!showNewTaskButton]]" work-task-auth="[[_workTaskAuth]]">
									</tricomp-task-list-tab-content>
								</div>
								<div id="draft" route="draft">
									<tricomp-task-list-tab-content data="[[_myDraftTasks]]" small-layout="[[_smallLayout]]" medium-layout="[[_mediumLayout]]" current-layout="{{_currentLayout}}" empty-message="[[_zeroDraftMessage]]" sort-property="{{_sortField}}" sort-descending="{{_sortDesc}}" sort-type="{{_sortType}}" embedded="[[!showNewTaskButton]]" work-task-auth="[[_workTaskAuth]]">
									</tricomp-task-list-tab-content>
								</div>
								<div id="unassigned" route="unassigned">
									<tricomp-task-list-tab-content data="[[_unassignedTasks]]" small-layout="[[_smallLayout]]" medium-layout="[[_mediumLayout]]" current-layout="{{_currentLayout}}" empty-message="[[_zeroUnassignedMessage]]" sort-property="{{_sortField}}" sort-descending="{{_sortDesc}}" sort-type="{{_sortType}}" embedded="[[!showNewTaskButton]]" work-task-auth="[[_workTaskAuth]]">
									</tricomp-task-list-tab-content>
								</div>
								<div id="closed" route="closed">
									<tricomp-task-list-tab-content data="[[_myClosedTasks]]" small-layout="[[_smallLayout]]" medium-layout="[[_mediumLayout]]" current-layout="{{_currentLayout}}" empty-message="[[_zeroClosedMessage]]" sort-property="{{_sortField}}" sort-descending="{{_sortDesc}}" sort-type="{{_sortType}}" embedded="[[!showNewTaskButton]]" ignore-location="[[!_disableMyClosed]]" table-scroller="{{_tableScroller}}" work-task-auth="[[_workTaskAuth]]">
									</tricomp-task-list-tab-content>
								</div>
							</iron-pages>
						</triplat-route-selector>
					</div>
				</div>
				<tripage-bar-code-scanner id="barCodeScanRoute" route-active="[[_barCodeScanRouteActive]]" route="barCodeScan" scanned-data="{{_scannedData}}" small-layout="[[_smallLayout]]"></tripage-bar-code-scanner>
				<tripage-qr-code-scanner id="qrCodeScanRoute" route-active="[[_qrCodeScanRouteActive]]" route="qrCodeScan" scanned-data="{{_scannedData}}" small-layout="[[_smallLayout]]"></tripage-qr-code-scanner>
			</iron-pages>
		</triplat-route-selector>

		<template is="dom-if" if="[[_showOfflineMessage]]">
			<div class="message-placeholder" hidden\$="[[_loadingTasks]]">
				<div aria-label\$="[[offlineMessage]]" tabindex="0" aria-live="polite">[[offlineMessage]]</div>
			</div>
		</template>
		
		<template is="dom-if" if="[[_showClosedOfflineMessage]]">
			<div class="message-placeholder" aria-live="polite">
				<div>Closed tasks are not available if the application is offline.</div>
			</div>
		</template>

		<template is="dom-if" if="[[_showUnassignedOfflineMessage]]">
			<div class="message-placeholder" aria-live="polite">
				<div>Unassigned tasks are not available if the application is offline.</div>
			</div>
		</template>

		<div class="action-bar-space"></div>
	`,

	is: "triapp-task-list",

	behaviors: [
		IronResizableBehavior
	],

	properties: {

		_currentLayout: {
			type: String,
			reflectToAttribute: true
		},

		_mediumLayout: {
			type: Boolean,
			reflectToAttribute: true
		},

		_smallLayout:{
			type: Boolean,
			reflectToAttribute: true
		},

		online: {
			type: Boolean,
			value: true
		},

		_disableAssetMyInProgress: {
			type: Boolean,
			value: true
		},

		_disableAssetMyCompleted: {
			type: Boolean,
			value: true
		},

		_disableAssetMyDraft: {
			type: Boolean,
			value: true
		},

		_disableAssetMyUnassigned: {
			type: Boolean,
			value: true
		},

		_disableAssetMyClosed: {
			type: Boolean,
			value: true
		},

		_disableMyClosed: {
			type: Boolean,
			value: true
		},

		_disableMyInProgressLocationsSearch: {
			type: Boolean,
			value: true
		},

		_disableMyCompletedLocationsSearch: {
			type: Boolean,
			value: true
		},

		_disableMyDraftLocationsSearch: {
			type: Boolean,
			value: true
		},

		_disableUnassignedLocationsSearch: {
			type: Boolean,
			value: true
		},

		_disableMyClosedLocationsSearch: {
			type: Boolean,
			value: true
		},

		downloading: {
			type: Boolean,
			value: false
		},

		_myInProgressTasks: {
			type: Array,
			value: []
		},

		_myCompletedTasks: {
			type: Array,
			value: []
		},

		_myDraftTasks: {
			type: Array,
			value: []
		},

		_unassignedTasks: {
			type: Array,
			value: []
		},

		_myClosedTasks: {
			type: Array,
			value: []
		},

		_showOfflineMessage: {
			type: Boolean,
			computed: "_computeShowOfflineMessage(_selectedTab, _selectedSearchType, online)"
		},

		_showListContent: {
			type: Boolean,
			computed: "_computeShowListContent(_showOfflineMessage)"
		},

		_showClosedOfflineMessage: {
			type: Boolean,
			computed: "_computeShowClosedOfflineMessage(_selectedTab, online)"
		},

		_showUnassignedOfflineMessage: {
			type: Boolean,
			computed: "_computeShowUnassignedOfflineMessage(_selectedTab, online)"
		},

		_showTabContent: {
			type: Boolean,
			computed: "_computeShowTabContent(_showClosedOfflineMessage, _showUnassignedOfflineMessage)"
		},

		_selectedTab: {
			type: String
		},

		showNewTaskButton: {
			type: Boolean,
			value: false
		},

		_sortField: {
			type: String,
			notify: true,
			value: "plannedStart"
		},

		_sortDesc: {
			type: Boolean,
			notify: true,
			value: false
		},

		_sortType: {
			type: String,
			notify: true,
			value: "DATE_TIME"
		},

		_sortFieldByTask: String,
		_sortDescByTask: Boolean,
		_sortTypeByTask: String,

		_sortFieldByAsset: String,
		_sortDescByAsset: String,
		_sortTypeByAsset: String,

		_sortFieldByLocation: String,
		_sortDescByLocation: Boolean,
		_sortTypeByLocation: String,

		_taskFilter: String,
		_taskFilterByTask: String,
		_taskFilterByAsset: String,
		_taskFilterByLocation: String,

		_selectedSearchType: String,

		_searchPlaceholder: String,
		_searchValue: String,

		_taskSearch: String,
		_assetsSearch: String,
		_locationSearch: String,

		_searchResultsFromAsset: Array,
		_searchResultsFromLocation: Array,

		_searchResults: {
			type: Array,
			value: []
		},

		_selectedSearchItem: Object,
		_recordId: String,
		_selectedAssetSearchItem: Object,
		_selectedLocationSearchItem: Object,
		_scannedData: String,
		_scanRouteActive: {
			type: Boolean,
			computed: '_computeScanRouteActive(_barCodeScanRouteActive, _qrCodeScanRouteActive)'
		},
		_barCodeScanRouteActive: Boolean,
		_qrCodeScanRouteActive: Boolean,

		_inProgressRouteActive: Boolean,
		_completedRouteActive: Boolean,
		_draftRouteActive: Boolean,
		_unassignedRouteActive: Boolean,
		_closedRouteActive: Boolean,
		
		_scroller: {
			type: Object,
			computed: "_computeScroller(_currentLayout, _tableScroller)"
		},

		_tableScroller: {
			type: Object
		},

		_workTaskAuth: {
			type: Object
		},

		_zeroInProgressMessage: {
			type: String
		},

		_zeroCompletedMessage: {
			type: String
		},

		_zeroClosedMessage: {
			type: String
		},

		_zeroUnassignedMessage: {
			type: String
		}
	},

	observers: [
		"_onLayoutChange(_currentLayout)",
		"_onTasksChange(_myInProgressTasks, _myCompletedTasks, _myDraftTasks, _myClosedTasks, _unassignedTasks)",
		"_onUnassignedRouteActiveChange(_unassignedRouteActive, online)",
		"_onClosedRouteActiveChange(_closedRouteActive, online)",
		"_handleSearchOnRouteChange(_inProgressRouteActive, _completedRouteActive, _draftRouteActive, _unassignedRouteActive, _closedRouteActive, _selectedSearchType)",
		"_handleSortBySelectedSearchType(_sortField,_sortType,_sortDesc)",
		"_setTaskFilterBySelectedSearchType(_taskFilter, _recordId)",
		"_setSearchBySelectedSearchType(_searchValue)",
		"_setSelectedItemBySelectedSearchType(_selectedSearchItem)",
		"_setSearchResultsBySelectedSearchType(_searchResultsFromAsset, _searchResultsFromLocation)",
		"_notifySearchInputDropdownResize(downloading)"
	],

	_notifySearchInputDropdownResize: function(downloading) {
		if(this._selectedSearchType != "task")
			this.$.searchBy.onSearchInputPositionChanged();
	},

	listeners: {
		"task-sort-selected": "_setTaskSort",
		"clear-selected-item":"_clearSelectedItem"
	},

	attached: function () {
		var __dictionary__zeroInProgressMessage = "You do not have any tasks in progress.";
		var __dictionary__zeroCompletedMessage = "You do not have any completed tasks.";
		var __dictionary__zeroDraftMessage = "You do not have any draft tasks.";
		var __dictionary__zeroUnassignedMessage = "Your team doesn't have any unassigned tasks.";
		var __dictionary__zeroClosedMessage = "You do not have any closed tasks.";
		var __dictionary__searchPlaceholder = "Search for an assigned task";
		this.set("_zeroInProgressMessage", __dictionary__zeroInProgressMessage);
		this.set("_zeroCompletedMessage", __dictionary__zeroCompletedMessage);
		this.set("_zeroDraftMessage", __dictionary__zeroDraftMessage);
		this.set("_zeroClosedMessage", __dictionary__zeroClosedMessage);
		this.set("_zeroUnassignedMessage", __dictionary__zeroUnassignedMessage);
		this.set("_searchPlaceholder", __dictionary__searchPlaceholder);
		this.set("_scrollContainer", this);
	},

	_clearSelectedItem: function() {
		this._searchValue = "";
		this._selectedSearchItem = null;
	},

	_handleSearchOnRouteChange: function(inProgressRouteActive, completedRouteActive, draftRouteActive, unassignedRouteActive, closedRouteActive, selectedSearchType) {
		if (selectedSearchType == "task") {
			this._handleAssetSearch(false, false, false, false, false);
			this._handleLocationSearch(false, false, false, false, false);
		} else if (selectedSearchType == "asset") {
			this._handleAssetSearch(inProgressRouteActive, completedRouteActive, draftRouteActive, unassignedRouteActive, closedRouteActive);
			this._handleLocationSearch(false, false, false, false, false);
		} else if (selectedSearchType == "location") {
			this._handleAssetSearch(false, false, false, false, false);
			this._handleLocationSearch(inProgressRouteActive, completedRouteActive, draftRouteActive, unassignedRouteActive, closedRouteActive);
		}
	},

	_handleAssetSearch: function(myInProgress, myCompleted, myDraft, myUnassigned, myClosed) {
		this.set('_disableAssetMyInProgress', !myInProgress);
		this.set('_disableAssetMyCompleted', !myCompleted);
		this.set('_disableAssetMyDraft', !myDraft);
		this.set('_disableAssetMyUnassigned', !myUnassigned);
		this.set('_disableAssetMyClosed', !myClosed);
	},

	_handleLocationSearch: function(myInProgress, myCompleted, myDraft, myUnassigned, myClosed) {
		this.set('_disableMyInProgressLocationsSearch', !myInProgress);
		this.set('_disableMyCompletedLocationsSearch', !myCompleted);
		this.set('_disableMyDraftLocationsSearch', !myDraft);
		this.set('_disableUnassignedLocationsSearch', !myUnassigned);
		this.set('_disableMyClosedLocationsSearch', !myClosed);
	},

	_handleSortBySelectedSearchType: function(sortField, sortType, sortDesc) {
		if (this._selectedSearchType == "asset" && this._recordId && this._recordId != '') {
			this.set('_sortFieldByAsset', sortField);
			this.set('_sortDescByAsset', sortDesc);
			this.set('_sortTypeByAsset', sortType);
		} else if (this._selectedSearchType == "location" && this._recordId && this._recordId != '') {
			this.set('_sortFieldByLocation', sortField);
			this.set('_sortTypeByLocation', sortType);
			this.set('_sortDescByLocation', sortDesc);
		} else {
			this.set('_sortFieldByTask', sortField);
			this.set('_sortTypeByTask', sortType);
			this.set('_sortDescByTask', sortDesc);
		}
	},

	_setTaskFilterBySelectedSearchType: function(taskFilter, recordId) {
		if (this._selectedSearchType == "asset" && recordId && recordId != '') {
			this.set('_taskFilterByAsset', taskFilter);
		} else if (this._selectedSearchType == "location" && recordId && recordId != '') {
			this.set('_taskFilterByLocation', taskFilter);
		} else {
			this.set('_taskFilterByTask', taskFilter);
		}
	},

	_setSearchResultsBySelectedSearchType: function(assets, locations) {
		this.set("_searchResults", (this._selectedSearchType == "asset") ? assets : locations);
	},

	_setSearchBySelectedSearchType: function(search) {
		if(this._selectedSearchType == "task") {
			this._taskSearch = search;
		} else if (this._selectedSearchType == "asset") {
			this._assetsSearch = search;
		} else {
			this._locationSearch = search;
		}
	},

	_setSelectedItemBySelectedSearchType: function(selectedSearchItem) {
		if(selectedSearchItem) {
			if (this._selectedSearchType == "asset") {
				this._selectedAssetSearchItem = selectedSearchItem;
			} else if(this._selectedSearchType == "location"){
				this._selectedLocationSearchItem = selectedSearchItem;
			} 
		} else {
			this._selectedAssetSearchItem = null;
			this._selectedLocationSearchItem = null;
			this._refreshTasks(this._inProgressRouteActive, this._completedRouteActive, this._draftRouteActive, this._unassignedRouteActive, this._closedRouteActive);
		}
		
	},

	_refreshTasks: function(inProgressRouteActive, completedRouteActive, draftRouteActive, unassignedRouteActive, closedRouteActive) {
		if(inProgressRouteActive || completedRouteActive || draftRouteActive) {
			this.$.workTaskBaseService.refreshInProgressAndCompletedTasks();
		} else if(unassignedRouteActive) {
			this.$.workTaskBaseService.refreshUnassignedTasks();
		} else if(closedRouteActive) {
			this.set('_disableMyClosed', false);
			this._taskSearch = null;
			this._taskSearch = "";
		}
	},

	_computeScanRouteActive(barCodeScanActive, qrCodeScanActive) {
		return barCodeScanActive || qrCodeScanActive;
	},

	_refreshInProgressAndCompletedTasks: function () {
		if(this._selectedSearchType == 'task' || (this._recordId == '' && this._scanRouteActive)) {
			this.$.workTaskBaseService.refreshInProgressAndCompletedTasks();
		} else if (this._selectedSearchType == "location") {
			afterNextRender(this, this._refreshTasksByLocationService);
		}
	},

	_refreshUnassignedTasks: function () {
		if(this._selectedSearchType == 'task' || (this._recordId == '' && this._scanRouteActive)) {
			this.$.workTaskBaseService.refreshUnassignedTasks();
		} else if (this._selectedSearchType == "location") {
			afterNextRender(this, this._refreshTasksByLocationService);
		}
	},

	_refreshClosedTasks: function () {
		if(this._selectedSearchType == 'task' || (this._recordId == '' && this._scanRouteActive)) {
			this._taskSearch = null;
			this._taskSearch = "";
		} else if (this._selectedSearchType == "location") {
			afterNextRender(this, this._refreshTasksByLocationService);
		}
	},

	_refreshTasksByLocationService: function() {
		this.$.workTaskSearchByLocationService.refreshTasks(this._selectedSearchItem);
	},

	_handleInprogressAndCompletedRouteActive: function (e) {
		if (e.detail.active) {
			this._resetSort();
			this._disableMyClosed = true;
			afterNextRender(this, this._refreshInProgressAndCompletedTasks);
		}
	},

	_onUnassignedRouteActiveChange: function (unassignedRouteActive, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (unassignedRouteActive && online) {
			this._resetSort();
			this._disableMyClosed = true;
			afterNextRender(this, this._refreshUnassignedTasks);
		}
	},

	_onClosedRouteActiveChange: function (closedRouteActive, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (closedRouteActive && online) {
			this._resetSort();
			let selectedSearchItemId = this._selectedSearchItem ? this._selectedSearchItem._id : "";
			this.set('_disableMyClosed', (selectedSearchItemId != ""));
			afterNextRender(this, this._refreshClosedTasks);
		}
	},

	_computeShowOfflineMessage: function(selectedTab, selectedSearchType, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		var __dictionary__offlineMessage = "This search is not available in offline mode."
		if(selectedTab && selectedSearchType != "task") {
			this.set("offlineMessage", __dictionary__offlineMessage);
		}
		return (selectedTab != "unassignedTab" && selectedTab != "closedTab") ? (!online && selectedSearchType != "task") : false;
	},

	_computeShowListContent: function (showOfflineMessage) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		return !showOfflineMessage;
	},

	_computeShowClosedOfflineMessage: function (selectedTab, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return selectedTab == "closedTab" && !online;
	},

	_computeShowUnassignedOfflineMessage: function (selectedTab, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return selectedTab == "unassignedTab" && !online;
	},

	_computeShowTabContent: function (showClosedOfflineMessage, showUnassignedOfflineMessage) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		return !showClosedOfflineMessage && !showUnassignedOfflineMessage;
	},

	_setTaskSort: function (e) {
		var taskSortName = e.detail;
		if (taskSortName == "plannedStart") {
			this.set('_sortField', "plannedStart");
			this.set('_sortDesc', false);
			this.set('_sortType', "DATE_TIME");
		} else if (taskSortName == "priority") {
			this.set('_sortField', "priorityRanking");
			this.set('_sortDesc', false);
			this.set('_sortType', null);
		} else if (taskSortName == "status") {
			this.set('_sortField', "status");
			this.set('_sortDesc', false);
			this.set('_sortType', "STRING_WITH_ID");
		} else if (taskSortName == "location") {
			this.set('_sortField', "computedLocation");
			this.set('_sortDesc', false);
			this.set('_sortType', null);
		} else if (taskSortName == "newest") {
			this.set('_sortField', "createdDate")
			this.set('_sortDesc', true);
			this.set('_sortType', "DATE_TIME");
		}
	},

	_resetSort: function () {
		this.set('_sortField', "priorityRanking");
		this.set('_sortDesc', false);
		this.set('_sortType', "null");
		this.$.taskListSortBy.selected = "priority";
	},

	_onLayoutToggleTap: function () {
		this.$.inProgressTabContent.toggleLayout();
		this._resetSort();
	},

	_computeLayoutIcon: function (currentLayout) {
		return (currentLayout == "table") ? "ibm:tile-tiles-tileview" : "ibm:spreadsheet-listview";
	},

	_computeLayoutToggleButtonTooltip: function (currentLayout) {
		var __dictionary__currentLayoutTableTooltip = "Switch to card layout";
		var __dictionary__currentLayoutCardsTooltip = "Switch to table layout";
		return (currentLayout == "table") ? __dictionary__currentLayoutTableTooltip : __dictionary__currentLayoutCardsTooltip;
	},

	_computeFilterHidden: function (draftRouteActive, showListContent) {
		return draftRouteActive || !showListContent;
	},

	_computeSortHidden: function (currentLayout, showListContent) {
		return (currentLayout == "table") ? true : !showListContent;
	},

	_onLayoutChange: function (layout) {
		this._notifyResize();
	},

	_onTasksChange: function (myInProgressTasks, myCompletedTasks, myDraftTasks, myClosedTasks, unassignedTasks) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		this._notifyResize();
	},

	_notifyResize: function () {
		this.async(function () {
			this.notifyResize();
		});
	},

	_computeScroller: function (layout, tableScroller) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (tableScroller) {
			return (layout == "table") ? tableScroller : this;
		}
	},

	_computeHideToggle: function (_smallLayout, _mediumLayout) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		return _smallLayout ? _smallLayout : _mediumLayout;
	}

});