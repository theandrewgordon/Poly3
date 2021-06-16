/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import { assertParametersAreDefined } from "../../../tricore-util/tricore-util.js";

import { isEquivalent, computePercentageValue, getOrgColor, computeAllocationWidth } from "../../utils/triutils-stacking.js";
import "../space-allocation-stack/tricomp-space-allocation-stack.js";

class FloorStackComponent extends PolymerElement {
	static get is() { return "tricomp-floor-stack"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-flex;
					height: 32px;
				}

				.floor-stack-supply {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-end-justified;
					background-color: var(--ibm-gray-10);
					box-sizing: border-box;
					height: 100%;
					position: relative;
				}
				
				.floor-stack-supply::after {
					@apply --layout-fit;
					background-color: var(--ibm-gray-70);
					content: " ";
					left: auto;
					width: 3px;
					z-index: 2;
				}

				.allocation-blocks {
					@apply --layout-fit;
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.allocation-block-buffer {
					width: 4px;
				}

				:host([dropzone-active]) #floor {
					outline: 2px solid rgb(118, 38, 121) !important;
				}

				#floor {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-flex;
					@apply --layout-relative;
					height: 32px;
					outline: 2px solid transparent;
					border: 1px solid #FFFFFF;
				}
			</style>

			<div id="floor">
				<div class="floor-stack-supply" style\$="[[_computeFloorStackSupplyStyle(_floorStackSupplyPercentage)]]"></div>
				<div class="allocation-blocks">
					<dom-repeat id="spaceStacksList" items="{{floor.stacks}}">
						<template>
							<tricomp-space-allocation-stack 
								title="{{item.org}}" 
								space-stack="[[item]]"
								style\$="[[_computeAllocationBlockStyle(item, assignableSpacesOnly, showToScale, floor.area, maxFloorArea, item.orgPath.value, floor.stacks.length, index)]]"
								color="[[_getStackColor(item.orgPath.value, buildingOrgs)]]"
								highlight="[[_computeHighlight(highlightedOrg, item.orgPath.value)]]"
								on-tap="_onTapSelected"
								show-to-scale="[[showToScale]]"
								selected="[[_computeSelected(selectedStack, item.orgPath.value, item)]]"
								draggable="true"
								assignable-spaces-only="[[assignableSpacesOnly]]">
							</tricomp-space-allocation-stack>
							<template is="dom-if" if="[[_computeAllocationWidth(item, assignableSpacesOnly, showToScale, floor.area, maxFloorArea)]]">
								<div class="allocation-block-buffer"></div>
							</template>
						</template>
					</dom-repeat>
				</div>
			</div>
		`;
	}
	
	static get properties() {
		return {
			floor: Object,

			maxFloorArea: Number,

			showToScale: Boolean,

			assignableSpacesOnly: {
				type: Boolean,
				value: false
			},

			_floorStackSupplyPercentage: {
				type: String,
				computed: "_computeFloorStackSupplyPercentage(floor.area, floor.assignableArea, maxFloorArea, showToScale, assignableSpacesOnly)"
			},
			
			buildingOrgs: {
				type: Array
			},

			highlightedOrg: {
				type: String
			},

			selectedStack: {
				type: Object
			},

			_rendered: {
				type: Boolean,
				value: false
			},

			dropzoneActive: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_renderSpaceStacks(floor)"
		]
	}

	ready() {
		super.ready();
		this._setupDropZone(this);
	}

	_setupDropZone(el) {
		if (!el.ondragenter) el.ondragenter = this._onDragEnter.bind(this);
		if (!el.ondragover) el.ondragover = this._onDragOver.bind(this);
		if (!el.ondragleave) el.ondragleave = this._onDragLeave.bind(this);
		if (!el.ondrop) el.ondrop = this._onDrop.bind(this);
	}

	_onDragEnter(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
		this.dispatchEvent(new CustomEvent("dragging-over-floor", { detail: { draggingOver: true, floor: this.floor }, bubbles: true, composed: true }));
	}

	_onDragOver(event) {
		event.preventDefault();
	}

	_onDragLeave(event) {
		event.preventDefault();
		this.dispatchEvent(new CustomEvent("dragging-over-floor", { detail: { draggingOver: false }, bubbles: true, composed: true }));
	}

	_onDrop(event) {
		event.preventDefault();
		this.dispatchEvent(new CustomEvent("dragging-over-floor", { detail: { draggingOver: false }, bubbles: true, composed: true }));
		this.dispatchEvent(new CustomEvent("floor-drop", { detail: { floor: this.floor }, bubbles: true, composed: true }));
	}

	_computeAllocationBlockStyle(stack, assignableSpacesOnly, showToScale, floorArea, maxFloorArea, orgPath, stacksCount, index) {
		if (stack) {
			// Check if it is the last stack bar
			let bufferGap = (stacksCount -1 == index) ? 3 : 4;
			let style = "background-color:" + getOrgColor(orgPath, this.buildingOrgs) + ";width:";
			style += "calc(" + this._computeAllocationWidth(stack, assignableSpacesOnly, showToScale, floorArea, maxFloorArea) + "% - " + bufferGap + "px)";
			return style;
		} 
	}

	_computeAllocationWidth(stack, assignableSpacesOnly, showToScale, floorArea, maxFloorArea) {
		return computeAllocationWidth(stack, assignableSpacesOnly, showToScale, floorArea, maxFloorArea);
	}

	_computeFloorStackSupplyPercentage(floorArea, assignableFloorArea, maxFloorArea, showToScale, assignableSpacesOnly) {
		if (floorArea > 0) {
			const area = assignableSpacesOnly ? assignableFloorArea : floorArea;
			return showToScale ? computePercentageValue(area, maxFloorArea) + "%" : "100%";
		} else {
			return "0%";
		}
	}

	_computeFloorStackSupplyStyle(percentage) {
		return "width:" + percentage;
	}

	_computeHighlight(highlightedOrg, org) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}
		return highlightedOrg === org;
	}

	_computeSelected(selectedStack, org, item) {
		if (selectedStack) {
			return isEquivalent(selectedStack, item);
		} else {
			return false;
		}
	}

	_onTapSelected(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('stack-tapped', {detail:{ spaceStackElem: e.target }, bubbles: true, composed: true}));
	}

	_renderSpaceStacks(value) {
		if (this._rendered) {
			this.$.spaceStacksList.render();
		}
		this.set('_rendered', true);
	}

	_getStackColor(orgPath, orgs) {
		return getOrgColor(orgPath, orgs)
	}

	toggleDropZoneActive(active) {
		this.set("dropzoneActive", active);
	}
}

window.customElements.define(FloorStackComponent.is, FloorStackComponent);