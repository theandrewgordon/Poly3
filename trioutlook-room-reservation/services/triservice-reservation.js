/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-ds-core/triplat-ds-core.js";
import "../../tricore-url/tricore-url.js";
import { TriDateUtilities } from "../../triplat-date-utilities/triplat-date-utilities.js";

import { isEmptyArray, isEmptyObj } from "../utils/triutils-utilities.js";

import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriserviceOutlook } from "./triservice-outlook.js";

export function getTriserviceReservation() {
	return getService(TriserviceReservation.is);
}

class TriserviceReservation extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-reservation"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<tricore-url raw-url="/p/web/roomReservation" bind-url="{{_roomReservationUrl}}"></tricore-url>
					<triplat-ds-core id="myOutlookReservationsDS" context="/triOutlookRoomReservation/-1/myOutlookReservations" type="GET"></triplat-ds-core>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			reservation: {
				type: Object,
				value: null,
				notify: true
			},

			_loadingMyOutlookReservation: {
				type: Boolean,
				value: false
			},

			_roomReservationUrl: {
				type: String,
				value: ""
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingMyOutlookReservation)"
		]
	}

	/**
	 * 1. Gets the calendarUID from the current meeting.
	 * 2. Get all the user reservations on tririga associated to that calendarUID.
	 * 3. Identify the master reservation definition. The master reservation is the one that does not belong to another reservation (seriesId is null).
	 * 4. If the meeting is not a recurring or it is not an occurrence of a recurring series then it returns the master reservation.
	 * 5. If it is an occurrence of a recurring series, so find the non master reservation definition with the same start and end dates as the occurrence.
	 * Return the reservation found, or the master reservation if no reservation was found.
	 */
	async getReservation() {
		if (this._isRootInstance) {
			if (this.reservation != null) return this.reservation;
			const serviceOutlook = getTriserviceOutlook();
			const calendarUID = await serviceOutlook.getCalendarUIDFromMeeting();
			const reservations = await this._getReservations(calendarUID);
			if (reservations != null) {
				const isRecurrence = serviceOutlook.isRecurrence()
				const isOccurrence = serviceOutlook.isOccurrence();
				const mainReservation = reservations.find(reservation => reservation.seriesID == null || reservation.seriesID.length == 0);
				if (!isRecurrence || !isOccurrence) return this.reservation = mainReservation;
				const occurrence =  reservations.find(reservation => {
					return reservation.seriesID != null &&
						reservation.seriesID.length > 0 &&
						moment(reservation.startDate).isSame(moment(serviceOutlook.startDate), "minute") && 
						moment(reservation.endDate).isSame(moment(serviceOutlook.endDate), "minute");
				});
				return this.reservation = occurrence != null ? occurrence : mainReservation;
			}
		} else {
			return this._rootInstance.getReservation();
		}
	}

	async _getReservations(calendarUID) {
		if (calendarUID != null) {
			try {
				this._loadingMyOutlookReservation = true;
				const myOutlookReservationsDS = this.shadowRoot.querySelector("#myOutlookReservationsDS");
				myOutlookReservationsDS.query = {
					page: { from: 0, size: 1000 },
					filters: [
						{operator: "equals", name: "iCalUID", value: calendarUID}
					]
				};
				const response = await myOutlookReservationsDS.generateRequest();
				return !isEmptyArray(response.data) ? response.data : null;
			} catch (error) {
				return null;
			} finally {
				this._loadingMyOutlookReservation = false;
			}
		} else {
			return null;
		}
	}

	openReservation(reservation) {
		if (this._isRootInstance) {
			const serviceOutlook = getTriserviceOutlook();
			let openReservationUrl = `${window.location.origin}${this._roomReservationUrl}`;
			if (!isEmptyObj(reservation)) {
				const isOccurrence = serviceOutlook.isOccurrence();
				const startDate = isOccurrence ? TriDateUtilities.toMilliseconds(serviceOutlook.startDate) : -1;
				const endDate = isOccurrence ? TriDateUtilities.toMilliseconds(serviceOutlook.endDate) : -1;
				openReservationUrl += `?route=open&id=${reservation._id}&start=${startDate}&end=${endDate}`;
			}
			window.open(openReservationUrl, "_blank");
		} else {
			return this._rootInstance.openReservation(reservation);
		}
	}
}

window.customElements.define(TriserviceReservation.is, TriserviceReservation);