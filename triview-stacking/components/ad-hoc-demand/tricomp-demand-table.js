/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-list/iron-list.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../styles/tristyles-stacking.js";
import { getTriserviceAdHocDemand } from "../../services/triservice-ad-hoc-demand.js";
import "./tricomp-demand-table-row.js";

class DemandTableComponent extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-demand-table"; }

	static get template() {
		return html`
			<style include="stacking-demand-table-styles tristyles-theme">
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
					font-family: var(--tri-font-family);
					font-size: 14px;
				}

				.table-header {
					border-bottom: 1px solid var(--ibm-gray-10);
					color: var(--tri-primary-content-color);
					font-weight: 500;
					height: 45px;
				}

				.table-body {
					@apply --layout-flex;
					color: var(--ibm-gray-100);
					overflow-y: auto;
				}

				.required-symbol {
					color: var(--ibm-orange-60);
				}
				:host([readonly]) .required-symbol {
					display: none;
				}

				.button-container {
					@apply --layout-end-justified;
					@apply --layout-horizontal;
				}

				paper-button {
					border: 0 !important;
					padding: 10px !important;
				}

				.button-content {
					@apply --layout-horizontal;
				}

				iron-icon {
					padding: 0;
					height: 18px;
					width: 18px;
				}
				:host([dir="ltr"]) iron-icon {
					margin-left: 5px;
				}
				:host([dir="rtl"]) iron-icon {
					margin-right: 5px;
				}
			</style>

			<div class="table-header row">
				<div class="column-icon-expand cell cell-expand-icon"></div>

				<div class="column-2 cell">
					<div>
						<span class="required-symbol">*</span> Organization
					</div>
				</div>

				<div class="column-1 cell">
					<div>
						<span class="required-symbol">*</span> Initial floor
					</div>
				</div>

				<div class="column-2 cell">
					<div>
						<span class="required-symbol">*</span> Space class
					</div>
				</div>

				<div class="column-1 cell">
					<div class="number-cell">
						<span class="required-symbol">*</span> Quantity
					</div>
				</div>

				<div class="column-1 cell">
					<div class="number-cell">
						<span class="required-symbol">*</span> Total area
					</div>
				</div>

				<dom-if if="[[!readonly]]">
					<template>
						<div class="column-icon-delete cell"></div>
					</template>
				</dom-if>
			</div>
			
			<div id="tableBody" class="table-body">
				<template is="dom-repeat" as="demand" items="{{demands}}">
					<tricomp-demand-table-row demand="{{demand}}" demands="[[demands]]" floors="[[floors]]"
						readonly="[[readonly]]" index="[[index]]" even="[[_computeEvenRowIndex(index)]]"
						fit-into="[[fitInto]]" scroll-container="[[_scrollContainer]]"></tricomp-demand-table-row>
				</template>
			</div>

			<dom-if if="[[!readonly]]">
				<template>
					<div class="button-container">
						<paper-button secondary noink on-tap="_addDemand">
							<div class="button-content">
								New row <iron-icon icon="ibm-glyphs:add-new"></iron-icon>
							</div>
						</paper-button>
					</div>
				</template>
			</dom-if>
			
		`;
	}

	static get properties() {
		return {
			demands: {
				type: Array,
				notify: true
			},

			fitInto: {
				type: Object
			},

			floors: {
				type: Array
			},

			readonly: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			_scrollContainer: {
				type: Object
			}
		}
	}

	ready() {
		super.ready();
		afterNextRender(this, () => {
			if (!this._scrollContainer) this._scrollContainer = this.$.tableBody;
		});
	}

	validateRowFields() {
		var rowValidationPromises = [];
		let demandRows = this.shadowRoot.querySelectorAll("tricomp-demand-table-row:not([hidden])");
		demandRows.forEach((row) => rowValidationPromises.push(row.validateFields()));

		return Promise.all(rowValidationPromises).then((results) => {
			let invalids = results;
			let invalid = false;
			for (let i = 0; i < invalids.length; i++) {
				if (invalids[i]) {
					invalid = true;
					break;
				}
			}
			return invalid;
		}, this);
	}

	_computeEvenRowIndex(index) {
		return (index % 2 == 0);
	}

	_addDemand(e) {
		e.stopPropagation();

		if (!this.readonly) getTriserviceAdHocDemand().addDemand();
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/ad-hoc-demand/tricomp-demand-table.js");
	}
}

window.customElements.define(DemandTableComponent.is, DemandTableComponent);