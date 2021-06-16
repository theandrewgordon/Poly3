/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-routing/triplat-routing.js";
import "../triblock-popup/triblock-popup.js";
import "../triblock-confirmation-popup/triblock-confirmation-popup.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/iron-selector/iron-selector.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "../triapp-task-list/triservice-work-task-base.js";
import "./tristyles-work-task-app.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import { TriWorkTaskTimeUtilitiesBehaviorImpl, TriWorkTaskTimeUtilitiesBehavior } from "./tribehav-work-task-time-utilities.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import "./tricomp-time-header.js";
import "./tricomp-time-table.js";
import { TriroutesTimeLog } from "./triroutes-time-log.js";
import "./triservice-time-log.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import "./tripage-time-log.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-popup work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-vertical;
					border: 2px solid var(--ibm-gray-10);
					border-radius: 8px;
					overflow: hidden;
				}
				:host([small-layout]:not([opened])) {
					margin-left: 15px;
					margin-right: 15px;
				}
				:host([opened]:not([small-layout])) {
					margin-bottom: 15px;
					margin-top: 15px;
				}

				tricomp-task-detail-section {
					--tricomp-task-detail-section-header-container: {
						border-top: none;
					};
				}

				.header-custom-content {
					@apply --layout-around-justified;
					@apply --layout-horizontal;
				}

				tricomp-time-header {
					@apply --layout-flex;
				}

				.section-content {
					max-height: 470px;
					overflow: auto;
				}
				:host(:not([small-layout])) .section-content {
					padding: 0 15px 15px 15px;
				}
				:host([small-layout]) .section-content {
					background-color: var(--ibm-neutral-3);
					max-height: 100%;
					padding-bottom: 51px;
				}

				.no-data {
					margin: 10px;
				}

				.add-row-container {
					@apply --layout-horizontal;
				}
				:host(:not([small-layout])) .add-row-container {
					@apply --layout-justified;
					border-bottom: 1px solid var(--ibm-gray-30);
				}

				:host([dir="ltr"]) .add-row-container {
					padding: 15px 12px 10px 0px;
				}

				:host([dir="rtl"]) .add-row-container {
					padding: 15px 0px 10px 12px;
				}

				:host([small-layout]) .add-row-container {
					@apply --layout-end-justified;
					padding: 15px;
				}

				.tri-link {
					@apply --layout-horizontal;
				}
				:host(:not([small-layout])) .tri-link {
					@apply --layout-end;
				}
				:host([small-layout]) .tri-link {
					@apply --layout-center;
				}

				:host(:not([small-layout])) .add-icon {
					height: 22px;
					width: 22px;
					padding: 0;
					--iron-icon-fill-color: var(--tri-primary-color);
				}
				:host([small-layout]) .add-icon {
					--iron-icon-height: 12px;
					--iron-icon-width: 12px;
					--iron-icon-fill-color: white;
					--iron-icon-stroke-color: white;
					background-color: var(--tri-primary-color);
					border-radius: 100%;
					padding: 7px;
				}
				:host([dir="ltr"]) .add-icon {
					margin-right: 3px;
				}
				:host([dir="rtl"]) .add-icon {
					margin-left: 3px;
				}

				.section-header {
					color: var(--ibm-gray-70);
					font-weight: 500;
				}

			
		</style>

		<triservice-work-task-base id="workTaskBaseService" time-logs="{{_timeLogs}}" loading-time-logs="{{_loadingTimeLogs}}" loading-timer-action="{{_loadingTimerAction}}"></triservice-work-task-base>
		<triservice-time-log id="timeLogService"></triservice-time-log>

		<triplat-route name="taskTimeLogs" on-route-active="_onRouteActive" params="{{_taskTimeLogsParams}}"></triplat-route>

		<triroutes-time-log on-detail-route-active-changed="_onDetailRouteActive"></triroutes-time-log>

		<triplat-route-selector no-initial-route="">
			<iron-selector activate-event="">
				
				<tricomp-task-detail-section aria-label="[[_header]]" small-layout="[[smallLayout]]" no-header="" opened="{{opened}}" route="taskTimeLogHome" default-route="" ignore-count="" loading="[[_loading]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">
					<div class="header-custom-content" slot="header-custom-content">
						<tricomp-time-header small-layout="[[smallLayout]]" current-user="[[currentUser]]" task="[[task]]" time-logs="[[_timeLogs]]" opened="[[opened]]" readonly="[[readonly]]"></tricomp-time-header>
					</div>
		
					<div id="sectionContent" class="section-content" slot="section-content">
						<template is="dom-if" if="[[smallLayout]]" restamp="">
							<tricomp-task-id task="[[task]]"></tricomp-task-id>
							<tricomp-time-header small-layout="[[smallLayout]]" current-user="[[currentUser]]" task="[[task]]" time-logs="[[_timeLogs]]" opened="[[opened]]"></tricomp-time-header>
						</template>
		
						<template is="dom-if" if="[[!_displayTable(_timeLogs)]]">
							<div class="no-data" hidden\$="[[_loadingTimeLogs]]">There are no time logs.</div>
						</template>
		
						<template is="dom-if" if="[[_displayAddRowLargeScreen(smallLayout, readonly)]]" restamp="">
							<div class="add-row-container">
								<div class="section-header tri-h3">Time Log</div>
								<paper-icon-button class="add-icon" icon="ibm-glyphs:add-new" on-tap="_handleAddTimeLog" disabled="[[readonly]]" alt="Add time log" noink=""></paper-icon-button>
							</div>
						</template>
		
						<template is="dom-if" if="[[_displayTable(_timeLogs)]]" restamp="">
							<tricomp-time-table small-layout="[[smallLayout]]" current-user="[[currentUser]]" readonly="[[readonly]]" time-logs="[[_timeLogs]]" opened="[[opened]]"></tricomp-time-table>
						</template>
		
						<div class="action-bar" hidden\$="[[_computeHideAddRowSmall(smallLayout, opened, _isTimeLogPageActive)]]">
							<paper-button footer\$="[[smallLayout]]" on-tap="_handleAddTimeLog">Add</paper-button>
						</div>
					</div>
				</tricomp-task-detail-section>

				<div route="timeLogDetail">
					<dom-if if="[[_timeLogPageOpened]]">
						<template>
							<tripage-time-log small-layout="[[smallLayout]]" current-user="[[currentUser]]" readonly="[[readonly]]" task="[[task]]" opened="{{_isTimeLogPageActive}}">
							</tripage-time-log>
						</template>
					</dom-if>
				</div>

			</iron-selector>
		</triplat-route-selector>

		<triblock-confirmation-popup id="removeConfPopup" class="conf-popup-alert" on-confirm-tapped="_removeConfirmedTapped">
			<div class="text" slot="text">
				<div class="header-warning tri-h2">Confirmation</div>
				<p>Do you want to remove this item from the list?</p>
			</div>
		</triblock-confirmation-popup>

		<triblock-popup id="removeStillRunningPopup" class="popup-alert" with-backdrop="" small-screen-max-width="0px">
			<div class="header-warning tri-h2">Warning</div>
			<div>You cannot remove this time log while it is still in progress.</div>
			<div class="footer">
				<paper-button dialog-confirm="">OK</paper-button>
			</div>
		</triblock-popup>
	`,

    is: "tricomp-task-detail-time",

    behaviors: [
	    TriComputeLoadingBehavior,
	    TriTaskDetailSectionBehavior,
	    TriWorkTaskTimeUtilitiesBehavior,
	    TriDirBehavior
	],

    properties: {
		currentUser: Object,
		readonly: Boolean,
		task: Object,

		_header: {
			type: String
		},

		_timeLogs: {
			type: Array
		},

		_loadingTimeLogs: {
			type: Boolean,
			value: false
		},

		_loadingTimerAction: {
			type: Boolean,
			value: false
		},

		_taskTimeLogsParams: {
			type: Object
		},

		_timeLogToRemove: String,
		_timeLogToRemoveDate: String,

		_isTimeLogPageActive: {
			type: Boolean,
			value: false
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		},

		_timeLogPageOpened: Boolean

	},

    listeners: {
		'open-remove-popup':'_openRemovePopup',
		'open-still-running-popup':'_openStillRunningPopup'
	},

    observers: [
		"_setLoadingBlockers(_sectionLoadingBlocker, _loadingTimerAction)",
		"_setValidLoadings(_loadingTimeLogs)"
	],

    attached: function() {
		var __dictionary__header = "Time logs";
		this.set("_header", __dictionary__header);

		var __dictionary__altExpand = "Expand time logs section";
		var __dictionary__altCollapse = "Collapse time logs section";
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _refreshTimeLogs: function() {
		this.$.workTaskBaseService.refreshTaskTimeLogs(this._taskTimeLogsParams.taskId);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, this._refreshTimeLogs);
		} 
	},

    _onDetailRouteActive: function(e) {
		if (e.detail.value) {
			afterNextRender(this, function() {
				this.set("_timeLogPageOpened", true);
			});
		}
	},

    _displayTable: function(timeLogs) {
		return timeLogs && timeLogs.length > 0;
	},

    _handleAddTimeLog: function(e) {
		e.stopPropagation();
		TriroutesTimeLog.getInstance().openTimeLogDetail("-1");
	},

    _displayAddRowLargeScreen: function(smallLayout, readonly) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !smallLayout && !readonly;
	},

    _computeHideAddRowSmall: function(smallLayout, opened, isTimeLogPageActive) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (this.readonly || !smallLayout)
			return true;
		else
			return !opened || isTimeLogPageActive;
	},

    _openRemovePopup: function(e) {
		e.stopPropagation();
		this.set('_timeLogToRemove', e.detail._id);
		this.set('_timeLogToRemoveDate', e.detail.plannedStart);
		this.$.removeConfPopup.openPopup();
	},

    _removeConfirmedTapped: function(e) {
		e.stopPropagation();
		this.$.timeLogService.removeTaskTimeLog(this._taskTimeLogsParams.taskId, this._timeLogToRemove, this._timeLogToRemoveDate);
		this.set('_timeLogToRemove', null);
		this.set('_timeLogToRemoveDate', null);
	},

    _openStillRunningPopup: function(e) {
		e.stopPropagation();
		this.$.removeStillRunningPopup.openPopup();
	},

    importMeta: getModuleUrl("triview-work-task/tricomp-task-detail-time.js")
});