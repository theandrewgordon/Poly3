/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-selector/iron-selector.js";

import "../../../@polymer/paper-checkbox/paper-checkbox.js";

import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";

import "../../styles/tristyles-stacking.js";

class TricompFloorSelector extends mixinBehaviors([TriBlockViewResponsiveBehavior], PolymerElement) {
	static get is() { return "tricomp-floor-selector"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				:host{
					@apply --layout-flex;
					@apply --layout-vertical;
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;≈
					user-select: none;
				}

				.placeholder-message {
					padding-top: 75px;
					@apply --layout-vertical;
					@apply --layout-center-center;
				}

				.floor-selection-options {
					@apply --layout-horizontal;
				}

				.floor-placeholder {
					@apply --layout-flex;
				}

				.floor-selection-button {
					padding: 20px 0px 0px 40px;
					font-weight: 500;
				}

				paper-checkbox {
					--paper-checkbox-size: 20px;
				}

				.floors-selector-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					overflow-y: auto;
					padding-left: 20px;
				}

				.floor-details {
					height: 45px;
					padding: 10px;
					margin: 10px;
					border: 1px solid var(--tri-primary-content-accent-color);
					@apply --layout-horizontal;
					@apply --layout-center;
					outline: none;
				}

				.floor-level {
					padding-left: 10px;
					padding-right: 10px;
				}

				.floor-name {
					padding-left: 10px;
				}

				.floors-selector .iron-selected {
					background: var(--tri-primary-light-color);
				}
			</style>

			<template is="dom-if" if="[[!showFloorPanel]]">
				<div class="placeholder-message">Select a building on the left to see a list of that building’s ﬂoors in this space.</div>
			</template>
			
			<div class="floor-selection-options">
				<template is="dom-if" if="[[showFloorPanel]]">
					<template is="dom-if" if="[[showFloorPlaceholder]]">	
						<div class="floor-placeholder placeholder-message">
							No floor is available for the building.
						</div>
					</template>
					<template is="dom-if" if="[[!showFloorPlaceholder]]">
						<paper-checkbox checked="{{selectAllChecked}}" id="selectAll" class="floor-selection-button" on-change="selectAllFloors" disabled="[[_computeSelectAllCheckbox(readonly, _disableSelectAll)]]">All</paper-checkbox>
					</template>
				</template>
			</div>
			
