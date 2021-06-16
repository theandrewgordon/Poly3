/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDateUtilities } from "../../../triplat-date-utilities/triplat-date-utilities.js";
import { getTriserviceWorkPlanner } from "../../services/triservice-work-planner.js";
import "../dropdown/tricomp-dropdown-button.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "./tricomp-datetime-selector-dropdown.js";

class TricompDatetimeSelector extends mixinBehaviors([TriDateUtilities], TrimixinDropdownComponent(PolymerElement)) {
	static get is() { return "tricomp-datetime-selector"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				tricomp-dropdown-button {
					--icon-padding: 0;
				}
			</style>

			<tricomp-dropdown-button opened="[[opened]]" read-only="[[readOnly]]" on-toggle-dropdown="_handleToggleDropdown">
				<span>[[formatDateWithTimeZone(value, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</span>
			</tricomp-dropdown-button>

			<template id="dropdownTemplate">
				<tricomp-datetime-selector-dropdown id="tricomp-datetime-selector-dropdown"></tricomp-datetime-selector-dropdown>
			</template>
		`;
	}

	static get properties() {
		return {
			label: {
				type: String
			},

			value: {
				type: String,
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
			},

			plannedStart: {
				type: Boolean,
				value: false
			},

			plannedEnd: {
				type: Boolean,
				value: false
			}
		};
	}

	_handleToggleDropdown(e) {
		e.stopPropagation();
		this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, this.task, this.value, 
				this.currentUser, this.label, this.plannedStart, this.plannedEnd, getTriserviceWorkPlanner().isTouchDevice);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/date-selector/tricomp-datetime-selector.js");
	}
}

window.customElements.define(TricompDatetimeSelector.is, TricompDatetimeSelector);