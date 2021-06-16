/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { animationFrame } from "../../../@polymer/polymer/lib/utils/async.js";

import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-pages/iron-pages.js";

import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/paper-slider/paper-slider.js";
import "../../../@polymer/paper-tooltip/paper-tooltip.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-number-input/triplat-number-input.js";
import "../../../triplat-query/triplat-query.js";
import "../../../triplat-select-input/triplat-select-input.js"
import "../../../triplat-uom/triplat-uom.js";

import "../../../triblock-tabs/triblock-tabs.js";

import "../../services/triservice-stack-plan.js";
import "../../services/triservice-stacking.js";
import "../../styles/tristyles-stacking.js";
import { round } from "../../utils/triutils-stacking.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "../overflow-text/tricomp-overflow-text.js";

class AllocationBlockFlyoutComponent extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-allocation-block-flyout"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}
				
				.flyout-div {
					margin:0;
					padding-right: 10px;
					padding-left: 10px;
					padding-top: 15px;
					padding-bottom: 15px;
					max-width: 280px;
				}
				
				#title {
					color: black;
					font-weight: 500;
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-top: 5px;
				}

				:host([dir="ltr"]) #title {
					padding-right: 1px;
				}
				
				:host([dir="rtl"]) #title {
					padding-left: 5px;
				}

				.spaces-area-content {
					padding: 15px 5px 15px 5px;
					@apply --layout-horizontal;
				}

				.area-move-entry-content {
					padding: 15px 0 0 0;
					@apply --layout-vertical;
				}
				
				.area {
					padding-left: 20px;
				}
				
				.spaces-area-content span {
					color: var(--tri-secondary-color);
				}
				
				.spaces-area-content div {
					color: black;
				}
				
				.spaces {
 					@apply --layout-vertical;
 				}

				.flyout-divider {
					height: 2px;
					background-color: var(--tri-primary-content-accent-color);
				}
				
				.buttons {
					padding: 15px 5px 0px 5px;
					@apply --layout-horizontal;
					@apply --layout-end-justified;
				}
				
				.btn { 
					font-weight: bold !important;
				}
				
				.arrow:after, .arrow:before {
					border: solid transparent;
					content: " ";
					height: 0;
					width: 0;
					position: absolute;
					pointer-events: none;
				}
				
				:host([_horizontal-align=left]) .arrow:after {
					border-width: 7px;
					left: 6px;
				}
				
				:host([_horizontal-align=left]) .arrow:before {
					border-width: 8px;
					left: 5px;
				}
				
				:host([_horizontal-align=right]) .arrow:after {
					border-width: 7px;
					right: 6px;
				}
				
				:host([_horizontal-align=right]) .arrow:before {
					border-width: 8px;
					right: 5px;
				}
				
				.arrow.up:after, .arrow.up:before {
					bottom: 100%;
				}
				
				.arrow.up:after {
					border-bottom-color: var(--primary-background-color);
				}
				
				.arrow.up:before {
					border-bottom-color: var(--ibm-gray-30);
				}

				.arrow.down:after, .arrow.down:before {
					top: 100%;
				}

				.arrow.down:after {
					border-top-color: var(--primary-background-color);
				}

				.arrow.down:before {
					border-top-color: var(--ibm-gray-30);
				}

				#flyout {
					margin: 0;
					min-width: 200px;
					background-color: white;
					border: 1px solid var(--tri-primary-content-accent-color);
					border-radius: 5px;
					box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
				}

				.divide-section {
					padding: 15px 5px 15px 5px;
					@apply --layout-vertical;
				}

				.inputs {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.divider-slider {
					@apply --layout-flex;
					margin-top: 2px;
				}

				.divider {
					margin: 0px 10px;
				}

				.divider-number-input {
					margin-top: 3px;
					text-align: center;
					width: 42px;
					--paper-input-container: {
						padding: 0px;
					};
					--paper-input-container-input: {
						font-size: 14px;
						font-weight: bold;
					};
					--paper-font-caption: {
						display: none;
					};
				}

				.area-value {
					@apply --layout-horizontal;
				}

				.title-tooltip {
					--paper-tooltip: {
						width: 230px;
					}
				}

				.hierarchy-path-text {
					color: black;
					font-weight: 400;
					cursor: pointer;
				}

				.hierarchy-path {
					padding-top: 5px;
					@apply --layout-horizontal;
					padding-bottom: 5px;
				}

				.collapse-icon {
					--iron-icon-height: 20px;
				}

				.org-id {
					color: var(--tri-secondary-color);
				}

				.dropdown-label {
					font-size: 18px;
				}

				.container {
					min-width: 245px;
				}

				.dropdown-content, .move-from {
					padding: 0 5px 0 5px;
				}

				.move-from span{
					color: black;
					font-weight: 500;
				}

				.move-to-building {
					padding: 0 5px 15px 5px;
				}

				triplat-select-input {
					padding: 5px 0;
					--triplat-select-input-paper-item: {
						font-size: 14px;
					}
					--triplat-select-input-input: {
						font-size: 14px;
					}
					--triplat-select-input-paper-item-min-height: 40px;
					--triplat-select-input-paper-item-focused: {
						font-size: 14px;
					}
				}

				:host([_hide-move]) triblock-tabs{
					--triblock-tab-unselected: {
						display: none;
						padding-left: 0 !important
					}
					--paper-tab-content-unselected:{
						height: auto !important;
					}
					--paper-tab: {
						padding-left: 0 !important;
						padding-right:0 !important;
					}
				}

				triblock-tab {
					--triblock-tabs: { 
						font-size: 12px;
					}
				}

			</style>
			
			<triservice-stacking current-user="{{_currentUser}}" uom-area-units="{{_uomAreaUnits}}"></triservice-stacking>
			<triservice-stack-plan id="stackPlanService"></triservice-stack-plan>

			<triplat-query data="[[_floors]]" filtered-data-out="{{_filteredFloorsList}}">
				<triplat-query-filter name="name" operator="contains" value="[[_searchFloor]]" ignore-if-blank></triplat-query-filter>
				<triplat-query-sort name="level"></triplat-query-sort>
			</triplat-query>

			<triplat-query data="[[_buildings]]" filtered-data-out="{{_filteredBuildingsList}}">
				<triplat-query-filter name="name" operator="contains" value="[[_searchBuilding]]" ignore-if-blank></triplat-query-filter>
				<triplat-query-sort name="name"></triplat-query-sort>
			</triplat-query>

			<iron-dropdown id="flyout" dynamic-align allow-outside-scroll horizontal-align="left"
				vertical-align="top" vertical-offset="33" horizontal-offset="-5" opened="{{opened}}"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" on-iron-overlay-opened="_handleFlyoutOverlay"
				on-iron-overlay-closed="_handleFlyoutOverlay" fit-into="[[_fitInto]]"
				scroll-action="[[_scrollAction]]">

				<div class="flyout-div arrow" id="dropdownContent" slot="dropdown-content">
					<div class="container">
						<div class="org-id">[[_spaceStack.orgPath.id]]</div>
						<tricomp-overflow-text lines="1" id="title">
							<span>[[_spaceStack.org]]</span>
							<template is="dom-if" if="[[_spaceClassMode]]">
								<span>: [[_spaceStack.spaceClass]]</span>
							</template>
						</tricomp-overflow-text>
						<paper-tooltip for="title" class="title-tooltip" position="right">[[_spaceStack.org]]
							<span hidden\$="[[!_spaceClassMode]]">: [[_spaceStack.spaceClass]] </span> 
						</paper-tooltip>
						<div class="hierarchy-path" hidden\$="[[_spaceClassMode]]">
							<div class="hierarchy-path-text" on-tap="_toggleCollapse">Hierarchy Path
								<iron-icon class="tri-link collapse-icon" icon="arrow-drop-down"></iron-icon>
								<iron-collapse id="collapse">
									<span>[[_spaceStack.orgPath.value]]</span>
								</iron-collapse>
							</div>
						</div>
						
						<triblock-tabs hide-scroll-buttons iron-pages-id="flyoutTabContent" selected="{{_flyoutTab}}" dir="ltr">
							<triblock-tab slot="tab" id="details" iron-page-id="detailsPage" label="Details">
							</triblock-tab>
							<triblock-tab slot="tab" id="move" iron-page-id="movePage" label="Move">
							</triblock-tab>
						</triblock-tabs>

						<div class="flyout-divider"></div>
						
						<iron-pages id="flyoutTabContent" selected="[[_flyoutTab]]">
							<div id="detailsPage">
								<div class="spaces-area-content">
									<div class="spaces"><span>Spaces:</span>
										<template is="dom-repeat" items="[[_spaceStackDataForDisplay]]">
											<div>[[item]]</div>
										</template>
									</div>
									<div class="area">
										<span>Area:</span>
										<div class="area-value">
											<div>[[_computeRoundedArea(_spaceStack, _assignableSpacesOnly)]]&nbsp;</div>
											<triplat-uom display="abbr" uom="[[_spaceStack.uom]]" uom-list="[[_uomAreaUnits]]"></triplat-uom>
										</div>
										<div>[[_computePercentage(_spaceStack, _assignableSpacesOnly)]] of floor</div>
									</div>
								</div>
								<div class="flyout-divider"></div>
								<template is="dom-if" if="[[!_spaceClassMode]]">
									<div class="buttons">
										<paper-button class="btn" primary-outline secondary on-tap="_handleViewSpaceClass">View space class</paper-button>
									</div>
								</template>
								<template is="dom-if" if="[[_spaceClassMode]]">
									<div class="divide-section">
										<span>Divide Space</span>
										<div class="inputs">
											<span>0</span>
											<paper-slider
												class="divider-slider"
												min="0"
												max="[[_spaceClassModeLength]]"
												step="0.01"
												value="{{_countToSplit}}"
												on-immediate-value-change="_handleDividerSliderChange">
											</paper-slider> 
											<span>[[_spaceClassModeLength]]</span>
											<div class="divider"></div>
											<triplat-number-input
												class="divider-number-input"
												label=""
												min="0"
												max="[[_spaceClassModeLength]]"
												unformatted-value="{{_countToSplit}}"
												user="[[_currentUser]]">
											</triplat-number-input>
										</div>
									</div>
									<div class="flyout-divider"></div>
									<div class="buttons">
										<paper-button class="btn" primary-outline secondary on-tap="_handleCancel">Cancel</paper-button>
										<paper-button class="btn" on-tap="_handleDone" disabled="[[_computeDisableDone(_countToSplit, _spaceClassModeLength)]]">Done</paper-button>
									</div>
								</template>
							</div>
							<div id="movePage" class="area-move-entry-content">
								<label class="move-from">Move from: <span>[[_spaceStack.floor.name]]</span></label>
								<div class="dropdown-content">
									<triplat-select-input on-value-changed="_handleFloorSelected"
										select-src="[[_filteredFloorsList]]" always-float-label
										value="{{_selectedFloor}}" value-name="name"
										search-value="{{_searchFloor}}">
										<label slot="label" class="dropdown-label">Move to:</label>
									</triplat-select-input>						
								</div>

								<div class="dropdown-content move-to-building">
									<triplat-select-input on-value-changed="_handleBuildingSelected"
										select-src="[[_filteredBuildingsList]]" always-float-label
										value="[[_selectedBuilding]]" value-name="name"
										search-value="{{_searchBuilding}}">
										<label slot="label" class="dropdown-label">Building:</label>
									</triplat-select-input>
								</div>
								<div class="flyout-divider"></div>
								<div class="buttons">
									<paper-button class="btn" primary-outline secondary on-tap="_handleCancel">Cancel</paper-button>
									<paper-button class="btn" on-tap="_handleDoneOnMove" disabled="[[_computeDisableDoneOnMove(_toBuilding, _toFloor)]]">Done</paper-button>
								</div>
							</div>
						</iron-pages>
					</div>
				</div>
			</iron-dropdown>
		`
	}
	
	static get properties() {
		return {

			_hideMove: {
				type: String,
				reflectToAttribute: true
			},

			_spaceStack: {
				type: Object
			},

			_spaceStackDataForDisplay: {
				type: Array,
				value: function () { return []; }
			},

			opened: Boolean,

			_spaceClassMode: {
				type: Boolean,
				value: false
			},

			_assignableSpacesOnly: {
				type: Boolean,
				value: false
			},

			_countToSplit: Number,
			_spaceClassModeLength: Number,

			_currentUser: Object,

			_horizontalAlign: {
				type: String,
				reflectToAttribute: true,
				value: "left"
			},
			
			_uomAreaUnits: Array,
			_selectedBuilding: Object,
			_selectedFloor: Object,
			_searchBuilding: String,
			_searchFloor: String,
			_toBuilding: Object,
			_toFloor: Object,
			_buildings: Array,		
			_filteredBuildingsList: Array,
			_floors: Array,
			_filteredFloorsList: Array,

			_flyoutTab: {
				type: String,
				value: "details"
			}
		};
	}

	static get observers() {
		return [
			"_handleSpaceStackChanged(_spaceStack, _assignableSpacesOnly)",
			"_observeStyleChangeWhenOpened(opened)",
			"_computeMoveTab(_buildings)"
		]
	}

	ready() {
		super.ready();
		this._styleDropdownObserver = new MutationObserver(this._handleDropdownStyleChanged.bind(this));
	}

	_computeMoveTab(buildings) { 
		if (buildings.length == 1 && buildings[0].floors.length == 1) {
				this._hideMove = true;
		}
		else	
			this._hideMove = false;
	}

	_handleSpaceStackChanged(spaceStack, assignableSpacesOnly) {
		if (spaceStack) {
			let spaceStackDataForDisplay = [];
			let spacesGroupedBySpaceClass = assignableSpacesOnly ? spaceStack.assignableSpaces : spaceStack.spaces;
			Object.keys(spacesGroupedBySpaceClass).forEach(function(spaceClass) {
				let dataForSpaceClass = spacesGroupedBySpaceClass[spaceClass];
				if (dataForSpaceClass) {
					let spaceDataLabel = round(dataForSpaceClass.count) + " " + spaceClass;
					spaceStackDataForDisplay.push(spaceDataLabel);
					if (this._spaceClassMode) {
						this.set('_spaceClassModeLength', round(dataForSpaceClass.count));
						this.set('_countToSplit', this._spaceClassModeLength);
					}
				}
			}.bind(this));
			this.set('_spaceStackDataForDisplay', spaceStackDataForDisplay);
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
		const classToAdd = dropdownRect.top > positionTargetRect.top ?  "up" : "down";
		this._addArrowClass(this.$.dropdownContent, classToAdd);
	}

	_addArrowClass(node, arrowClass) {
		const classToRemove = arrowClass == "up" ? "down" : "up";
		node.classList.remove(classToRemove);
		node.classList.add(arrowClass);
	}

	_computeRoundedArea(spaceStack, assignableSpacesOnly) {
		if (spaceStack && (spaceStack.assignableSpacesAreaAllocated || spaceStack.areaAllocated)) {
			return assignableSpacesOnly ? round(spaceStack.assignableSpacesAreaAllocated) : round(spaceStack.areaAllocated);
		}
	}

	_computePercentage(spaceStack, assignableSpacesOnly) {
		if (spaceStack && (spaceStack.assignableSpacesPercentage || spaceStack.percentage)) {
			return (assignableSpacesOnly ? round(spaceStack.assignableSpacesPercentage) : round(spaceStack.percentage)) + "%";
		}
	}

	flyoutNotifyResize() {
		this.$.flyout.notifyResize()
	}

	toggle(fitInto, scrollContainer, targetElement, stack, spaceClassMode, assignableSpacesOnly, buildings, buildingIndex) {
		if (!this.opened || this._targetElement != targetElement) {
			this.set("_spaceClassMode", spaceClassMode);
			this.set("_spaceStack", stack);
			this.set("_assignableSpacesOnly", assignableSpacesOnly);
			this.set("_buildings", buildings);

			let floorsTotal = buildings[buildingIndex].floors;
			let floorsAvailableForMove = [];
			floorsTotal.forEach(e => (e._id != stack.floor.id) ? floorsAvailableForMove.push(e) : []);

			this.set("_floors", floorsAvailableForMove);
			this.set("_selectedBuilding", { value: buildings[buildingIndex].name, id: buildings[buildingIndex]._id });
			this.set("_selectedFloor", null);
			this.set("_toBuilding", buildings[buildingIndex]);
			this.set("_toFloor", null);
			this.set("_flyoutTab", "details");

			if (Object.keys(this._spaceStack.spaces).length == 1 && !this._spaceStack.parentStack) {
				this._doViewSpaceClass();
			} else {
				this._targetElement = targetElement;
				const targetRect = targetElement.getBoundingClientRect();
				if(targetRect.x < (scrollContainer.offsetWidth/2)) {
					this.set("_horizontalAlign", "left");
					this.$.flyout.horizontalAlign = "left";
					if(targetRect.x < 0)
						this.$.flyout.horizontalOffset = -targetRect.x+20;
					else this.$.flyout.horizontalOffset = -5;
					this.$.flyout.verticalOffset = 38;
				}
				else {
					this.set("_horizontalAlign", "right");
					this.$.flyout.horizontalAlign = "right";
					if(targetRect.right > scrollContainer.offsetWidth)
						this.$.flyout.horizontalOffset = targetRect.right-targetRect.left-20;
					else
						this.$.flyout.horizontalOffset = -5;
				}
				this._fitInto = fitInto;
				this._scrollContainer = scrollContainer;
				this.$.flyout.open();
			}
		} else {
			this.$.flyout.close();
		}
	}
	
	_handleFlyoutOverlay(e) {
		if (this.opened) {
			this.$.flyout.notifyResize();
		} else {
			this.set('_spaceStack', null);
		}
	}

	close() {
		this.$.flyout.close();
	}

	_handleViewSpaceClass(e) {
		e.stopPropagation();
		this._doViewSpaceClass();
	}

	_doViewSpaceClass() {
		this.dispatchEvent(new CustomEvent('stack-view-space-class', {
			detail: { spaceStack: this._spaceStack },
			bubbles: true,
			composed: true
		}));
	}

	_handleCancel(e) {
		e.stopPropagation();
		this.close();
	}

	_handleDone(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('split-space-class', {
			detail: {
				countToSplit: this._countToSplit,
				spaceStack: this._spaceStack
			},
			bubbles: true,
			composed: true
		}))
	}

	_computeDisableDone(countToSplit, max) {
		return countToSplit == 0 || countToSplit == max;
	}

	_handleDividerSliderChange(e) {
		e.stopPropagation();
		const value = e.target.immediateValue;
		this.set('_countToSplit', value);
	}

	_toggleCollapse(e) {
		this.$.collapse.toggle();
	}

	_handleDoneOnMove() {
		if(this._toFloor && this._toBuilding) {
			this.dispatchEvent(new CustomEvent('shift-stacks-without-drag', {
				detail: { toFloor: this._toFloor, toBuilding: this._toBuilding, spaceStack: this._spaceStack },
				bubbles: true,
				composed: true
			}));
		}
		this.close();
	}

	_handleBuildingSelected(e) {
		if (e && e.detail && e.detail.value) {
			let index = this._buildings.map(e => e._id).indexOf(e.detail.value.id);
			if(index != -1) {
				let toBuilding = this._buildings[index];
				this.set("_toBuilding", toBuilding);
				this.set("_floors", toBuilding.floors);
			}
		} else {
			this.set("_toBuilding", null);
			this.set("_floors", null);
		}
		this.set("_toFloor", null);
		this.set("_selectedFloor", null);
	}

	_handleFloorSelected(e) {
		if (e && e.detail && e.detail.value) {
			let index = this._floors.map(e => e._id).indexOf(e.detail.value.id);
			if(index != -1) {
				let toFloor = this._floors[index];
				this.set("_toFloor", toFloor);
			}
		} else this.set("_toFloor", null);
	}

	_computeDisableDoneOnMove(building, floor) {
		return !(building != null && building != undefined && floor != null && floor != undefined);
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/allocation-block-flyout/tricomp-allocation-block-flyout.js");
	}
}

window.customElements.define(AllocationBlockFlyoutComponent.is, AllocationBlockFlyoutComponent);