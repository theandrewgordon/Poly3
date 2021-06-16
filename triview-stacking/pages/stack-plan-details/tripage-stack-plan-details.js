/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import { TriPlatViewBehavior } from "../../../triplat-view-behavior/triplat-view-behavior.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-routing/triplat-route.js";

import "../../../triblock-confirmation-popup/triblock-confirmation-popup.js";
import "../../../triblock-popup/triblock-popup.js";

import "../../components/ad-hoc-demand/tricomp-ad-hoc-demand.js";
import "../../components/alert-banner/tricomp-alert-banner.js";
import "../../components/details-header/tricomp-details-header.js";
import "../../components/stack-plan/tricomp-stack-plan.js";
import "../../routes/triroutes-stacking.js";
import { getTriserviceAdHocDemand } from "../../services/triservice-ad-hoc-demand.js";
import "../../styles/tristyles-stacking.js";
import { computeContactsInvalid } from "../../utils/triutils-stacking.js";

class StackPlanDetailsPage extends mixinBehaviors([TriPlatViewBehavior , TriDirBehavior], PolymerElement) {
	static get is() { return "tripage-stack-plan-details"; }

	static get template() {
		return html`
			<style include="stacking-layout-styles stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.header {
					background-color: var(--ibm-neutral-2);
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 20px;
					position: relative;
				}

				.unsaved-changes {
					bottom: 4px;
					color: var(--ibm-gray-70);
					font-size: 12px;
					font-style: italic;
					position: absolute;
					right: 20px;
				}

				.note-icon {
					height: 24px;
					width: 24px;
					--iron-icon-fill-color: var(--tri-primary-color);
					padding: 0px;
					margin-top: 15px;
				}

				.manage-icon {
					height: 24px;
					width: 24px;
					--iron-icon-fill-color: var(--tri-primary-color);
					padding: 0px;
					margin-top: 15px;
				}

				:host([dir="rtl"]) .note-icon {
					margin-right: 20px;
				}

				:host([dir="ltr"]) .note-icon {
					margin-left: 20px;
				}

				#errorIndicator {
					--triplat-icon-height: 14px;
					--triplat-icon-width: 14px;
					--triplat-icon-fill-color: var(--tri-danger-color);
				}

				.note-popup {
					outline: 4px solid var(--tri-primary-content-accent-color) !important;
					padding: 16px;
				}

				.popup-header {
					color: var(--ibm-gray-70);
					padding-bottom: 15px;
				}

				.note-textarea {
					border: 1px solid var(--ibm-gray-30);
					width: 650px;
					height: 300px;
					resize: none;
					font-size: 14px;
				}

				.footer {
					@apply --layout-horizontal;
					@apply --layout-end-justified;
					padding-top: 15px;
				}

				.divider {
					color: var(--tri-primary-content-label-color);
					height: 30px;
					min-width: 1px;
					margin: 7px 16px 0px 18px;
				}

				.header-warning {
					color: var(--tri-major-warning-color);
					font-weight: 300;
				}

				.popup-message {
					color: var(--tri-primary-color-100);
				}

				.notePopup-message{
					width: 270px;
					color: var(--tri-primary-color-100);
				}

				tricomp-details-header {
					@apply --layout-flex;
				}
			</style>

			<triroutes-stacking id="stackingRoute"></triroutes-stacking>

			<triplat-route name="stackPlanDetail" params="{{_detailsParams}}" on-route-active="_onRouteActive" active="{{_opened}}"></triplat-route>

			<triservice-stack-plan id="stackPlanService" stacks="{{_stacks}}" stack-plan="{{_stackPlan}}"
				unsaved-changes="{{_unsavedChanges}}" stack-plan-blobs="{{_stackPlanBlobs}}" 
				can-submit-stack-plan="{{_canSubmitStackPlan}}" can-save-stack-plan="{{_canSaveStackPlan}}" 
				can-revise-stack-plan="{{_canReviseStackPlan}}"></triservice-stack-plan>
			
			<dom-if if="[[_displayStatusBanner(_stackPlan.statusENUS)]]">
				<template>
					<tricomp-alert-banner info>
						This record is in [[_stackPlan.status]] status. Any changes will not be saved.
					</tricomp-alert-banner>
				</template>
			</dom-if>

			<div class="header label-actions">
				<tricomp-details-header stack-plan="[[_stackPlan]]"></tricomp-details-header>
				<div class="action-bar">
					<paper-icon-button class="manage-icon" icon="icons:settings" on-tap="_handleManageAction"></paper-icon-button>
					<triplat-icon id="errorIndicator" hidden$="[[!isContactRowInvalid]]" icon="icons:error"></triplat-icon>
 					<paper-icon-button class="note-icon" icon="ibm-glyphs:notes" on-tap="_handleNoteAction"></paper-icon-button>
					<div class="divider"></div>
					<paper-button secondary id="viewSummaryButton" on-tap="_handleViewSummaryButtonTapped">View Summary</paper-button>
					<paper-button secondary on-tap="_handleRestoreButtonTapped" disabled="[[_computeDisableRestoreButton(_unsavedChanges, _canReviseStackPlan)]]">Restore</paper-button>
					<paper-button secondary hidden\$="[[!_canSubmitStackPlan]]" on-tap="_handleSubmitButtonTapped">Submit</paper-button>	
					<paper-button secondary hidden\$="[[!_canReviseStackPlan]]" on-tap="_handleReviseButtonTapped">Revise</paper-button>
					<paper-button class="save-button" on-tap="_handleSave" disabled="[[!_unsavedChanges]]" hidden\$="[[_hideSaveButton(readonly, _canSaveStackPlan)]]">Save</paper-button>
				</div>
				<div class="unsaved-changes" hidden\$="[[_computeHideUnsavedMessage(readonly, _unsavedChanges)]]">[[_unsavedChangesMessage]]</div>
			</div>

			<triblock-popup id="notesPopup" class="note-popup" with-backdrop on-iron-overlay-canceled="_handleNotePopupClose">
				<div class="tri-h2 popup-header">Notes</div>
				<textarea id="noteTextarea" readonly\$="[[!_canSaveStackPlan]]" class="note-textarea" rows="8" maxlength="1000" value="{{_notes::input}}" aria-label="Resolution Summary" tri-scroll-into-view=""></textarea>
				<div class="footer">
					<paper-button secondary  dialog-dismiss on-tap="_handleNotePopupClose" hidden\$="[[!_canSaveStackPlan]]">Cancel</paper-button>
					<paper-button dialog-confirm on-tap="_saveNote" disabled="[[_disableDoneButton(_stackPlanBlobs.notes, _notes, _canSaveStackPlan)]]">Done</paper-button>
				</div>
			</triblock-popup>

			<triblock-popup id="contactsAlert" class="popup-alert" with-backdrop small-screen-max-width="0px">
				<div class="tri-h2 header-warning">Warning</div>
				<p>The contact list is missing required information.</p>
				<p>You will need to complete the required information to submit the stack plan.</p>
				<div class="footer">
					<paper-button dialog-dismiss>Cancel</paper-button>
					<paper-button dialog-dismiss on-tap="_goToContactList">Go to Contacts list</paper-button>
				</div>
			</triblock-popup>

			<triblock-confirmation-popup id="removeConfirmationPopup" on-confirm-tapped="_saveNote">
				<div class="popup-content" slot="text">
					<div class="header-warning tri-h2">Confirmation</div>
					<p class="notePopup-message">Do you want to save your changes?</p>
				</div>
			</triblock-confirmation-popup>

			<triblock-confirmation-popup id="restorePopup" on-confirm-tapped="_restoredFromServer">
				<div class="popup-content" slot="text">
					<div class="header-warning tri-h2">Confirmation</div>
					<p class="popup-message">Are you sure you want to restore your stack plan with the server version?</p>
				</div>
			</triblock-confirmation-popup>

			<tricomp-stack-plan id="stackPlan" class="stack-plan-allocations" stacks-init="[[_stacks]]"
				stack-plan="[[_stackPlan]]" opened="[[_opened]]"></tricomp-stack-plan>

			<tricomp-ad-hoc-demand id="adHocDemand"></tricomp-ad-hoc-demand>
		`;
	}

