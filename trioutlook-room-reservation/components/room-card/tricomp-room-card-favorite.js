/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../@polymer/paper-spinner/paper-spinner.js";

import "../../../triplat-icon/ibm-icons.js";

import { getTriserviceFavoriteRooms } from "../../services/triservice-favorite-rooms.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompRoomCardFavorite extends PolymerElement {
	static get is() { return "tricomp-room-card-favorite"; }

	static get template() {
		return html`
			<style include="carbon-style">
				.spinner {
					--paper-spinner-stroke-width: 2px;
					height: 16px;
					width: 16px;
				}
			</style>

			<dom-if if="[[_loading]]">
				<template>
					<paper-spinner class="spinner" active="[[_loading]]"></paper-spinner>
				</template>
			</dom-if>

			<dom-if if="[[!_loading]]" restamp>
				<template>
					<dom-if if="[[!room.isFavorite]]" restamp>
						<template>
							<paper-icon-button outlook-secondary icon="ibm:rating-star" on-tap="_addFavorite"></paper-icon-button>
						</template>
					</dom-if>
					<dom-if if="[[room.isFavorite]]" restamp>
						<template>
							<paper-icon-button outlook-secondary icon="ibm:rating-star-filled" on-tap="_removeFavorite"></paper-icon-button>
						</template>
					</dom-if>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			room: {
				type: Object
			},

			inPopup: {
				type: Boolean
			},

			_loading: {
				type: Boolean,
				value: false
			}
		};
	}

	async _addFavorite(e) {
		e.stopPropagation();
		if (!this.inPopup) {
			await getTriserviceFavoriteRooms().addFavoriteRoom(this.room);
		} else {
			this._doPopupOnlyTasks(true);
		}
	}

	async _removeFavorite(e) {
		e.stopPropagation();
		if (!this.inPopup) {
			await getTriserviceFavoriteRooms().removeFavoriteRoom(this.room);
		} else {
			this._doPopupOnlyTasks(false);
		}
	}

	_dispatchFaveRoomChanged(isFavorite) {
		this.dispatchEvent(new CustomEvent('favorite-room-changed',
			{
				detail: {isFavorite: isFavorite},
				bubbles: true,
				composed: true
			}
		));
	}

	_doPopupOnlyTasks(isFavorite) {
		this.set('room.isFavorite', isFavorite);
		this._dispatchFaveRoomChanged(isFavorite);
		this.set("_loading", true);
		setTimeout(() => { this.set("_loading", false) }, 500);
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-card/tricomp-room-card-favorite.js");
	}
}

window.customElements.define(TricompRoomCardFavorite.is, TricompRoomCardFavorite);