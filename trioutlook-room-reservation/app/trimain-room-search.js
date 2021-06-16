/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../@polymer/polymer/lib/utils/render-status.js";
import "../../@polymer/iron-pages/iron-pages.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../triplat-routing/triplat-routing.js";
import "../pages/room-filters/tripage-room-filters.js";
import "../pages/room-results/tripage-room-results.js";
import { getTriroutesRoomSearch } from "../routes/triroutes-room-search.js";
import "../services/triservice-application-settings.js";
import { getTriserviceFavoriteRooms } from "../services/triservice-favorite-rooms.js";
import "../services/triservice-location-search.js";
import "../services/triservice-outlook.js";
import "../services/triservice-recurrence.js";
import { getTriserviceRoomFilters } from "../services/triservice-room-filters.js";
import "../services/triservice-room-layout-types.js";
import "../services/triservice-rooms-search.js";
import "../services/triservice-reservation.js";
import { getTriserviceUser } from "../services/triservice-user.js";
import "../styles/tristyles-app.js";
import "../styles/tristyles-carbon-theme.js";
import { isEmptyArray } from "../utils/triutils-utilities.js";

class TrimainRoomSearch extends PolymerElement {
	static get is() { return "trimain-room-search"; }

	static get template() {
		return html`
			<style include="room-reservation-app-styles carbon-style">
				:host {
					@apply --layout-vertical;
				}

				.not-supported {
					@apply --layout-flex;
					@apply --layout-vertical;
					@apply --layout-center;
					padding: 20px;
				}
			</style>

			<triroutes-room-search
				on-filters-route-active-changed="_loadRoomFilters">
			</triroutes-room-search>

			<triservice-application-settings></triservice-application-settings>
			<triservice-favorite-rooms></triservice-favorite-rooms>
			<triservice-location-search></triservice-location-search>
			<triservice-outlook id="serviceOutlook"></triservice-outlook>
			<triservice-recurrence></triservice-recurrence>
			<triservice-room-filters></triservice-room-filters>
			<triservice-room-layout-types></triservice-room-layout-types>
			<triservice-rooms-search></triservice-rooms-search>
			<triservice-reservation id="serviceReservation"></triservice-reservation>

			<triplat-route-selector>
				<iron-pages>
					<div route="results" default-route>
						<tripage-room-results></tripage-room-results>
					</div>

					<div route="filters">
						<dom-if id="roomFiltersRouteIf">
							<template>
								<tripage-room-filters></tripage-room-filters>
							</template>
						</dom-if>
					</div>

					<div route="notSupported" class="not-supported productive-heading-03">
						This Microsoft Outlook web application does not support the TRIRIGA Reserve room search add-in.
					</div>
				</iron-pages>
			</triplat-route-selector>
		`;
	}

	async ready() {
		super.ready();
		let serviceOutlook = this.shadowRoot.querySelector("#serviceOutlook");
		const notSupported = serviceOutlook.isClientNotSupported();
		if (notSupported) {
			afterNextRender(this, () => getTriroutesRoomSearch().openNotSupported());
			return;
		}
		await serviceOutlook.refreshParametersFromOutlook();
		serviceOutlook.listenToMeetingChanges();
		await getTriserviceRoomFilters().loadDefaultRoomFilters();

		// If there're no filters, check for favorite rooms.
		await getTriserviceUser().getCurrentUser();
		const allFilters = getTriserviceRoomFilters().allFilters;
		if (isEmptyArray(allFilters)) getTriserviceFavoriteRooms().getFavoriteRooms();
		await  this.shadowRoot.querySelector("#serviceReservation").getReservation();
	}

	_loadRoomFilters(e) {
		if (e.detail.value) {
			afterNextRender(this, () => this.shadowRoot.querySelector("#roomFiltersRouteIf").if = true);
		}
	}
};

window.customElements.define(TrimainRoomSearch.is, TrimainRoomSearch);