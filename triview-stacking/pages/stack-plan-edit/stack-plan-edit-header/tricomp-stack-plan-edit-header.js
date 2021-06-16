/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../../@polymer/polymer/polymer-element.js";

import "../../../../@polymer/paper-button/paper-button.js";

import "../../../../triblock-popup/triblock-popup.js";

import "../../../routes/triroutes-stacking.js";
import "../../../services/triservice-stack-plan.js";
import "../../../styles/tristyles-stacking.js";
import { removeDuplicates } from "../../../utils/triutils-stacking.js";

class TricompStackPlanEditHeeader extends PolymerElement {
	static get is() { return "tricomp-stack-plan-edit-header"; }

	static get template() {
		return html`
			<style include="stacking-layout-styles stacking-popup-styles tristyles-theme">
				.header {
					background-color: var(--ibm-neutral-2);
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 20px 20px 20px 20px;
				}
			</style>

			<triroutes-stacking id="stackingRoute"></triroutes-stacking>

			<triservice-stack-plan id="stackPlanService"></triservice-stack-plan>

			<div class="header label-actions">
				<div class="header-content">
					<div class="page-title tri-h2">
						<span class="classic-link">[[stackPlan.name]]</span>
					</div>
					<div class="sub-header-text">
						<span>ID[[stackPlan.id]]</span>
						<div class="id-org-divider">|</div>
						<span>Stack from [[stackPlan.orgType]] Allocations</span>
					</div>
				</div>
				<paper-button class="return-button" on-tap="_handleReturnToStackPlan">Return to stack plan</paper-button>
			</div>

			<triblock-popup id="popupAlert" class="popup-alert" with-backdrop small-screen-max-width="0px">
				<div class="tri-h2 header-warning">Warning</div>
				<p>One or more buildings do not have any selected floors.</p>
				<div class="footer">
					<paper-button dialog-dismiss>Ok</paper-button>
				</div>
			</triblock-popup>
		`;
	}

	static get properties() {
		return {
			contactRolesPartiallyComplete: Array,
			stackPlan: Object,
			buildingListSelectedInitial: Array,
			floorListSelectedInitial: Array,
			buildingListSelected: Array,
			floorListSelected: Array,

			_buildingWithNoFloorsSelected: {
				type: Boolean
			},

			readonly: {
				type: Boolean,
				value: false
			}
		};
	}

	_handlePopUpDisplay(newBuildings, newFloors) {
		this.set("_buildingWithNoFloorsSelected", false);
		if(newBuildings) {
			newBuildings.forEach(function (item) {
				let index = newFloors.map(e => e.buildingId).indexOf(item.buildingId);
				if(index == -1) 
					this.set("_buildingWithNoFloorsSelected", true);
			}.bind(this));
		}
	}

	_handleReturnToStackPlan() {
		if (this.readonly) {
			this.$.stackingRoute.navigateToStackPlanPage();
			return;
		}

		let newFloors = removeDuplicates(this.floorListSelected, this.floorListSelectedInitial);
		let newBuildings = removeDuplicates(this.buildingListSelected, this.buildingListSelectedInitial);
		this._handlePopUpDisplay(newBuildings, newFloors);
		if(this._buildingWithNoFloorsSelected){
			this.$.popupAlert.open();
		} else {
			this.$.stackPlanService.saveContactsJSONToStackPlan(this.stackPlan._id, JSON.stringify(this.contactRolesPartiallyComplete));
			if(newFloors && newFloors.length > 0) {
				this.$.stackPlanService.saveStackPlan(this.stackPlan._id)
					.then(async function (stackPlan) {
						await this.$.stackPlanService.addBuildingFloors(this.stackPlan._id, newBuildings, newFloors);
						await this.$.stackPlanService.getSpaceStackSupplyForNewFloors(this.stackPlan._id, newFloors);
						this.$.stackingRoute.navigateToStackPlanPage();
					}.bind(this));
			} else {
				this.$.stackingRoute.navigateToStackPlanPage();
			}
		}
	}
}
window.customElements.define('tricomp-stack-plan-edit-header', TricompStackPlanEditHeeader);