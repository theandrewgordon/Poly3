/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask, timeOut } from "../../../@polymer/polymer/lib/utils/async.js";

import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { getTriserviceLocationSearch } from "../../services/triservice-location-search.js";
import "../../styles/tristyles-dropdown.js";
import "../../styles/tristyles-carbon-theme.js";
import { isEmptyArray } from "../../utils/triutils-utilities.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "./tricomp-search-results.js";

class TricompLocationSearchDropdown extends mixinBehaviors([IronResizableBehavior], TrimixinDropdown(PolymerElement)) {
	static get is() { return "tricomp-location-search-dropdown"; }

	static get template() {
		return html`
			<style include="room-reservation-dropdown-styles carbon-style">
				iron-dropdown {
					max-height: 500px;
				}

				.content {
					overflow-y: auto;
					padding: 0;
				}

				.no-matches-message {
					padding: 10px 20px;
					visibility: hidden;
				}

				.no-matches-message[is-visible] {
					visibility: visible;
				}
			</style>

			<triservice-location-search cities="{{_cities}}" properties="{{_properties}}" buildings="{{_buildings}}"
				cities-count="{{_citiesCount}}" properties-count="{{_propertiesCount}}" buildings-count="{{_buildingsCount}}"
				scroller="[[_scroller]]" loading="{{_loading}}">
			</triservice-location-search>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="32"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]" no-auto-focus>
				<div id="content" class="content" slot="dropdown-content">
					<div class="no-matches-message" hidden\$="[[_hasResults]]" is-visible\$="[[_showNoMatchesFound]]">No matches found</div>

					<tricomp-search-results header="[[_cityHeader]]" results="[[_cities]]"
						total-count="[[_citiesCount]]" partial-count="[[_partialCount]]"
						show-more="{{_showMoreCities}}" hidden\$="[[_hideCities]]"
						on-item-selected="_onItemSelected"></tricomp-search-results>

					<tricomp-search-results header="[[_propertyHeader]]" results="[[_properties]]"
						total-count="[[_propertiesCount]]" partial-count="[[_partialCount]]"
						show-more="{{_showMoreProperties}}" hidden\$="[[_hideProperties]]"
						on-item-selected="_onItemSelected" compute-text-function="[[_computePropertyText]]"></tricomp-search-results>

					<tricomp-search-results header="[[_buildingHeader]]" results="[[_buildings]]"
						total-count="[[_buildingsCount]]" partial-count="[[_partialCount]]"
						show-more="{{_showMoreBuildings}}" hidden\$="[[_hideBuildings]]"
						on-item-selected="_onItemSelected" compute-text-function="[[_computeBuildingText]]"></tricomp-search-results>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			_cities: {
				type: Array
			},

			_properties: {
				type: Array
			},

			_buildings: {
				type: Array
			},

			_citiesCount: {
				type: Number
			},

			_propertiesCount: {
				type: Number
			},

			_buildingsCount: {
				type: Number
			},

			_cityHeader: {
				type: String,
				value: () => {
					const __dictionary__city = "City";
					return __dictionary__city;
				}
			},

			_propertyHeader: {
				type: String,
				value: () => {
					const __dictionary__property = "Property";
					return __dictionary__property;
				}
			},

			_buildingHeader: {
				type: String,
				value: () => {
					const __dictionary__building = "Building";
					return __dictionary__building;
				}
			},

			_partialCount: {
				type: Number,
				value: 4
			},

			_showMoreCities: {
				type: Boolean
			},

			_showMoreProperties: {
				type: Boolean
			},

			_showMoreBuildings: {
				type: Boolean
			},

			_hideCities: {
				type: Boolean,
				computed: "_computeHideProperty(_showMoreProperties, _showMoreBuildings, _cities)"
			},

			_hideProperties: {
				type: Boolean,
				computed: "_computeHideProperty(_showMoreCities, _showMoreBuildings, _properties)"
			},

			_hideBuildings: {
				type: Boolean,
				computed: "_computeHideProperty(_showMoreCities, _showMoreProperties, _buildings)"
			},

			_scroller: {
				type: Object,
				notify: true,
				computed: "_computeScroller(_showMoreCities, _showMoreProperties, _showMoreBuildings)"
			},

			_hasResults: {
				type: Boolean,
				value: false
			},

			_loading: {
				type: Boolean,
				value: false
			},

			_showNoMatchesFound: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_resetShowMore(_opened)",
			"_notifyResize(_opened, _cities, _properties, _buildings, _showMoreCities, _showMoreProperties, _showMoreBuildings)",
			"_computeHasResults(_cities.*, _properties.*, _buildings.*)",
			"_computeShowNoMatchesFound(_loading, _hasResults, _opened)"
		];
	}

	toggle(fitInto = window, scrollContainer, targetElement, sameTargetWidth) {
		if (!this._opened || this._targetElement != targetElement) {
			this.open(fitInto, scrollContainer, targetElement, sameTargetWidth);
		} else {
			this.close();
		}
	}

	open(fitInto = window, scrollContainer, targetElement, sameTargetWidth) {
		this._fitInto = fitInto;
		this._scrollContainer = scrollContainer;
		this._targetElement = targetElement;
		this._sameTargetWidth = sameTargetWidth;
		this.$.dropdown.open();
	}

	close() {
		this.$.dropdown.close();
	}

	_onItemSelected(e) {
		const selectedLocation = e.detail.item;
		getTriserviceLocationSearch().setTempSelectedLocation(selectedLocation);
		this.close();
	}

	_resetShowMore(opened) {
		if (!opened) {
			this._showMoreCities = false;
			this._showMoreProperties = false;
			this._showMoreBuildings = false;
		}
	}

	_notifyResize(opened, cities, properties, buildings, showMoreCities, showMoreProperties, showMoreBuildings) {
		if (opened && (
			cities && cities.length > 0 || properties && properties.length > 0 || buildings && buildings.length > 0 || 
			showMoreCities || showMoreProperties || showMoreBuildings
		)) {
			setTimeout(() => this.notifyResize(), 500);
		}
	}

	_computeHideProperty(showMoreA, showMoreB, items) {
		return showMoreA || showMoreB || !items || items.length == 0;
	}

	_computeScroller(showMoreCities, showMoreProperties, showMoreBuildings) {
		return (showMoreCities || showMoreProperties || showMoreBuildings) ? this.$.content : window;
	}

	_computePropertyText(item) {
		if (!item) return "";
		if (!item._computedText) {
			item._computedText = !item.city ? item.name : `${item.city} - ${item.name}`;
		}
		return item._computedText;
	}

	_computeBuildingText(item) {
		if (!item) return "";
		if (!item._computedText) {
			item._computedText =  `${!item.city ? "" : `${item.city} - `}${!item.property ? "" : `${item.property} - `}${item.name}`;
		}
		return item._computedText;
	}

	_computeHasResults(citiesChange, propertiesChange, buildingsChange) {
		this._debounceComputeHasResults = Debouncer.debounce(
			this._debounceComputeHasResults,
			microTask,
			() => {
				this._hasResults = !isEmptyArray(citiesChange.base) || !isEmptyArray(propertiesChange.base) || !isEmptyArray(buildingsChange.base);
			}
		);
	}

	_computeShowNoMatchesFound(loading, hasResults, opened) {
		let showNoMatchesFound = !loading && !hasResults && opened;
		if (showNoMatchesFound) {
			this._debounceComputeShowNoMatchesFound = Debouncer.debounce(
				this._debounceComputeShowNoMatchesFound,
				timeOut.after(500),
				() => {
					this._showNoMatchesFound = true;
				}
			);
		} else {
			this._showNoMatchesFound = false;
			if (this._debounceComputeShowNoMatchesFound) this._debounceComputeShowNoMatchesFound.cancel();
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/location-search/tricomp-location-search-dropdown.js");
	}
}

window.customElements.define(TricompLocationSearchDropdown.is, TricompLocationSearchDropdown);