/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../../@polymer/polymer/polymer-element.js";
import "../../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../../@polymer/paper-button/paper-button.js";
import "../../../../@polymer/paper-input/paper-input-container.js";
import "../../../../triblock-popup/triblock-popup.js";
import "../../../routes/triroutes-stacking.js";
import "../../../services/triservice-stack-plan.js";
import "../../../styles/tristyles-stacking.js";
import { getCompleteIncomplete } from "../../../utils/triutils-stacking.js";

class TricompStackPlanNewHeader extends PolymerElement {
	static get is() { return "tricomp-stack-plan-new-header"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles stacking-popup-styles tristyles-theme">
				:host{
					@apply --layout-vertical;
				}

				.header {
					background-color: var(--ibm-neutral-2);
					@apply --layout-vertical;
					padding: 20px 20px 0px 20px;
				}
				
				.header-text {
					@apply --layout-vertical;
				}

				.select-message {
					margin-top: 4px;
				}

				.stackPlan-name {
					--paper-input-container: {
						border: 1px solid var(--tri-primary-content-accent-color);
						padding-bottom: 0px;
						background-color: white;
						margin-top: 15px;
						border-bottom: 0px;
					}
				}

				paper-input-container input {
					font-family: var(--tri-font-family);
					font-size: 14px;
					padding-left: 20px;
					padding-bottom: 5px;
				}

				input {
					@apply --paper-input-container-shared-input-style;
				}

				.create-button {
					margin-right: 0px !important;
				}

			</style>

			<triroutes-stacking id="stackingRoute"></triroutes-stacking>

			<triservice-stack-plan id="stackPlanService"></triservice-stack-plan>

			<div class="header">
				<div class="label-actions">
					<div class="header-text">
						<div class="page-title tri-h2">New Stack Plan</div>
						<div class="tri-h4 select-message">[[computeContactsMessage(selectedTab)]]</div>
					</div>
					<paper-button id="createButton" class="create-button"
						disabled="[[_computeDisableShowCreateBtn(buildingListSelected.length, floorListSelected.length, _stackPlanName)]]"
						on-tap="_handleCreateAction" hidden\$="[[readonly]]">Create</paper-button>
				</div>
				
				<paper-input-container class="stackPlan-name" no-label-float >
					<iron-input bind-value="{{_stackPlanName}}" slot="input">
						<input placeholder="Enter a name for this stack plan" maxlength="150">
					</iron-input>
				</paper-input-container>
			</div>

			<triblock-popup id="popupAlert" class="popup-alert" with-backdrop small-screen-max-width="0px">
				<div class="tri-h2 header-warning">Warning</div>
				<p>One or more buildings do not have any selected floors.</p>
				<div class="footer">
					<paper-button dialog-dismiss>Ok</paper-button>
				</div>
			</triblock-popup>
		`
	}

	static get properties() {
		return {
			buildingListSelected: {
				type: Array,
				value: function () { return []; }
			},

			_buildingWithNoFloors: {
				type: Array,
				value: function () { return []; }
			},

			_buildingWithNoFloorsSelected: {
				type: Boolean
			},

			contactRoles: Array,

			floorListSelected: {
				type: Array,
				value: function () { return []; }
			},

			readonly: Boolean,
			_stackPlan: Object,
			_stackPlanName: String,
			selectedOrgAllocType: String,
			selectedTab: String
		}
	}

	resetStackPlanName() {
		this.set('_stackPlanName', null);
	}

	computeContactsMessage(selectedTab) {
		let __dictionary__buildingsTabMessage =  "Select buildings and ﬂoors to include in the stack plan.";
		let __dictionary__contactsTabMessage =  "Add contacts to notify them when the stack plan is submitted.";
		return (selectedTab == "contactsTab") ? 
		(__dictionary__buildingsTabMessage + " " + __dictionary__contactsTabMessage) : __dictionary__buildingsTabMessage;
	}

	_computeDisableShowCreateBtn(selectedBuildingLength, selectedFloorLength, name) {
		this.set("_buildingWithNoFloorsSelected", false);
		this.buildingListSelected.forEach(function (item) {
			let index = this.floorListSelected.map(e => e.buildingId).indexOf(item.buildingId);
			if(index == -1) 
				this.set("_buildingWithNoFloorsSelected", true);
		}.bind(this));
		return !(selectedFloorLength > 0 && selectedBuildingLength > 0) || !name;
	}

	_handleCreateAction() {
		if(this._buildingWithNoFloorsSelected){
			this.$.popupAlert.open();
		} else {
			this.$.stackPlanService
				.createStackPlan(this._stackPlanName, this.selectedOrgAllocType, this.buildingListSelected, this.floorListSelected)
				.then(function (stackPlanId) {
					this.$.stackPlanService.refreshStackPlanObject(stackPlanId).then(async stackPlan => {
						this._stackPlan = stackPlan;

						const [completes, incompletes] = getCompleteIncomplete(this.contactRoles);

						await this.$.stackPlanService.saveContactsJSONToStackPlan(this._stackPlan._id, JSON.stringify(incompletes));

						this.dispatchEvent(new CustomEvent('create-contact-roles', {
							detail: {
								contactRoles: completes,
								stackPlan: stackPlan
							},
							bubbles: false,
							composed: false
						}));
						this.$.stackingRoute.navigateToStackPlansPage();
					});
				}.bind(this));
		}
	}
}

window.customElements.define('tricomp-stack-plan-new-header', TricompStackPlanNewHeader);