			<div class="floors-selector-container">
				<iron-selector attr-for-selected="recordid" id="floorSelector" class="floors-selector" multi>
					<template is="dom-if" if="[[showFloorPanel]]">
						<template is="dom-repeat" items="[[floorsForBuilding]]">
							<div recordid\$="{{item._id}}" tabIndex="0" class="floor-details" readonly$="[[item.disable]]" on-tap="_handleFloorSelected">
								<paper-checkbox class="floor-checkbox" checked="{{item.selected}}" disabled="[[_computeDisable(item.disable, readonly)]]"></paper-checkbox>
								<span class="floor-level">[[item.level]]</span>-
								<span class="floor-name">[[item.floor]]</span>
							</div>
						</template>
					</template>
				</iron-selector>
			</div>
		`
	}

	static get properties() {
		return {
			_disableSelectAll: {
				type: Boolean,
				value: false
			},

			floorsForBuilding: {
				type: Array,
				notify: true
			},

			showFloorPanel: {
				type: Boolean,
				notify: true,
				value: false
			},

			showFloorPlaceholder: {
				type: Boolean,
				value: false
			},

			floorListSelected: {
				type: Array,
				notify: true,
				value: function () { return []; }
			},

			currentBuildingSelected: {
				type: Object,
				notify: true
			},

			selectAllChecked: {
				type: Boolean
			},

			prevFloor: {
				type: Object
			},

			readonly: {
				type: Boolean,
				value: false
			}
		}
	}

	static get observers() {
		return [
			"_handleSelectAllCheckbox(floorsForBuilding.length, floorListSelected.length)",
			"_hideFloorPanel(currentBuildingSelected)"
		]
	}

	_hideFloorPanel(currentBuildingSelected) {
		if (currentBuildingSelected.selected) {
			this.set('showFloorPanel', true);
			if (this.floorsForBuilding.length == 0) this.set("showFloorPlaceholder", true);
			else this.set("showFloorPlaceholder", false);
		} else {
			this.set('showFloorPanel', false); this.set("showFloorPlaceholder", false);
		}
	}

	highlightFloorSelection(floors) {
		this.$.floorSelector.selectedValues = [];
		for(var i=0; i<floors.length; i++) {
			if(floors[i].selected)
				this.$.floorSelector.select(floors[i]._id);
		}
	}

	_computeSelectAllCheckbox(readonly, disableSelectAll) {
		return (readonly || disableSelectAll);
	}

	_handleSelectAllCheckbox(floorsLength, selectedfloorsLength) {
		let count = 0;
		let disableCount = 0;
		let selected = this.floorListSelected;
		if (floorsLength > 0) {
			this.floorsForBuilding.forEach(function (floors) {
				for (var i = 0; i < selectedfloorsLength; i++) {
					if (floors._id == selected[i]._id) {
						count++;
						if (selected[i].disable) {
							disableCount++;
						}
					}
				}
			});
		}
		if (count == floorsLength) {
			this.set("selectAllChecked", true);
			if(count == disableCount) 
				this.set("_disableSelectAll", true);
		} else if (count < floorsLength) {
			this.set("selectAllChecked", false);
			this.set("_disableSelectAll", false);
		}
	}

	selectAllFloors() {
		let selectAllChecked = this.selectAllChecked;
		if(selectAllChecked) {
			if (this.floorsForBuilding && this.floorsForBuilding.length > 0) {
				this.floorsForBuilding.forEach(function (floor, index) {
					let selectedIndex = this.floorListSelected.map(e => e._id).indexOf(floor._id);
					if (selectedIndex == -1) {
						this.push('floorListSelected', this._generateFloorObject(floor, true));
						this.set("floorsForBuilding." + index, this._generateFloorObject(floor, true));
					}
				}.bind(this));
			}
		} else {
			if (this.floorsForBuilding && this.floorsForBuilding.length > 0) {
				this.floorsForBuilding.forEach(function (floor, index) {
					let selectedIndex = this.floorListSelected.map(e => e._id).indexOf(floor._id);
					if (selectedIndex != -1 && !this.floorListSelected[selectedIndex].disable) {
						this.splice('floorListSelected', selectedIndex, 1);
						this.set("floorsForBuilding." + index, this._generateFloorObject(floor, false));
					}
				}.bind(this));
			}
		}
		this.highlightFloorSelection(this.floorsForBuilding);
	}

	_handleFloorSelected(e) {
		e.stopPropagation();
		if (this.readonly) return;
		let item = e.model.item;
		if(!item.disable) {
			let floorIndex = this.floorsForBuilding.map(e => e._id).indexOf(item._id);
			let selectedFloorIndex = this.floorListSelected.map(e => e._id).indexOf(item._id);
			if (selectedFloorIndex != -1) {
				this.set("floorsForBuilding." + floorIndex, this._generateFloorObject(item, false));
				this.splice('floorListSelected', selectedFloorIndex, 1);
			} else {
				this.set("floorsForBuilding." + floorIndex, this._generateFloorObject(item, true));
				this.push('floorListSelected', item);
			}
			this.$.floorSelector.select(item._id);
			if(e.detail.sourceEvent.shiftKey) {
				this._shiftKeySelection(e);
			}
			this.prevFloor = item;
		}
	}

	_shiftKeySelection(e) {
		var inc, dec, level;
		if(this.prevFloor) {
			if(Number(this.prevFloor.level) < Number(e.model.item.level)) {
				inc = true;
				dec = false;
			}
			else if(Number(this.prevFloor.level) > Number(e.model.item.level)) {
				inc = false;
				dec = true;
			}
			if(inc && !dec) {
				for(var i=0; i<this.floorsForBuilding.length; i++) {
					level = Number(this.floorsForBuilding[i].level);
					if(level >= Number(this.prevFloor.level) && level <= Number(e.model.item.level)) {
						this._floorSelection(i);
					}
				}
			}
			else if(!inc && dec) {
				for(var i=0; i<this.floorsForBuilding.length; i++) {
					level = Number(this.floorsForBuilding[i].level);
					if(level <= Number(this.prevFloor.level) && level >= Number(e.model.item.level)) {
						this._floorSelection(i);
					}
				}
			}
		}
	}

	_floorSelection(i) {
		let floorIndex = this.floorListSelected.map(e => e._id).indexOf(this.floorsForBuilding[i]._id);
		if(!this.prevFloor.selected){
			this.set("floorsForBuilding." + i, this._generateFloorObject(this.floorsForBuilding[i], true));
			if(floorIndex == -1) 
				this.push('floorListSelected', this.floorsForBuilding[i]);
		} else {
			this.set("floorsForBuilding." + i, this._generateFloorObject(this.floorsForBuilding[i], false));
			if(floorIndex != -1) 
				this.splice('floorListSelected', floorIndex, 1);
		}
		this.highlightFloorSelection(this.floorsForBuilding);
	}

	_generateFloorObject(floor, selected) {
		return {...floor, selected: selected};
	}

	_computeDisable(disable, readonly) {
		return disable || readonly;
	}
}

window.customElements.define('tricomp-floor-selector', TricompFloorSelector);