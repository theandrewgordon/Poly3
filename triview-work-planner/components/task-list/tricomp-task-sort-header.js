/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../styles/tristyles-work-planner.js";
import "../sort-switch/tricomp-sort-switch.js";
import "../undo-button/tricomp-undo-button.js";

class TricompTaskSortHeader extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-task-sort-header"; }

	static get template() {
		return html`
			<style include="work-planner-task-card-styles work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
				}
				:host([table-sort]) {
					padding: 0px 10px 0px 0px;
				}
				:host([dir="ltr"][table-sort]) {
					margin-right: 10px;
				}
				:host([dir="rtl"][table-sort]) {
					margin-left: 10px;
				}

				.selected-sort {
					@apply --layout-flex;
				}

				:host([no-sort]) .selected-sort {
					visibility: hidden;
				}

				.divider {
					background-color: var(--tri-primary-content-accent-color);
					width: 2px;
					height: 20px;
					margin: 0px 5px; 
				}

				.table-checkbox-column {
					height: 45px;
				}
			</style>

			<dom-if if="[[!tableSort]]">
				<template>
					<dom-if if="[[!noSelectAll]]">
						<template>
							<paper-checkbox class="checkbox" checked="{{selectAll}}" on-change="_handleCheckboxChange"></paper-checkbox>
						</template>
					</dom-if>
					
					<tricomp-sort-switch class="selected-sort" sort-field="_selectedTxt"
						on-sort-order-changed="_handleSortOrderChanged">
					</tricomp-sort-switch>

					<dom-if if="[[showUndo]]">
						<template>
							<div class="divider"></div>
							<tricomp-undo-button></tricomp-undo-button>
						</template>
					</dom-if>
				</template>
			</dom-if>

			<dom-if if="[[tableSort]]">
				<template>
					<div class="table-checkbox-column">
						<paper-checkbox class="checkbox" checked="{{selectAll}}" on-change="_handleCheckboxChange"
							hidden\$="[[noSelectAll]]"></paper-checkbox>
					</div>

					<div class="table-expand-column">
						<tricomp-sort-switch sort-field="_selectedTxt"
							on-sort-order-changed="_handleSortOrderChanged" hidden\$="[[noSelectAll]]">
						</tricomp-sort-switch>
					</div>

					<div class="table-first-column">
						<tricomp-sort-switch label="Name" sort-field="name"
							on-sort-order-changed="_handleSortOrderChanged">
						</tricomp-sort-switch>
					</div>

					<div class="table-middle-column">
						<tricomp-sort-switch label="Location" sort-field="_location"
							on-sort-order-changed="_handleSortOrderChanged">
						</tricomp-sort-switch>
					</div>

					<div class="table-last-column">
						<tricomp-sort-switch label="Priority" sort-field="priorityRanking"
							on-sort-order-changed="_handleSortOrderChanged">
						</tricomp-sort-switch>
					</div>

					<div class="hover-icon-container" draggable\$="[[_computeDraggable(disableDrag)]]"></div>
				</template>
			</dom-if>
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

			showUndo: {
				type: Boolean,
				value: false
			},

			noSort: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			noSelectAll: {
				type: Boolean,
				value: false
			},

			tableSort: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			disableDrag: {
				type: Boolean,
				value: false
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

	_computeDraggable(disableDrag) {
		return disableDrag ? false : "true";
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-task-sort-header.js");
	}
}

window.customElements.define(TricompTaskSortHeader.is, TricompTaskSortHeader);