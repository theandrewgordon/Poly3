/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { TrimixinService } from "./trimixin-service.js";
import "./triservice-parent.js";

class TriserviceLoading extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-loading"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triservice-parent loading="{{_loadingParent}}"></triservice-parent>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			loadingContactRolesApp: {
				type: Boolean,
				value: false
			},

			_loadingParent: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingParent, loadingContactRolesApp)"
		]
	}
};

window.customElements.define(TriserviceLoading.is, TriserviceLoading);