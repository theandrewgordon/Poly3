/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-routing/triplat-routing.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-auth-check/triplat-auth-check.js";
import { importJsPromise as TriplatDateUtilitiesReady } from "../triplat-date-utilities/triplat-date-utilities.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "../triapp-task-list/triservice-work-task-search-by-asset.js";
import "../triapp-task-list/triservice-work-task-search-by-location.js";
import "../@polymer/iron-pages/iron-pages.js";
import "./triservice-app-location-context.js";
import "./triservice-asset.js";
import "./triservice-location.js";
import "./triservice-procedure.js";
import "./triservice-resource.js";
import "./triservice-work-task.js";
import "./triservice-new-work-task.js";
import "./triservice-work-task-actions.js";
import "./triservice-time-log.js";
import "./tricomp-offline-config.js";
import "./tricomp-fixed-alert.js";
import "./tristyles-work-task-app.js";
import { TriroutesWorkTaskApp } from "./triroutes-work-task-app.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";
import "./tripage-task-inbox.js";
import "./tripage-new-task.js";
import "./tripage-task.js";

TriplatDateUtilitiesReady.then(() => {
	Polymer({
		_template: html`
			<style include="work-task-shared-app-layout-styles work-task-shared-page-styles tristyles-theme">

					triplat-route-selector {
						overflow: auto;
						position: relative;
					}

					:host([_show-error]) triplat-route-selector {
						overflow: hidden;
					}
				
			</style>

			<triservice-work-task-base id="workTaskBaseService" small-layout="{{_smallLayout}}" model-and-view="triWorkTask" instance-id="-1" current-user="{{_currentUser}}" online="[[online]]">
			</triservice-work-task-base>

			<triservice-work-task-search-by-asset id="workTaskSearchByAssetService" model-and-view="triWorkTask" instance-id="-1">
			</triservice-work-task-search-by-asset>

			<triservice-work-task-search-by-location id="workTaskSearchByLocationService" model-and-view="triWorkTask" instance-id="-1">
			</triservice-work-task-search-by-location>

			<triservice-work-task id="workTaskService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
			</triservice-work-task>

			<triservice-work-task-actions id="workTaskActionsService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
			</triservice-work-task-actions>
		
			<triservice-new-work-task id="newWorkTaskService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]" current-user="[[_currentUser]]">
			</triservice-new-work-task>

			<triservice-time-log id="timeLogService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
			</triservice-time-log>

			<triservice-asset id="assetService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
			</triservice-asset>

			<triservice-location id="locationService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
			</triservice-location>

			<triservice-procedure id="procedureService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]" current-user="[[_currentUser]]">
			</triservice-procedure>

			<triservice-resource id="resourceService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]" current-user="[[_currentUser]]">
			</triservice-resource>

			<triservice-app-location-context model-and-view="triAppLocationContext" instance-id="-1" online="[[online]]">
			</triservice-app-location-context>
			
			<triplat-auth-check app-name="workTask" auth="{{_workTaskAuth}}"></triplat-auth-check>

			<triplat-route name="taskInbox" active="{{_taskInboxPageLoaded}}"></triplat-route>
			<triplat-route name="newTask" active="{{_newTaskPageLoaded}}"></triplat-route>
			<triplat-route name="task" active="{{_taskPageLoaded}}"></triplat-route>

			<triplat-loading-indicator class="loading-indicator" show="[[_offlineBusy]]">
			</triplat-loading-indicator>

			<template is="dom-if" if="[[!disableOffline]]">
				<tricomp-fixed-alert warning="" title="Running in offline mode" hidden="[[online]]" aria-label="Running in offline mode"></tricomp-fixed-alert>
				<tricomp-fixed-alert warning="" title="Download in progress..." hidden="[[!_downloading]]" aria-label="Download in progress"></tricomp-fixed-alert>
				<tricomp-fixed-alert warning="" title="Pending actions in offline queue..." hidden="[[!_showHasPendingActions]]" aria-label="Pending actions in offline queue">
				</tricomp-fixed-alert>
				<tricomp-fixed-alert warning="" title="Upload in progress..." hidden="[[!_uploading]]" aria-label="Upload in progress"></tricomp-fixed-alert>
				<tricomp-fixed-alert error="" title="Upload of a pending action failed" hidden="[[!_showError]]" aria-label="Upload of a pending action failed"></tricomp-fixed-alert>
			</template>

			<triplat-route-selector id="routeSelector">
				<iron-pages>
					<div route="taskInbox">
						<dom-if if="[[_computeLoaded(_taskInboxPageLoaded, _offlineLoaded)]]">
							<template>
								<tripage-task-inbox id="inboxPage" downloading="[[_downloading]]" default-route="" online="[[online]]" current-user="[[_currentUser]]" embedded="[[embedded]]">
								</tripage-task-inbox>
							</template>
						</dom-if>
					</div>

					<div route="newTask">
						<dom-if if="[[_computeLoaded(_newTaskPageLoaded, _offlineLoaded)]]">
							<template>
								<tripage-new-task id="newTaskPage" online="[[online]]" current-user="[[_currentUser]]" auth="[[_workTaskAuth]]">
								</tripage-new-task>
							</template>
						</dom-if>
					</div>

					<div route="task">
						<dom-if if="[[_computeLoaded(_taskPageLoaded, _offlineLoaded)]]">
							<template>
								<tripage-task id="taskPage" online="[[online]]" current-user="[[_currentUser]]" auth="[[_workTaskAuth]]">
								</tripage-task>
							</template>
						</dom-if>
					</div>

					<tricomp-offline-config id="offlineConfig" small-layout="[[_smallLayout]]" route="offlineSettings" on-online-changed="_handleOnlineChanged" uploading="{{_uploading}}" downloading="{{_downloading}}" disable-offline="[[disableOffline]]" show-has-pending-actions="{{_showHasPendingActions}}" show-error="{{_showError}}" current-user="[[_currentUser]]" busy="{{_offlineBusy}}" on-reload-app="_handleReloadApp">
					</tricomp-offline-config>
				</iron-pages>
			</triplat-route-selector>
		`,

		is: "trimain-work-task",

		properties: {
			online: {
				type: Boolean,
				value: true,
				notify: true
			},

			disableOffline: {
				type: Boolean,
				value: false
			},

			embedded: {
				type: Boolean,
				value: false
			},

			_currentUser: Object,

			_uploading: {
				type: Boolean,
				value: false
			},

			_downloading: {
				type: Boolean,
				value: false
			},

			_showHasPendingActions: {
				type: Boolean,
				value: false
			},

			_offlineBusy: {
				type: Boolean,
				value: false
			},

			_showError: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			_workTaskAuth: {
				type: Object
			},

			_taskInboxPageLoaded: Boolean,
			_newTaskPageLoaded: Boolean,
			_taskPageLoaded: Boolean,
			_offlineLoaded: Boolean,

			_smallLayout: {
				type: Boolean,
				notify: true,
				reflectToAttribute: true
			}
			
		},

		_handleOnlineChanged: function(e) {
			if (this.disableOffline === false) {
				this.online = e.detail.value;
			}
			this.set("_offlineLoaded", true);
		},

		_handleReloadApp: function() {
			TriroutesWorkTaskApp.getInstance().navigateHome(true);
			location.reload();
		},

		_computeLoaded: function(pageLoaded, offlineLoaded) {
			return pageLoaded && offlineLoaded;
		},

		importMeta: getModuleUrl("triview-work-task/trimain-work-task.js")
	});
});