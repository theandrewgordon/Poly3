/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triplat-routing/triplat-route.js";
import { TrimixinService, getService } from "../services/trimixin-service.js";

export function getTriroutesRoomSearch() {
	return getService(TriroutesRoomSearch.is);
};

class TriroutesRoomSearch extends TrimixinService(PolymerElement) {
	static get is() { return "triroutes-room-search"; }

	static get template() {
		return html`
			<dom-if id="rootInstanceIf" if="[[_isRootInstance]]">
				<template>
					<triplat-route id="resultsRoute" name="results" path="/results"
						active="{{resultsRouteActive}}">
					</triplat-route>
					<triplat-route id="filtersRoute" name="filters" path="/filters"
						active="{{filtersRouteActive}}">
					</triplat-route>
					<triplat-route id="notSupportedRoute" name="notSupported" path="/notSupported">
					</triplat-route>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			resultsRouteActive: {
				type: Boolean,
				notify: true
			},

			filtersRouteActive: {
				type: Boolean,
				notify: true
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#rootInstanceIf").render();
		}
	}

	openRoomResults() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#resultsRoute").navigate();
		} else {
			this._rootInstance.openRoomFilters();
		}
	}

	openRoomFilters() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#filtersRoute").navigate();
		} else {
			this._rootInstance.openRoomFilters();
		}
	}

	openNotSupported() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#notSupportedRoute").navigate();
		} else {
			this._rootInstance.openNotSupported();
		}
	}
};

window.customElements.define(TriroutesRoomSearch.is, TriroutesRoomSearch);