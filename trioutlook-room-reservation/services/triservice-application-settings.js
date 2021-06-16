/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceApplicationSettings() {
	return getService(TriserviceApplicationSettings.is);
}

class TriserviceApplicationSettings extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-application-settings"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="applicationSettingsDS" name="applicationSettings" data="{{applicationSettings}}" loading="{{_loadingApplicationSettings}}" manual></triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			applicationSettings: {
				type: Object,
				notify: true
			},

			isReady: {
				type: Number,
				value: false,
				notify: true
			},

			_loadingApplicationSettings: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingApplicationSettings)"
		];
	}

	refreshApplicationSettings(force) {
		if (this._isRootInstance) {
			if (force || !this.applicationSettings) {
				this.shadowRoot.querySelector("#applicationSettingsDS").refresh()
					.then(response => {
						this.isReady = true;
						return this._returnDataFromResponse(response);
					})
					.catch(error => {
						this.isReady = true;
						return Promise.reject(error);
					});
			} else {
				return Promise.resolve(this.applicationSettings);
			}
		} else {
			this._rootInstance.refreshApplicationSettings(force);
		}
	}
}

window.customElements.define(TriserviceApplicationSettings.is, TriserviceApplicationSettings);