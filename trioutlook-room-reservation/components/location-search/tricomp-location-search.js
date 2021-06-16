/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { getTriserviceLocationSearch } from  "../../services/triservice-location-search.js";
import { getTriserviceRoomFilters } from  "../../services/triservice-room-filters.js";
import "../../styles/tristyles-carbon-theme.js";

import { TrimixinDropdownTargetElement } from "../dropdown/trimixin-dropdown-target-element.js";
import "../search-field/tricomp-search-field.js";
import "../location-hierarchy/tricomp-location-hierarchy.js";

import "./tricomp-location-search-dropdown.js";

class TricompLocationSearch extends TrimixinDropdownTargetElement(PolymerElement) {
	static get is() { return "tricomp-location-search"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-vertical;
				}
			</style>

			<triservice-location-search search-value="[[_searchValue]]" 
				temp-selected-location="{{_selectedLocation}}" temp-location-hierarchy="{{_locationHierarchy}}">
			</triservice-location-search>

			<triservice-room-filters temp-location-filter="{{_locationFilter}}"></triservice-room-filters>

			<tricomp-search-field id="searchField" value="{{_searchValue}}" 
				focused="{{_searchFieldFocused}}" readonly="[[_readonly]]"
				on-clear-field="_handleClearSearchField">
			</tricomp-search-field>

			<dom-if if="[[_locationHierarchy._id]]" restamp>
				<template>
					<div class="top-16 bottom-16 helper-text-01">Suggested locations</div>
					<tricomp-location-hierarchy location-hierarchy="[[_locationHierarchy]]" selected="[[_locationFilter]]"
						on-user-changed="_handleUserLocationSelectionChanged">
					</tricomp-location-hierarchy>
				</template>
			</dom-if>

			<template id="dropdownTemplate">
				<tricomp-location-search-dropdown id="tricomp-location-search-dropdown"></tricomp-location-search-dropdown>
			</template>
		`;
	}

	static get properties() {
		return {
			_readonly: {
				type: Boolean,
				value: false
			},

			_searchValue: {
				type: String
			},

			_searchFieldFocused: {
				type: Boolean
			},

			_selectedLocation: {
				type: Object
			},

			_locationHierarchy: {
				type: Object
			},

			_locationFilter: {
				type: Object
			}
		};
	}

	static get observers() {
		return [
			"_handleToggleDropdown(_searchValue, _searchFieldFocused, _readonly)",
			"_handleSelectedLocationChanged(_selectedLocation)",
			"_computeReadonly(_selectedLocation)"
		];
	}

	_handleToggleDropdown(searchValue, searchFieldFocused, readonly) {
		if (searchValue && searchValue !== "" && searchFieldFocused && !this.opened && !readonly) {
			this._getDropdown().open(this.fitInto, this.scrollContainer, this, true);
		}
		if (this.opened && (!searchValue || searchValue === "" || readonly)) {
			this._getDropdown().close();
		}
	}

	_computeReadonly(selectedLocation) {
		this._readonly = selectedLocation != null && selectedLocation._id != null;
	}

	_handleClearSearchField() {
		this.$.searchField.clear();
		getTriserviceLocationSearch().clearTempSelectedLocation();
		getTriserviceRoomFilters().clearTempLocationFilter();
		this.$.searchField.focus();
	}

	_handleSelectedLocationChanged(selectedLocation) {
		this._debounceSelectedLocationChanged = Debouncer.debounce(
			this._debounceSelectedLocationChanged,
			microTask,
			() => {
				if (selectedLocation != null && selectedLocation._id != null) {
					this._searchValue = selectedLocation._computedText ? selectedLocation._computedText : selectedLocation.name;
				} else {
					this._searchValue = "";
				}
			}
		);
	}

	_handleUserLocationSelectionChanged(e) {
		this._locationFilter = e.detail;
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/location-search/tricomp-location-search.js");
	}
}

window.customElements.define(TricompLocationSearch.is, TricompLocationSearch);