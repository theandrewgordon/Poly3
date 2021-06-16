/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import {
	PolymerElement,
	html
} from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-pages/iron-pages.js";

import "../../../triplat-routing/triplat-route.js";
import "../../../triapp-contact-roles/triapp-contact-roles.js";
import "../../components/building-floor-selector/tricomp-building-floor-selector.js";
import "../../components/tabs/tricomp-buildings-contacts-tab.js";
import { computeNonEmptyContactRolesCount, checkForValidContactRows } from "../../utils/triutils-stacking.js";
import "./stack-plan-new-header/tricomp-stack-plan-new-header.js";
import "../../routes/triroutes-stacking.js";
import "../../services/triservice-lookup-data.js";
import "../../styles/tristyles-stacking.js";

class StackPlanNewPage extends PolymerElement {
	static get is() {
		return "tripage-stack-plan-new";
	}

	static get template() {
		return html`
			<style
				include="stacking-shared-styles stacking-popup-styles tristyles-theme"
			>
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
				}

				iron-pages {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

			</style>

			<triroutes-stacking id="stackingRoute"></triroutes-stacking>

			<triplat-route
				name="stackPlanNew"
				on-route-active="_handleRouteActive"
				active="{{_active}}"
				>
			</triplat-route>

			<triservice-lookup-data
				id="lookupDataService"
				filtered-building-list="{{_filteredBuildingList}}">
			</triservice-lookup-data>

			<tricomp-stack-plan-new-header
				id="stackPlanNewHeader"
				contact-roles="[[_contactRoles]]"
				selected-org-alloc-type="[[selectedOrgAllocType]]"
				selected-tab="[[selectedTab]]"
				building-list-selected="[[_buildingListSelected]]"
				floor-list-selected="[[_floorListSelected]]"
				on-create-contact-roles="_doCreateContactRoles"
				>
			</tricomp-stack-plan-new-header>

			<tricomp-buildings-contacts-tab
				id="tabContainer"
				selected-tab="{{selectedTab}}"
				selected-buildings="{{_buildingListSelected}}">
			</tricomp-buildings-contacts-tab>

			<iron-pages selected="[[selectedTab]]" attr-for-selected="tab">
				<tricomp-building-floor-selector
					id="buildingFloorSelector"
					tab="buildingsTab"
					selected-org-alloc-type="{{selectedOrgAllocType}}"
					building-list-selected="{{_buildingListSelected}}"
					floor-list-selected="{{_floorListSelected}}">
				</tricomp-building-floor-selector>
				<div tab="contactsTab">
					<triapp-contact-roles
						id="contactRolesApp"
						parent-record="[[_parentRecord]]"
						readonly="[[readonly]]"
						contact-roles="{{_contactRoles}}"
						contact-roles-count="{{contactRolesCount}}"
						loading="{{loadingContactRolesAppNew}}"
						linked-business-object-list="{{_linkedBusinessObjectList}}"
						active="[[_active]]"
						>
					</triapp-contact-roles>
				</div>
			</iron-pages>
		`;
	}

	static get properties() {
		return {
			_filteredBuildingList: {
				type: Array
			},

			_buildingListSelected: {
				type: Array,
				notify: true,
				value: function() {
					return [];
				}
			},

			contactRolesCount: {
				type: Number,
				notify: true
			},

			_contactRoles: {
				type: Array
			},

			_floorListSelected: {
				type: Array,
				notify: true,
				value: function() {
					return [];
				}
			},

			readonly: {
				type: Boolean,
				value: false
			},
			
			selectedTab: String,

			_parentRecord: {
				type: Object
			},

			loadingContactRolesAppNew: {
				type: Boolean,
				notify: true
			},

			_active: {
				type: Boolean,
				value: false
			},

			_linkedBusinessObjectList: Array
		};
	}

	static get observers() {
		return ["_computeNonEmptyContactRoleRowsCount(_contactRoles.*)"];
	}

	_computeNonEmptyContactRoleRowsCount(contactRoles) {
		let count = computeNonEmptyContactRolesCount(contactRoles.base);
		let isInvalid = checkForValidContactRows(contactRoles.base);
		this.shadowRoot.querySelector("#tabContainer").displayInvalid(count, isInvalid);
		this.contactRolesCount = count;
	}

	_handleRouteActive(e) {
		if (e.detail.active) {
			if (this.readonly) {
				this.shadowRoot.querySelector("#stackingRoute").navigateToStackPlansPage();
			} else {
				const buildingFloorSelector = this.shadowRoot.querySelector("#buildingFloorSelector");
				buildingFloorSelector.disableBuildingLookup(true);
				afterNextRender(this, function() {
					this._resetForm();
					this.set("selectedTab", "buildingsTab");
					buildingFloorSelector.setBuildingListScroller();
					buildingFloorSelector.disableBuildingLookup(false);
					this.set('_parentRecord', { recordForm: "Stack Plan", recordBusinessObject: "Stack Plan" });
				});
			}
		} else {
			this.set('_parentRecord', null);
			this.set("_buildingListSelected", []);
			this.set("_floorListSelected", []);
			this.shadowRoot.querySelector("#buildingFloorSelector").disableBuildingLookup(true);
		}
	}

	_resetForm() {
		this.shadowRoot.querySelector("#stackPlanNewHeader").resetStackPlanName();
		this.shadowRoot.querySelector("#buildingFloorSelector").resetPreviousNewSelection();
	}

	_doCreateContactRoles(e) {
		const contactRolesApp = this.shadowRoot.querySelector("#contactRolesApp");
		const contactRoles = e.detail.contactRoles;
		const stackPlan = e.detail.stackPlan;
		let pendingPromise = false;
		let lastCallNumber = 0;
		let callCounter = 0;

		contactRoles.forEach(contactRole => {
			const curCallNumber = callCounter++;
			callCreateContactRole.bind(this, curCallNumber, contactRole)();
			function callCreateContactRole(curCallNumber, contactRole) {
				if (!pendingPromise && lastCallNumber === curCallNumber) {
					pendingPromise = true;
					contactRolesApp.doCreateContactRole(stackPlan._id, stackPlan.recordBusinessObject, stackPlan.recordForm, contactRole, true).then(() => {
						pendingPromise = false;
						lastCallNumber = curCallNumber + 1;	
					})
				} else {
					setTimeout(callCreateContactRole.bind(this, curCallNumber, contactRole), 500);
				}
			}
		});
	}
}

window.customElements.define("tripage-stack-plan-new", StackPlanNewPage);
