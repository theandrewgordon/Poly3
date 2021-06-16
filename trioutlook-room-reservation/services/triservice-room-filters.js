/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement } from "../../@polymer/polymer/polymer-element.js";

import { isEmptyArray } from "../utils/triutils-utilities.js";
import { getTriserviceUser } from "./triservice-user.js";
import { getTriserviceOutlook } from "./triservice-outlook.js";
import { TrimixinService, getService } from "./trimixin-service.js";

const DEFAULT_ROOM_FILTERS = "DEFAULT_ROOM_FILTERS";
const DEFAULT_ROOM_FILTERS_EXPIRATION = 24 * 60 * 60 * 1000;// ONE DAY

export function getTriserviceRoomFilters() {
	return getService(TriserviceRoomFilters.is);
}

class TriserviceRoomFilters extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-room-filters"; }

	static get properties() {
		return {
			allFilters: {
				type: Array,
				value: () => { return []; },
				notify: true
			},

			locationFilter: {
				type: Array,
				value: () => { return []; },
				notify: true
			},

			tempLocationFilter: {
				type: Array,
				value: () => { return []; },
				notify: true
			},

			roomCapacity: {
				type: Number,
				value: 1,
				notify: true
			},

			layoutFilter: {
				type: Array,
				value: () => [],
				notify: true
			},

			tempLayoutFilter: {
				type: Array,
				value: () => [],
				notify: true
			},

			amenitiesFilter: {
				type: Array,
				value: () => [],
				notify: true
			},

			tempAmenitiesFilter: {
				type: Array,
				value: () => [],
				notify: true
			},

			defaultFiltersLoaded: {
				type: Boolean,
				value: false,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			"_setAllFilters(locationFilter.*, layoutFilter.*, amenitiesFilter.*)"
		];
	}

	async loadDefaultRoomFilters() {
		if (this._isRootInstance) {
			let defaultRoomFilters = this._loadDefaultRoomFiltersFromStorage();
			if (defaultRoomFilters == null) {
				let userBuilding = await getTriserviceUser().getUserBuilding();
				if (userBuilding) {
					this.locationFilter = [userBuilding];
				}
				this._saveDefaultRoomFiltersToStorage(this.locationFilter);
			} else {
				this.locationFilter = defaultRoomFilters;
			}
			this.defaultFiltersLoaded = true;
		} else {
			return this._rootInstance.loadDefaultRoomFilters();
		}
	}

	_loadDefaultRoomFiltersFromStorage() {
		try {
			let defaultRoomFilters = localStorage.getItem(DEFAULT_ROOM_FILTERS);
			defaultRoomFilters = defaultRoomFilters != null ? JSON.parse(defaultRoomFilters) : null;
			if (defaultRoomFilters && 
				defaultRoomFilters.user == getTriserviceOutlook().getCurrentUserEmail().toUpperCase() &&
				(new Date().getTime() - defaultRoomFilters.date) < DEFAULT_ROOM_FILTERS_EXPIRATION) {
				return defaultRoomFilters.locationFilter;
			}
			return null;
		} catch(error) {
			return null;
		}
	}

	_saveDefaultRoomFiltersToStorage(locationFilter) {
		try {
			localStorage.setItem(DEFAULT_ROOM_FILTERS, JSON.stringify({
				locationFilter: locationFilter ? locationFilter : [],
				date: new Date().getTime(),
				user: getTriserviceOutlook().getCurrentUserEmail().toUpperCase()
			}));
		} catch(error) {
			return;
		}
	}

	_setAllFilters() {
		if (this._isRootInstance) {
			const allFilters = [];
			if (!isEmptyArray(this.locationFilter)) {
				allFilters.push(...this.locationFilter);
			}
			if (!isEmptyArray(this.layoutFilter)) {
				allFilters.push(...this.layoutFilter);
			}
			if (!isEmptyArray(this.amenitiesFilter)) {
				allFilters.push(...this.amenitiesFilter);
			}
			this.allFilters = [...allFilters];
		}
	}

	setLocationFilters() {
		if (this._isRootInstance) {
			this.locationFilter = [...this.tempLocationFilter];
		} else {
			this._rootInstance.setLocationFilters();
		}
	}

	resetTempLocationFilter() {
		if (this._isRootInstance) {
			this.tempLocationFilter = [...this.locationFilter];
		} else {
			this._rootInstance.resetTempLocationFilter();
		}
	}

	clearTempLocationFilter() {
		if (this._isRootInstance) {
			this.tempLocationFilter = [];
		} else {
			this._rootInstance.clearTempLocationFilter();
		}
	}

	removeLocationFilter(selectedItem) {
		if (this._isRootInstance) {
			const locationIndex = this.locationFilter.findIndex(location => location._id === selectedItem._id);
			if (locationIndex > -1) this.splice("locationFilter", locationIndex, 1);
		} else {
			this._rootInstance.removeLocationFilter(selectedItem);
		}
	}

	setLayoutFilter() {
		if (this._isRootInstance) {
			this.layoutFilter = [...this.tempLayoutFilter];
		} else {
			this._rootInstance.setLayoutFilter();
		}
	}

	resetTempLayoutFilter() {
		if (this._isRootInstance) {
			this.tempLayoutFilter = [...this.layoutFilter];
		} else {
			this._rootInstance.resetTempLayoutFilter();
		}
	}

	addToTempLayoutFilter(layout) {
		if (this._isRootInstance) {
			this.push("tempLayoutFilter", layout);
		} else {
			this._rootInstance.addToTempLayoutFilter(layout);
		}
	}

	removeFromTempLayoutFilter(layout) {
		if (this._isRootInstance) {
			const layoutIndex = this.tempLayoutFilter.findIndex(filter => filter._id === layout._id);
			if (layoutIndex > -1) this.splice("tempLayoutFilter", layoutIndex, 1);
		} else {
			this._rootInstance.removeFromTempLayoutFilter(layout);
		}
	}

	removeLayoutFilter(selectedItem) {
		if (this._isRootInstance) {
			const layoutIndex = this.layoutFilter.findIndex(filter => filter._id === selectedItem._id);
			if (layoutIndex > -1) this.splice("layoutFilter", layoutIndex, 1);
		} else {
			this._rootInstance.removeLayoutFilter(selectedItem);
		}
	}

	setAmenitiesFilter() {
		if (this._isRootInstance) {
			this.amenitiesFilter = [...this.tempAmenitiesFilter];
		} else {
			this._rootInstance.setAmenitiesFilter();
		}
	}

	resetTempAmenitiesFilter() {
		if (this._isRootInstance) {
			this.tempAmenitiesFilter = [...this.amenitiesFilter];
		} else {
			this._rootInstance.resetTempAmenitiesFilter();
		}
	}

	addToTempAmenitiesFilter(amenity) {
		if (this._isRootInstance) {
			this.push("tempAmenitiesFilter", amenity);
		} else {
			this._rootInstance.addToAmenitiesFilter(amenity);
		}
	}

	removeFromTempAmenitiesFilter(amenity) {
		if (this._isRootInstance) {
			const amenityIndex = this.tempAmenitiesFilter.findIndex(filter => filter.amenity === amenity.amenity);
			if (amenityIndex > -1) this.splice("tempAmenitiesFilter", amenityIndex, 1);
		} else {
			this._rootInstance.removeFromAmenitiesFilter(amenity);
		}
	}

	removeAmenityFilter(selectedItem) {
		if (this._isRootInstance) {
			const amenityIndex = this.amenitiesFilter.findIndex(filter => filter.amenity === selectedItem.amenity);
			if (amenityIndex > -1) this.splice("amenitiesFilter", amenityIndex, 1);
		} else {
			this._rootInstance.removeAmenityFilter(selectedItem);
		}
	}
}

window.customElements.define(TriserviceRoomFilters.is, TriserviceRoomFilters);