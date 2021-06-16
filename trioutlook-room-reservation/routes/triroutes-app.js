/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triplat-routing/triplat-route.js";
import { TrimixinService, getService } from "../services/trimixin-service.js";

export function getTriroutesApp() {
	return getService(TriroutesApp.is);
};

class TriroutesApp extends TrimixinService(PolymerElement) {
	static get is() { return "triroutes-app"; }

	static get template() {
		return html`
			<dom-if id="rootInstanceIf" if="[[_isRootInstance]]">
				<template>
					<triplat-route id="roomSearchRoute" name="roomSearch" path="/"
						active="{{roomSearchRouteActive}}">
					</triplat-route>
					<triplat-route id="roomDetailRoute" name="roomDetail" path="/roomDetail/:roomId/:added"
						active="{{roomDetailRouteActive}}" params="{{roomDetailParams}}">
					</triplat-route>
					<triplat-route id="floorplanRoute" name="floorplan" path="/building/:buildingId/floor/:floorId"
						active="{{floorplanRouteActive}}" params="{{floorplanParams}}">
					</triplat-route>
					<triplat-route id="ssoRoute" name="sso" path="/sso"
						active="{{ssoRouteActive}}">
					</triplat-route>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			roomSearchRouteActive: {
				type: Boolean,
				notify: true
			},

			roomDetailRouteActive: {
				type: Boolean,
				notify: true
			},

			roomDetailParams: {
				type: Object,
				notify: true
			},

			floorplanRouteActive: {
				type: Boolean,
				notify: true
			},

			floorplanParams: {
				type: Object,
				notify: true
			},

			ssoRouteActive: {
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
};

window.customElements.define(TriroutesApp.is, TriroutesApp);