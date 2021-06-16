/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-selector/iron-selector.js";
import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/paper-item/paper-item.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../dropdown/tricomp-dropdown-button.js";

class TricompTaskStatusTabSmall extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-task-status-tab-small"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				tricomp-dropdown-button {
					height: 45px;
					padding-left: 15px;
					padding-right: 15px;
					--tricomp-dropdown-button: {
						@apply --layout-flex;
						justify-content: normal;
					};
					--tricomp-dropdown-button-selected-item: {
						@apply --layout-flex;
					}
				}

				.selected {
					@apply --layout-flex;
					@apply --layout-horizontal;
				}

				.selected-label {
					@apply --layout-flex;
					color: var(--tri-primary-icon-button-color);
					font-weight: 500;
				}

				:host([dir="ltr"]) .selected-label{ 
					padding-left: 5px;
				}
				:host([dir="rtl"]) .selected-label {
					padding-right: 5px;
				}

				.selector {
					@apply --layout-flex;
				}

				paper-item {
					background-color: #325c80;
					border-bottom: 1px solid var(--tri-primary-dark-color);
					color: white !important;
					font-size: 14px;
					padding-left: 15px;
					padding-right: 15px;
					--paper-item-focused-before: {
						display: none;
					};
					--paper-item-focused: {
						background-color: var(--tri-primary-dark-color);
					};
				}

				paper-item.iron-selected {
					background-color: var(--tri-primary-dark-color);
				}
			</style>

			<tricomp-dropdown-button opened="[[_opened]]" on-toggle-dropdown="_handleToggleDropdown">
				<span class="selected">Display: <span class="selected-label">[[_getLabel(_selectedItem)]]</span></span>
			</tricomp-dropdown-button>
			<iron-collapse opened="[[_opened]]">
				<iron-selector class="selector" attr-for-selected="name" selected="{{selected}}" selected-item="{{_selectedItem}}">
					<paper-item slot="items" name="unassigned" label="Unassigned" role="option">Unassigned</paper-item>
					<paper-item slot="items" name="assigned" label="Assigned" role="option">Assigned</paper-item>
					<paper-item slot="items" name="overdue" label="Overdue" role="option">Overdue</paper-item>
				</iron-selector>
			</iron-collapse>
		`;
	}

	static get properties() {
		return {
			selected: {
				type: String,
				notify: true,
				observer: "_handleSelectedChanged"
			},

			_opened: {
				type: Boolean,
				value: false
			},

			_selectedItem: {
				type: Object
			}
		};
	}

	_getLabel(selectedItem) {
		return selectedItem ? selectedItem.getAttribute("label") : "";
	}

	_handleToggleDropdown() {
		this._opened = !this._opened;
	}

	_handleSelectedChanged() {
		this._opened = false;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-status-tab/tricomp-task-status-tab-small.js");
	}
}

window.customElements.define(TricompTaskStatusTabSmall.is, TricompTaskStatusTabSmall);