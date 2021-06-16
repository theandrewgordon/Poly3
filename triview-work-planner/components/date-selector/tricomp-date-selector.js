/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { formatDate } from "../../utils/triutils-date.js";
import { getTriserviceWorkPlanner } from "../../services/triservice-work-planner.js";
import "../dropdown/tricomp-dropdown-button.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "./tricomp-date-selector-dropdown.js";

class TricompDateSelector extends TrimixinDropdownComponent(PolymerElement) {
	static get is() { return "tricomp-date-selector"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
			</style>

			<tricomp-dropdown-button opened="[[opened]]" read-only="[[readOnly]]" on-toggle-dropdown="_handleToggleDropdown">
				<span>[[_formatDate(value, currentUser)]]</span>
			</tricomp-dropdown-button>

			<template id="dropdownTemplate">
				<tricomp-date-selector-dropdown id="tricomp-date-selector-dropdown"></tricomp-date-selector-dropdown>
			</template>
		`;
	}

	static get properties() {
		return {
			value: {
				type: Number,
				notify: true
			},

			task: {
				type: Object,
				observer: "_closeDropdown"
			},

			currentUser: {
				type: Object
			},

			readOnly: {
				type: Boolean,
				value: false
			}
		};
	}

	_handleToggleDropdown(e) {
		e.stopPropagation();
		this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, this.task, this.value, this.currentUser, getTriserviceWorkPlanner().isTouchDevice);
	}

	_formatDate(date, currentUser) {
		if (!date || !currentUser) {
			return "";
		}
		return formatDate(date, currentUser._DateFormat, currentUser._Locale);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/date-selector/tricomp-date-selector.js");
	}
}

window.customElements.define(TricompDateSelector.is, TricompDateSelector);