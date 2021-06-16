/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-ds/triplat-ds.js";

import { TrimixinService } from "./trimixin-service.js";

class TriServiceStacking extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-stacking"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="currentUser" name="currentUser" data="{{currentUser}}" loading="{{_loadingCurrentUser}}"></triplat-ds>

					<triplat-ds id="uomAreaUnits" name="uomAreaUnits" data="{{uomAreaUnits}}" loading="{{_loadingUomAreaUnits}}"></triplat-ds>
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

			uomAreaUnits: {
				type: Array,
				notify: true
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingCurrentUser: {
				type: Boolean,
				value: false
			},

			_loadingUomAreaUnits: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingCurrentUser, _loadingUomAreaUnits)"
		]
	}
};

window.customElements.define(TriServiceStacking.is, TriServiceStacking);
