/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-routing/triplat-routing.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "./triroutes-task.js";
import "./tripage-task-detail.js";
import "./tristyles-work-task-app.js";
import { TriroutesWorkTaskApp } from "./triroutes-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import "./tripage-location-details.js";
import "./tripage-asset-details.js";
import "./tripage-procedure-details.js";
import "./tripage-step-details.js";
import "./triservice-asset.js";
import "../triapp-task-list/tripage-bar-code-scanner.js";
import "../triapp-task-list/tripage-qr-code-scanner.js";

Polymer({
    _template: html`
		<style include="work-task-shared-app-layout-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
				}
			
		</style>

		<triservice-work-task-base id="workTaskBaseService" small-layout="{{smallLayout}}" on-my-task-changed="_handleTaskChanged" on-unassigned-task-changed="_handleTaskChanged"></triservice-work-task-base>

		<triservice-asset asset-lookup-search="[[_scannedData]]"></triservice-asset>

		<triroutes-task on-location-detail-route-active-changed="_onLocationDetailRouteActive" on-asset-details-route-active-changed="_onAssetDetailsRouteActive" on-procedure-details-route-active-changed="_onProcedureDetailsRouteActive" on-step-details-route-active-changed="_onStepDetailsRouteActive"
			on-task-detail-bar-code-route-active-changed="_onTaskDetailBarCodePageRouteActive" on-task-detail-qr-code-route-active-changed="_onTaskDetailQrCodePageRouteActive">
		</triroutes-task>
		<triplat-route name="task" on-route-active="_onRouteActive" params="{{_taskParams}}"></triplat-route>

		<triplat-route-selector>
			<iron-pages>
				<tripage-task-detail route="taskDetail" default-route="" current-user="[[currentUser]]" readonly="[[_readonly]]" task="[[_task]]" online="[[online]]" auth="[[auth]]">
				</tripage-task-detail>

				<div route="locationDetails">
					<dom-if if="[[_locationDetailsPageLoaded]]">
						<template>
							<tripage-location-details current-user="[[currentUser]]" task="[[_task]]" online="[[online]]"></tripage-location-details>
						</template>
					</dom-if>
				</div>

				<div route="assetDetails">
					<dom-if if="[[_assetDetailsPageLoaded]]">
						<template>
							<tripage-asset-details current-user="[[currentUser]]" task="[[_task]]" online="[[online]]"></tripage-asset-details>
						</template>
					</dom-if>
				</div>

				<div route="procedureDetails">
					<dom-if if="[[_procedureDetailsPageLoaded]]">
						<template>
							<tripage-procedure-details small-layout="[[smallLayout]]" current-user="[[currentUser]]" readonly="[[_readonly]]" task="[[_task]]" online="[[online]]"></tripage-procedure-details>
						</template>
					</dom-if>
				</div>
						
				<div route="stepDetails">
					<dom-if if="[[_stepDetailsPageLoaded]]">
						<template>
							<tripage-step-details small-layout="[[smallLayout]]" current-user="[[currentUser]]" readonly="[[_readonly]]" task="[[_task]]"></tripage-step-details>
						</template>
					</dom-if>
				</div>

				<div route="taskDetailBarCodeScan">
					<dom-if if="[[_taskDetailBarCodePageLoaded]]">
						<template>
							<tripage-bar-code-scanner id="taskDetailBarCodeScan" route="taskDetailBarCodeScan" route-active="[[_taskDetailBarCodeRouteActive]]" scanned-data="{{_scannedData}}" small-layout="[[smallLayout]]"></tripage-bar-code-scanner>
						</template>
					</dom-if>
				</div>

				<div route="taskDetailQrCodeScan">
					<dom-if if="[[_taskDetailQrCodePageLoaded]]">
						<template>
							<tripage-qr-code-scanner id="taskDetailQrCodeScan" route="taskDetailQrCodeScan" route-active="[[_taskDetailQrCodeRouteActive]]" scanned-data="{{_scannedData}}" small-layout="[[smallLayout]]"></tripage-qr-code-scanner>
						</template>
					</dom-if>
				</div>

			</iron-pages>
		</triplat-route-selector>
	`,

    is: "tripage-task",

    properties: {
		currentUser: Object,

		online: {
			type: Object,
			value: true,
			observer: "_handleOnlineChanged"
		},

		auth: Object,
		
		_task: {
			type: Object
		},

		_readonly: {
			type: Boolean,
			value: false,
			computed: "_isReadonly(_task, auth)"
		},

		_taskParams: {
			type: Object
		},

		_locationDetailsPageLoaded: Boolean,
		_assetDetailsPageLoaded: Boolean,
		_procedureDetailsPageLoaded: Boolean,
		_stepDetailsPageLoaded: Boolean,
		_taskDetailBarCodePageLoaded: Boolean,
		_taskDetailQrCodePageLoaded: Boolean,

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		},
		_taskDetailBarCodeRouteActive: Boolean,
		_taskDetailQrCodeRouteActive: Boolean,
		_scannedData: String
		
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, this._refreshTask);
		}
	},

    _onLocationDetailRouteActive: function(e) {
		if (e.detail.value) {
			afterNextRender(this, function() {
				this.set("_locationDetailsPageLoaded", true);
			});
		}
	},

    _onAssetDetailsRouteActive: function(e) {
		if (e.detail.value) {
			afterNextRender(this, function() {
				this.set("_assetDetailsPageLoaded", true);
			});
		}
	},

    _onProcedureDetailsRouteActive: function(e) {
	   if (e.detail.value) {
		   afterNextRender(this, function() {
				 this.set("_procedureDetailsPageLoaded", true);
		   });
	   }
   },

    _onStepDetailsRouteActive: function(e) {
	   if (e.detail.value) {
		   afterNextRender(this, function() {
				 this.set("_stepDetailsPageLoaded", true);
		   });
	   }
   },

	_onTaskDetailBarCodePageRouteActive: function(e) {
		const active = e.detail.value;
		this.set('_taskDetailBarCodeRouteActive', active);
		afterNextRender(this, function() {
			this.set("_taskDetailBarCodePageLoaded", active);
		});
	},

	_onTaskDetailQrCodePageRouteActive: function(e) {
		const active = e.detail.value;
		this.set('_taskDetailQrCodeRouteActive', active)
		afterNextRender(this, function() {
			this.set("_taskDetailQrCodePageLoaded", active);
		});
	},

    _refreshTask: function() {
		var promise = null;
		if (this._taskParams.assigned == "assigned") {
			promise = this.$.workTaskBaseService.refreshTask(this._taskParams.taskId, true);
		} else {
			promise = this.$.workTaskBaseService.refreshUnassignedTask(this._taskParams.taskId, true);
		}
		return promise.then(function(task) {
			this._task = task;
			if (!task || !task._id) {
				TriroutesWorkTaskApp.getInstance().navigateHome();
			}
		}.bind(this));
	},

    _handleTaskChanged: function(e) {
		this._task = e.detail.value;
	},

    _handleOnlineChanged: function(newOnline, oldOnline) {
		if (oldOnline && !newOnline && this._task && (this._task.assignmentStatusENUS === "Unassigned" || this._task.statusENUS.value === "Closed")) {
			TriroutesWorkTaskApp.getInstance().navigateHome();
		}
	},

    _isReadonly: function(task, auth) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !task || !task.statusENUS ||
			task.assignmentStatusENUS === "Unassigned" ||
			task.statusENUS.value === "Closed" || 
			task.statusENUS.value === "Review In Progress" ||
			task.statusENUS.value === "Routing In Progress" ||
			this._computeReadOnlyAuth(auth);
	},

    _computeReadOnlyAuth: function(auth) {
		return auth.canRead && !auth.canCreate && !auth.canDelete && !auth.canUpdate;
	},

    importMeta: getModuleUrl("triview-work-task/tripage-task.js")
});