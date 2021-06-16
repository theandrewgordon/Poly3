/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/paper-button/paper-button.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import { getTriserviceContactRoles } from "../../services/triservice-contact-roles.js";
import "../../styles/tristyles-contact-roles-app.js";
import "./tricomp-contact-roles-table-row.js";
import { isEmptyArray } from "../../utils/triutils-contact-roles-app.js";

class ContactRolesTableComponent extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-contact-roles-table"; }

	static get template() {
		return html`
			<style include="contact-roles-app-table-styles tristyles-theme">
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
					font-family: var(--tri-font-family);
					font-size: 14px;
				}

				.roles-message {
					margin: 15px 20px 10px 20px;
				}

				.table-header {
					border-bottom: 1px solid var(--ibm-gray-10);
					color: var(--tri-primary-content-color);
					height: 45px;
					margin: 0 20px 0 20px;
				}

				.table-body {
					@apply --layout-flex;
					color: var(--ibm-gray-100);
					margin: 0 20px 0 20px;
				}

				.header-2 {
					padding-left: 20px;
				}

				.required-symbol {
					color: var(--ibm-orange-60);
				}

				tricomp-contact-roles-table-row {
					padding-right: 10px;
				}

				.button-container {
					@apply --layout-end-justified;
					@apply --layout-horizontal;
				}

				paper-button#newRowButton {
					border: 0 !important;
					padding: 10px !important;
					margin: 10px 0 !important;
				}

				#newRowButton:hover {
					background-color: var(--tri-primary-color);
				}

				.button-content {
					@apply --layout-horizontal;
					font-weight: bold;
				}

				iron-icon {
					padding: 0;
					height: 18px;
					width: 18px;
				}

				:host([dir="ltr"]) iron-icon {
					margin-left: 5px;
				}

				:host([dir="rtl"]) iron-icon {
					margin-right: 5px;
				}
			</style>

			<div class="roles-message">For some roles, you can assign only one contact.</div>

			<div class="table-header row secondary-text">
				<div class="column-2 cell">
					<span class="required-symbol">*</span>&nbsp;<span>Role</span>
				</div>

				<div class="column-2 cell header-2">
					<span class="required-symbol">*</span>&nbsp;<span>Name</span>
				</div>

				<div class="column-1 cell header-2">Organization</div>

				<div class="column-1 cell header-2">Work phone</div>

				<div class="column-1 cell header-2">Fax</div>

				<div class="column-1 cell header-2">Email</div>

				<div class="column-icon-delete cell"></div>
			</div>
			
			<div id="tableBody" class="table-body">
				<dom-if if="[[!_isEmptyArray(contactRoles)]]" restamp>
					<template>
						<template is="dom-repeat" as="contactRole" items="{{contactRoles}}">
							<tricomp-contact-roles-table-row
								contact-roles-count="{{contactRolesCount}}"
								contact-role="{{contactRole}}" 
								contact-roles="[[contactRoles]]" 
								parent-record="[[parentRecord]]"
								index="[[index]]" 
								even="[[_computeEvenRowIndex(index)]]" 
								people-list="[[peopleList]]" 
								row-invalid="[[hasInvalid]]"
								fit-into="[[fitInto]]" 
								scroll-container="[[_scrollContainer]]"
								readonly="[[readonly]]"
								role-readonly="[[_computeRoleReadonly(contactRole, readonly, _forceRender)]]"
								on-contact-role-field-selected="_forceContactRolesTableRerender"
								on-contact-role-removed="_forceContactRolesTableRerender"
								>
								</tricomp-contact-roles-table-row>
						</template>
					</template>
				</dom-if>
				<div class="button-container">
					<paper-button id="newRowButton" secondary noink on-tap="_addContactRoles" hidden\$="[[readonly]]">
						<div class="button-content">
							<span>New row</span>
							<iron-icon icon="ibm-glyphs:add-new"></iron-icon>
						</div>
					</paper-button>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			contactRoles: {
				type: Array,
				notify: true
			},

			parentRecord: {
				type: Object
			},

			contactRolesCount: {
				type: Boolean,
				notify: true
			},

			fitInto: {
				type: Object
			},

			peopleList: {
				type: Array
			},

			hasInvalid: {
				type: Boolean
			},

			_scrollContainer: {
				type: Object
			},

			readonly: {
				type: Boolean,
				value: false
			},

			_forceRender: {
				type: Boolean,
				value: false
			}
		}
	}

	ready() {
		super.ready();
		afterNextRender(this, () => {
			if (!this._scrollContainer) this._scrollContainer = this.$.tableBody;
		});
	}

	_computeEvenRowIndex(index) {
		return (index % 2 == 0);
	}

	_addContactRoles(e) {
		e.stopPropagation();
		getTriserviceContactRoles().addContactRole();
		if (this.contactRoles && this.contactRoles.length === 1) {
			const contactRoles = this.contactRoles;
			this.set('contactRoles', null)
			afterNextRender(this, () => {
				this.set('contactRoles', contactRoles);
			})
		}
	}

	_isEmptyArray(array) {
		return isEmptyArray(array);
	}

	_computeRoleReadonly(contactRole, readonly, forceRender) {
		let required = false;
		if (contactRole.required && contactRole.roleRequirementENUS === "Requires Exactly One") {
			required = true;
		} else if (contactRole.required && contactRole.roleRequirementENUS === "Requires At Least One") {
			const requiresAtLeastOneRoles = this.contactRoles.filter(cr => cr.role === contactRole.role);
			if (requiresAtLeastOneRoles.length <= 1) {
				required = true;
			}
		}
		return required || readonly;
	}

	_forceContactRolesTableRerender(e) {
		e.stopPropagation();
		this.set('_forceRender', !this._forceRender);
	}

	static get importMeta() {
		return getModuleUrl("triapp-contact-roles/components/contact-roles-table/tricomp-contact-roles-table.js");
	}
}

window.customElements.define(ContactRolesTableComponent.is, ContactRolesTableComponent);