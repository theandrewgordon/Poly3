/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { templatize } from "../../../@polymer/polymer/lib/utils/templatize.js";

let dropdownInstances = new Map();

export const TrimixinDropdownComponent = (superClass) => class extends superClass {
	static get properties() {
		return {
			opened: {
				type: Boolean,
				notify: true
			},

			fitInto: {
				type: Object
			},

			scrollContainer: {
				type: Object,
				observer: "_handleScrollContainerChanged"
			},

			setTargetWidth: {
				type: Boolean,
				value: false
			}
		};
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._closeDropdown();
	}

	_handleScrollContainerChanged(newScrollContainer) {
		if (this.opened) {
			this._getDropdown().applyScrollContainer(newScrollContainer);
		}
	}

	_getDropdown() {
		const componentName = Object.getPrototypeOf(this).constructor.is;
		let dropdown = dropdownInstances.get(componentName);
		if (!dropdown) {
			const dropdownTemplate = this.$.dropdownTemplate;
			if (dropdownTemplate) {
				const DropdownTemplateClass = templatize(dropdownTemplate, this);
				let dropdownTemplateInstance = new DropdownTemplateClass(null);
				document.body.appendChild(dropdownTemplateInstance.root);
				dropdown = document.body.querySelector(`#${componentName}-dropdown`);
				dropdownInstances.set(componentName, dropdown);
			}
		}
		return dropdown;
	}

	_closeDropdown() {
		if (this.opened) this._getDropdown().close();
	}
}