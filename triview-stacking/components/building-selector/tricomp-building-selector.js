/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

import "../../../triplat-icon/triplat-icon.js";

import "../../../triblock-table/triblock-table.js";

class TricompBuildingSelector extends mixinBehaviors([TriBlockViewResponsiveBehavior, TriDirBehavior, IronResizableBehavior], PolymerElement) {
	static get is() { return "tricomp-building-selector"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host{
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.message-placeholder {
					@apply --layout-center;
					@apply --layout-vertical;
					padding-top: 75px;
				}

				.building-table {
					@apply --layout-flex;
					overflow-x: hidden;
					--triblock-table-cell: {
						min-height: 70px;
						height: auto !important;
						padding: 0px !important;
					}
					border-top: 1px solid var(--tri-primary-content-accent-color);
					--triblock-table-header: {
						display: none;
					}
					--triblock-table-row-container: {
						padding: 15px 10px 10px 5px;
						border-bottom: 1px solid var(--tri-primary-content-accent-color);
						border-left: 1px solid var(--tri-primary-content-accent-color); 
						border-right: 1px solid var(--tri-primary-content-accent-color);
					}
					--triblock-table-row-selected-background-color: var(--tri-primary-content-background-color);
					--triblock-table-row-hover: {
						border-left: 4px solid var(--tri-primary-color-50); 
						padding-left: 2px;
					}
					--triblock-table-row-selected: {
						border-left: 4px solid var(--tri-primary-color-60);
						padding-left: 2px;
					}
					--triblock-table-even-row-background-color: var(--ibm-neutral-2);
				}

				:host([small-screen-width]) .building-table {
					--triblock-table-row: {
						padding: 10px;
					}
				}
				
				.building-icon-column {
					--triblock-table-column-fixed-width: 62px;
				}

				.image-container {
					border: 1px solid var(--tri-primary-content-accent-color);
					height: 47px;
					width: 45px;
					margin-left: 5px;
				}

				.building-icon {
					--triplat-icon-height: 40px;
					--triplat-icon-width: 40px;
					--triplat-icon-fill-color: var(--tri-primary-content-label-color);
					padding: 3px;
				}

				.button-text-container {
					@apply --layout-flex;
				}

				.building-name-container {
					@apply --layout-horizontal;
					font-weight: bold;
					word-break: break-word;
				}

				.divider {
					max-width: 1px;
					background-color: var(--tri-primary-content-color);
					height: 18px;
					margin-left: 5px;
					margin-right: 5px;
				}

				.building-address-buttons-container {
					@apply --layout-horizontal;
					@apply --layout-flex-end;
				}

				.building-address-container {
					@apply --layout-flex;
				}

				.building-address {
					font-weight: 500;
					color: var(--tri-primary-content-label-color);
					font-size: 12px;
				}

				.building-detail {
					font-weight: 500;
					color: var(--tri-primary-content-label-color);
					font-size: 12px;
				}
				
				.buttons-container {
					@apply --layout-horizontal;
					@apply --layout-end;
				}

				#checkboxIcon {
					--triplat-icon-fill-color: var(--tri-primary-color);
					--triplat-icon-height: 16px;
				}

				#checkboxIcon iron-icon {
					--iron-icon-fill-color: var(--tri-primary-color);
					--iron-icon-height: 16px;
					--iron-icon-width: 16px;
				}

