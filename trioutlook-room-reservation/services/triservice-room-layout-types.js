/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { isEmptyArray } from "../utils/triutils-utilities.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceRoomLayoutTypes() {
	return getService(TriserviceRoomLayoutTypes.is);
}

class TriserviceRoomLayoutTypes extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-room-layout-types"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="layoutTypesDS" name="layoutTypes" manual></triplat-ds>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			layoutTypes: {
				type: Array,
				notify: true
			},

			_loadingLayoutTypes: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingLayoutTypes)"
		];
	}

	async refreshLayoutTypes(force) {
		if (this._isRootInstance) {
			if (force || isEmptyArray(this.layoutTypes)) {
				this._loadingLayoutTypes = true;
				try {
					let results = await this.shadowRoot.querySelector("#layoutTypesDS").refresh();
					let layoutTypes = results.data;
					if (!isEmptyArray(layoutTypes)) {
						layoutTypes.forEach(layout => {
							layout.name = layout.value;
							layout.type = "roomLayout";
						});
					}
					this.layoutTypes = [...layoutTypes];
				} finally {
					this._loadingLayoutTypes = false;
				}
			} else {
				return Promise.resolve(this.layoutTypes);
			}
		} else {
			this._rootInstance.refreshLayoutTypes(force);
		}
	}
}

window.customElements.define(TriserviceRoomLayoutTypes.is, TriserviceRoomLayoutTypes);