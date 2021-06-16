/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import {
	PolymerElement,
	html,
} from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-query/triplat-query.js";

import "../role-select-input/tricomp-role-select-input.js";
import "../contact-select-input/tricomp-contact-select-input.js";
import "../field-validation/tricomp-contact-role-field-validation.js";
import {
	computeNonEmptyContactRolesCount,
	formatNameForContact,
	computeRoleRequired,
} from "../../utils/triutils-contact-roles-app.js";
import "../../styles/tristyles-contact-roles-app.js";
import { getTriserviceContactRoles } from "../../services/triservice-contact-roles.js";

class ContactRolesTableRowComponent extends PolymerElement {
	static get is() {
		return "tricomp-contact-roles-table-row";
	}

	static get template() {
		return html`
			<style include="contact-roles-app-table-styles tristyles-theme">
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
					background-color: var(
						--tri-primary-content-background-color
					);
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

				.disabled-delete-icon {
					cursor: default;
					--iron-icon-fill-color: var(--tri-danger-color);
					opacity: 0.3;
				}

				tricomp-contact-select-input {
					@apply --layout-flex;
				}

				tricomp-contact-role-field-validation {
					position: absolute;
					bottom: 4px;
					left: 10px;
				}
			</style>

			<triservice-contact-roles
				id="contactRoleService"
				linked-business-object-list="{{linkedBusinessObjectList}}"
				contact-roles="{{contactRoles}}"
				people-list-search-value="[[contactRole.name]]"
				people-list-scroller="[[_peopleListScroller]]"
			>
			</triservice-contact-roles>

			<div class="row">
				<div class="column-2 cell">
					<tricomp-role-select-input
						selected-role="{{contactRole}}"
						value="{{contactRole.role}}"
						readonly="[[roleReadonly]]"
						placeholder="Select"
						attr-to-display="name"
						fit-into="[[fitInto]]"
						opened="{{_roleOpened}}"
						linked-business-object="[[parentRecord.recordBusinessObject]]"
						linked-form="[[parentRecord.recordForm]]"
						scroll-container="[[scrollContainer]]"
						on-item-selected="_onRoleSelected"
						invalid="[[_roleInvalid]]"
						set-target-width
					>
					</tricomp-role-select-input>
					<tricomp-contact-role-field-validation
						value="[[contactRole.role]]"
						invalid="{{_roleInvalid}}"
						required
					></tricomp-contact-role-field-validation>
				</div>

				<div class="column-2 cell">
					<tricomp-contact-select-input
						data="[[peopleList]]"
						value="{{contactRole.name}}"
						placeholder="Type to search"
						attr-to-display="computedContact"
						scroll-container="[[scrollContainer]]"
						fit-into="[[fitInto]]"
						opened="{{_nameOpened}}"
						on-item-selected="_onContactSelected"
						set-target-width
						invalid="[[_nameInvalid]]"
						readonly="[[readonly]]"
						scroller="{{_peopleListScroller}}"
					>
					</tricomp-contact-select-input>
					<tricomp-contact-role-field-validation
						value="[[contactRole.name]]"
						invalid="{{_nameInvalid}}"
						required
					></tricomp-contact-role-field-validation>
				</div>

				<div class="column-1 cell">
					<span>[[contactRole.organization]]</span>
				</div>

				<div class="column-1 cell">
					<span>[[contactRole.workPhone]]</span>
				</div>

				<div class="column-1 cell">
					<span>[[contactRole.fax]]</span>
				</div>

				<div class="column-1 cell">
					<span>[[contactRole.email]]</span>
				</div>

				<div class="column-icon-delete cell">
					<paper-icon-button
						class$="[[_computeDisabledIconStyle(roleReadonly)]]"
						icon="icons:remove-circle"
						danger
						on-tap="_deleteContactRole"
						disabled="[[roleReadonly]]"
					></paper-icon-button>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			contactRole: {
				type: Object,
				notify: true,
			},

			contactRoles: {
				type: Array,
			},

			linkedBusinessObjectList: Array,

			contactRolesCount: {
				type: Boolean,
				notify: true,
			},

			even: {
				type: Boolean,
				reflectToAttribute: true,
			},

			fitInto: {
				type: Object,
			},

			_focused: {
				type: Boolean,
				reflectToAttribute: true,
				computed: "_computeFocused(_roleOpened, _nameOpened)",
			},

			index: {
				type: Number,
			},

			_nameOpened: {
				type: Boolean,
			},

			_nameInvalid: {
				type: Boolean,
			},

			peopleList: {
				type: Array,
			},

			_peopleListScroller: {
				type: Object,
			},

			_roleOpened: {
				type: Boolean,
			},

			_roleInvalid: {
				type: Boolean,
			},

			rowInvalid: {
				type: Boolean,
			},

			scrollContainer: {
				type: Object,
			},

			readonly: {
				type: Boolean,
				value: false,
			},

			roleReadonly: {
				type: Boolean,
				value: false,
			},

			parentRecord: Object,
		};
	}

	static get observers() {
		return [
			"_computeNonEmptyContactRoleRowsCount(contactRole.*)",
			"_formatPeopleList(peopleList)",
			"_handleFieldsChanged(contactRole.role, contactRole.name)",
		];
	}

	_computeDisabledIconStyle(roleReadonly) {
		return roleReadonly ? "disabled-delete-icon" : "";
	}

	_formatPeopleList(peopleList) {
		if (peopleList) {
			peopleList.forEach((contact) => {
				contact.computedContact = formatNameForContact(contact);
			});
		}
	}

	_computeNonEmptyContactRoleRowsCount(contactRoleBase) {
		let contactRole = contactRoleBase.base;
		if (contactRole) {
			if (!contactRole.role) contactRole.roleObject = {};
			if (!contactRole.name) contactRole.personObject = {};
			if (this.rowInvalid) {
				this.validateFields();
			}
		}
		this.contactRolesCount = computeNonEmptyContactRolesCount(
			this.contactRoles
		);
	}

	_computeFocused(roleOpened, nameOpened) {
		return roleOpened || nameOpened;
	}

	_onRoleSelected(e) {
		if (e.detail && e.detail.item) {
			const cr = this.contactRole;
			this.set("contactRole", {});
			cr.role = e.detail.item.name;
			cr.roleObject = e.detail.item;
			cr.required = computeRoleRequired(
				e.detail.item.roleRequirement,
				e.detail.item.linkedBusinessObject,
				e.detail.item.linkedForm,
				this.parentRecord.recordBusinessObject,
				this.parentRecord.recordForm
			);
			cr.roleRequirementENUS = e.detail.item.roleRequirement;
			this.set("contactRole", cr);
			this.dispatchEvent(
				new CustomEvent("contact-role-field-selected", {
					bubbles: false,
					composed: false,
				})
			);
		}

		this._doProcessSelected();
	}

	_onContactSelected(e) {
		if (e.detail && e.detail.item) {
			const cr = this.contactRole;
			this.set("contactRole", {});
			const selected = e.detail.item;
			cr.computedContact = selected.computedContact;
			cr.organization = selected.organization;
			cr.fax = selected.fax;
			cr.email = selected.email;
			cr.workPhone = selected.workPhone;
			cr.personObject = selected;
			this.set("contactRole", cr);
			this.dispatchEvent(
				new CustomEvent("contact-role-field-selected", {
					bubbles: false,
					composed: false,
				})
			);
		}

		this._doProcessSelected();
	}

	_doProcessSelected() {
		if (this.parentRecord._id) {
			if (this.contactRole._id) {
				getTriserviceContactRoles().doUpdateContactRole(this.parentRecord._id, this.contactRole);
			} else if (this.contactRole.roleObject && this.contactRole.roleObject.name && this.contactRole.personObject && this.contactRole.personObject.name) {
				getTriserviceContactRoles().doCreateContactRole(this.parentRecord._id, this.parentRecord.recordBusinessObject, this.parentRecord.recordForm, this.contactRole)
					.then((result) => {
						this.dispatchEvent(
							new CustomEvent(
								"partially-filled-contact-role-created",
								{
									detail: { item: this.contactRole },
									bubbles: true,
									composed: true,
								}
							)
						);
					});
			} else if ((this.contactRole.roleObject && this.contactRole.roleObject.name) || (this.contactRole.personObject && this.contactRole.personObject.name)) {
				getTriserviceContactRoles().addContactRoleFromContactRolesPartiallyCompleted(this.contactRole);
			}
		}
	}

	_deleteContactRole(e) {
		e.stopPropagation();
		if (this.contactRole._id) {
			getTriserviceContactRoles().deleteContactRole(
				this.parentRecord._id,
				this.contactRole._id
			);
		} else {
			if (this.contactRole.name || this.contactRole.role) {
				getTriserviceContactRoles().removeContactRoleFromContactRolesPartiallyCompleted(
					this.contactRole
				);
			}
			getTriserviceContactRoles().removeContactRole(this.index);
			this.dispatchEvent(
				new CustomEvent("contact-role-removed", {
					bubbles: false,
					composed: false,
				})
			);
		}
	}

	validateFields() {
		var validationPromises = [];
		let fieldValidations = this.shadowRoot.querySelectorAll(
			"tricomp-contact-role-field-validation"
		);
		let count = 0;
		fieldValidations.forEach((field) => {
			if (field.value == "" || field.value == null) count++;
		});
		fieldValidations.forEach((field) => {
			if (count < 2) {
				validationPromises.push(field.validate());
				field.autoValidate = true;
			} else {
				field.invalid = false;
				field.autoValidate = false;
			}
		}, this);
	}

	_handleFieldsChanged(role, contact) {
		if (role || contact) {
			this.validateFields();
		} else if (!role && !contact && !this.contactRole._id) {
			this.set("_roleInvalid", false);
			this.set("_nameInvalid", false);
		}
	}

	static get importMeta() {
		return getModuleUrl(
			"triapp-contact-roles/components/contact-roles-table/tricomp-contact-roles-table-row.js"
		);
	}
}

window.customElements.define(
	ContactRolesTableRowComponent.is,
	ContactRolesTableRowComponent
);
