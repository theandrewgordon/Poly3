/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { getTriserviceWorkPlanner } from "../../services/triservice-work-planner.js";
import "../dropdown/tricomp-dropdown-button.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "../text-placeholder/tricomp-text-placeholder.js";
import "./tricomp-hours-selector-dropdown.js";

class TricompHoursSelector extends TrimixinDropdownComponent(PolymerElement) {
	static get is() { return "tricomp-hours-selector"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
			</style>

			<tricomp-dropdown-button opened="[[opened]]" read-only="[[readOnly]]" on-toggle-dropdown="_handleToggleDropdown">
				<span>
					<tricomp-text-placeholder value="[[value]]" placeholder="0 hrs">
						[[value]] hrs
					</tricomp-text-placeholder>
				</span>
			</tricomp-dropdown-button>

			<template id="dropdownTemplate">
				<tricomp-hours-selector-dropdown id="tricomp-hours-selector-dropdown"></tricomp-hours-selector-dropdown>
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

			readOnly: {
				type: Boolean,
				value: false
			},

			workHours: {
				type: Boolean,
				value: false
			}
		};
	}

	_handleToggleDropdown(e) {
		e.stopPropagation();
		this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, this.task, this.value, this.workHours, getTriserviceWorkPlanner().isTouchDevice);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/hours-selector/tricomp-hours-selector.js");
	}
}

window.customElements.define(TricompHoursSelector.is, TricompHoursSelector);