/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement,html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/neon-animation/animations/scale-down-animation.js";

import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-selector/iron-selector.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../styles/tristyles-stacking.js";
import "./tricomp-stack-plan-legend-item.js";

class StackBuildingLegend extends PolymerElement {
	static get is() { return "tricomp-stack-plan-legend"; }

	static get template() {
		return html `
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					max-width: 170px;
				}

				.title {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 12px 0px 10px;
					font-weight: bold;
				}

				.hide-expand-icon {
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
					--iron-icon-stroke-color: var(--tri-primary-color);
					padding: 0px 7px;
					cursor: pointer;
				}

				:host([_opened]) .hide-expand-icon {
					transform: rotate(0deg);  
				}

				:host(:not([_opened])) .hide-expand-icon {
					transform: rotate(180deg);  
				}

				.orgs {
					@apply --layout-vertical;
					padding: 10px 7px;
					border-top: 1px solid var(--ibm-gray-10);
				}

				.iron-selected {
					--tricomp-stack-plan-legend-item-name: {
						font-weight: bold;
					}
				}

				:not(.iron-selected) {
					--tricomp-stack-plan-legend-item-name: {
						font-weight: normal;
					}
				}
			</style>

			<div class="title">
				<iron-icon class="hide-expand-icon" icon="ibm-glyphs:expand-open"
					on-tap="_toggleLegendOpen"></iron-icon>
				</iron-icon>
				<span class="noselect" hidden\$="[[!_opened]]">Legend</span>
			</div>
			<iron-collapse id="orgLegend" opened="[[_opened]]">
				<div class="orgs" hidden\$="[[!_opened]]">
					<tricomp-stack-plan-legend-item name="[[_unallocatedName]]" fill="[[_unallocatedColor]]"></tricomp-stack-plan-legend-item>
					<iron-selector attr-for-selected="path" selected="{{highlighted}}">
						<template is="dom-repeat" items="[[orgs]]" restamp>
							<tricomp-stack-plan-legend-item
								name="[[item.name]]"
								fill="[[item.fill]]"
								path="[[item.path]]"
								on-mouseover="_handleOrgHover"
								on-mouseleave="_handleOrgLeave"
								selected-stack="[[selectedStack]]"
								building-id="[[buildingId]]"
								stack-hover="[[_computeStackHover(item.path, stackHoverOrg)]]">
							</tricomp-stack-plan-legend-item>
						</template>
					</iron-selector>
				</div>
			</iron-collapse>
		`
	}

	static get properties() {
		return {
			orgs: {
				type: Array
			},

			highlighted: {
				type: String,
				notify: true
			},

			selectedStack: {
				type: Object
			},

			buildingId: {
				type: String
			},

			_opened: {
				type: Boolean,
				reflectToAttribute: true,
				value: true
			},

			_unallocatedName: {
				type: String,
				value: () => {
					const __dictionary__unallocatedName = "Unallocated";
					return __dictionary__unallocatedName;
				}
			},

			_unallocatedColor: {
				type: String,
				value: "var(--ibm-gray-10)"
			},

			stackHoverOrg: String
		}
	}

	scrollLegendToTop() { 
		this.$.orgLegend.scrollTop = 0;
	}

	_handleOrgHover(e) {
		e.stopPropagation();
		this.set("highlighted", e.target.path);
	}

	_handleOrgLeave(e) {
		e.stopPropagation();
		this.set("highlighted", null);
	}

	_toggleLegendOpen(e) {
		e.stopPropagation();
		this.set("_opened", !this._opened);
	}

	_computeStackHover(path, stackHoverOrg) {
		return path === stackHoverOrg;
	}
}

window.customElements.define(StackBuildingLegend.is, StackBuildingLegend);