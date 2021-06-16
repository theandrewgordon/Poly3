/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

class ContactRoleFieldValidationComponent extends PolymerElement {
	static get is() { return "tricomp-contact-role-field-validation"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					color: var(--ibm-orange-60);
					font-family: var(--tri-font-family);
					font-size: 12px;
				}
			</style>

			[[_errorMessage]]
		`;
	}

	static get properties() {
		return {
			autoValidate: {
				type: Boolean,
				value: false
			},

			/**
			 * Indicate that the `value` is not valid.
			 */
			invalid: {
				type: Boolean,
				value: false,
				notify: true
			},

			/**
			 * Indicate that the `value` is required.
			 */
			required: {
				type: Boolean,
				value: false
			},

			/**
			 * The `value` to validate.
			 */
			value: {
				type: String
			},

			_errorMessage: {
				type: String
			}
		}
	}

	static get observers() {
		return [
			"_handleAutoValidate(autoValidate, value, required)",
			"_computeErrorMessage(invalid, required)"
		];
	}

	validate() {
		return new Promise((resolve) => {
			this._setInvalid(this.value, this.required);
			setTimeout(resolve(this.invalid), 1);
		}, this);
	}

	_handleAutoValidate(autoValidate, value, required) {
		if (autoValidate) this._setInvalid(value, required);
	}

	_setInvalid(value, required) {
		if (required && (!value || value == "")) {
			this.invalid = true;
		} else if (required && value && value != "") {
			this.invalid = false;
		}
	}

	_computeErrorMessage(invalid, required) {
		let __dictionary__requiredField =  "Required";

		if (invalid && required) {
			this._errorMessage = __dictionary__requiredField;
		} else if (!invalid) {
			this._errorMessage = "";
		}
	}

	static get importMeta() {
		return getModuleUrl("triapp-contact-roles/components/field-validation/tricomp-contact-role-field-validation.js");
	}
}

window.customElements.define(ContactRoleFieldValidationComponent.is, ContactRoleFieldValidationComponent);