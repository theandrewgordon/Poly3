/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import "../../../@polymer/paper-radio-button/paper-radio-button.js";
import "../../../@polymer/paper-radio-group/paper-radio-group.js";

import "../../../triplat-query/triplat-query.js";

import "../building-search-field/tricomp-building-search-field.js";
import "../building-selector/tricomp-building-selector.js";
import "../floor-selector/tricomp-floor-selector.js";
import "../../services/triservice-lookup-data.js";
import "../../styles/tristyles-stacking.js";

import { TrimixinBuildingFloorSelection } from "./trimixin-building-floor-selection.js";

class TricompBuildingFloorSelector extends TrimixinBuildingFloorSelection(PolymerElement) {
	static get is() { return "tricomp-building-floor-selector"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles stacking-popup-styles tristyles-theme">
				:host{
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.selection-field {
					@apply --layout-horizontal;
					background-color: var(--ibm-neutral-2);
					padding: 0px 20px 15px 20px;
				}

				.left-section {
					@apply --layout-flex;
					padding-top:25px;
					max-width: 400px;
				}
				
				.right-section {
					@apply --layout-vertical;
					@apply --layout-flex;
					@apply --layout-end;
				}

				paper-radio-button {
					padding-top: 40px;
					padding-right: 0px;
				}

				.content {
					@apply --layout-flex;
					@apply --layout-horizontal;
				}

				.left-panel {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 0px 0px 20px 20px;
					max-width: 400px;
					background-color: var(--ibm-neutral-2);
				}

				#showSelectedBuildingsCheckbox {
					margin-bottom: 20px;
					font-weight: 500;
				}

				paper-checkbox {
					--paper-checkbox-size: 20px;
				}

				.right-panel {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 10px 10px 20px 20px;
				}
			</style>

			<triservice-lookup-data id="lookupDataService" 
				building-list-search-value="{{buildingListSearchValueForDS}}" 
				org-alloc-types="{{_orgAllocTypes}}" 
				filtered-building-list="{{_filteredBuildingList}}" 
				building-list-scroller="[[_buildingListScroller]]" 
				floors-for-building="{{_floorsForBuilding}}">
			</triservice-lookup-data>

			<div class="selection-field">
				<div class="left-section">
					<tricomp-building-search-field building-search-value="{{_buildingListSearchValue}}" hidden\$="[[readonly]]"></tricomp-building-search-field>
				</div>
				<div class="right-section">
					<paper-radio-group selected="{{selectedOrgAllocType}}">
						<template is="dom-repeat" items="[[_orgAllocTypes]]">
							<paper-radio-button hidden$="[[hideSelectedOrgAllocType]]" name="[[item.internalValue]]">Stack from [[_computeOrgAllocTypeLabel(item.value)]] allocations</paper-radio-button>
						</template>
					</paper-radio-group>
				</div>
			</div>

			<triplat-query delay="0" data="{{_selectedBuildingsList}}" filtered-data-out="{{_filteredBuildingList}}">
				<triplat-query-filter name="building" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="address" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="city" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="state" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="country" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="property" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="status" operator="contains" value="[[buildingListSearchValue]]" ignore-if-blank>
				</triplat-query-filter>
				<triplat-query-sort name="building"></triplat-query-sort>
			</triplat-query>

			<div class="content">
				<div class="left-panel">
					<paper-checkbox id="showSelectedBuildingsCheckbox" checked="{{_showSelectedBuildings}}" disabled="[[readonly]]">Show selected buildings only</paper-checkbox>
					<tricomp-building-selector id="buildingSelector" 
						filtered-building-list="[[_filteredBuildingList]]" 
						building-list-scroller="{{_buildingListScroller}}" 
						selected-buildings-only-checked="[[_showSelectedBuildings]]"
						readonly="[[readonly]]">
					</tricomp-building-selector>
				</div>
				<div class="right-panel">
					<tricomp-floor-selector id="floorSelectorComponent" 
						show-floor-panel="{{showFloorPanel}}" 
						current-building-selected="{{currentBuildingSelected}}" 
						floors-for-building="{{_floorsForBuilding}}" 
						floor-list-selected="{{floorListSelected}}"
						readonly="[[readonly]]">
					</tricomp-floor-selector>
				</div>
			</div>
		`
	}
}

window.customElements.define('tricomp-building-floor-selector', TricompBuildingFloorSelector);