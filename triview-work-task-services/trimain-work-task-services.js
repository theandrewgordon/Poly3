/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../tricore-url/tricore-url.js";
import "../triplat-routing/triplat-routing.js";
import "../@polymer/iron-pages/iron-pages.js";
import { importJsPromise as TriplatDateUtilitiesReady } from "../triplat-date-utilities/triplat-date-utilities.js";
import { TriBlockViewResponsiveBehavior } from "../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-auth-check/triplat-auth-check.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "../triapp-task-list/triservice-work-task-search-by-asset.js";
import "../triapp-task-list/triservice-work-task-search-by-location.js";
import "../triview-work-task/triservice-app-location-context.js";
import "../triview-work-task/triservice-work-task.js";
import "../triview-work-task/triservice-work-task-actions.js";
import "../triview-work-task/triservice-time-log.js";
import "../triview-work-task/triservice-location.js";
import "../triview-work-task/triservice-asset.js";
import "../triview-work-task/triservice-procedure.js";
import "../triview-work-task/triservice-resource.js";
import "../triview-work-task/triservice-new-work-task.js";
import "../triview-work-task/tricomp-offline-config.js";
import "../triview-work-task/tricomp-fixed-alert.js";
import "../triplat-offline-manager/triplat-ds-offline.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "./tricomp-portal-icons.js";
import { TriroutesWorkTaskServices } from "./triroutes-work-task-services.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";
import "./tricomp-portal-services.js";
import "./tricomp-portal-item-tasks.js";
import "../triview-work-task/triapp-work-task.js";
import "../triview-locate/triapp-locate.js";

