/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icons/iron-icons.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../../@polymer/paper-input/paper-input.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "./tricomp-role-select-input-dropdown.js"
import "../../services/triservice-contact-roles.js"

class RoleSelectInputComponent extends TrimixinDropdownComponent(PolymerElement) {
	static get is() { return "tricomp-role-select-input"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				paper-input {
					--paper-input-container-invalid-color: var(--ibm-orange-60);
					--paper-input-container-input: {
						font-family: var(--tri-font-family);
						font-size: 14px;
						padding-bottom: 5px;
					};
				}

				paper-icon-button {
					width: 23px;
					height: 23px;
					padding: 0px 4px;
				}
			</style>

			<triservice-contact-roles id="contactRoleService" 
				roles-list="{{rolesList}}">
			</triservice-contact-roles>

			<triplat-query data="{{rolesList}}" filtered-data-out="{{filteredRolesList}}">
				<triplat-query-filter name="name" operator="contains" value="{{value}}" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter id="linkedBOID" name="linkedBusinessObject" operator="equals" ignore-if-blank>
				</triplat-query-filter>
			</triplat-query>

			<template is="dom-if" if="[[readonly]]">{{value}}</template>

			<template is="dom-if" if="[[!readonly]]">
				<paper-input id="input" value="{{value}}" placeholder="[[placeholder]]" no-label-float on-keyup="_getFocusByTabAndArrow"
					invalid="[[invalid]]" on-tap="_onSearch" disabled\$="[[_handleReadOnly(linkedBusinessObject, linkedForm)]]">
					<paper-icon-button class="tri-link" slot="suffix" icon="icons:expand-more" alt="more" title="more" on-tap="_onMenuIconTapped">
					</paper-icon-button>
				</paper-input>
			</template>

			<template id="dropdownTemplate">
				<tricomp-role-select-input-dropdown id="tricomp-role-select-input-dropdown"></tricomp-role-select-input-dropdown>
			</template>
		`;
	}

	_getFocusByTabAndArrow(e) {
		if(e.code == "Tab" || e.code == "ArrowDown" || e.code == "ArrowUp") {
			this._getDropdown().focus();
		}
	}

	static get properties() {
		return {
			attrToDisplay: {
				type: String
			},

			filteredRolesList: {
				type: Array,
				observer: "_observeFilteredRolesList"
			},

			_contactRoles: Array,

			rolesList: {
				type: Array
			},

			dropdownHorizontalAlign: {
				type: String,
				value: "left"
			},

			invalid: {
				type: Boolean,
				value: false
			},

			itemSelected: {
				type: Object,
				notify: true,
				value: () => {
					return null;
				}
			},

			linkedBusinessObject: {
				type: String,
				value: null
			},

			linkedForm: {
				type: String,
				value: null
			},

			placeholder: {
				type: String
			},

			readonly: {
				type: Boolean,
				value: false
			},

			recordId: {
				type: String,
				notify: true
			},

			value: {
				type: String,
				notify: true,
				valur: "Role"
			}
		}
	}

	_handleReadOnly(linkedBusinessObject, linkedForm) {
		this.$.contactRoleService.removeRequiredRoleFromList(linkedBusinessObject, linkedForm);
		return (!linkedBusinessObject);
	}

	dispatchItemSelectedEvent(item) {
		this.dispatchEvent(
			new CustomEvent(
				"item-selected",
				{
					detail: { item: item },
					bubbles: true, composed: true
				}
			)
		);
	}

	_observeFilteredRolesList(filteredRolesList) {
		this._getDropdown().updateData(filteredRolesList);
	}

	_onMenuIconTapped(e) {
		e.stopPropagation();
		let count = 0;
		this.rolesList.forEach(role => {
			if(role.linkedBusinessObject === this.linkedBusinessObject) {
				if(role.roleRequirement !== "Requires Exactly One") {
					count++;
				}
			}
		})
		let linkedBO = (this.value || count == 0) ? "" : this.linkedBusinessObject;
		this.$.linkedBOID.value = linkedBO;
		if(this.linkedBusinessObject) {
			this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, 
				this.dropdownHorizontalAlign, this.filteredRolesList, this.attrToDisplay, this.setTargetWidth, linkedBO);
		}
	}

	_onSearch(e) {
		e.stopPropagation();
		this.loadFullListDS();
		if(this.linkedBusinessObject) {
			this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, 
				this.dropdownHorizontalAlign, this.filteredRolesList, this.attrToDisplay, this.setTargetWidth, "");
		}
	}

	loadFullListDS() {
		this.$.linkedBOID.value = "";
	}
}

window.customElements.define(RoleSelectInputComponent.is, RoleSelectInputComponent);