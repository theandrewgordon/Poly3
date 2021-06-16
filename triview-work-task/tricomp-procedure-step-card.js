/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/paper-input/paper-textarea.js";
import "../triplat-number-input/triplat-number-input.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "./tricomp-procedure-step-status.js";
import "./tristyles-work-task-app.js";
import "./triservice-procedure.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
					padding: 15px 5px;
					border-top: 1px solid var(--ibm-gray-10);
				}

				:host([small-layout]) {
					padding: 10px 0px;
					border-top: none;
					border-bottom: 1px solid var(--ibm-gray-10);
				}

				.top-line {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				:host([small-layout]) .top-line {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.name {
					@apply --layout-horizontal;
					@apply --layout-flex-9;
				}

				.name-prefix {
					text-align: right;
					min-width: 25px;
				}

				:host([dir=ltr]) .name-text {
					margin-right: 90px;
					margin-left: 5px;
				}

				:host([dir=rtl]) .name-text {
					margin-right: 5px;
					margin-left: 90px;
				}

				:host([small-layout]) .name-text {
					margin: 0px 5px;
				}

				.description {
					padding-top: 10px;
				}

				.required {
					color: var(--ibm-red-50);
				}

				.bottom-line {
					@apply --layout-horizontal;
					@apply --layout-start;
				}

				.detail-section {
					@apply --layout-vertical;
					@apply --layout-flex;
					margin: 0px 30px;
					max-width: 80%;
				}

				.reading {
					@apply --layout-horizontal;
					@apply --layout-end;
				}

				.reading-input {
					@apply --layout-flex;
					--paper-input-container-input: {
						font-size: 14px;
					}
					--paper-input-container-label: {
						font-size: 14px;
					}
				}

				.reading-uom {
					padding-bottom: 8px;
				}

				.comments {
					--paper-input-container-input: {
						font-size: 14px;
						max-height: 100px;
					}
					--paper-input-container-label: {
						font-size: 14px;
					}
				}
				
				.completed-info {
					padding: 15px 0px;
					width: 250px;
					@apply --layout-vertical;
					@apply --layout-end;
				}
			
		</style>

		<triservice-procedure id="procedureService" loading-procedures="{{_loadingProcedures}}"></triservice-procedure>

		<div class="top-line">
			<div class="name">
				<div class="name-prefix">
					<span class="required" hidden\$="[[!step.stepRequired]]">*</span>
					<span>[[step.stepNumber]].</span>
				</div>
				<span class="name-text">[[step.stepName]]</span>
			</div>
			
			<tricomp-procedure-step-status id="stepStatusId" small-layout="[[smallLayout]]" disabled="[[_computeStatusDisabled(step, step.readingValue, readonly, _loadingProcedures, task.statusENUS.value, _invalidReading)]]" complete="{{_stepStatus}}" busy="[[_loadingProcedures]]"></tricomp-procedure-step-status>
		</div>

		<template is="dom-if" if="[[!smallLayout]]">
			<div class="bottom-line">
				<div class="detail-section">
					<span class="description secondary-text" hidden\$="[[!step.procedureStep]]">[[step.procedureStep]]</span>
					<div class="reading" hidden="[[!step.readingRequired]]">
						<triplat-number-input class="reading-input" label="Reading" readonly="[[_computeReadingInputReadonly(readonly, task.statusENUS.value, _stepStatus)]]" unformatted-value="{{step.readingValue}}" user="[[currentUser]]" min="-9999999999" max="9999999999" auto-validate="" invalid="{{_invalidReading}}"></triplat-number-input>
						<span class="reading-uom">[[step.readingUOM]]</span>
					</div>
					<paper-textarea class="comments" label="Comments" value="{{step.stepComments}}" maxlength="1000" max-rows="4" readonly="[[_computeReadonly(readonly, task.statusENUS.value)]]"></paper-textarea>
				</div>
				<div class="completed-info secondary-text">
					<div hidden\$="[[_computeHideCompletedInfo(step.completedBy, step.completedDateTime)]]">
						<span>[[step.completedBy]]</span>
						<span>on</span>
					</div>
					<span hidden\$="[[_computeHideCompletedInfo(step.completedBy, step.completedDateTime)]]">[[formatDateWithTimeZone(step.completedDateTime, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</span>
				</div>
			</div>
		</template>
	`,

    is: "tricomp-procedure-step-card",
    behaviors: [TriDateUtilities, TriDirBehavior],

    properties: {
		currentUser: Object,
		opened: Boolean,
		readonly: Boolean,
		task: Object,

		step: {
			type: Object,
			notify: true
		},

		_loadingProcedures: {
			type: Boolean
		},

		_stepStatus: {
			type: Boolean,
			notify: true,
			value: false
		},

		_invalidReading: {
			type: Boolean
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		'_readingChanged(step.readingValue)',
		'_computeStepStatus(step.status, opened)',
		'_handleLeaving(opened)'
	],

    listeners: {
		'step-status-changed':'_handleStatusChanged'
	},

    _readingChanged: function(value) {
		if (!this.opened || !this.task) return;
		if (this.readonly || this.task.statusENUS.value == "Completed" || this.task.statusENUS.value == "Routing In Progress")
			this.$$("#stepStatusId").disabled = true;
		else if (this.step && this.step.readingRequired && value === null) {
			this.$$("#stepStatusId").disabled = true;
			if (this.step.status != "Active") {
				var assetId = (this.step.procedureRule == "per Asset") ? this.step.assetName.id : -1;
				var locationId = (this.step.procedureRule == "per Location") ? this.step.locationName.id : -1;
				this.$.procedureService.refreshStep(this.step.stepNumber, this.step.procedureRecordID, assetId, locationId, this.step.procedureRule, true)
					.then(function() {
						this.$.procedureService.updateStep(this.step, this.task._id, "reset");
					}.bind(this))
					.then(function() {
						this._computeStepStatus(this.step.status, this.opened);
					}.bind(this));
			}
		}
		else
			this.$$("#stepStatusId").disabled = false;
	},

    _computeStepStatus: function(status, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (opened) this.set('_stepStatus', (status == "Completed") ? true : false);
	},

    _handleStatusChanged: function(e) {
		var action = (e.detail.complete) ? "complete" : "reset";
		var assetId = (this.step.procedureRule == "per Asset") ? this.step.assetName.id : -1;
		var locationId = (this.step.procedureRule == "per Location") ? this.step.locationName.id : -1;
		this.$.procedureService.refreshStep(this.step.stepNumber, this.step.procedureRecordID, assetId, locationId, this.step.procedureRule, true)
			.then(function() {
				this.$.procedureService.updateStep(this.step, this.task._id, action);
			}.bind(this))
			.then(function() {
				var status = (action == "complete") ? "Completed" : "Active";
				this.set('step.status', status);
				this.set('step.completedBy', (status == "Completed") ? this.currentUser.fullName : "");
				this.set('step.completedDateTime', (status == "Completed") ? this.getCurrentDatetime(this.currentUser._TimeZoneId) : "");
			}.bind(this));
	},

    _computeStatusDisabled: function(step, readingValue, readonly, busy, taskStatus, invalidReading) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (readonly || busy || taskStatus == "Completed" || taskStatus == "Routing In Progress" || invalidReading) return true;
		return (step && step.readingRequired && readingValue === null);
	},

    _handleLeaving: function(opened) {
		if (!opened && this.step && this.task && !this.smallLayout && !this.readonly && this.task.statusENUS.value != "Completed" && this.task.statusENUS.value != "Routing In Progress") {
			this.$.procedureService.updateStep(this.step, this.task._id);
		}
	},

    _computeHideCompletedInfo: function(completedBy, completedDateTime) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (!completedBy || !completedDateTime);
	},

    _computeReadonly: function(readonly, taskStatus) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return readonly || taskStatus == "Completed" || taskStatus == "Routing In Progress";
	},

    _computeReadingInputReadonly(readonly, taskStatus, stepStatus) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return readonly || taskStatus == "Completed" || taskStatus == "Routing In Progress" || stepStatus;
	}
});