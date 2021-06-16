/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-routing.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../@polymer/iron-selector/iron-selector.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "../triapp-task-list/triservice-work-task-base.js";
import { TriWorkTaskTimeUtilitiesBehaviorImpl, TriWorkTaskTimeUtilitiesBehavior } from "./tribehav-work-task-time-utilities.js";
import { TriroutesTask } from "./triroutes-task.js";
import { TriroutesTaskDetail } from "./triroutes-task-detail.js";
import "./triservice-asset.js";
import "./triservice-location.js";
import "./triservice-procedure.js";
import "./triservice-time-log.js";
import "./triservice-work-task.js";
import "./tristyles-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import "./tricomp-task-detail-description.js";
import "./tricomp-task-detail-priority.js";
import "./tricomp-task-detail-actions.js";
import "./tricomp-task-detail-resolution.js";
import "./tricomp-location-detail-card.js";
import "./tricomp-task-detail-time.js";
import "./tricomp-task-detail-requests.js";
import "./tricomp-task-detail-people.js";
import "./tricomp-task-detail-assets.js";
import "./tricomp-task-detail-locations.js";
import "./tricomp-task-detail-comments.js";
import "./tricomp-task-detail-materials.js";
import "./tricomp-task-detail-procedures.js";

Polymer({
	_template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					background-color: var(--ibm-neutral-2);
					color: var(--tri-primary-color-100);
				}
				:host([_small-layout]) {
					overflow: auto;
					padding-bottom: 51px;
				}

				:host([_small-layout][_section-opened]) {
					overflow: hidden;
				}

				.main-container {
					padding: 20px 30px;
				}
				:host([_small-layout]) .main-container {
					padding: 15px 0 0 0;
				}

				.general-style {
					margin-top: 15px;
				}

				:host([_small-layout]) .general-mobile-style {
					padding-left: 15px;
					padding-right: 15px;
				}

				:host([_small-layout]) tricomp-task-detail-description {
					padding-top: 15px !important;
					margin-top: 0px
				}

				.task-header {
					@apply --layout-center;
					@apply --layout-horizontal;
					font-weight: 300;
					margin: 0;
				}

				label.header-label {
					color: var(--ibm-gray-70) !important;
					padding-bottom: 0;
				}

				.header-content {
					@apply --layout-flex;
					min-width: 0;
				}

				.task-name {
					color: var(--ibm-gray-70);
					font-weight: bold;
				}
				
				:host([dir="ltr"]) .header-content {
					padding-right: 15px;
				}

				:host([dir="rtl"]) .header-content {
					padding-left: 15px;
				}

				.header-content > div {
					padding: 2px 0;
				}

				.task-priority-status {
					@apply --layout-horizontal;
				}
				:host(:not([_small-layout])) .task-priority-status {
					@apply --layout-center;
				}
				:host([_small-layout]) .task-priority-status {
					@apply --layout-vertical;
					padding: 0px;
				}

				:host([_small-layout]) .task-priority-status > div {
					padding: 0 15px;
				}

				.status-readonly {
					color: var(--tri-danger-color);
				}

				.priority-divider {
					height: 23px;
					margin: 0 10px;
				}

				:host([_small-layout]) tricomp-task-detail-priority {
					border-bottom: 1px solid var(--ibm-gray-10);
					border-top: 1px solid var(--ibm-gray-10);
					margin-top: 15px;
				}

				:host(:not([_small-layout])) .task-location-classification {
					@apply --layout-center;
					@apply --layout-horizontal;
				}
				:host([_small-layout]) .task-location-classification {
					@apply --layout-vertical;
				}

				.primary-location {
					@apply --layout-horizontal;
					@apply --layout-center;
				}
				:host(:not([_small-layout])) .primary-location {
					white-space: nowrap;
				}

				.location-divider {
					@apply --layout-self-stretch;
					margin-right: 15px;
				}
				:host([_small-layout]) .location-divider {
					margin-top: 15px;
				}

				.classification-box {
					@apply --layout-flex;
				}

				tricomp-task-detail-time {
					margin-bottom: 15px;
					margin-top: 15px;
				}

				.last-updated-container {
					padding: 15px 0;
					border-top: 1px solid var(--ibm-gray-10);
				}
				:host([_small-layout]) .last-updated-container {
					margin-left: 15px;
					margin-right: 15px;
				}

				.last-updated-container span {
					color: var(--tri-primary-color-100);
				}

				#locationDetailCard {
					--tricomp-location-detail-card-divider-icon-divider: {
						display: none;
					}
				}
			
		</style>

		<triroutes-task-detail id="taskDetailRoutes"></triroutes-task-detail>

		<triplat-route name="task" params="{{_taskParams}}" on-route-active="_onRouteActive" active="{{_routeActive}}"></triplat-route>

		<triservice-work-task-base id="workTaskBaseService" loading-tasks="{{_loadingTasks}}" small-layout="{{_smallLayout}}"></triservice-work-task-base>

		<triservice-work-task id="workTaskService" loading="{{_loadingWorkTaskService}}"></triservice-work-task>

		<triservice-location id="locationService" primary-location="{{_primaryLocation}}" loading-locations="{{_loadingLocations}}"></triservice-location>

		<triservice-asset id="assetService"></triservice-asset>

		<triservice-procedure id="procedureService" procedures-count="{{_proceduresCount}}"></triservice-procedure>

		<triservice-time-log loading-time-log-action="{{_loadingTimeLogAction}}" loading-timer-action="{{_loadingTimerAction}}"></triservice-time-log>

		<triservice-resource id="resourceService"></triservice-resource>

		<triplat-loading-indicator class="loading-indicator loading-indicator-fixed" show="[[_loading]]"></triplat-loading-indicator>

		<div class="main-container">
			<triplat-route-selector>
				<iron-selector id="detailSelector" selected-attribute="opened" activate-event="">

					<div class="task-content" route="taskDetailHome" default-route="">
						<div class="task-header general-style general-mobile-style tri-h2">
							<div class="header-content">
								<div class="tri-h3">[[task.taskID]]</div>
								<div class="tri-h2 task-name">[[task.taskName]]</div>
							</div>
							
							<dom-if if="[[_routeActive]]">
								<template>
									<tricomp-task-detail-actions task="[[task]]" small-layout="[[_smallLayout]]" online="[[online]]" hidden\$="[[_computeActionsHidden(_sectionOpened, _smallLayout, task, readonly)]]" auth="[[auth]]"></tricomp-task-detail-actions>
								</template>
							</dom-if>
						</div>

						<div class="task-priority-status general-style general-mobile-style">
							<template is="dom-if" if="[[task.taskType.value]]" restamp="">
								<div><label class="header-label">Type: </label>[[task.taskType.value]]</div>

								<div class="divider priority-divider" hidden\$="[[_smallLayout]]"></div>
							</template>

							<div><label class="header-label">Status: </label><span class\$="[[_computeStatusClass(task)]]">[[task.status.value]]</span></div>

							<div class="divider priority-divider" hidden\$="[[_smallLayout]]"></div>

							<dom-if if="[[_routeActive]]">
								<template>
									<tricomp-task-detail-priority task="[[task]]" small-layout="[[_smallLayout]]" priority="[[task.taskPriority]]" priority-en-us="[[task.taskPriorityENUS]]" status-en-us="[[task.statusENUS]]" readonly="[[readonly]]">
									</tricomp-task-detail-priority>
								</template>
							</dom-if>
						</div>

						<div class="task-location-classification general-style general-mobile-style" hidden\$="[[!_displayLocationClassification(_primaryLocation, task.serviceClass.value, task.requestClass.value)]]">
							<template is="dom-if" if="[[_primaryLocation.name]]">
								<div class="primary-location">
									<dom-if if="[[_routeActive]]">
										<template>
											<tricomp-location-detail-card id="locationDetailCard" hide-procedure-count="" location="[[_primaryLocation]]"></tricomp-location-detail-card>
										</template>
									</dom-if>
									<div class="icon-container" hidden\$="[[!_displayLocationIcon(_primaryLocation, online)]]">
										<paper-icon-button class="location-icon" primary="" icon="ibm-glyphs:location" on-tap="_navigateToLocationDetails" alt="Open floor plan"></paper-icon-button>
									</div>
								</div>
							</template>

							<div class="divider location-divider" hidden\$="[[!_displayLocationDivider(_primaryLocation, task.serviceClass.value, task.requestClass.value)]]"></div>

							<div class="classification-box" hidden\$="[[!_displayClassification(task.serviceClass.value, task.requestClass.value)]]">
								<label>Classification</label>
								<div hidden\$="[[!task.serviceClass.value]]">[[task.serviceClass.value]]</div>
								<div hidden\$="[[!task.requestClass.value]]">[[task.requestClass.value]]</div>
							</div>
						</div>

						<dom-if if="[[_routeActive]]">
							<template>
								<tricomp-task-detail-description class="general-style general-mobile-style" task="[[task]]" hidden\$="[[_hideDescription(task.serviceClass.value, task.requestClass.value, task.description, task.requestedByName)]]">
								</tricomp-task-detail-description>
								<tricomp-task-detail-resolution class="general-style" small-layout="{{_smallLayout}}" task="{{task}}" readonly="[[readonly]]" hidden\$="[[!task.resolutionDescription]]"></tricomp-task-detail-resolution>
							</template>
						</dom-if>
					</div>

					<dom-if if="[[_routeActive]]">
						<template>
							<tricomp-task-detail-time route="taskTimeLogs" small-layout="[[_smallLayout]]" current-user="[[currentUser]]" readonly="[[readonly]]" task="[[task]]" opened="{{_timeLogsOpened}}" general-loading="[[_loading]]" on-open-section="_handleOpenTaskTimeLogs">
							</tricomp-task-detail-time>

							<tricomp-task-detail-requests route="taskRequests" small-layout="[[_smallLayout]]" class="general-mobile-style" task="[[task]]" online="[[online]]" opened="{{_requestsOpened}}" general-loading="[[_loading]]" on-open-section="_handleOpenTaskRequests">
							</tricomp-task-detail-requests>

							<tricomp-task-detail-locations route="taskLocations" small-layout="[[_smallLayout]]" class="general-mobile-style" task="[[task]]" online="[[online]]" opened="{{_locationsOpened}}" general-loading="[[_loading]]" on-open-section="_handleOpenTaskLocations">
							</tricomp-task-detail-locations>

							<tricomp-task-detail-assets route="taskAssets" small-layout="[[_smallLayout]]" class="general-mobile-style" task="[[task]]" online="[[online]]" readonly="[[readonly]]" opened="{{_assetsOpened}}" general-loading="[[_loading]]" on-open-section="_handleOpenTaskAssets">
							</tricomp-task-detail-assets>

							<tricomp-task-detail-procedures id="taskDetailProcedures" small-layout="[[_smallLayout]]" route="taskProcedures" class="general-mobile-style" task="[[task]]" online="[[online]]" opened="{{_proceduresOpened}}" count="[[_proceduresCount]]" general-loading="[[_loading]]" on-open-section="_handleOpenTaskProcedures">
							</tricomp-task-detail-procedures>

							<tricomp-task-detail-materials route="taskMaterials" small-layout="[[_smallLayout]]" class="general-mobile-style" current-user="[[currentUser]]" task="[[task]]" readonly="[[readonly]]" online="[[online]]" opened="{{_materialsOpened}}" general-loading="[[_loading]]" on-open-section="_handleOpenTaskMaterials">
							</tricomp-task-detail-materials>

							<tricomp-task-detail-people route="taskPeople" small-layout="[[_smallLayout]]" class="general-mobile-style" task="[[task]]" opened="{{_peopleOpened}}" general-loading="[[_loading]]" on-open-section="_handleOpenTaskPeople">
							</tricomp-task-detail-people>

							<tricomp-task-detail-comments route="taskComments" small-layout="[[_smallLayout]]" class="general-mobile-style" task="[[task]]" current-user="[[currentUser]]" online="[[online]]" opened="{{_commentsOpened}}" readonly="[[readonly]]" general-loading="[[_loading]]" on-open-section="_handleOpenTaskComments">
							</tricomp-task-detail-comments>
						</template>
					</dom-if>
				</iron-selector>
			</triplat-route-selector>

			<div class="last-updated-container">
				<label>Last updated:</label> 
				<span>[[_convertDateAndTime(task.modifiedDateTime, currentUser, currentUser._DateTimeFormat)]]</span>
			</div>
		</div>
	`,

	is: "tripage-task-detail",

	behaviors: [
		TriComputeLoadingBehavior,
		TriWorkTaskTimeUtilitiesBehavior,
		TriDirBehavior
	],

	properties: {
		currentUser: Object,

		readonly: {
			type: Boolean,
			reflectToAttribute: true
		},

		task: Object,

		auth: Object,

		online: {
			type: Boolean
		},

		_loadingLocations: {
			type: Boolean
		},

		_loadingTasks: {
			type: Boolean
		},

		_loadingTimeLogAction: {
			type: Boolean
		},

		_loadingTimerAction: {
			type: Boolean
		},

		_loadingWorkTaskService: {
			type: Boolean
		},

		_primaryLocation: {
			type: Object
		},

		_taskParams: {
			type: Object
		},

		_proceduresCount: {
			type: Number,
			notify: true
		},

		_sectionOpened: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		_smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		},

		_timeLogsOpened: Boolean,
		_requestsOpened: Boolean,
		_locationsOpened: Boolean,
		_assetsOpened: Boolean,
		_proceduresOpened: Boolean,
		_materialsOpened: Boolean,
		_peopleOpened: Boolean,
		_commentsOpened: Boolean,
		_routeActive: Boolean
	},

	observers: [
		"_setValidLoadings(_loadingTasks, _loadingLocations, _loadingWorkTaskService, _loadingTimeLogAction, _loadingTimerAction)",
		"_computeTaskDetailOpen(_timeLogsOpened, _requestsOpened, _locationsOpened, _assetsOpened, _proceduresOpened, _materialsOpened, _peopleOpened, _commentsOpened)",
		"closedProcedures(_proceduresOpened, _routeActive, task)"
	],

	closedProcedures:function(proceduresOpened, routeActive, task) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		const taskDetailProcedures = this.shadowRoot.querySelector("#taskDetailProcedures");
		if (taskDetailProcedures && !proceduresOpened && routeActive && task) {
			taskDetailProcedures.emptySearchProcedures(task._id);
		}
	},

	_hideDescription: function(serviceClass, requestClass, description, requestBy) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return !(serviceClass || requestClass || description || requestBy);
	},

	_handleOpenTaskTimeLogs: function(e) {
		this.$.taskDetailRoutes.openTaskTimeLogs(this.task._id, !this._smallLayout);
	},

	_handleOpenTaskRequests: function(e) {
		this.$.taskDetailRoutes.openTaskRequests(this.task._id, !this._smallLayout);
	},

	_handleOpenTaskLocations: function(e) {
		this.$.taskDetailRoutes.openTaskLocations(this.task._id, !this._smallLayout);
	},

	_handleOpenTaskAssets: function(e) {
		this.$.taskDetailRoutes.openTaskAssets(this.task._id, !this._smallLayout);
	},

	_handleOpenTaskProcedures: function(e) {
		if(this._proceduresCount == 1){
			this.shadowRoot.querySelector("#taskDetailProcedures")._openProcedureDetails(this.task);
		}
		else{
		this.$.taskDetailRoutes.openTaskProcedures(this.task._id, !this._smallLayout);}
	},

	_handleOpenTaskMaterials: function(e) {
		this.$.taskDetailRoutes.openTaskMaterials(this.task._id, !this._smallLayout);
	},

	_handleOpenTaskPeople: function(e) {
		this.$.taskDetailRoutes.openTaskPeople(this.task._id, !this._smallLayout);
	},

	_handleOpenTaskComments: function(e) {
		this.$.taskDetailRoutes.openTaskComments(this.task._id, !this._smallLayout);
	},

	_onRouteActive: function(e) {
		afterNextRender(this, function() {
			this.$.workTaskBaseService.refreshTaskTimeLogs(this._taskParams.taskId);
			this.$.workTaskService.countRequests(this._taskParams.taskId);
			this.$.resourceService.countResources(this._taskParams.taskId);
			this.$.assetService.countTaskAssets(this._taskParams.taskId);
			this.$.locationService.refreshTaskLocations(this._taskParams.taskId);
			this.$.workTaskService.countTaskComments(this._taskParams.taskId);
			this.$.workTaskService.countMaterials(this._taskParams.taskId);
			this.$.procedureService.refreshTaskProcedures(this._taskParams.taskId);
		});
	},

	_navigateToLocationDetails: function(e) {
		e.stopPropagation();
		TriroutesTask.getInstance().openTaskLocationDetails(this._primaryLocation._id);
	},

	_displayLocationClassification: function(primaryLocation, serviceClass, requestClass) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return (primaryLocation && primaryLocation.name) || (serviceClass != "") || (requestClass != "");
	},

	_displayLocationDivider: function(primaryLocation, serviceClass, requestClass) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return (primaryLocation && primaryLocation.name) && ((serviceClass != "") || (requestClass != ""));
	},

	_displayClassification: function(serviceClass, requestClass) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return (serviceClass != "") || (requestClass != "");
	},

	_displayLocationIcon: function(primaryLocation, online) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return primaryLocation && primaryLocation.hasGraphic && online;
	},

	_computeTaskDetailOpen: function(timeLogsOpened, requestsOpened, locationsOpened, assetsOpened, proceduresOpened, materialsOpened, peopleOpened, commentsOpened) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		this._sectionOpened = timeLogsOpened || requestsOpened || locationsOpened || assetsOpened || proceduresOpened || materialsOpened || peopleOpened || commentsOpened;
	},

	_computeActionsHidden: function(sectionOpened, _smallLayout, task, readonly) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return sectionOpened && _smallLayout || readonly && task && task.assignmentStatusENUS != "Unassigned";
	},

	_computeStatusClass: function(task) {
		return (!task || !task.statusENUS ||
			task.statusENUS.value === "Closed" || 
			task.statusENUS.value === "Review In Progress" ||
			task.statusENUS.value === "Routing In Progress") ? "status-readonly" : "";
	},

	importMeta: getModuleUrl("triview-work-task/tripage-task-detail.js")
});