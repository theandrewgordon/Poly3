/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js";
import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-number-input/triplat-number-input.js";
import "../../../triplat-query/triplat-query.js";
import "../../../triplat-uom/triplat-uom.js";

import "../../services/triservice-ad-hoc-demand.js";
import "../../services/triservice-stack-plan.js";
import "../../services/triservice-stacking.js";
import "../../styles/tristyles-stacking.js";
import "../field-validation/tricomp-field-validation.js";
import "../select-input/tricomp-select-input.js";

class DemandTableRowComponent extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-demand-table-row"; }

	static get template() {
		return html`
			<style include="stacking-demand-table-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					border-bottom: 1px solid var(--ibm-gray-10);
					font-family: var(--tri-font-family);
					font-size: 14px;
				}

				:host(:not([even])) {
					background-color: var(--ibm-neutral-2);
				}
				:host([even]) {
					background-color: var(--tri-primary-content-background-color);
				}
				:host([focused]) {
					z-index: 1;
				}

				.cell {
					position: relative;
				}

				paper-icon-button {
					padding: 0;
					height: 18px;
					width: 18px;
				}

				:host([_has-notes]) .expand-icon::after {
					content: "…";
					font-size: 10px;
					font-weight: bold;
					position: absolute;
					bottom: -3px;
					right: 0;
				}

				tricomp-select-input {
					@apply --layout-flex;
				}

				triplat-number-input {
					--triplat-paper-input-container-invalid-color: var(--ibm-orange-60);
					--triplat-paper-input-container-input: {
						font-family: var(--tri-font-family);
						font-size: 14px;
						padding-bottom: 5px;
					};
				}

				tricomp-field-validation {
					position: absolute;
					bottom: 4px;
					left: 10px;
				}

				:host([dir="ltr"]) .total-area {
					margin-right: 5px;
				}
				:host([dir="rtl"]) .total-area {
					margin-left: 5px;
				}

				.row-detail {
					padding-bottom: 15px;
				}

				.row-detail-cell {
					@apply --layout-vertical;
					overflow: hidden;
					padding: 0 10px;
				}

				.row-detail-cell span {
					margin-bottom: 3px;
				}

				.textarea {
					border: 1px solid var(--ibm-gray-30);
					box-sizing: border-box;
					width: 100%;

					--iron-autogrow-textarea: {
						box-sizing: border-box;
						color: var(--ibm-gray-100);
						font-family: var(--tri-font-family);
						font-size: 14px;
						padding: 5px 9px 3px 9px;
					};
				}
			</style>

			<triservice-ad-hoc-demand id="adHocDemandService" building="{{_building}}"></triservice-ad-hoc-demand>

			<triservice-stacking current-user="{{_currentUser}}" uom-area-units="{{_uomAreaUnits}}"></triservice-stacking>

			<triservice-stack-plan id="stackPlanService"
				organization-list="{{_organizationList}}" space-class-list="{{_spaceClassList}}"></triservice-stack-plan>

			<triplat-query data="[[_organizationList]]" filtered-data-out="{{_filteredOrganizationList}}">
				<triplat-query-filter name="idName" operator="contains" value="[[demand.organization]]" ignore-if-blank></triplat-query-filter>
				<triplat-query-sort name="idName"></triplat-query-sort>
			</triplat-query>

			<triplat-query data="[[floors]]" filtered-data-out="{{_filteredFloorList}}">
				<triplat-query-filter name="name" operator="contains" value="[[demand.initialFloor]]" ignore-if-blank></triplat-query-filter>
				<triplat-query-sort name="level"></triplat-query-sort>
			</triplat-query>

			<triplat-query data="[[_spaceClassList]]" filtered-data-out="{{_filteredSpaceClassList}}">
				<triplat-query-filter name="idName" operator="contains" value="[[demand.spaceClass]]" ignore-if-blank></triplat-query-filter>
				<triplat-query-sort name="idName"></triplat-query-sort>
			</triplat-query>

			<div class="row">
				<div class="column-icon-expand cell cell-expand-icon">
					<paper-icon-button class="expand-icon" icon="ibm-glyphs:notes" primary noink on-tap="_rowExpandCollapse"></paper-icon-button>
				</div>

				<div class="column-2 cell">
					<dom-if if="[[readonly]]">
						<template>
							<span>[[demand.organization]]</span>
						</template>
					</dom-if>
					<dom-if if="[[!readonly]]">
						<template>
							<tricomp-select-input data="[[_filteredOrganizationList]]" value="{{demand.organization}}"
								placeholder="Type to select" attr-to-display="idName" scroll-container="[[scrollContainer]]"
								fit-into="[[fitInto]]" opened="{{_organizationOpened}}" item-selected="[[demand.organizationObj]]"
								on-item-selected="_onOrganizationSelected" set-target-width invalid="[[_organizationInvalid]]"></tricomp-select-input>
							<tricomp-field-validation value="[[demand.organization]]" invalid="{{_organizationInvalid}}" required></tricomp-field-validation>
						</template>
					</dom-if>
				</div>

				<div class="column-1 cell">
					<dom-if if="[[readonly]]">
						<template>
							<span>[[demand.initialFloor]]</span>
						</template>
					</dom-if>
					<dom-if if="[[!readonly]]">
						<template>
							<tricomp-select-input data="[[_filteredFloorList]]" value="{{demand.initialFloor}}"
								placeholder="Type to select" attr-to-display="name" scroll-container="[[scrollContainer]]"
								fit-into="[[fitInto]]" opened="{{_initialFloorOpened}}" item-selected="[[demand.floorObj]]"
								on-item-selected="_onFloorSelected" set-target-width invalid="[[_floorInvalid]]"></tricomp-select-input>
							<tricomp-field-validation value="[[demand.initialFloor]]" invalid="{{_floorInvalid}}" required></tricomp-field-validation>
						</template>
					</dom-if>
				</div>

				<div class="column-2 cell">
					<dom-if if="[[readonly]]">
						<template>
							<span>[[demand.spaceClass]]</span>
						</template>
					</dom-if>
					<dom-if if="[[!readonly]]">
						<template>
							<tricomp-select-input data="[[_filteredSpaceClassList]]" value="{{demand.spaceClass}}"
								placeholder="Type to select" attr-to-display="idName" scroll-container="[[scrollContainer]]"
								fit-into="[[fitInto]]" opened="{{_spaceClassOpened}}" item-selected="[[demand.spaceClassObj]]"
								on-item-selected="_onSpaceClassSelected" set-target-width invalid="[[_spaceClassInvalid]]"></tricomp-select-input>
							<tricomp-field-validation value="[[demand.spaceClass]]" invalid="{{_spaceClassInvalid}}" required></tricomp-field-validation>
						</template>
					</dom-if>
				</div>

				<div class="column-1 cell number-cell">
					<dom-if if="[[readonly]]">
						<template>
							<div class="number-cell">[[demand.quantity]]</div>
						</template>
					</dom-if>
					<dom-if if="[[!readonly]]">
						<template>
							<triplat-number-input unformatted-value="{{demand.quantity}}" user="[[_currentUser]]" min="1"
								no-label-float invalid="[[_quantityInvalid]]" invalid-input-message=""></triplat-number-input>
							<tricomp-field-validation value="[[demand.quantity]]" invalid="{{_quantityInvalid}}" required></tricomp-field-validation>
						</template>
					</dom-if>
				</div>

				<div class="column-1 cell number-cell">
					<dom-if if="[[readonly]]">
						<template>
						<div class="number-cell">
							[[demand.totalArea]] 
							<triplat-uom display="abbr" uom="[[_defaultUomAreaUnits]]" uom-list="[[_uomAreaUnits]]"></triplat-uom>
						</div>
						</template>
					</dom-if>
					<dom-if if="[[!readonly]]">
						<template>
							<triplat-number-input class="total-area" unformatted-value="{{demand.totalArea}}" user="[[_currentUser]]" min="1"
								no-label-float invalid="[[_totalAreaInvalid]]" invalid-input-message=""></triplat-number-input>
							<triplat-uom display="abbr" uom="[[_defaultUomAreaUnits]]" uom-list="[[_uomAreaUnits]]"></triplat-uom>
							<tricomp-field-validation value="[[demand.totalArea]]" invalid="{{_totalAreaInvalid}}" required></tricomp-field-validation>
						</template>
					</dom-if>
				</div>

				<dom-if if="[[!readonly]]">
					<template>
						<div class="column-icon-delete cell">
							<paper-icon-button icon="ibm:remove-delete" danger noink on-tap="_deleteDemand"></paper-icon-button>
						</div>
					</template>
				</dom-if>
			</div>

			<iron-collapse id="rowDetail" no-animation>
				<div class="collapse-content row row-detail">
					<div class="column-icon-expand"></div>

					<div class="column-1 row-detail-cell">
						<span>Notes</span>
						<iron-autogrow-textarea class="textarea" value="{{demand.notes}}"></iron-autogrow-textarea>
					</div>

					<div class="column-icon-delete"></div>
				</div>
			</iron-collapse>
		`;
	}

	static get properties() {
		return {
			demand: {
				type: Object,
				notify: true
			},

			even: {
				type: Boolean,
				reflectToAttribute: true
			},

			fitInto: {
				type: Object
			},

			floors: {
				type: Array
			},

			index: {
				type: Number
			},

			readonly: {
				type: Boolean,
				value: false
			},

			scrollContainer: {
				type: Object
			},

			_building: {
				type: Object
			},

			_currentUser: {
				type: Object
			},

			_uomAreaUnits: {
				type: Array
			},

			_spaceClassList: {
				type: Array
			},

			_organizationList: {
				type: Array
			},

			_filteredFloorList: {
				type: Array
			},

			_filteredOrganizationList: {
				type: Array
			},

			_filteredSpaceClassList: {
				type: Array
			},

			_focused: {
				type: Boolean,
				reflectToAttribute: true,
				computed: "_computeFocused(_organizationOpened, _initialFloorOpened, _spaceClassOpened)"
			},

			_organizationOpened: {
				type: Boolean
			},

			_initialFloorOpened: {
				type: Boolean
			},

			_spaceClassOpened: {
				type: Boolean
			},

			_defaultUomAreaUnits: {
				type: String,
				computed: "_computeDefaultUomAreaUnits(_building.areaUnits)"
			},

			_hasNotes: {
				type: Boolean,
				value: false,
				computed: "_computeHasNotes(demand.notes)",
				reflectToAttribute: true
			},

			_organizationInvalid: {
				type: Boolean
			},

			_floorInvalid: {
				type: Boolean
			},

			_spaceClassInvalid: {
				type: Boolean
			},

			_quantityInvalid: {
				type: Boolean
			},

			_totalAreaInvalid: {
				type: Boolean
			}
		}
	}

	static get observers() {
		return [
			"_observeDemand(demand)"
		];
	}

	validateFields() {
		var validationPromises = [];
		let fieldValidations = this.shadowRoot.querySelectorAll("tricomp-field-validation");
		fieldValidations.forEach((field) => {
			validationPromises.push(field.validate());
			field.autoValidate = true;
		}, this);
		
		return Promise.all(validationPromises).then((results) => {
			let invalids = results;
			let invalid = false;
			for (let i = 0; i < invalids.length; i++) {
				if (invalids[i]) {
					invalid = true;
					break;
				}
			}
			return invalid;
		}, this);
	}

	_observeDemand(demand) {
		if (this.$.rowDetail && this.$.rowDetail.opened) this.$.rowDetail.toggle();

		let fieldValidations = this.shadowRoot.querySelectorAll("tricomp-field-validation");
		fieldValidations.forEach((field) => {
			field.autoValidate = false;
			field.invalid = false;
		});
	}

	_computeFocused(organizationOpened, initialFloorOpened, spaceClassOpened) {
		return organizationOpened || initialFloorOpened || spaceClassOpened;
	}

	_rowExpandCollapse(e) {
		e.stopPropagation();

		this.$.rowDetail.toggle();
		this.dispatchEvent(new CustomEvent("expanded-changed", { bubbles: false, composed: false }));
	}

	_onOrganizationSelected(e) {
		if (e.detail && e.detail.item) this.demand.organizationObj = e.detail.item;
	}

	_onFloorSelected(e) {
		if (e.detail && e.detail.item) this.demand.floorObj = e.detail.item;
	}

	_onSpaceClassSelected(e) {
		if (e.detail && e.detail.item) this.demand.spaceClassObj = e.detail.item;
	}

	_deleteDemand(e) {
		e.stopPropagation();

		if (!this.readonly) this.$.adHocDemandService.deleteDemand(this.index);
	}

	_computeDefaultUomAreaUnits(unit) {
		return (unit && unit != "") ? unit : "square-feet";
	}

	_computeHasNotes(notes) {
		return (notes && notes != "") ? true : false;
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/ad-hoc-demand/tricomp-demand-table-row.js");
	}
}

window.customElements.define(DemandTableRowComponent.is, DemandTableRowComponent);