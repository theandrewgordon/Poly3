/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../dropdown/tricomp-dropdown-button.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "./tricomp-task-priority-dropdown.js";
import "./tricomp-task-priority-item.js";

class TricompTaskPriority extends TrimixinDropdownComponent(PolymerElement) {
	static get is() { return "tricomp-task-priority"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				tricomp-dropdown-button {
					--icon-padding: 0;
				}
				:host([text-overflow]) tricomp-dropdown-button {
					min-width: 90px;
					--tricomp-dropdown-button: {
						min-width: 0;
					};
					--tricomp-dropdown-button-selected-item: {
						min-width: 0;
					};
				}

				tricomp-task-priority-item {
					--priority-icon-height: 16px;
					--priority-icon-width: 16px;
				}
			</style>

			<tricomp-dropdown-button opened="[[opened]]" read-only="[[readOnly]]" on-toggle-dropdown="_handleToggleDropdown">
				<tricomp-task-priority-item vertical="[[vertical]]" horizontal="[[horizontal]]"
					priority="[[priority]]" priority-en-us="[[priorityEnUs]]" priority-color="[[priorityColor]]" 
					icon-only="[[iconOnly]]" text-overflow="[[textOverflow]]"></tricomp-task-priority-item>
			</tricomp-dropdown-button>

			<template id="dropdownTemplate">
				<tricomp-task-priority-dropdown id="tricomp-task-priority-dropdown"></tricomp-task-priority-dropdown>
			</template>
		`;
	}

	static get properties() {
		return {
			task: {
				type: Object,
				observer: "_closeDropdown"
			},

			readOnly: {
				type: Boolean,
				value: false
			},

			priority: {
				type: String,
				value: ""
			},

			priorityEnUs: {
				type: String,
				value: ""
			},

			priorityColor: {
				type: String
			},

			iconOnly: {
				type: Boolean
			},

			vertical: {
				type: Boolean,
				value: false
			},

			horizontal: {
				type: Boolean,
				value: false
			},

			dropdownHorizontalAlign: {
				type: String, 
				value: "left"
			},

			textOverflow: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			}
		};
	}

	_handleToggleDropdown(e) {
		e.stopPropagation();
		this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, this.task, this.priorityEnUs, this.dropdownHorizontalAlign);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-priority/tricomp-task-priority.js");
	}
}

window.customElements.define(TricompTaskPriority.is, TricompTaskPriority);