TriplatDateUtilitiesReady.then(() => {
	Polymer({
		_template: html`
			<style include="work-task-services-shared-app-layout-styles tristyles-theme">

					triplat-route-selector {
						overflow: auto;
						position: relative;
					}

					:host([_show-error]) triplat-route-selector {
						overflow: hidden;
					}

					.loading-indicator {
						--triplat-loading-indicator-clear-background: transparent;
					}

					.portal-page {
						@apply --layout-vertical;
					}

					.portal-content {
						@apply --layout-flex;
						@apply --layout-vertical;
					}

					#tasks {
						@apply --layout-flex;
						@apply --layout-vertical;
					}

					:host([small-screen-width]) tricomp-portal-item-tasks {
						overflow: auto;
					}
				
			</style>

			<tricore-url hidden="" raw-url="/p/web/serviceRequest" bind-url="{{_srUrl}}"></tricore-url>

			<triplat-ds id="currentUser" name="currentUser" data="{{_currentUser}}">
				<triplat-ds-offline mode="AUTOMATIC"></triplat-ds-offline>
			</triplat-ds>

			<triservice-work-task-base id="workTaskBaseService" model-and-view="triWorkTask" instance-id="-1" online="[[online]]">
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

			<triservice-app-location-context model-and-view="triAppLocationContext" instance-id="-1" online="[[online]]" current-user="[[_currentUser]]">
			</triservice-app-location-context>

			<!-- Check authorization for Work Task -->
			<triplat-auth-check app-name="workTask" auth="{{workTaskAuth}}" on-check-complete="_handlePortalItemForTasks">
			</triplat-auth-check>

			<triplat-route name="workTask" on-route-active="_onWorkTaskRouteActive"></triplat-route>
			<triplat-route name="locate" on-route-active="_onLocateRouteActive"></triplat-route>
			
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
					<div class="portal-page" route="workTaskServices" default-route="">
						<div class="portal-content">
							<dom-if if="[[_portalServicesLoaded]]">
								<template>
									<tricomp-portal-services id="services" hidden\$="[[smallScreenWidth]]" online="[[online]]" work-task-auth="[[workTaskAuth]]">
									</tricomp-portal-services>
								</template>
							</dom-if>
							<dom-if if="[[_portalItemTasksLoaded]]">
								<template>
									<tricomp-portal-item-tasks id="tasks" downloading="[[_downloading]]" on-open-task="_handleOpenTask" online="[[online]]">
									</tricomp-portal-item-tasks>
								</template>
							</dom-if>
							<dom-if if="[[_portalServicesLoaded]]">
								<template>
									<tricomp-portal-services id="smallScreenServices" hidden\$="[[!smallScreenWidth]]" online="[[online]]" work-task-auth="[[workTaskAuth]]">
									</tricomp-portal-services>
								</template>
							</dom-if>
						</div>
					</div>

					<div route="locate">
						<dom-if if="[[_locateAppLoaded]]">
							<template>
								<triapp-locate current-user="[[_currentUser]]" home-app="workTaskServices">
								</triapp-locate>
							</template>
						</dom-if>
					</div>

					<div route="workTask">
						<dom-if if="[[_workTaskAppLoaded]]">
							<template>
								<triapp-work-task id="workTask" online="[[online]]">
								</triapp-work-task>
							</template>
						</dom-if>
					</div>

					<tricomp-offline-config id="offlineConfig" route="portalOfflineSettings" online="{{online}}" uploading="{{_uploading}}" downloading="{{_downloading}}" disable-offline="[[disableOffline]]" show-has-pending-actions="{{_showHasPendingActions}}" show-error="{{_showError}}" current-user="[[_currentUser]]" busy="{{_offlineBusy}}" on-reload-app="_handleReloadApp">
					</tricomp-offline-config>
				</iron-pages>
			</triplat-route-selector>
		`,

		is: "trimain-work-task-services",

		behaviors: [
			TriBlockViewResponsiveBehavior
		],

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

			_currentUser: {
				type: Object
			},

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

			_srUrl: {
				type: String
			},

			_portalServicesLoaded: Boolean,
			_portalItemTasksLoaded: Boolean,
			_locateAppLoaded: Boolean,
			_workTaskAppLoaded: Boolean
		},

		listeners: {
			"service-item-tapped": "_handleServiceItemTapped"
		},

		ready: function() {
			afterNextRender(this, this._loadPortalItems);
		},

		_loadPortalItems: function() {
			this.set("_portalServicesLoaded", true);
		},

		_handlePortalItemForTasks: function(e) {
			this._loadPortalItem(e.detail, "_portalItemTasksLoaded");
		},

		_loadPortalItem: function(detail, portalItemLoadedName) {
			if(this._hasPermission(detail)) {
				afterNextRender(this, function() {
					this.async(function() {
						this.set(portalItemLoadedName, true);
					});
				});
			}
		},

		_hasPermission: function(detail) {
			return detail.hasLicense && detail.canRead;
		},

		_handleServiceItemTapped: function(e) {
			var serviceType = e.detail.serviceType;
			if (serviceType === "workTask") {
				this._loadWorkTaskApp();
				afterNextRender(this, () => {
					TriroutesWorkTaskServices.getInstance().openNewTask("-1");
				});
			} else if (serviceType === "serviceRequest") {
				var currentApp = encodeURIComponent(window.location.href.split("/p/web/")[1]);

				var url = this._srUrl;
				url += "?homeApp=" + currentApp;
				url += "#!/new/-1";

				this.async(function() {
					location.assign(url);
				});
			} else if(serviceType === "locate") {
				TriroutesWorkTaskServices.getInstance().navigateLocate();
			}
		},

		_onLocateRouteActive: function(e) {
			if (e.detail.active) {
				this.set("_locateAppLoaded", true);
			}
		},

		_onWorkTaskRouteActive: function(e) {
			if (e.detail.active) {
				this._loadWorkTaskApp();
			}
		},

		_loadWorkTaskApp: function() {
				this.set("_workTaskAppLoaded", true);
		},

		_handleOpenTask: function(e) {
			this._loadWorkTaskApp();
			afterNextRender(this, () => {
				if (e.detail.taskAssignmentStatusENUS === "Unassigned") {
					TriroutesWorkTaskServices.getInstance().openTask(e.detail.taskId, true);
				} else if (e.detail.taskStatus === "Draft") {
					TriroutesWorkTaskServices.getInstance().openNewTask(e.detail.taskId);
				} else {
					TriroutesWorkTaskServices.getInstance().openTask(e.detail.taskId);
				}
			});
		},

		_handleReloadApp: function() {
			TriroutesWorkTaskServices.getInstance().navigateHome(true);
			location.reload();
		},

		importMeta: getModuleUrl("triview-work-task-services/trimain-work-task-services.js")
	});
});