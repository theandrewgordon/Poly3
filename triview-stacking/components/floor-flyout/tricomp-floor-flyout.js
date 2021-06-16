/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from '../../../@polymer/polymer/polymer-element.js';
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { animationFrame } from "../../../@polymer/polymer/lib/utils/async.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import '../../../tricore-url/tricore-url.js';
import '../../../triplat-icon/ibm-icons-glyphs.js';
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import { round, computeMismatch, sumSpaces } from "../../utils/triutils-stacking.js";
import "../../styles/tristyles-stacking.js";
import "../floor-flyout-table/tricomp-floor-flyout-table.js";

class FloorFlyoutComponent extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-floor-flyout"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}
				
				.flyout-div {
					margin:0;
					padding: 10px 15px 15px;
					max-height: 400px;
				}

				:host([_has-discrepancy]) .flyout-div {
					border-radius: 3px;
					padding: 5px 15px 15px;
					border-top: 5px solid var(--ibm-yellow-30);
				}
				
				.flyout-content {
					@apply --layout-vertical;
					padding: 0px 5px;
				}

				.detail-info {
					@apply --layout-horizontal;
					@apply --layout-start;
					font-size: 18px;
					padding: 5px 0px 10px;
				}

				.title {
					color: var(--ibm-gray-50);;
					font-weight: 400;
				}

				.name {
					font-weight: 500;
				}

				.floor-link {
					@apply --layout-horizontal;
					@apply --layout-center;
					cursor: pointer;
					color: black;
				}

				.floor-link:hover {
					text-decoration: underline;
				}
				
				.arrow:after, .arrow:before {
					border: solid transparent;
					content: " ";
					height: 0;
					width: 0;
					position: absolute;
					pointer-events: none;
				}
				
				:host([_vertical-align=top]) .arrow:after {
					border-width: 10px;
					top: 10px;
				}
				
				:host([_vertical-align=top]) .arrow:before {
					border-width: 11px;
					top: 9px;
				}
				
				:host([_vertical-align=bottom]) .arrow:after {
					border-width: 10px;
					bottom: 11px;
				}
				
				:host([_vertical-align=bottom]) .arrow:before {
					border-width: 11px;
					bottom: 10px;
				}
				
				.arrow.left:after, .arrow.left:before {
					right: 100%;
				}
				
				.arrow.left:after {
					border-right-color: var(--primary-background-color);
				}
				
				.arrow.left:before {
					border-right-color: var(--ibm-gray-30);
				}

				#flyout {
					margin: 0;
					min-width: 350px;
					background-color: white;
					border: 1px solid var(--tri-primary-content-accent-color);
					border-radius: 5px;
					box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
				}

				.popup-close {
					--iron-icon-fill-color: var(--ibm-gray-50);
					position: absolute;
					right: 10px;
					top: 5px;
					cursor: pointer;
				}

				.open-icon {
					min-width: 16px;
					min-height: 16px;
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
					color: var(--tri-primary-color);
					cursor: pointer;
				}

				:host([dir="ltr"]) .open-icon {
					padding-right: 10px;
					padding-left: 5px;
				}

				:host([dir="rtl"]) .open-icon {
					padding-right: 5px;
					padding-left: 10px;
				}

				.message-placeholder {
					@apply --layout-center;
					@apply --layout-vertical;
					padding-top: 32px;
					padding-bottom: 32px;
				}

				.level {
					white-space: nowrap;
				}

			</style>

			<tricore-url id="urlGen"></tricore-url>
			
			<iron-dropdown id="flyout" dynamic-align allow-outside-scroll horizontal-align="[[_horizontalAlign]]"
				vertical-align="top" vertical-offset="[[_computeVerticalOffset(_targetHeight)]]" horizontal-offset="84" opened="{{opened}}"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" on-iron-overlay-opened="_handleDropdownOpened"
				on-iron-overlay-closed="_handleDropdownClosed" fit-into="[[_fitInto]]"
				scroll-action="[[_scrollAction]]">

				<div class="flyout-div arrow" id="dropdownContent" slot="dropdown-content">
					<div class="flyout-content">
						<iron-icon class="popup-close" icon="ibm-glyphs:popup-close" on-tap="_handlePopupClose"></iron-icon>
						<template is="dom-if" if="[[_hasDiscrepancy]]">
							<span class="title">Warning: Discrepancy</span>
						</template>
						<div class="detail-info">
							<div class="floor-link" on-tap="_handleFloorOpen">
								<span class="name">[[_floor.name]]&nbsp;</span>
								<span>|</span>
								<span class="level">&nbsp;Level [[_floor.level]]</span>
							</div>
							<iron-icon class="open-icon" icon="ibm-glyphs:maximize" on-tap="_handleFloorOpen"></iron-icon>
						</div>
					</div>
					<template is="dom-if" if="[[_spaceClassDataForDisplay.length]]">
						<tricomp-floor-flyout-table data="[[_spaceClassDataForDisplay]]"></tricomp-floor-flyout-table>
					</template>
					<template is="dom-if" if="[[!_spaceClassDataForDisplay.length]]">
						<div class="message-placeholder">
							<span>No supply or demand is available.</span>
						</div>
						
					</template>
				</div>
			</iron-dropdown>
		`
	}
	
	static get properties() {
		return {
			_floor: {
				type: Object 
			},

			_spaceClassDataForDisplay: {
				type: Array,
				value: function () { return []; }
			},

			_horizontalAlign: {
				type: String,
				reflectToAttribute: true,
				value: "right"
			},

			_verticalAlign: {
				type: String,
				reflectToAttribute: true,
				value: "top"
			},

			_assignableSpacesOnly: {
				type: Boolean
			},

			_hasDiscrepancy: {
				type: Boolean,
				reflectToAttribute: true,
				computed: '_computeShowDiscrepancy(_floor, _assignableSpacesOnly)'
			},

			_targetHeight: {
				type: Number,
				value: 0
			}
		};
	}

	static get observers() {
		return [
			'_handleFloorChanged(_floor)',
			'_observeStyleChangeWhenOpened(opened)'
		]
	}

	ready() {
		super.ready();
		this._styleDropdownObserver = new MutationObserver(this._handleDropdownStyleChanged.bind(this));
	}

	_handleFloorChanged(floor) {
		if (floor) {
			const spaceClassDataForDisplay = [];
			const supply = this._assignableSpacesOnly ? floor.assignableSpaceSupply : floor.spaceSupply;
			const supplySpaceClasses = Object.keys(supply);
			const demand = sumSpaces(floor.stacks.map(stack => this._assignableSpacesOnly ? stack.assignableSpaces : stack.spaces));
			const demandSpaceClasses = Object.keys(demand);
			const allSpaceClasses = [...new Set([...supplySpaceClasses, ...demandSpaceClasses])];
			
			allSpaceClasses.forEach(spaceClass => {
				const [countMismatch, demandCount, supplyCount] = computeMismatch(spaceClass, supply, demand, "count");
				const [areaMismatch, demandArea, supplyArea] = computeMismatch(spaceClass, supply, demand, "area");
				spaceClassDataForDisplay.push({
					name: spaceClass,
					countMismatch: countMismatch,
					areaMismatch: areaMismatch,
					demandCount: demandCount,
					supplyCount: supplyCount,
					demandArea: demandArea,
					supplyArea: supplyArea,
					uom: supply[spaceClass] ? supply[spaceClass].uom : demand[spaceClass].uom,
					isTotal: false
				});
			});

			let demandAreaTotal = 0, supplyAreaTotal = 0;
			if (spaceClassDataForDisplay.length> 0) {
				demandAreaTotal = spaceClassDataForDisplay.map(item => item.demandArea).reduce((total, area) => total + area);
				supplyAreaTotal = spaceClassDataForDisplay.map(item => item.supplyArea).reduce((total, area) => total + area);

				const total = {
					name: "Total",
					countMismatch: false,
					areaMismatch: demandAreaTotal > supplyAreaTotal,
					demandCount: 0,
					supplyCount: 0,
					demandArea: round(demandAreaTotal),
					supplyArea: round(supplyAreaTotal),
					uom: spaceClassDataForDisplay.length > 0 ? spaceClassDataForDisplay[0].uom : null,
					isTotal: true
				};
				spaceClassDataForDisplay.push(total);
			}

			this.set('_spaceClassDataForDisplay', spaceClassDataForDisplay);
		}
	}

	_observeStyleChangeWhenOpened(newOpened) {
		if (!this._styleDropdownObserver) {
			return;
		}
		if (newOpened) {
			this._styleDropdownObserver.observe(this.$.flyout, { attributes : true, attributeFilter : ["style"] });
		} else {
			this._styleDropdownObserver.disconnect();
		}
	}

	_handleDropdownStyleChanged() {
		this._debounceDropdownStyleChanged = Debouncer.debounce(
			this._debounceDropdownStyleChanged,
			animationFrame,
			this._computeDropdownContentClasses.bind(this)
		);
	}

	_computeDropdownContentClasses() {
		const positionTargetRect = this.$.flyout.positionTarget.getBoundingClientRect();
		const dropdownRect = this.$.flyout.getBoundingClientRect();
		this._verticalAlign = (dropdownRect.bottom > positionTargetRect.bottom + 13) ? "top" : "bottom";
		this._addArrowClass(this.$.dropdownContent, "left");
	}

	_addArrowClass(node, arrowClass) {
		node.classList.add(arrowClass);
	}

	toggle(fitInto, scrollContainer, targetElement, floor, assignableSpacesOnly) {
		if (!this.opened || this._targetElement != targetElement) {
			this._assignableSpacesOnly = assignableSpacesOnly;
			this.set("_floor", floor);

			this._targetElement = targetElement;
			this._targetHeight = targetElement.offsetHeight;
			this._fitInto = fitInto;
			this._scrollContainer = scrollContainer;
			this.$.flyout.open();
		} else {
			this.$.flyout.close();
		}
	}
	
	_handleDropdownOpened(e) {
		this.$.flyout.notifyResize();
	}

	_handleDropdownClosed(e) {
		this.set('_floor', null);
		this.set('_spaceClassDataForDisplay', []);
	}
	
	_handlePopupClose(e) {
		e.stopPropagation();
		this.$.flyout.close();
	}

	_computeMismatchText(mismatch) {
		const __dictionary__match = "match";
		const __dictionary__mismatch = "mismatch";
		return mismatch ? __dictionary__mismatch : __dictionary__match;
	}

	_handleFloorOpen(e) {
		e.stopPropagation();
		const id = this._floor._id;
		const url = this.$.urlGen.getUrl("/WebProcess.srv?objectId=750000&actionId=750011&specId=" + id);
		window.open(url, "_blank");
	}

	_computeShowDiscrepancy(item, assignableSpacesOnly) {
		if (item) {
			return assignableSpacesOnly ? item.hasAssignableDiscrepancy : item.hasDiscrepancy;
		} else {
			return false;
		}
	}

	_computeVerticalOffset(height) {
		return height > 17 ? -5 : -11;
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/floor-flyout/tricomp-floor-flyout.js");
	}
}

window.customElements.define(FloorFlyoutComponent.is, FloorFlyoutComponent);