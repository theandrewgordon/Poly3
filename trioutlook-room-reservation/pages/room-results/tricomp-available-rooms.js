/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import "../../../triplat-icon/ibm-icons.js";

import "../../components/checkbox/tricomp-checkbox.js";
import { CHECKED } from "../../components/checkbox/tricomp-checkbox.js";
import "../../components/rooms-accordion/tricomp-rooms-accordion.js";
import "../../services/triservice-favorite-rooms.js";
import "../../services/triservice-room-filters.js";
import "../../services/triservice-rooms-search.js";
import { getTriserviceRoomsSearch } from "../../services/triservice-rooms-search.js";
import "../../styles/tristyles-app.js";
import "../../styles/tristyles-carbon-theme.js";
import { isEmptyArray } from "../../utils/triutils-utilities.js";
import { saveDataToLocal } from "../../utils/triutils-localstorage.js";
import { getTriserviceOutlook } from "../../services/triservice-outlook.js";
import { getTriserviceRecurrence } from "../../services/triservice-recurrence.js";

class TricompAvailableRooms extends PolymerElement {
	static get is() { return "tricomp-available-rooms"; }

	static get template() {
		return html`
			<style include="room-reservation-app-styles carbon-style">
				:host {
					@apply --layout-vertical;
				}

				.section-title {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				.section-title span {
					@apply --layout-flex;
				}

				.no-results-container {
					padding-top: 8px;
				}
			</style>

			<triservice-favorite-rooms favorite-rooms="{{_favoriteRooms}}"></triservice-favorite-rooms>
			<triservice-room-filters location-filter="{{_locationFilter}}" all-filters="{{_allFilters}}"></triservice-room-filters>
			<triservice-rooms-search rooms-count="{{_roomsCount}}" rooms-hierarchy="{{_roomsHierarchy}}" 
				search-has-favorite-rooms="{{_searchHasFavoriteRooms}}" has-unavailable-rooms="{{_hasUnavailableRooms}}" 
				on-reservable-rooms-changed="_onReservableRoomsChanged" loading="{{_loading}}"
				only-favorites-filter="{{_showOnlyFavorites}}" unavailable-filter="{{_showUnavailable}}"></triservice-rooms-search>

			<div class="productive-heading-03 bottom-8 section-title">
				<span class="section-title">
					[[_computeTitleText(_isFavoriteList, _locationFilter.*)]]
				</span>

				<dom-if if="[[_displayFavoriteFilterIcon(_searchHasFavoriteRooms, _isFavoriteList)]]">
					<template>
						<paper-icon-button outlook-secondary icon="[[_favoriteIcon(_showOnlyFavorites)]]" on-tap="_toggleFavorites"></paper-icon-button>
					</template>
				</dom-if>
			</div>

			<dom-if if="[[_displayNoResults(_roomsCount, _hasUnavailableRooms, _loading)]]">
				<template>
					<div class="no-results-container">
						<dom-if if="[[!_locationFilter.length]]">
							<template>
								<div class="body-short-01 bottom-8">Tap the “Add a filter” button above to search for rooms to reserve.</div>
							</template>
						</dom-if>

						<dom-if if="[[_locationFilter.length]]">
							<template>
								<div class="body-short-01">[[_computeMatchedRoomsText(_roomsCount)]]</div>
							</template>
						</dom-if>
					</div>
				</template>
			</dom-if>

			<dom-if if="[[_displayResults(_roomsCount, _hasUnavailableRooms)]]">
				<template>
					<div class="helper-text-01 bottom-16">[[_computeMatchedRoomsText(_roomsCount)]]</div>

					<dom-if if="[[_hasUnavailableRooms]]">
						<template>
							<tricomp-checkbox class="bottom-20" on-user-checked="_handleUserChecked">Show unavailable rooms</tricomp-checkbox>
						</template>
					</dom-if>

					<div class="divider divider-horizontal bottom-20"></div>

					<dom-repeat items="[[_roomsHierarchy]]" as="location">
						<template>
							<div class="bottom-32">
								<div class="productive-heading-02 bottom-8" hidden$\="[[!location.parentName]]">[[location.parentName]]</div>
								<dom-repeat items="[[location.buildingsFloors]]" as="buildingFloor">
									<template>
										<tricomp-rooms-accordion building="[[buildingFloor.building]]" floor="[[buildingFloor.floor]]" rooms="[[buildingFloor.rooms]]"></tricomp-rooms-accordion>
									</template>
								</dom-repeat>
							</div>
						</template>
					</dom-repeat>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			_favoriteRooms: {
				type: Array
			},

			_locationFilter: {
				type: Array
			},

			_roomsCount: {
				type: Number
			},

			_roomsHierarchy: {
				type: Array
			},

			_searchHasFavoriteRooms: {
				type: Boolean
			},

			_hasUnavailableRooms: {
				type: Boolean
			},

			_allFilters: {
				type: Boolean
			},

			_allFiltersChanged: {
				type: Boolean,
				value: false
			},

			_reservableRoomsChanged: {
				type: Boolean,
				value: false
			},

			_loading: {
				type: Boolean
			},

			_isFavoriteList: {
				type: Boolean,
				value: false,
				computed: "_computeIsFavoriteList(_roomsHierarchy, _locationFilter, _favoriteRooms, _hasUnavailableRooms)"
			},

			_showOnlyFavorites: {
				type: Number
			},

			_showUnavailable: {
				type: Number
			}
		};
	}

	static get observers() {
		return [
			"_onAllFiltersChanged(_allFilters.*)",
			"_openFirstAccordion(_roomsHierarchy, _allFiltersChanged, _reservableRoomsChanged)"
		];
	}

	constructor() {
		super();
		this._headerTappedHandlerListener = this._headerTappedHandler.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("building-floor-header-tapped", this._headerTappedHandlerListener);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("building-floor-header-tapped", this._headerTappedHandlerListener);
	}

	_computeIsFavoriteList(roomsHierarchy, locationFilter, favoriteRooms, hasUnavailableRooms) {
		return !isEmptyArray(roomsHierarchy) && isEmptyArray(locationFilter) && !isEmptyArray(favoriteRooms) ||
				isEmptyArray(roomsHierarchy) && isEmptyArray(locationFilter) && !isEmptyArray(favoriteRooms) && hasUnavailableRooms;
	}

	_onAllFiltersChanged(allFiltersChange) {
		const allFilters = allFiltersChange.base;
		if (!isEmptyArray(allFilters)) {
			this._allFiltersChanged = true;
		}
	}

	_onReservableRoomsChanged(e) {
		const reservableRooms = e.detail.value;
		if (!isEmptyArray(reservableRooms)) {
			this._reservableRoomsChanged = true;
		}
	}

	_openFirstAccordion(roomsHierarchy, allFiltersChanged, reservableRoomsChanged) {
		afterNextRender(this, () => {
			if (!isEmptyArray(roomsHierarchy) && ((allFiltersChanged && reservableRoomsChanged) || 
				(isEmptyArray(this._allFilters) && !isEmptyArray(this._favoriteRooms)))) {
				this._allFiltersChanged = false;
				this._reservableRoomsChanged = false;
				const roomsAccordion = this.shadowRoot.querySelector("tricomp-rooms-accordion");
				if (roomsAccordion) roomsAccordion.openAccordionIsLessThan(6);
			}
		});
	}

	_displayFavoriteFilterIcon(searchHasFavoriteRooms, isFavoriteList) {
		return searchHasFavoriteRooms && !isFavoriteList;
	}

	_computeTitleText(isFavoriteList, locationFilterChange) {
		var __dictionary__titleAvailableMeetingRooms = "Available Meeting Rooms";
		var __dictionary__titleFavoriteMeetingRooms = "Favorite Meeting Rooms";

		if (isFavoriteList) {
			return __dictionary__titleFavoriteMeetingRooms;
		} else if (locationFilterChange && !isEmptyArray(locationFilterChange.base)) {
			return __dictionary__titleAvailableMeetingRooms;
		} else {
			return "";
		}
	}

	_favoriteIcon(showOnlyFavorites) {
		if (showOnlyFavorites === 1) {
			return "ibm:rating-star-filled";
		} else {
			return "ibm:rating-star";
		}
	}

	_toggleFavorites(e) {
		e.stopPropagation();
		this._showOnlyFavorites = this._showOnlyFavorites === 1 ? "" : 1;
	}

	_displayNoResults(roomsCount, hasUnavailableRooms, loading) {
		return !roomsCount && !hasUnavailableRooms && loading !== undefined && !loading;
	}

	_displayResults(roomsCount, hasUnavailableRooms) {
		return roomsCount > 0 || roomsCount == 0 && hasUnavailableRooms;
	}

	_computeMatchedRoomsText(roomsCount) {
		let text;
		if (roomsCount > 1 || roomsCount == 0) {
			var __dictionary__matchedRooms ="Your search found {1} rooms.";
			text = __dictionary__matchedRooms.replace("{1}", roomsCount);
		} else if (roomsCount == 1) {
			var __dictionary__matchedRoom = "Your search found 1 room.";
			text = __dictionary__matchedRoom;
		}
		return text;
	}

	_headerTappedHandler(e) {
		e.stopPropagation();
		const buildingId = e.detail.buildingId;
		const floorId = e.detail.floorId;
		const url = '#!/building/' + buildingId + '/floor/' + floorId;

		getTriserviceRoomsSearch().saveBuildingRoomsDataToLocal(e.detail.cityId, buildingId, e.detail.propertyId);
		getTriserviceRoomsSearch().saveAddedRoomsDataToLocal();
		saveDataToLocal(getTriserviceRecurrence().isRecurring, 'isRecurring');
		getTriserviceOutlook().openDialog(url);
	}

	_handleUserChecked(e) {
		const state = e.detail;
		this._showUnavailable = (state === CHECKED) ? "" : 0;
	}
}

window.customElements.define(TricompAvailableRooms.is, TricompAvailableRooms);