/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/iron-icon/iron-icon.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-uom/triplat-uom.js";

import "../../services/triservice-stacking.js";

import "../overflow-text/tricomp-overflow-text.js";

class FloorFlyoutTableComponent extends PolymerElement {
	static get is() { return 'tricomp-floor-flyout-table' }

	static get template() {
		return html `
			<style include="tristyles-theme">

				.mismatch {
					color: var(--ibm-orange-50);
				}

				.supply-demand-header {
					@apply --layout-vertical;
					@apply --layout-start;
				}

				.supply-demand {
					@apply --layout-horizontal;
					@apply --layout-center-justified;
					@apply --layout-flex;
					@apply --layout-self-stretch;
				}

				.supply-demand > *:not(triplat-uom) {
					padding-left: 5px;
				}

				.discrepancy-icon {
					padding: 0px 5px;
					min-height: 16px;
					min-width: 16px;
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
					--iron-icon-fill-color: var(--ibm-yellow-40);
				}

				table {
					border-collapse: collapse;
					table-layout: fixed;
				}

				th {
					color: var(--ibm-gray-70);
					font-weight: 500;
				}

				td, th {
					padding: 5px;
					box-sizing: border-box;
					height: 44px;
					min-width: 120px;
				}

				tr:not(:last-of-type) td, tr:not(:last-of-type) th {
					border-bottom: 1px solid var(--ibm-gray-10);
				}

				tr:last-of-type td {
					background-color: var(--ibm-neutral-2);
				}

				.content {
					@apply --layout-horizontal;
				}

				.center {
					@apply --layout-flex;
					border-left: 1px solid var(--ibm-gray-10);
					border-right: 1px solid var(--ibm-gray-10);
				}

				.space-class {
					max-width: 120px;
				}

				.space-class-header {
					@apply --layout-horizontal;
					@apply --layout-center;
				}
			</style>

			<triservice-stacking uom-area-units="{{_uomAreaUnits}}"></triservice-stacking>

			<table>
				<tr>
					<th class="space-class">
						<div class="space-class-header">
							<span>Space class</span>
						</div>
					</th>
					<th class="center">
						<div class="supply-demand-header">
							<span>Count</span>
							<span>Supply / Demand</span>
						</div>
					</th>
					<th>
						<div class="supply-demand-header">
							<span>Area</span>
							<span>Supply / Demand</span>
						</div>
					</th>
				</tr>
				<template is="dom-repeat" items="[[data]]">
					<tr>
						<td class="space-class">
							<tricomp-overflow-text lines="2" text="[[item.name]]" title="[[item.name]]"></tricomp-overflow-text>
						</td>
						<td class="center">
							<div class="content">
								<template is="dom-if" if="[[!item.isTotal]]">
									<div class="supply-demand">
										<span>[[item.supplyCount]]</span>
										<span>/</span>
										<span class\$="[[_computeMismatchClass(item.countMismatch)]]">[[item.demandCount]]</span>
									</div>
									<template is="dom-if" if="[[item.countMismatch]]">
										<iron-icon class="discrepancy-icon" icon="ibm-glyphs:warning"></iron-icon>
									</template>
									<template is="dom-if" if="[[!item.countMismatch]]">
										<div class="discrepancy-icon"></div>
									</template>
								</template>
							</div>
						</td>
						<td>
							<div class="content">
								<div class="supply-demand">
									<span>[[item.supplyArea]]</span>
									<span>/</span>
									<span class\$="[[_computeMismatchClass(item.areaMismatch)]]">[[item.demandArea]]&nbsp;</span>
									<triplat-uom display="abbr" uom="[[item.uom]]" uom-list="[[_uomAreaUnits]]"></triplat-uom>
								</div>
								<template is="dom-if" if="[[item.areaMismatch]]">
									<iron-icon class="discrepancy-icon" icon="ibm-glyphs:warning"></iron-icon>
								</template>
								<template is="dom-if" if="[[!item.areaMismatch]]">
									<div class="discrepancy-icon"></div>
								</template>
							</div>
						</td>
					</tr>
				</template>
			</table>
		`;
	}

	static get properties() {
		return {
			data: Array,
			_uomAreaUnits: Array
		}
	}

	_computeMismatchClass(mismatch) {
		return mismatch ? "mismatch" : "";
	}
}

window.customElements.define(FloorFlyoutTableComponent.is, FloorFlyoutTableComponent);