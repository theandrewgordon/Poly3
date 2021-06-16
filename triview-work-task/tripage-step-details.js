/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/paper-input/paper-textarea.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-number-input/triplat-number-input.js";
import { TriBlockScrollFieldIntoViewBehavior } from "../triblock-scroll-field-into-view-behavior/triblock-scroll-field-into-view-behavior.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "./tricomp-procedure-step-status.js";
import "./triservice-procedure.js";
import "./tristyles-work-task-app.js";
import "./tricomp-procedure-status-bar.js";
import "../triapp-task-list/tricomp-overflow-text.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">


				:host([small-layout]) {
					overflow: auto;
					padding-bottom: 153px;
				}

				.top-section {
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
					padding: 20px;
				}

				.name {
					@apply --layout-horizontal;
				}

				.step-text {
					margin: 0px 5px;
				}

				.description {
					padding-top: 15px;
				}

				.required {
					color: var(--ibm-red-50);
					
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

				.bottom-section {
					@apply --layout-vertical;
					padding: 20px;
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
					padding: 10px 0px;
					@apply --layout-vertical;
					@apply --layout-start;
				}

				:host([dir=ltr]) .completed-info {
					padding-left: 75px;
					padding-right: 0px;
				}

				:host([dir=rtl]) .completed-info {
					padding-left: 0px;
					padding-right: 75px;
				}

				:host([small-layout]) .action-bar {
					@apply --layout-vertical;
					padding-bottom: 0px !important;
				}

				:host([small-layout]) .action-bar > * {
					margin-bottom: 10px;
				}

				.actions {
					@apply --layout-horizontal;
				}

				.status {
					margin-top: 5px;
					width: 95%;
				}

				.message-placeholder {
					@apply --layout-fit;
				}

			
		</style>

		<triplat-route id="stepDetailsRoute" name="stepDetails" on-route-active="_onRouteActive" active="{{_opened}}" params="{{_stepDetailsParams}}"></triplat-route>
		
		<triservice-procedure id="procedureService" procedure="{{_procedure}}" step="{{_step}}" loading-procedures="{{_loadingProcedures}}"></triservice-procedure>

		<template is="dom-if" if="[[!smallLayout]]">
			<div class="message-placeholder">
				<div>Wow, such empty.</div>
				<div>
					<paper-button on-tap="_handleBackButton">Back</paper-button>
				</div>
			</div>
		</template>

		<div hidden\$="[[!smallLayout]]">
			<div class="action-bar">
				<tricomp-procedure-status-bar class="status" procedure="[[_procedure]]" opened="[[_opened]]"></tricomp-procedure-status-bar>
				<div class="actions">
					<paper-button footer-secondary="" disabled\$="[[_firstStep(_step)]]" on-tap="_handlePreviousButton">Previous</paper-button>
					<paper-button footer="" hidden\$="[[!_allComplete(_procedure)]]" on-tap="_handleDoneButton">Done</paper-button>
					<paper-button footer\$="[[!_allComplete(_procedure)]]" footer-secondary\$="[[_allComplete(_procedure)]]" hidden\$="[[_allCompleteAndlastStep(_step, _procedure)]]" disabled\$="[[_lastStep(_step, _procedure)]]" on-tap="_handleNextButton">Next</paper-button>
				</div>
			</div>
	
			<div class="top-section">
				<div class="name">
					<div>
						<span class="required" hidden\$="[[!_step.stepRequired]]">*</span>
						<span>[[_step.stepNumber]].</span>
					</div>
					<span class="step-text">[[_step.stepName]]</span>
				</div>
				<tricomp-overflow-text class="secondary-text description" lines="8" collapse="" hidden\$="[[!_step.procedureStep]]" text="[[_step.procedureStep]]">
					</tricomp-overflow-text>
				<div class="reading" hidden="[[!_step.readingRequired]]">
					<triplat-number-input id="readingInputId" class="reading-input" label="Reading" readonly="[[_computeReadingInputReadonly(readonly, task.statusENUS.value, _stepStatus)]]" unformatted-value="{{_step.readingValue}}" user="[[currentUser]]" min="-9999999999" max="9999999999" auto-validate="" invalid="{{_invalidReading}}"></triplat-number-input>
					<span class="reading-uom">[[_step.readingUOM]]</span>
				</div>
			</div>
			<div class="bottom-section">
				<tricomp-procedure-step-status id="stepStatusId" small-layout="[[smallLayout]]" disabled="[[_computeStatusDisabled(_step, _step.readingValue, readonly, _loadingProcedures, task.statusENUS.value, _invalidReading)]]" force-large="" complete="{{_stepStatus}}"></tricomp-procedure-step-status>
				<div class="completed-info secondary-text">
					<div hidden\$="[[_computeHideCompletedInfo(_step.completedBy, _step.completedDateTime)]]">
						<span>[[_step.completedBy]]</span>
						<span>on</span>
					</div>
					<span hidden\$="[[_computeHideCompletedInfo(_step.completedBy, _step.completedDateTime)]]">[[formatDateWithTimeZone(_step.completedDateTime, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</span>
				</div>
				<paper-textarea id="commentsId" class="comments" label="Comments" value="{{_step.stepComments}}" maxlength="1000" max-rows="4" readonly="[[_computeReadonly(readonly, task.statusENUS.value)]]" tri-scroll-into-view=""></paper-textarea>
			</div>
		</div>
	`,

    is: "tripage-step-details",

    behaviors: [
	    TriDateUtilities,
	    TriBlockScrollFieldIntoViewBehavior,
	    TriDirBehavior
	],

    properties: {

		currentUser: Object,
		readonly: Boolean,
		task: Object,

		_loadingProcedures: {
			type: Boolean
		},

		_procedure: {
			type: Object,
			notify: true
		},

		_step: {
			type: Object,
			notify: true
		},

		_stepDetailsParams: {
			type: Object,
			notify: true
		},

		_opened: {
			type: Boolean,
			value: false
		},

		_rule: {
			type: String,
			notify: true
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
		'_readingChanged(_step.readingValue)',
		'_computeStepStatus(_step.status, _opened)'
	],

    listeners: {
		'step-status-changed':'_handleStatusChanged'
	},

    attached: function() {
		this.$.readingInputId.paperInputElement.addEventListener('focus', this._handleInputFocused);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.set('_rule', this._getRule(this._stepDetailsParams.assetId, this._stepDetailsParams.locationId));
				this.$.procedureService.refreshProcedure(this._stepDetailsParams.procedureId, this._stepDetailsParams.assetId, this._stepDetailsParams.locationId, this._rule)
					.then(function() {
						this.$.procedureService.refreshStep(this._stepDetailsParams.stepNumber, this._stepDetailsParams.procedureId, this._stepDetailsParams.assetId, this._stepDetailsParams.locationId, this._rule)
					}.bind(this));
			});
		} else {
			this._updateStepDetails();
		}
	},

    _allComplete: function(procedure) {
		if (procedure) {
			if (procedure.requiredStepsTotal != 0)
				return (procedure.requiredStepsCompleted == procedure.requiredStepsTotal);
			else
				return (procedure.stepsCompleted == procedure.stepsTotal);
		} else 
			return false;
	},

    _handlePreviousButton: function() {
		var stepNumber = this._step.stepNumber;
		if (stepNumber != "1") {
			this._updateStepDetails();
			stepNumber--;
			this.$.procedureService.refreshStep(stepNumber, this._stepDetailsParams.procedureId, this._stepDetailsParams.assetId, this._stepDetailsParams.locationId, this._rule);
		}
	},

    _handleNextButton: function() {
		var stepNumber = this._step.stepNumber;
		if (stepNumber != this._procedure.stepsTotal) {
			this._updateStepDetails();
			stepNumber++;
			this.$.procedureService.refreshStep(stepNumber, this._stepDetailsParams.procedureId, this._stepDetailsParams.assetId, this._stepDetailsParams.locationId, this._rule);
		}
	},

    _handleDoneButton: function() {
		window.history.go(-2);
	},

    _handleBackButton: function() {
		window.history.back();
	},

    _getRule: function(assetId, locationId) {
		if (this._stepDetailsParams.assetId != -1)
			return "per Asset";
		else if (this._stepDetailsParams.locationId != -1)
			return "per Location";
		else
			return "per Task";
	},

    _firstStep: function(step) {
		if (this._opened && step)
			return (step.stepNumber == 1);
	},

    _lastStep: function(step, procedure) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (this._opened && step && procedure)
			return (step.stepNumber == procedure.stepsTotal);
	},

    _allCompleteAndlastStep: function(step, procedure) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (this._allComplete(procedure) && this._lastStep(step, procedure));
	},

    _readingChanged: function(value) {
		if (!this._opened || !this.smallLayout || !this.task) return;
		if (this.readonly || this.task.statusENUS.value == "Completed" || this.task.statusENUS.value == "Routing In Progress")
			this.$$("#stepStatusId").disabled = true;
		else if (this._step && this._step.readingRequired && value === null) {
			this.$$("#stepStatusId").disabled = true;
			if (this._step.status != "Active") {
				this.$.procedureService.updateStep(this._step, this.task._id, "reset")
					.then(function() {
						this._computeStepStatus(this.task._id, this._step.status, this._opened);
					}.bind(this));
			}
		} else
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
		this.$.procedureService.updateStep(this._step, this.task._id, action)
			.then(function() {
				var status = (action == "complete") ? "Completed" : "Active";
				this.set('_step.status', status);
				this.set('_step.completedBy', (status == "Completed") ? this.currentUser.fullName : "");
				this.set('_step.completedDateTime', (status == "Completed") ? this.getCurrentDatetime(this.currentUser._TimeZoneId) : "");
			}.bind(this));
	},

    _computeStatusDisabled: function(step, readingValue, readonly, busy, taskStatus, invalidReading) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (readonly || busy || taskStatus == "Completed" || taskStatus == "Routing In Progress" || invalidReading) return true;
		return (step && step.readingRequired && readingValue === null);
	},

    _updateStepDetails: function() {
		if (this._step && this.task && !this.readonly && this.task.statusENUS.value != "Completed" && this.task.statusENUS.value != "Routing In Progress") {
			this.$.procedureService.updateStep(this._step, this.task._id);
		}
	},

    _computeHideCompletedInfo: function(completedBy, completedDateTime) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return (!completedBy || !completedDateTime);
	},

    _handleInputFocused: function(e) {
		e.stopPropagation();
		let input = e.target._focusableElement;
		this.async(function() {
			input.setSelectionRange(0, 9999);
		}.bind(this), 500);
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