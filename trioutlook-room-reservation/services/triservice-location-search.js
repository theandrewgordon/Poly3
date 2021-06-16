/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { Debouncer } from "../../@polymer/polymer/lib/utils/debounce.js";
import { timeOut } from "../../@polymer/polymer/lib/utils/async.js";

import "../../triplat-ds/triplat-ds.js";
import "../../triplat-query/triplat-query.js";

import "../routes/triroutes-room-search.js"
import { isEmptyObj, isEmptyArray } from "../utils/triutils-utilities.js";
import { getTriserviceRoomFilters } from "./triservice-room-filters.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceLocationSearch() {
	return getService(TriserviceLocationSearch.is);
};

class TriserviceLocationSearch extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-location-search"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triroutes-room-search filters-route-active="{{_filtersRouteActive}}"></triroutes-room-search>

					<triplat-ds name="cities" data="{{cities}}" query-total-Size="{{citiesCount}}" loading="{{_loadingCities}}" disable="[[_disableDS]]">
						<triplat-query delay="0">
							<triplat-query-scroll-page scroller="[[scroller]]" size="30" disable-auto-fetch threshold="20"></triplat-query-scroll-page>
							<triplat-query-filter name="name" operator="contains" value="[[_searchFilter]]" ignore-if-blank></triplat-query-filter>
							<triplat-query-sort name="name"></triplat-query-sort>
						</triplat-query>
					</triplat-ds>

					<triplat-ds name="properties" data="{{properties}}" query-total-Size="{{propertiesCount}}" loading="{{_loadingProperties}}" disable="[[_disableDS]]">
						<triplat-query delay="0">
							<triplat-query-scroll-page scroller="[[scroller]]" size="30" disable-auto-fetch threshold="20"></triplat-query-scroll-page>
							<triplat-query-filter name="name" operator="contains" value="[[_searchFilter]]" ignore-if-blank></triplat-query-filter>
							<triplat-query-sort name="name"></triplat-query-sort>
						</triplat-query>
					</triplat-ds>

					<triplat-ds name="buildings" data="{{buildings}}" query-total-Size="{{buildingsCount}}" loading="{{_loadingBuildings}}" disable="[[_disableDS]]">
						<triplat-query delay="0">
							<triplat-query-scroll-page scroller="[[scroller]]" size="30" disable-auto-fetch threshold="20"></triplat-query-scroll-page>
							<triplat-query-filter name="name" operator="contains" value="[[_searchFilter]]" ignore-if-blank></triplat-query-filter>
							<triplat-query-sort name="name"></triplat-query-sort>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="buildingsByCityOrPropertyDS" name="buildings" data="{{buildingsByCityOrProperty}}" loading="{{_loadingBuildingsByCityOrProperty}}" force-server-filtering manual>
						<triplat-query delay="0">
							<triplat-query-filter id="buildingsByCityOrPropertyDSFilter" operator="equals"></triplat-query-filter>
							<triplat-query-sort name="name"></triplat-query-sort>
						</triplat-query>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			searchValue: {
				type: String,
				notify: true
			},

			cities: {
				type: Array,
				notify: true
			},

			properties: {
				type: Array,
				notify: true
			},

			buildings: {
				type: Array,
				notify: true
			},

			buildingsByCityOrProperty: {
				type: Array,
				notify: true
			},

			locationHierarchy: {
				type: Object,
				notify: true
			},

			tempLocationHierarchy: {
				type: Object,
				notify: true
			},

			citiesCount: {
				type: Number,
				notify: true
			},

			propertiesCount: {
				type: Number,
				notify: true
			},

			buildingsCount: {
				type: Number,
				notify: true
			},

			scroller: {
				type: Object,
				notify: true
			},

			selectedLocation: {
				type: Object,
				notify: true
			},

			tempSelectedLocation: {
				type: Object,
				notify: true
			},

			_loadingCities: {
				type: Boolean,
				notify: true
			},

			_loadingProperties: {
				type: Boolean,
				notify: true
			},

			_loadingBuildings: {
				type: Boolean,
				notify: true
			},

			_loadingBuildingsByCityOrProperty: {
				type: Boolean,
				notify: true
			},

			_disableDS: {
				type: Boolean,
				value: true
			},

			_filtersRouteActive: {
				type: Boolean
			},

			_searchFilter: {
				type: String
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingCities, _loadingProperties, _loadingBuildings, _loadingBuildingsByCityOrProperty)",
			"_handleSearchValueChanged(_filtersRouteActive, searchValue, tempSelectedLocation)"
		];
	}

	_handleSearchValueChanged(filtersRouteActive, searchValue, tempSelectedLocation) {
		if (this._isRootInstance) {
			this._debounceComputeDisableDS = Debouncer.debounce(
				this._debounceComputeDisableDS,
				timeOut.after(300),
				() => {
					let disable = !isEmptyObj(tempSelectedLocation) || !filtersRouteActive || !searchValue || searchValue === "";
					if (disable) {
						this.cities = [];
						this.properties = [];
						this.buildings = [];
					} else {
						this._searchFilter = searchValue;
					}
					setTimeout(() => this._disableDS = disable);
				}
			);
		}
	}

	clearTempSelectedLocation() {
		if (this._isRootInstance) {
			this.tempLocationHierarchy = null;
			this.tempSelectedLocation = {};
		} else {
			this._rootInstance.clearTempSelectedLocation();
		}
	}

	setLocation() {
		if (this._isRootInstance) {
			this.locationHierarchy = {...this.tempLocationHierarchy};
			this.selectedLocation = {...this.tempSelectedLocation};
		} else {
			this._rootInstance.setLocation();
		}
	}

	resetTempLocation(tempLocationFilter) {
		if (this._isRootInstance) {
			this.tempLocationHierarchy = {...this.locationHierarchy};
			this.tempSelectedLocation = {...this.selectedLocation};
			if (isEmptyObj(this.tempLocationHierarchy) && isEmptyObj(this.tempSelectedLocation) && !isEmptyArray(tempLocationFilter)) {
				this.setTempSelectedLocation(tempLocationFilter[0]);
			}
		} else {
			this._rootInstance.resetTempLocation();
		}
	}

	setTempSelectedLocation(tempSelectedLocation) {
		if (this._isRootInstance) {
			this.tempSelectedLocation = tempSelectedLocation;
			getTriserviceRoomFilters().tempLocationFilter = [tempSelectedLocation];
			let cityOrPropertyId;
			let cityOrPropertyType;
			if (tempSelectedLocation.citySystemRecordID && tempSelectedLocation.citySystemRecordID !== "") {
				cityOrPropertyId = tempSelectedLocation.citySystemRecordID;
				cityOrPropertyType = "City";
			} else if (tempSelectedLocation.propertySystemRecordID && tempSelectedLocation.propertySystemRecordID !== "") {
				cityOrPropertyId = tempSelectedLocation.propertySystemRecordID;
				cityOrPropertyType = "Property";
			} else if (tempSelectedLocation.type === "City" || tempSelectedLocation.type === "Property") {
				cityOrPropertyId = tempSelectedLocation._id;
				cityOrPropertyType = tempSelectedLocation.type;
			}

			if (!cityOrPropertyId && !cityOrPropertyType) {
				this._setBuildingAsLocationHierarchy(tempSelectedLocation);
			} else {
				this._getLocationHierarchyByCityOrProperty(cityOrPropertyId, cityOrPropertyType);
			}
		} else {
			this._rootInstance.setTempSelectedLocation(tempSelectedLocation);
		}
	}

	_setBuildingAsLocationHierarchy(selectedBuilding) {
		if (this._isRootInstance) {
			this.tempLocationHierarchy = {...selectedBuilding};
		} else {
			this._rootInstance._setBuildingAsLocationHierarchy(selectedBuilding);
		}
	}

	_getLocationHierarchyByCityOrProperty(cityOrPropertyId, cityOrPropertyType) {
		if (this._isRootInstance) {
			this._refreshBuildingsByCityOrProperty(cityOrPropertyId, cityOrPropertyType)
				.then((buildings) => {
					if (buildings && buildings.length > 0) this._createLocationHierarchy(buildings)
				});
		} else {
			this._rootInstance._getLocationHierarchyByCityOrProperty(cityOrPropertyId, cityOrPropertyType);
		}
	}

	async _refreshBuildingsByCityOrProperty(cityOrPropertyId, cityOrPropertyType, force) {
		if (this._isRootInstance) {
			let buildingsByCityOrPropertyDSFilter = this.shadowRoot.querySelector("#buildingsByCityOrPropertyDSFilter");
			if (force || this.buildingsByCityOrProperty == null || buildingsByCityOrPropertyDSFilter.value != cityOrPropertyId) {
				await this._setBuildingsByCityOrPropertyDSFilter(cityOrPropertyId, cityOrPropertyType);
				return this.shadowRoot.querySelector("#buildingsByCityOrPropertyDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.buildingsByCityOrProperty);
			}
		}
	}

	_setBuildingsByCityOrPropertyDSFilter(cityOrPropertyId, cityOrPropertyType) {
		return new Promise((resolve) => {
			this.shadowRoot.querySelector("#buildingsByCityOrPropertyDSFilter").value = cityOrPropertyId;
			this.shadowRoot.querySelector("#buildingsByCityOrPropertyDSFilter").name = cityOrPropertyType.toLowerCase() + "SystemRecordID";
			setTimeout(resolve, 1);
		});
	}

	_createLocationHierarchy(buildings) {
		let tempLocationHierarchy = {};

		// Set the city or property of the first building as a parent of the hierarchy.
		let hasCity = buildings[0].citySystemRecordID && buildings[0].citySystemRecordID !== "";
		let hasProperty = buildings[0].propertySystemRecordID && buildings[0].propertySystemRecordID !== "";

		if (hasCity) {
			tempLocationHierarchy = this._setHierarchyParentObj(buildings[0].citySystemRecordID, buildings[0].city, "City");
		} else if (hasProperty) {
			tempLocationHierarchy = this._setHierarchyParentObj(buildings[0].propertySystemRecordID, buildings[0].property, "Property");
		}

		// Iterate over the buildings array to build the hierarchy.
		for (let i = 0; i < buildings.length; i++) {
			let parentIsCity = tempLocationHierarchy.type && tempLocationHierarchy.type === "City";
			let parentIsProperty = tempLocationHierarchy.type && tempLocationHierarchy.type === "Property";
			let buildingHasProperty = buildings[i].propertySystemRecordID && buildings[i].propertySystemRecordID !== "";

			if (parentIsCity && buildingHasProperty) {
				tempLocationHierarchy.hasProperty = true;
				let indexProperty = tempLocationHierarchy.children.findIndex(e => e._id == buildings[i].propertySystemRecordID);
				if (indexProperty == -1) {
					let property = this._setHierarchyParentObj(buildings[i].propertySystemRecordID, buildings[i].property, "Property", buildings[i]);
					property.hasParent = true;
					tempLocationHierarchy.children.push(property);
				} else {
					tempLocationHierarchy.children[indexProperty].children.push( buildings[i] );
				}
			} else if (parentIsCity && !buildingHasProperty || parentIsProperty) {
				tempLocationHierarchy.children.push( buildings[i] );
			}
		}

		this.tempLocationHierarchy = {...tempLocationHierarchy};
	}

	_setHierarchyParentObj(id, name, type, child) {
		if (this._isRootInstance) {
			let object = {
				_id: id,
				name: name,
				type: type,
				children: child ? [ child ] : []
			}
			return object;
		}
	}
};

window.customElements.define(TriserviceLocationSearch.is, TriserviceLocationSearch);