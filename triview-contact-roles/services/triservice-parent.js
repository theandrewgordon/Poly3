/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-ds/triplat-ds.js";

import { TrimixinService } from "./trimixin-service.js";

class TriServiceParent extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-parent"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="parent" name="parent" data="{{parentRecord}}" loading="{{_loadingParent}}" manual>
						<triplat-ds-instance instance-id="[[recordId]]"></triplat-ds-instance>
					</triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			parentRecord: {
				type: Object,
				notify: true
			},

			recordId: String,

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingParent: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingParent)"
		]
	}

	refreshParent(recordId) {
		if (this._isRootInstance) {
			if (recordId && !this.parentRecord) {
				return this.shadowRoot.querySelector("#parent").refresh()
					.then(this._returnDataFromResponse.bind(this))
			}
		} else {
			return this._rootInstance.refreshParent(recordId);
		}
	}
};

window.customElements.define(TriServiceParent.is, TriServiceParent);