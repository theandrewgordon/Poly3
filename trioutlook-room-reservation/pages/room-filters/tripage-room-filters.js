/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../../../@polymer/paper-button/paper-button.js";

import "../../components/location-search/tricomp-location-search.js"
import { getTriroutesRoomSearch } from "../../routes/triroutes-room-search.js"
import { getTriserviceLocationSearch } from "../../services/triservice-location-search.js";
import { getTriserviceRoomFilters } from "../../services/triservice-room-filters.js";
import { getTriserviceRoomLayoutTypes } from "../../services/triservice-room-layout-types.js";
import "../../styles/tristyles-app.js";
import "../../styles/tristyles-carbon-theme.js";
import { isEmptyArray } from "../../utils/triutils-utilities.js";
import "../../components/room-amenities-filters/tricomp-room-amenities-filters.js";
import "../../components/room-layout-filters/tricomp-room-layout-filters.js";

class TripageRoomFilters extends PolymerElement {
	static get is() { return "tripage-room-filters"; }

	static get template() {
		return html`
			<style include="room-reservation-app-styles carbon-style">
				:host {
					@apply --layout-vertical;
					padding-bottom: 70px;
				}

				.title-container,
				.filter-container {
					padding: 20px;
				}

				.filter-container {
					@apply --layout-vertical;
					@apply --layout-flex;
					overflow-y: auto;
				}

				.filter-container > div {
					flex-shrink: 0;
				}

				.divider {
					margin: 0 20px;
				}

				.amenities-section {
					padding-bottom: 16px;
				}

				.footer-container {
					@apply --layout-end-justified;
					@apply --layout-horizontal;
					background-color: var(--carbon-ui-03);
					padding: 20px;
					position: fixed;
					right: 0;
					bottom: 0;
					left: 0;
				}
			</style>

			<triroutes-room-search on-filters-route-active-changed="_onRouteChange"></triroutes-room-search>

			<triservice-room-filters temp-location-filter="{{_tempLocationFilter}}" temp-layout-filter="{{_tempLayoutFilter}}" temp-amenities-filter="{{_tempAmenitiesFilter}}"></triservice-room-filters>
			<triservice-room-layout-types layout-types="{{_layoutTypes}}"></triservice-room-layout-types>

			<div class="title-container">
				<div class="productive-heading-03">
					Filter Rooms
				</div>
			</div>

			<div class="divider divider-horizontal"></div>

			<div class="filter-container">
				<div class="bottom-40">
					<div class="productive-heading-02 bottom-16">Location</div>
					<tricomp-location-search></tricomp-location-search>
				</div>

				<dom-if if="[[_layoutTypes]]">
					<template>
						<div class="bottom-40">
							<div class="productive-heading-02 bottom-16">Room Layout</div>
							<tricomp-room-layout-filters layout-types="[[_layoutTypes]]" temp-layout-filter="[[_tempLayoutFilter]]"></tricomp-room-layout-filters>
						</div>
					</template>
				</dom-if>

				<div class="amenities-section">
					<div class="productive-heading-02 bottom-16">Room Amenities</div>
					<tricomp-room-amenities-filters temp-amenities-filter="[[_tempAmenitiesFilter]]"></tricomp-room-amenities-filters>
				</div>
			</div>

			<div class="footer-container">
				<paper-button outlook-secondary on-tap="_handleBackTap">Cancel</paper-button>
				<paper-button outlook-primary disabled="[[_disabledApplyFilters]]" on-tap="_setFilters">Apply filters</paper-button>
			</div>
		`;
	}

	static get properties() {
		return {
			_disabledApplyFilters: {
				type: Boolean,
				computed: "_computedDisabledApplyFilters(_tempLocationFilter.*)"
			},

			_tempLocationFilter: {
				type: Array
			},

			_tempLayoutFilter: {
				type: Array
			},

			_tempAmenitiesFilter: {
				type: Array
			},

			_layoutTypes: {
				type: Array
			}
		};
	}

	_onRouteChange(e) {
		if (e.detail.value) {
			getTriserviceRoomLayoutTypes().refreshLayoutTypes();
			const serviceRoomFilters = getTriserviceRoomFilters();
			serviceRoomFilters.resetTempLayoutFilter();
			serviceRoomFilters.resetTempAmenitiesFilter();
			serviceRoomFilters.resetTempLocationFilter();
			getTriserviceLocationSearch().resetTempLocation(serviceRoomFilters.tempLocationFilter);
		}
	}

	_computedDisabledApplyFilters(locationFilterChange) {
		return isEmptyArray(locationFilterChange.base);
	}

	_backToResultsPage() {
		getTriroutesRoomSearch().openRoomResults();
	}

	_handleBackTap(e) {
		e.stopPropagation();
		this._backToResultsPage();
	}

	_setFilters(e) {
		e.stopPropagation();

		getTriserviceLocationSearch().setLocation();
		getTriserviceRoomFilters().setLocationFilters();
		getTriserviceRoomFilters().setLayoutFilter();
		getTriserviceRoomFilters().setAmenitiesFilter();
		
		setTimeout(this._backToResultsPage.bind(this), 301);
	}
};

window.customElements.define(TripageRoomFilters.is, TripageRoomFilters);