				#deleteIcon {
					--iron-icon-fill-color: var(--tri-danger-color);
					height: 16px;
					padding: 0px;
				}
				
				.building-status {
					color: var(--tri-primary-content-label-color);
					font-size: 12px;
					font-weight: 500;
					padding-top: 5px
				}

				.status-content {
					color: var(--tri-primary-content-color);
				}

				#floorsCount {
					@apply --layout-end-justified;
					@apply --layout-horizontal;
					font-weight: bold;
					font-size: 12px;
					margin-right: 10px;
					word-break: break-word;
				}

				:host([dir="rtl"]) #floorsCount {
					margin-left: 10px;
				}

				.show-disable {
					visibility: visible;
					opacity:0.6;
				}

				.show {
					visibility: visible;
				}

				.hide {
					visibility: hidden;
				}
			</style>

			<div class="table-container">
				<template is="dom-if" if="[[!filteredBuildingList.length]]">
					<div class="message-placeholder">
						<div>[[_setNoBuildingsMessage(selectedBuildingsOnlyChecked)]]</div>
					</div>
				</template>

				<triblock-table class="building-table" hidden\$="[[!filteredBuildingList.length]]" data="{{filteredBuildingList}}" scroller="{{buildingListScroller}}" on-row-tap="_handleRowTap">
					<triblock-table-column class="building-icon-column">
						<template>
							<div class="image-container">
								<triplat-icon class="building-icon" icon="ibm-medium:buildings"></triplat-icon>
							</div>
						</template>
					</triblock-table-column>

					<triblock-table-column class="building-name-column">
						<template>
							<div class="button-text-container">
								<div class="building-name-container">
									<div class="building-name">[[item.building]] </div>
									<div class="divider" hidden$="[[!item.property]]"></div>
									<span>[[item.property]]</span>
								</div>
								<div class="building-address-buttons-container">
									<div class="building-address-container">
										<div class="building-address">[[item.address]]</div>
										<div class="building-detail">[[item.city]] [[item.state]]<span hidden$="[[!item.country]]">,</span> [[item.country]]</div>
									</div>
									<div class="buttons-container">
										<triplat-icon id="checkboxIcon" icon="ibm:ready" 
											class$="[[_computeSelectionIcon(item.buildingSelected, item.floorsCount, item.disable)]]">
										</triplat-icon>
										<paper-icon-button id="deleteIcon" icon="icons:remove-circle" on-tap="_removeSelection" 
											class$="[[_computeSelectionIcon(item.buildingSelected, item.floorsCount, item.disable)]]"
											readonly="[[readonly]]">
										</paper-icon-button>
									</div>
								</div>
								<div class="building-status">Status:
									<span class="status-content">[[item.status]]</span>
								</div>
								<div id="floorsCount" class$="[[_displayFloorsCount(item.buildingSelected)]]">
									<div hidden\$="[[_hideCountDisplay(item.floorsCount)]]">
										<span>[[item.selectedFloorCount]] of </span>
										<span>[[item.floorsCount]] Floors selected</span>
									</div>
									<span hidden\$="[[!_hideCountDisplay(item.floorsCount)]]">[[item.floorsCount]] Floors</span>
								</div>
							</div>
						</template>
					</triblock-table-column>
				</triblock-table>
			</div>
		`
	}

	static get properties() {
		return {
			filteredBuildingList: {
				type: Array
			},
			
			buildingListScroller: {
				type: Object,
				notify: true
			},

			selectedBuildingsOnlyChecked: {
				type: Boolean
			},

			readonly: {
				type: Boolean,
				value: false
			}
		}
	}

	_setNoBuildingsMessage(selectedBuildingsOnlyChecked) {
		let __dictionary__noSelectedBuildingsMessage = "No buildings are selected. Clear this check box to see a list of buildings.";
		let __dictionary__noBuildingsMessage = "No building was found."
		return selectedBuildingsOnlyChecked ? __dictionary__noSelectedBuildingsMessage : __dictionary__noBuildingsMessage;
	}
	
	_displayFloorsCount(buildingSelected) {
		return (buildingSelected) ? "show" : "hide";
	}

	_hideCountDisplay(selectedFloorCount) {
		return !(selectedFloorCount > 0);
	}
	
	_computeSelectionIcon(buildingSelected, floorsCount, disableIcon) {
		let className = (disableIcon) ? "show-disable" : "show";
		return (buildingSelected && floorsCount > 0) ? className : "hide";
	}

	_handleRowTap(e){
		e.stopPropagation();
		this.fire("building-selected", e.detail);
	}

	_removeSelection(e){
		e.stopPropagation();
		if (!this.readonly) {
			this.fire("building-unselected", e);
		}
	}
}
window.customElements.define('tricomp-building-selector', TricompBuildingSelector);