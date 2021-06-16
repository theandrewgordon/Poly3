/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js" 

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-input/iron-input.js";

import "../../../@polymer/paper-button/paper-button.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";

import "../../../triplat-icon/carbon-icons-16.js";

import "../../components/filters-list/tricomp-filters-list.js";
import { getTriroutesRoomSearch } from "../../routes/triroutes-room-search.js";
import { getTriserviceApplicationSettings } from "../../services/triservice-application-settings.js";
import "../../services/triservice-room-filters.js";
import "../../services/triservice-rooms-search.js";
import { getTriserviceReservation } from "../../services/triservice-reservation.js";
import { getTriserviceOutlook } from "../../services/triservice-outlook.js";
import "../../styles/tristyles-carbon-theme.js";
import { isEmptyArray, isIEorEdgeBrowser } from "../../utils/triutils-utilities.js";
import "./tricomp-added-rooms.js";
import "./tricomp-available-rooms.js";

class TripageRoomResults extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tripage-room-results"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-vertical;
				}

				.search-container {
					@apply --layout-vertical;
					@apply --layout-flex;
					overflow-y: auto;
				}

				.search-header {
					@apply --layout-vertical;
					background-color: var(--carbon-ui-03);
					padding: 15px 20px;
					flex-shrink: 0;
				}

				.search-filters {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				.capacity {
					@apply --layout-flex-5;
					@apply --layout-horizontal;
					@apply --layout-center;
					word-break: break-word;
				}

				:host([_ie-edge]) .capacity {
					word-break: break-all;
				}

				:host([dir="ltr"]) .capacity {
					margin-right: 10px;
				}

				:host([dir="rtl"]) .capacity {
					margin-left: 10px;
				}

				.add-filter-btn {
					@apply --layout-flex-4;
					word-break: break-word;
				}

				.filter-icon {
					flex-shrink: 0;
				}

				:host([dir="ltr"]) iron-input {
					margin-right: 10px;
				}

				:host([dir="rtl"]) iron-input {
					margin-left: 10px;
				}

				input {
					border: 0;
					font-family: var(--carbon-font-family);
					font-size: 14px;
					color: var(--carbon-text-01);
					outline: none;
					padding: 0px 5px;
					text-align: center;
					height: 30px;
					width: 30px;
					background-color: var(--carbon-field-01);
					border: 1px solid transparent;
					border-bottom-color: var(--carbon-ui-04);
				}

				input::-ms-clear {
					display: none;
				}

				:host([focused]) input {
					border-color: var(--carbon-focus);
				}

				:host paper-button {
					@apply --layout-horizontal;
					margin: 0 !important;
				}

				iron-icon {
					color: white;
					width: 16px;
					height: 16px;
				}
				:host([dir="ltr"]) iron-icon {
					margin-right: 6px;
				}
				:host([dir="rtl"]) iron-icon {
					margin-left: 6px;
				}

				.search-results {
					@apply --layout-vertical;
					@apply --layout-flex;
					padding: 20px;
					flex-shrink: 0;
				}

				.edit-reservation-btn {
					margin: 0px !important;
				}

				tricomp-added-rooms, tricomp-available-rooms {
					flex-shrink: 0;
				}
			</style>

			<triroutes-room-search on-results-route-active-changed="_onRouteChange"></triroutes-room-search>

			<triservice-room-filters location-filter="{{_locationFilter}}" room-capacity="{{_roomCapacity}}"></triservice-room-filters>
			<triservice-rooms-search added-rooms="{{_addedRooms}}"></triservice-rooms-search>
			<triservice-reservation id="serviceReservation" reservation="{{_reservation}}"></triservice-reservation>
			
			<div class="search-container">
				<div class="search-header">
					<div class="search-filters">
						<div class="capacity">
							<iron-input bind-value="{{_roomCapacity}}">
								<input id="roomCapacityInput" value="{{value::input}}">
							</iron-input>
							<div class="label-01">Room Capacity</div>
						</div>
						<paper-button outlook-secondary on-tap="_handleAddFiltersTap" class="add-filter-btn">
							<iron-icon icon="carbon-16:filter" class="filter-icon"></iron-icon>
							Add a filter
						</paper-button>
					</div>

					<dom-if if="[[_hasFilters(_locationFilter.*)]]" restamp>
						<template>
							<tricomp-filters-list class="top-16"></tricomp-filters-list>
						</template>
					</dom-if>
				</div>
				
				<div class="search-results">
					<dom-if if="[[_addedRooms.length]]">
						<template>
							<tricomp-added-rooms class="bottom-32" rooms="[[_addedRooms]]"></tricomp-added-rooms>
						</template>
					</dom-if>

					<tricomp-available-rooms></tricomp-available-rooms>
				</div>
			</div>

			<paper-button class="edit-reservation-btn" outlook-secondary hidden\$="[[_computeHideEditReservationButton(_reservation)]]" 
				on-tap="_handleEditReservationTap">Edit reservation</paper-button>
		`;
	}

	static get properties() {
		return {
			focused: {
				type: Boolean,
				notify: true,
				reflectToAttribute: true
			},

			_addedRooms: {
				type: Array
			},

			_locationFilter: {
				type: Array
			},

			_roomCapacity: {
				type: Number
			},

			_reservation: {
				type: Object
			},

			_ieEdge: {
				type: Boolean,
				reflectToAttribute: true,
				value: isIEorEdgeBrowser()
			}
		};
	}

	ready() {
		super.ready();
		this.$.roomCapacityInput.addEventListener("focus", this._onFocus.bind(this), true);
		this.$.roomCapacityInput.addEventListener("blur", this._onBlur.bind(this), true);
	}

	_onRouteChange(e) {
		if (e.detail.value) {
			afterNextRender(this, () => getTriserviceApplicationSettings().refreshApplicationSettings());
		}
	}

	_handleAddFiltersTap(e) {
		e.stopPropagation();
		getTriroutesRoomSearch().openRoomFilters();
	}

	_onFocus() {
		this.focused = true;
	}
	
	_onBlur() {
		this.focused = false;
	}

	_hasFilters(filterChange) {
		const filter = filterChange.base;
		return !isEmptyArray(filter);
	}

	_computeHideEditReservationButton(reservation) {
		return reservation == null && !getTriserviceOutlook().isOutlookMacDesktopClient();
	}

	_handleEditReservationTap() {
		getTriserviceReservation().openReservation(this._reservation);
	}
};

window.customElements.define(TripageRoomResults.is, TripageRoomResults);