	static get properties() {
		return {
			_stacks: Object,

			_stackPlan: Object,

			_stackPlanBlobs: Object,

			_selectedBuildingIndex: {
				type: Number,
				value: 0
			},

			_opened: {
				type: Boolean
			},

			_detailsParams: Object,

			_unsavedChanges: {
				type: Boolean
			},

			_unsavedChangesMessage: {
				type: String,
				value: () => {
					const __dictionary__unsavedChangesMessage = "You have unsaved changes";
					return __dictionary__unsavedChangesMessage;
				}
			},

			_notes: {
				type: String,
				value: ""
			},

			_canSubmitStackPlan: {
				type: Boolean
			},

			_canSaveStackPlan: {
				type: Boolean
			},

			_canReviseStackPlan: {
				type: Boolean
			},
		
			readonly: Boolean,

			isContactRowInvalid: {
				type: Boolean,
				value: false
			}
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/pages/stack-plan-details/tripage-stack-plan-details.js");
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("open-ad-hoc-demand", this._handleOpenAdHocDemand.bind(this));
		this.addEventListener("ad-hoc-demand-added", this._handleAdHocDemandAdded.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("open-ad-hoc-demand", this._handleOpenAdHocDemand.bind(this));
		this.removeEventListener("ad-hoc-demand-added", this._handleAdHocDemandAdded.bind(this));
	}

	_handleContactsValidation(stackPlanId) {
		return this.$.stackPlanService.refreshStackPlanObject(stackPlanId)
				.then(stackPlan => {
					this.set("isContactRowInvalid", computeContactsInvalid(stackPlan));
				});
	}

	_onRouteActive(e) {
		if (e.detail.active) {
			 afterNextRender(this, async function() {
				await this._handleContactsValidation(this._detailsParams.stackPlanId);
				this.$.stackPlanService.refreshStackPlan(this._detailsParams.stackPlanId);
			});
			this.$.stackPlan.handleViewSpaceClassOnDetailPage();
			this.$.stackPlan.resetSelectedDropdown();
			this.$.stackPlan.resetSelectedCheckbox();
		} else {
			this.$.stackPlan.resetAssignableSpacesOnly();
			this._unsavedChanges = false;
			getTriserviceAdHocDemand().clearAllDemands();
			this.dispatchEvent(new CustomEvent('close-toast-alert', { detail: {}, bubbles: true, composed: true}));
			this.$.adHocDemand.close();
		}
		this.$.stackPlan.resetScaleSlider();
	}

	_handleSave(e) {
		e.stopPropagation();
		this.$.stackPlanService.saveStackPlan(this._detailsParams.stackPlanId);
		this._unsavedChanges = false;
	}

	_handleNoteAction() {
		this.set('_notes', this._stackPlanBlobs.notes);
		this.$.notesPopup.openPopup();
	}

	_saveNote() {
		if (!this._canSaveStackPlan) {
			this.$.notesPopup.closePopup();
		}
		else {
			this.$.stackPlanService.saveNote(this._stackPlan._id, this._notes);
		}
	}

	_handleNotePopupClose() {
		if (this._stackPlanBlobs.notes != this._notes) {
			this.$.removeConfirmationPopup.openPopup();
		}
		if (!this._canSaveStackPlan) {
			this.$.removeConfirmationPopup.closePopup();
		}
	}

	_disableDoneButton(oldString, newString, _canSaveStackPlan) {
		if (!_canSaveStackPlan) {
			return false;
		}
		else {
			return oldString == newString;
		}
	}

	_handleManageAction() {
		this.$.stackingRoute.navigateToStackPlanSetupScreenPage(this._detailsParams.stackPlanId);
	}

	_goToContactList(e) {
		this.$.stackingRoute.navigateToStackPlanSetupScreenPage(this._detailsParams.stackPlanId);
	}

	_handleViewSummaryButtonTapped(e) {
		this.$.stackingRoute.navigateToStackPlanSummaryPage(this._detailsParams.stackPlanId);
	}

	_handleRestoreButtonTapped(e) {
		this.$.restorePopup.openPopup();
	}

	_restoredFromServer(e) {
		e.stopPropagation();
		this.$.stackPlanService.deleteStackPlanDataLocal(this._detailsParams.stackPlanId, true);
		this._unsavedChanges = false;
		this.$.stackPlanService.refreshStackPlan(this._detailsParams.stackPlanId)
		.then(
			function(success) {
				this._showRestoreToast();
			}.bind(this)
		);
	}

	_showRestoreToast() {
		var __dictionary__updateStackPlanText = "Stack plan restored.";
		this.dispatchEvent(new CustomEvent('toast-alert', {
			detail: {
				type: "success",
				text: __dictionary__updateStackPlanText
			}, bubbles: true, composed: true
		}));
	}

	_computeHideUnsavedMessage() {
		if (this.readonly)
			return true;
		else {
			return (!this._unsavedChanges);
		}
	}

	_handleSubmitButtonTapped() {
		if (!this._stackPlan._id) return;
		let stackPlanId = this._stackPlan._id;
		let isContactRowInvalid = this.isContactRowInvalid;

		if (this._unsavedChanges) {
			this.$.stackPlanService.saveStackPlan(stackPlanId, true).then(() => {
				this._handleContactValidation(isContactRowInvalid, stackPlanId);
			});
		} else {
			this._handleContactValidation(isContactRowInvalid, stackPlanId);
		}
	}

	_handleContactValidation(invalid, stackPlanId) {
		if(invalid) 
			this.$.contactsAlert.openPopup();
		else 
			this._submitStackPlan(stackPlanId);
	}

	_submitStackPlan(stackPlanId) {
		this.$.stackPlanService.refreshStackPlanBo(this._detailsParams.stackPlanId).then(stackPlan => {
			this.$.stackPlanService.submitStackPlan(stackPlanId).then(() => {
				this.$.stackingRoute.navigateToStackPlansPage();
				setTimeout(() => {
					this.$.stackPlanService.submitStackPlanToast();
				}, 100);
			});
		});
	}

	_hideSaveButton(readonly, canSaveStackPlan) {
		return readonly || !canSaveStackPlan;
	}

	_handleReviseButtonTapped() {
		if (!this._stackPlan._id) return;
		let stackPlanId = this._stackPlan._id;
		this.$.stackPlanService.reviseStackPlan(stackPlanId).then(() => {
			this.$.stackPlanService.refreshStackPlan(this._detailsParams.stackPlanId).then(success => {
				this.$.stackPlanService.reviseStackPlanToast();
			}, this);
		});
	}

	_displayStatusBanner(statusENUS) {
		return statusENUS == "Review In Progress" || statusENUS == "Active";
	} 

	_computeDisableRestoreButton() {
		if (this._canReviseStackPlan) {
			return this._unsavedChanges;
		}
		else {
			return !(this._unsavedChanges);
		}
	}
	
	_handleOpenAdHocDemand(e) {
		e.stopPropagation();
		this.$.adHocDemand.open();
	}

	_handleAdHocDemandAdded(e) {
		e.stopPropagation();
		this.$.stackPlan.handleAdHocDemandAdded();
	}
}

window.customElements.define(StackPlanDetailsPage.is, StackPlanDetailsPage);