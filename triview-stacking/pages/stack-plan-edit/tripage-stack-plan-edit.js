/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-pages/iron-pages.js";
import "../../../triplat-routing/triplat-route.js";
import "../../../triapp-contact-roles/triapp-contact-roles.js";
import "../../components/tabs/tricomp-buildings-contacts-tab.js";
import "../../components/building-floor-selector/tricomp-building-floor-selector.js";
import { getTriServiceStackPlan } from "../../services/triservice-stack-plan.js";
import { computeNonEmptyContactRolesCount, computeContactsInvalid, 
	checkForValidContactRows, computeStatusReadonly } from "../../utils/triutils-stacking.js";

import "../../styles/tristyles-stacking.js";

import "../../routes/triroutes-stacking.js";

import "./stack-plan-edit-header/tricomp-stack-plan-edit-header.js";

class StackPlanEditPage extends PolymerElement {
	static get is() {
		return "tripage-stack-plan-edit";
	}

	static get template() {
		return html`
			<style
				include="stacking-layout-styles stacking-shared-styles tristyles-theme"
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
				name="stackPlanEdit"
				params="{{_detailsParams}}"
				on-route-active="_onRouteActive"
				active="{{_active}}"
				>
			</triplat-route>

			<triservice-stack-plan
				id="stackPlanService"
				stack-plan="{{_stackPlan}}"
				stacks="{{_stacks}}"
				contact-roles-partially-complete="{{_contactRolesPartiallyComplete}}">
			</triservice-stack-plan>

			<tricomp-stack-plan-edit-header contact-roles-partially-complete="[[_contactRolesPartiallyComplete]]"
				building-list-selected="[[_buildingListSelected]]"
				building-list-selected-initial="[[_initialBuildingListSelected]]" 
				floor-list-selected="[[_floorListSelected]]"
				floor-list-selected-initial="[[_initialFloorListSelected]]"
				stack-plan="[[_stackPlan]]"
				readonly="[[_readonly]]">
			</tricomp-stack-plan-edit-header>

			<tricomp-buildings-contacts-tab id="tabContainer"
				selected-buildings="{{_buildingListSelected}}" 
				selected-tab="{{selectedTab}}">
			</tricomp-buildings-contacts-tab>

			<iron-pages selected="[[selectedTab]]" attr-for-selected="tab">
				<tricomp-building-floor-selector
					id="buildingFloorSelector"
					tab="buildingsTab"
					building-list-selected="{{_buildingListSelected}}"
					hide-selected-org-alloc-type
					floor-list-selected="{{_floorListSelected}}"
					selected-org-alloc-type="{{_stackPlan.orgType}}"
					readonly="[[_readonly]]">
				</tricomp-building-floor-selector>
				<div tab="contactsTab">
					<triapp-contact-roles
						parent-record="[[_parentRecord]]"
						readonly="[[_readonly]]"
						contact-roles="{{_contactRoles}}"
						contact-roles-count="{{contactRolesCount}}"
						has-invalid="[[isContactRowInvalid]]"
						contact-roles-partially-complete="{{_contactRolesPartiallyComplete}}"
						loading="{{loadingContactRolesAppEdit}}"
						active="[[_active]]">
					</triapp-contact-roles>
				</div>
			</iron-pages>
		`;
	}

	static get properties() {
		return {
			_buildingListSelected: {
				type: Array,
				notify: true,
				value: function() {
					return [];
				}
			},

			buildingListSelected: {
				type: Array
			},

			_contactRoles: {
				type: Array
			},

			contactRolesCount: {
				type: Number,
				notify: true
			},

			_detailsParams: Object,

			_floorListSelected: {
				type: Array,
				notify: true,
				value: function() {
					return [];
				}
			},

			isContactRowInvalid: Boolean,
			_peopleList: Array,
			authReadonly: Boolean,
			_stackPlan: Object,
			selectedTab: String,
			selectedOrgAllocType: String,

			_stacks: {
				type: Array
			},

			_readonly: {
				type: Boolean,
				computed: '_computeReadonly(authReadonly, _stackPlan.statusENUS)'
			},

			_contactRolesPartiallyComplete: {
				type: Array
			},

			loadingContactRolesAppEdit: {
				type: Boolean,
				notify: true
			},

			_active: {
				type: Boolean,
				value: false
			},

			_parentRecord: {
				type: Object
			}
		};
	}

	static get observers() {
		return ["_computeNonEmptyContactRoleRowsCount(_contactRoles.*)"];
	}
  
	constructor() {
		super();
		this.handlePartiallyFilledContactRoleCreatedListener = this._handlePartiallyFilledContactRoleCreated.bind(this);
	}
	
	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("partially-filled-contact-role-created", this.handlePartiallyFilledContactRoleCreatedListener);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("partially-filled-contact-role-created", this.handlePartiallyFilledContactRoleCreatedListener);
	}

	_handlePartiallyFilledContactRoleCreated(e) {
		e.stopPropagation();
		getTriServiceStackPlan().saveContactsJSONToStackPlan(this._stackPlan._id, JSON.stringify(this._contactRolesPartiallyComplete));
	}

	_computeNonEmptyContactRoleRowsCount(contactRoles) {
		let count = computeNonEmptyContactRolesCount(contactRoles.base);
		let isInvalid = checkForValidContactRows(contactRoles.base);
		this.shadowRoot.querySelector("#tabContainer").displayInvalid(count, isInvalid);
		this.contactRolesCount = count;
	}

	_onRouteActive(e) {
		if (e.detail.active) {
			afterNextRender(this, async function() {
				await this.$.stackPlanService
						.refreshStackPlanObject(this._detailsParams.stackPlanId)
						.then(stackPlan => {
							let isContactRowInvalid = computeContactsInvalid(stackPlan);
							this.set("isContactRowInvalid", isContactRowInvalid);
							this.set("selectedTab", (isContactRowInvalid) ? "contactsTab" : "buildingsTab");
						});
				await this.$.stackPlanService
					.refreshStackPlan(this._detailsParams.stackPlanId, true)
					.then(stackPlan => {
						this._initialBuildingListSelected = this._stacks.buildings;
						this._initialFloorListSelected = this._getFloorsList(this._stacks.buildings);
						const buildingFloorSelector = this.shadowRoot.querySelector("#buildingFloorSelector");
						buildingFloorSelector.setInitialSelectedBuildingsFloors(
							this._initialBuildingListSelected,
							this._initialFloorListSelected
						);
						buildingFloorSelector.resetPreviousEditSelection();
						buildingFloorSelector.setBuildingListScroller();
						this.set('_parentRecord', stackPlan);
					});
			});
				
		} else {
			this.set('_parentRecord', null);
			this.set("_buildingListSelected", []);
			this.set("_floorListSelected", []);
		}
	}

	_getFloorsList(buildings) {
		let floors = [];
		if (buildings) {
			buildings.forEach(building => {
				if (building.floors) {
					floors.push(...building.floors);
				}
			});
		}
		return floors;
	}

	_computeReadonly(authReadonly, statusENUS) {
		const readonly = computeStatusReadonly(authReadonly, statusENUS);
		return readonly;
	}
}
window.customElements.define(StackPlanEditPage.is, StackPlanEditPage);
