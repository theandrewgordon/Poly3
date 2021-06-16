/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { TriPlatDs } from "../../triplat-ds/triplat-ds.js";

import { isEmptyArray } from "../utils/triutils-utilities.js";

import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriserviceRoomsSearch } from "./triservice-rooms-search.js";
import { getTriserviceRoomFilters } from "./triservice-room-filters.js";
import "./triservice-user.js";

export function getTriserviceFavoriteRooms() {
	return getService(TriserviceFavoriteRooms.is);
}

class TriserviceFavoriteRooms extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-favorite-rooms"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triservice-user current-user="{{_currentUser}}"></triservice-user>

					<triplat-ds id="favoriteRoomsDS" name="favoriteRooms" data="{{favoriteRooms}}" loading="{{_loadingFavoriteRooms}}" manual>
						<triplat-ds-context name="currentUser" context-id="[[_currentUser._id]]"></triplat-ds-context>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			favoriteRooms: {
				type: Array,
				notify: true
			},

			_loadingFavoriteRooms: {
				type: Boolean
			},

			_currentUser: {
				type: Object
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingFavoriteRooms)"
		];
	}

	getFavoriteRooms(force) {
		if (this._isRootInstance) {
			if (!this._currentUser || !this._currentUser._id) return Promise.resolve([]);

			if (force || !this.favoriteRooms) {
				return this.shadowRoot.querySelector("#favoriteRoomsDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.favoriteRooms);
			}
		} else {
			this._rootInstance.getFavoriteRooms(force);
		}
	}

	async addFavoriteRoom(room) {
		if (this._isRootInstance) {
			if (!this._currentUser || !this._currentUser._id) return Promise.resolve();

			if (!this.favoriteRoom) await this.getFavoriteRooms();
			return this.shadowRoot.querySelector("#favoriteRoomsDS").addRecord(room, TriPlatDs.RefreshType.NONE)
				.then(() => {
					const favoriteRoomIndex = this.favoriteRooms.findIndex(favoriteRoom => favoriteRoom._id === room._id);
					if (favoriteRoomIndex < 0) this.push("favoriteRooms", room);
					getTriserviceRoomsSearch().setRoomFavoriteValue(room, true);
					if (isEmptyArray(getTriserviceRoomFilters().locationFilter)) {
						this.favoriteRooms = [...this.favoriteRooms];
					}
				});
		} else {
			this._rootInstance.addFavoriteRoom(roomId);
		}
	}

	async removeFavoriteRoom(room) {
		if (this._isRootInstance) {
			if (!this._currentUser || !this._currentUser._id) return Promise.resolve();

			if (!this.favoriteRoom) await this.getFavoriteRooms();
			return this.shadowRoot.querySelector("#favoriteRoomsDS").removeRecord(room, TriPlatDs.RefreshType.NONE)
				.then(() => {
					const favoriteRoomIndex = this.favoriteRooms.findIndex(favoriteRoom => favoriteRoom._id === room._id);
					if (favoriteRoomIndex > -1) this.splice("favoriteRooms", favoriteRoomIndex, 1);

					getTriserviceRoomsSearch().setRoomFavoriteValue(room, false);
				});
		} else {
			this._rootInstance.removeFavoriteRoom(roomId);
		}
	}
}

window.customElements.define(TriserviceFavoriteRooms.is, TriserviceFavoriteRooms);