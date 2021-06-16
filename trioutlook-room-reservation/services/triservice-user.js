/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-ds/triplat-ds.js";
import "../../triplat-search-location/triplat-search-location.js";

import { TrimixinService, getService } from "./trimixin-service.js";
import { getTriserviceOutlook } from "./triservice-outlook.js";

export function getTriserviceUser() {
	return getService(TriserviceUser.is);
};

class TriserviceUser extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-user"; }

	static get template() {
		return html`
			<dom-if id="rootInstanceIf" if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="currentUserDS" name="currentUser" data="{{currentUser}}" loading="{{_loadingCurrentUser}}"></triplat-ds>

					<triplat-ds id="buildingsDS" name="buildings" loading="{{_loadingBuildingsForGeoLocation}}" force-server-filtering manual>
						<triplat-query>
							<triplat-query-filter name="latitude" operator="not equals" value="0"></triplat-query-filter>
							<triplat-query-and></triplat-query-and>
							<triplat-query-filter name="longitude" operator="not equals" value="0"></triplat-query-filter>
						</triplat-query>
					</triplat-ds>

					<triplat-ds id="primaryBuildingDS" name="myPrimaryBuilding" loading="{{_loadingPrimaryBuilding}}" manual></triplat-ds>

					<triplat-search-location id="searchLocation" closest-location="{{_closestBuilding}}" threshold="100" disable
						on-triplat-geo-success="_handleGetGeoLocationSuccess"
						on-triplat-geo-error="_handleGetGeoLocationError">
					</triplat-search-location>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			currentUser: {
				type: Object,
				notify: true
			},

			_loadingCurrentUser: {
				type: Boolean,
				value: false
			},

			_loadingBuildingsForGeoLocation: {
				type: Boolean,
				value: false
			},

			_loadingPrimaryBuilding: {
				type: Boolean,
				value: false
			},

			_loadingGeoLocation: {
				type: Boolean,
				value: false
			},

			_closestBuilding: {
				type: Object
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingCurrentUser, _loadingBuildingsForGeoLocation, _loadingPrimaryBuilding, _loadingGeoLocation)",
		]
	}

	getCurrentUser(force) {
		if (this._isRootInstance) {
			if (force || !this.currentUser) {
				return this.shadowRoot.querySelector("#currentUserDS").refresh()
					.then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.currentUser);
			}
		} else {
			return this._rootInstance.getCurrentUser(force);
		}
	}

	/**
	 * if geolocation is available this returns the nearest building that has at least one reservable room that is integrated into outlook.
	 * if geolocation is not available then returns the user primary building if it has at least one reservable room that is integrated into outlook.
	 * otherwise returns null
	 */
	async getUserBuilding() {
		if (this._isRootInstance) {
			let closestBuilding;
			try {
				await this._getGeoLocation();
				let buildingsForGeoLocation = await this._getBuildingsForGeoLocation();
				closestBuilding = this._getClosestBuilding(buildingsForGeoLocation);
			} catch (error) {
				closestBuilding = null;
				this._clearGeoLocationPromise();
			}
			let userBuilding;
			if (closestBuilding != null) {
				userBuilding = closestBuilding;
			} else {
				try { 
					userBuilding = await this._getUserPrimaryBuilding();
				} catch (error) {
					userBuilding = null;
				}
			}
			return userBuilding && userBuilding._id ? userBuilding : null;
		} else {
			return this._rootInstance.getUserBuilding();
		}
	}

	_getGeoLocation() {
		if (getTriserviceOutlook().isOutlookDesktopClient()) return Promise.reject("Geolocation is not supported on Outlook Desktop Clients.");
		if (this._getGeoLocationPromise) return this._getGeoLocationPromise;
		return this._getGeoLocationPromise = new Promise((resolve, reject) => {
			this._loadingGeoLocation = true;
			this._getGeoLocationResolve = resolve;
			this._getGeoLocationReject = reject;
			this.$.rootInstanceIf.render();
			this.shadowRoot.querySelector("#searchLocation").disable = false;
		});
	}

	_handleGetGeoLocationSuccess() {
		if (this._getGeoLocationResolve) {
			this._getGeoLocationResolve();
			this._clearGeoLocationPromise();
		}
	}

	_clearGeoLocationPromise() {
		this._getGeoLocationReject = null;
		this._getGeoLocationResolve = null;
		this._getGeoLocationPromise = null;
		this._loadingGeoLocation = false;
	}

	_handleGetGeoLocationError() {
		if (this._getGeoLocationReject) {
			this._getGeoLocationReject();
			this._clearGeoLocationPromise();
		}
	}

	async _getBuildingsForGeoLocation() {
		if (!this._buildingsForGeoLocation) {
			this._buildingsForGeoLocation = await this.shadowRoot.querySelector("#buildingsDS").refresh()
				.then(this._returnDataFromResponse.bind(this));
		}
		return this._buildingsForGeoLocation;
	}

	_getClosestBuilding(buildingsForGeoLocation) {
		if (!buildingsForGeoLocation || buildingsForGeoLocation.length == 0) {
			return null;
		}
		let searchLocation = this.shadowRoot.querySelector("#searchLocation");
		searchLocation.closestLocation = null;
		searchLocation.locationsWithinThreshold = null;
		searchLocation.locations = buildingsForGeoLocation;

		return searchLocation.locationsWithinThreshold && searchLocation.locationsWithinThreshold.length > 0 ? 
			searchLocation.closestLocation : null;
	}

	async _getUserPrimaryBuilding() {
		if (this._userPrimaryBuilding) return this._userPrimaryBuilding;
		this._userPrimaryBuilding = await this.shadowRoot.querySelector("#primaryBuildingDS").refresh()
			.then(this._returnDataFromResponse.bind(this));
		return this._userPrimaryBuilding;
	}
};

window.customElements.define(TriserviceUser.is, TriserviceUser);