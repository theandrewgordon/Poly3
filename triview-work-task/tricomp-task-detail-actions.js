/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-auth-check/triplat-auth-check.js";
import "../triplat-select-input/triplat-select-input.js";
import { TriBlockScrollFieldIntoViewBehavior } from "../triblock-scroll-field-into-view-behavior/triblock-scroll-field-into-view-behavior.js";
import "../triblock-popup/triblock-popup.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-button/paper-button.js";
import "./tristyles-work-task-app.js";
import "./tricomp-hold-dropdown-selector.js";
import "./triservice-work-task.js";
import "./triservice-new-work-task.js";
import "./triservice-work-task-actions.js";
import "./triservice-procedure.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-popup tristyles-theme">

				.select-input-label {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.hold-list-small {
					@apply --layout-vertical;
				}

				.hold-item {
					padding: 12px 0px;
					border-top: 1px solid var(--ibm-gray-10);
					cursor: pointer;
				}

				.hold-item:last-child {
					border-bottom: 1px solid var(--ibm-gray-10);
				}

			
		</style>

		<triservice-work-task-actions id="workTaskActionsService" online=""></triservice-work-task-actions>

		<triservice-work-task id="workTaskService" filtered-reissue-reasons="{{_filteredReissueReasons}}" reissue-reasons-search-value="{{_reissueReasonsSearchValue}}">
		</triservice-work-task>
		
		<triservice-new-work-task id="newWorkTaskService"></triservice-new-work-task>

		<triservice-procedure id="procedureService"></triservice-procedure>

		<triplat-auth-check id="authCheck"></triplat-auth-check>

		<div class="action-bar">
			<tricomp-hold-dropdown-selector id="holdButton" hidden="" disabled="[[_taskBusy]]"></tricomp-hold-dropdown-selector>
			<paper-button id="deleteButton" hidden="" danger-outline\$="[[!smallLayout]]" footer-danger\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleDeleteAction">Delete</paper-button>
			<paper-button id="submitButton" hidden="" footer\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleSubmitAction">Submit</paper-button>
			<paper-button id="saveDraftButton" hidden="" footer\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleSaveDraftAction">Save Draft</paper-button>
			<paper-button id="holdPopupButton" hidden="" footer-secondary="" disabled="[[_taskBusy]]" on-tap="_handleHoldPopup">Hold</paper-button>
			<paper-button id="completeButton" hidden="" footer\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleCompleteAction">Complete</paper-button>
			<paper-button id="resumeButton" hidden="" footer\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleResumeAction">Resume</paper-button>
			<paper-button id="reopenPopupButton" hidden="" secondary\$="[[!smallLayout]]" footer-secondary\$="[[smallLayout]]" footer\$="[[smallLayout]]" disabled="[[_disableReopenButton(_taskBusy, _isReopenPopupOpened)]]" on-tap="_handleReopenPopup">Reopen</paper-button>
			<paper-button id="closeButton" hidden="" footer\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleCloseAction">Close</paper-button>
			<paper-button id="acceptButton" footer\$="[[smallLayout]]" disabled="[[_taskBusy]]" on-tap="_handleAcceptAction">Accept</paper-button>
		</div>

		<triblock-popup id="confirmDeletePopup" class="popup-alert" with-backdrop="" small-screen-max-width="0px" aria-label="Confirmation">
			<div class="header-general tri-h2">Confirmation</div>
			<div>Are you sure you want to delete this draft?</div>
			<div class="footer">
				<paper-button secondary="" dialog-dismiss="">Cancel</paper-button>
				<paper-button dialog-confirm="" on-tap="_deleteTask">Delete</paper-button>
			</div>
		</triblock-popup>
		
		<triblock-popup id="holdPopup" class="popup-alert" with-backdrop="" small-screen-max-width="0px" aria-label="Select Hold Type">
			<div class="header-general tri-h2">Select Hold Type</div>
			<div class="hold-list-small">
				<div class="hold-item tri-link" id="holdForPartsButton" on-tap="_handleHoldForPartsAction">Hold for Parts</div>
				<div class="hold-item tri-link" id="holdPerRequesterButton" on-tap="_handleHoldPerRequesterAction">Hold per Requester</div>
			</div>
		</triblock-popup>

		<triblock-popup id="completeNotDonePopup" class="popup-alert" with-backdrop="" small-screen-max-width="0px" aria-label="Attention">
			<div class="header-warning tri-h2">Attention</div>
			<div>To complete this work task, you must first complete all of the required procedure steps.</div>
			<div class="footer">
				<paper-button dialog-confirm="">OK</paper-button>
			</div>
		</triblock-popup>

		<triblock-popup id="completeResolutionPopup" class="popup-alert resolution-popup" with-backdrop="" small-screen-max-width="0px" aria-label="Resolution Summary">
			<div class="header-general tri-h2">Resolution Summary</div>
			<textarea id="resolutionTextarea" class="resolution-textarea" rows="8" maxlength="1000" placeholder="Record a resolution summary below before marking this task complete. The resolution summary will be saved with the task record for future reference." value="{{_resolutionDescription::input}}" aria-label="Resolution Summary" tri-scroll-into-view=""></textarea>
			<template is="dom-if" if="[[!online]]">
				<div>You cannot change the task until you return online. Do you still want to complete the task?</div>
			</template>
			<div class="footer">
				<paper-button secondary="" dialog-dismiss="">Cancel</paper-button>
				<paper-button dialog-confirm="" on-tap="_completeTask">Complete</paper-button>
			</div>
		</triblock-popup>

		<triblock-popup id="reopenPopup" class="popup-alert" with-backdrop="" small-screen-max-width="0px" modal="" aria-label="Select a reissue reason">
			<div class="header-general tri-h2">Select a reopen reason</div>
			<triplat-select-input id="reasonDropdown" label="Reason" class="reason-select" required="" invalid="{{_reasonInvalid}}" on-select-input-value-user-change="_handleInputValueUserChange" error-message="Reason is required." select-src="{{_filteredReissueReasons}}" search-value="{{_reissueReasonsSearchValue}}" value="{{_selectedReason}}" value-name="value" dir="[[_dir]]" scroll-element-into-view="">
				<div label="" class="select-input-label" slot="label">
					<iron-icon icon="search"></iron-icon>
					<span>Reason</span>
				</div>
			</triplat-select-input>
			<div class="footer">
				<paper-button id="reopenButton" on-tap="_handleReopenAction" disabled="{{_reopenDisabled}}">Reopen</paper-button>
			</div>
		</triblock-popup>
	`,

    is: "tricomp-task-detail-actions",

    behaviors: [
		TriBlockScrollFieldIntoViewBehavior
	],

    properties: {

		task: Object,

		online: {
			type: Boolean,
			value: true
		},

		auth: Object,

		_taskBusy: {
			type: Boolean,
			value: false
		},

		_reissueReasonsSearchValue: {
			type: String,
			notify: true,
		},

		_selectedReason: {
			type: Object
		},

		_dir: {
			type: String
		},

		_filteredReissueReasons: {
			type: Array
		},

		_reasonInvalid: {
			type: Boolean
		},

		_reopenDisabled: {
			type: Boolean,
			value: true
		},

		_isReopenPopupOpened: {
			type: Boolean,
			value: false
		},

		_resolutionDescription: {
			type: String,
			value: ""
		},

		_hasClosePermission: {
			type: Boolean,
			value: false
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_computeShowHideActionButtons(task.statusENUS, task.assignmentStatusENUS, _hasClosePermission)",
		"_handleResolutionDescriptionChanged(_resolutionDescription)"
	],

    listeners: {
		"iron-overlay-opened": "_reopenPopupOpened",
		"iron-overlay-closed": "_reopenPopupClosed",
		"hold-dropdown-selected": "_holdOptionSelected"
	},

    _handleResolutionDescriptionChanged:function(_resolutionDescription){
		if(_resolutionDescription==null){
			this._resolutionDescription="";
		}
	},

    attached: function() {
		var textDirectionValue = document.querySelector('body').getAttribute('dir');
		this.set('_dir', textDirectionValue ? textDirectionValue : "ltr");

		afterNextRender(this, function() {
			this.$.authCheck.getActionPermission("triWorkTask", "close", "actions", "myTasks")
			.then(function(value) {
				this.set("_hasClosePermission", value);
			}.bind(this))
			.catch(function() {
				this.set("_hasClosePermission", false);
			}.bind(this));
		});
	},

    _computeShowHideActionButtons: function(statusENUS, assignmentStatusENUS, hasClosePermission) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (assignmentStatusENUS == "Unassigned") {
			this.$.submitButton.hidden = true;
			this.$.saveDraftButton.hidden = true;
			this.$.deleteButton.hidden = true;
			this.$.completeButton.hidden = true;
			this.$.holdButton.hidden = true;
			this.$.holdPopupButton.hidden = true;
			this.$.resumeButton.hidden = true;
			this.$.closeButton.hidden = true;
			this.$.reopenPopupButton.hidden = true;
			this.$.acceptButton.hidden = this.auth ? !this.auth.canUpdate : false;
			return;
		}

		this.$.acceptButton.hidden = true;

		if(statusENUS) {
			var status = statusENUS.value;
			this.set('_taskBusy', false);
			if (status != "" && status != null) {
				switch(status) {
					case "Draft": 
						this.$.submitButton.hidden = !this.online;
						this.$.saveDraftButton.hidden = this.online;
						this.$.deleteButton.hidden = this.auth ? !this.auth.canDelete : false;
						this.$.completeButton.hidden = true;
						this.$.holdButton.hidden = this._computeHideHoldDropdown(true);
						this.$.holdPopupButton.hidden = this._computeHideHoldPopup(true);
						this.$.resumeButton.hidden = true;
						this.$.closeButton.hidden = true;
						this.$.reopenPopupButton.hidden = true;
						break;
					case "Active":
						this.$.submitButton.hidden = true;
						this.$.saveDraftButton.hidden = true;
						this.$.deleteButton.hidden = true;
						this.$.completeButton.hidden = false;
						this.$.holdButton.hidden = this._computeHideHoldDropdown(false);
						this.$.holdPopupButton.hidden = this._computeHideHoldPopup(false);
						this.$.resumeButton.hidden = true;
						this.$.closeButton.hidden = true;
						this.$.reopenPopupButton.hidden = true;
						break;
					case "Hold for Parts":
						this.$.submitButton.hidden = true;
						this.$.saveDraftButton.hidden = true;
						this.$.deleteButton.hidden = true;
						this.$.completeButton.hidden = true;
						this.$.holdButton.hidden = this._computeHideHoldDropdown(true);
						this.$.holdPopupButton.hidden =  this._computeHideHoldPopup(true);
						this.$.resumeButton.hidden = false;
						this.$.closeButton.hidden = true;
						this.$.reopenPopupButton.hidden = true;
						break;
					case "Hold per Requester":
						this.$.submitButton.hidden = true;
						this.$.saveDraftButton.hidden = true;
						this.$.deleteButton.hidden = true;
						this.$.completeButton.hidden = true;
						this.$.holdButton.hidden = this._computeHideHoldDropdown(true);
						this.$.holdPopupButton.hidden = this._computeHideHoldPopup(true);
						this.$.resumeButton.hidden = false;
						this.$.closeButton.hidden = true;
						this.$.reopenPopupButton.hidden = true;
						break;
					case "Completed":
						this.$.submitButton.hidden = true;
						this.$.saveDraftButton.hidden = true;
						this.$.deleteButton.hidden = true;
						this.$.completeButton.hidden = true;
						this.$.holdButton.hidden = this._computeHideHoldDropdown(true);
						this.$.holdPopupButton.hidden = this._computeHideHoldPopup(true);
						this.$.resumeButton.hidden = true;
						this.$.closeButton.hidden = (hasClosePermission) ? false : true;
						this.$.reopenPopupButton.hidden = false;
						break;
					default:
						this.$.submitButton.hidden = true;
						this.$.saveDraftButton.hidden = true;
						this.$.deleteButton.hidden = true;
						this.$.completeButton.hidden = true;
						this.$.holdButton.hidden = this._computeHideHoldDropdown(true);
						this.$.holdPopupButton.hidden = this._computeHideHoldPopup(true);
						this.$.resumeButton.hidden = true;
						this.$.closeButton.hidden = true;
						this.$.reopenPopupButton.hidden = true;
				}
			}
		}
	},

    _holdOptionSelected: function(e) {
		var holdOption = e.detail.holdOption;
		if (holdOption && holdOption == "holdPerRequester") 
			this._handleHoldPerRequesterAction();
		else if (holdOption && holdOption == "holdForParts")
			this._handleHoldForPartsAction();
	},

    _handleHoldPopup: function() {
		this.$.holdPopup.openPopup();
	},

    _handleHoldPerRequesterAction: function() {
		this.$.workTaskActionsService.holdTaskPerRequester(this.task._id);
		this.set('_taskBusy', true);
		this.$.holdPopup.closePopup();
	},

    _handleHoldForPartsAction: function() {
		this.$.workTaskActionsService.holdTaskForParts(this.task._id);
		this.set('_taskBusy', true);
		this.$.holdPopup.closePopup();
	},

    _computeHideHoldDropdown: function(force) {
		if (force == undefined) 
			force = false;
		return (this.smallLayout) ? true : force;
	},

    _computeHideHoldPopup: function(force) {
		if (force == undefined)
			force = false;
		return (!this.smallLayout) ? true : force;
	},

    _handleResumeAction: function() {
		this.$.workTaskActionsService.resumeTask(this.task._id);
		this.set('_taskBusy', true);
	},

    _handleAcceptAction: function() {
		this.set('_taskBusy', true);
		this.$.workTaskActionsService.assignTaskToCurrentUser(this.task._id).then(function() {
			this.set('_taskBusy', false);
			window.history.back();
		}.bind(this));
		
	},

    _handleCompleteAction: function() {
		if (!this.$.procedureService.getProceduresAllDone()) {
			this.$.completeNotDonePopup.openPopup();
		} else {
			this.set('_resolutionDescription', this.task.resolutionDescription);
			this.$.completeResolutionPopup.openPopup();
			this.$.resolutionTextarea.focus();
		}
	},

    _completeTask: function() {
		this.set('task.resolutionDescription', this._resolutionDescription);
		this.$.workTaskActionsService.completeTask(this.task._id)
			.then(function() {
				window.history.back();
			}.bind(this));
		this.set('_taskBusy', true);
	},

    _handleCloseAction: function() {
		this.$.workTaskActionsService.closeTask(this.task._id);
		this.set('_taskBusy', true);
	},

    _handleReopenAction: function() {
		if(this._selectedReason) {
			this.$.workTaskActionsService.reopenTask(this.task._id, this._selectedReason);
			this.set('_taskBusy', true);
			this.$.reopenPopup.closePopup();
		}
	},

    _handleReopenPopup: function() {
		this.set('_reissueReasonsSearchValue', "");
		this.set('_selectedReason', null);
		this.set('_reasonInvalid', false);
		this.set('_reopenDisabled', true);
		this.$.reopenPopup.openPopup();
	},

    _handleInputValueUserChange: function() {
		if(this._selectedReason) {
			this.set('_reasonInvalid', false);
			this.set('_reopenDisabled', false);
		} else {
			this.set('_reasonInvalid', true);
			this.set('_reopenDisabled', true);
		}
	},

    _reopenPopupOpened: function() {
		this._isReopenPopupOpened = true;
	},

    _reopenPopupClosed: function() {
		if (!this.$.reopenPopup.opened) { this._isReopenPopupOpened = false };
	},

    _disableReopenButton: function(busy, popupOpened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return busy || popupOpened;
	},

    _handleDeleteAction: function() {
		this.$.confirmDeletePopup.openPopup();
	},

    _deleteTask: function() {
		this.set('_taskBusy', true);
		this.$.newWorkTaskService.deleteTask(this.task._id)
			.then(function() {
				this.set('_taskBusy', false);
				window.history.back();
			}.bind(this)
		);
	},

    _handleSubmitAction: function() {
		this.set('_taskBusy', true);
		this.$.newWorkTaskService.activateTask(this.task)
			.then(function() {
				this.set('_taskBusy', false);
				window.history.back();
			}.bind(this)
		);
	},

    _handleSaveDraftAction: function() {
		this.set('_taskBusy', true);
		this.$.newWorkTaskService.updateTask(this.task)
			.then(function() {
				this.set('_taskBusy', false);
				window.history.back();
			}.bind(this)
		);
	}
});