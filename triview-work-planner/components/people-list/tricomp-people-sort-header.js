/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../styles/tristyles-work-planner.js";
import "../sort-switch/tricomp-sort-switch.js";

class TricompPeopleSortHeader extends  mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-people-sort-header"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					flex-shrink: 0;
				}

				:host([dir="ltr"]:not([small-layout])) {
					padding-right: 46px;
				}

				:host([dir="rtl"]:not([small-layout])) {
					padding-left: 46px;
				}

				:host([small-layout][dir="ltr"]) {
					padding-left: 5px;
					padding-right: 15px;
				}
				
				:host([small-layout][dir="rtl"]) {
					padding-left: 15px;
					padding-right: 5px;
				}

				.selected-sort {
					@apply --layout-flex-3;
				}

				:host([dir="ltr"]) .selected-sort {
					padding-right: 70px;
				}

				:host([dir="rtl"]) .selected-sort {
					padding-left: 70px;
				}
				
				.capacity-sort {
					@apply --layout-flex-5;
				}
			</style>
			<paper-checkbox class="checkbox" checked="{{selectAll}}" on-change="_handleCheckboxChange" disabled="[[disableSelectAll]]"></paper-checkbox>
			<tricomp-sort-switch class="selected-sort" sort-field="_selectedTxt"
				on-sort-order-changed="_handleSortOrderChanged">
			</tricomp-sort-switch>
			<tricomp-sort-switch class="capacity-sort" label="Capacity" sort-field="availability.plannedHours"
				on-sort-order-changed="_handleSortOrderChanged">
			</tricomp-sort-switch>
		`;
	}
	static get properties() {
		return {
			sortField: {
				type: String,
				notify: true
			},
	
			sortDesc: {
				type: Boolean,
				notify: true,
				value: false
			},

			selectAll: {
				type: Boolean,
				value: false,
				notify: true
			},

			disableSelectAll: {
				type: Boolean,
				value: false
			},

			smallLayout: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			}
		};
	}

	reset() {
		this._clearSortSwitches();
		this.selectAll = false;
	}

	_getAllSortSwicthes() {
		return this.shadowRoot.querySelectorAll("tricomp-sort-switch");
	}

	_handleCheckboxChange() {
		this.dispatchEvent(
			new CustomEvent(
				"select-all-changed-by-user", 
				{
					detail: { selectAll: this.selectAll },
					bubbles: false, composed: false
				}
			)
		);
	}

	_handleSortOrderChanged(e) {
		let sortOrder = e.target.sortOrder;
		if (sortOrder != "") {
			this.sortField = e.target.sortField;
			this.sortDesc = sortOrder == "DESC";
			this._clearSortSwitches(e.target);
		} else if (this.sortField == e.target.sortField) {
			this.sortField = "";
			this.sortDesc = false;
			this._clearSortSwitches(e.target);
		}
	}

	_clearSortSwitches(elementToNotClear) {
		this._getAllSortSwicthes().forEach((item) => {
			if (!elementToNotClear || item != elementToNotClear) {
				item.sortOrder = "";
			}
		});
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/people-list/tricomp-people-sort-header.js");
	}
}

window.customElements.define(TricompPeopleSortHeader.is, TricompPeopleSortHeader);