/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-pages/iron-pages.js";
import { TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-routing.js";
import "./routes/triroutes-app.js";
import "./services/triservice-loading.js";
import "./services/triservice-message.js";
import "./services/triservice-user.js";
import { getTriserviceOutlook } from "./services/triservice-outlook.js";
import { getTriserviceLogin } from "./services/triservice-login.js";
import "./app/trimain-room-search.js";
import "./app/trimain-room-detail.js";
import "./app/trimain-floorplan.js";
import "./styles/tristyles-app.js";
import { getDataFromLocal, deleteDataFromLocal, OUTLOOK_TOKEN_KEY } from "./utils/triutils-localstorage.js";
import { getModuleUrl  } from "../tricore-util/tricore-util.js";

class TrioutlookRoomReservation extends mixinBehaviors([TriPlatViewBehavior], PolymerElement) {
	static get is() { return "trioutlook-room-reservation"; }

	static get template() {
		return html`
			<style include="room-reservation-app-styles">
				:host {
					@apply --layout-fit;
					@apply --layout-vertical;
				}

				.loading-indicator {
					--triplat-loading-indicator-clear-background: transparent;
					z-index: 200;
					--triplat-loading-indicator-container: {
						position: fixed;
					};
				}
			</style>

			<triroutes-app
				room-search-route-active="{{_roomSearchRouteActive}}"
				room-detail-route-active="{{_roomDetailRouteActive}}"
				floorplan-route-active="{{_floorplanRouteActive}}"
				on-sso-route-active-changed="_closeSSODialog">
			</triroutes-app>
			
			<triservice-loading loading="{{_loading}}"></triservice-loading>
			<triservice-message id="messageService"></triservice-message>
			<triservice-user></triservice-user>
			<triservice-outlook></triservice-outlook>
			<triservice-login></triservice-login>

			<triplat-route-selector>
				<iron-pages>
					<div route="roomSearch" default-route>
						<dom-if id="roomSearchRouteIf">
							<template>
								<trimain-room-search></trimain-room-search>
							</template>
						</dom-if>
					</div>
					<div route="roomDetail">
						<dom-if id="roomDetailRouteIf">
							<template>
								<trimain-room-detail></trimain-room-detail>
							</template>
						</dom-if>
					</div>
					<div route="floorplan">
						<dom-if id="floorplanRouteIf">
							<template>
								<trimain-floorplan></trimain-floorplan>
							</template>
						</dom-if>
					</div>
					<div route="sso"></div>
				</iron-pages>
			</triplat-route-selector>

			<triplat-loading-indicator class="loading-indicator" show="[[_computeShowLoadingIndicator(_loading, _loadedWebContextId)]]"></triplat-loading-indicator>
		`;
	}

	static get properties() {
		return {
			_loading: {
				type: Boolean
			},

			_loadedWebContextId: {
				type: Boolean,
				value: false
			},

			_roomSearchRouteActive: {
				type: Boolean
			},

			_roomDetailRouteActive: {
				type: Boolean
			},

			_floorplanRouteActive: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_loadRoomSearch(_roomSearchRouteActive, _loadedWebContextId)",
			"_loadRoomDetail(_roomDetailRouteActive, _loadedWebContextId)",
			"_loadFloorplan(_floorplanRouteActive, _loadedWebContextId)"
		];
	}

	constructor() {
		super();
		this._onDSErrorListener = this._handeDSErrors.bind(this);
	}

	async connectedCallback() {
		super.connectedCallback();
		this.addEventListener("ds-add-error", this._onDSErrorListener);
		this.addEventListener("ds-create-error", this._onDSErrorListener);
		this.addEventListener("ds-delete-error", this._onDSErrorListener);
		this.addEventListener("ds-get-error", this._onDSErrorListener);
		this.addEventListener("ds-perform-action-error", this._onDSErrorListener);
		this.addEventListener("ds-remove-error", this._onDSErrorListener);
		this.addEventListener("ds-update-error", this._onDSErrorListener);
		try {
			await this.getWebContextId();
		} finally {
			this._loadedWebContextId = true;
		}
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("ds-add-error", this._onDSErrorListener);
		this.removeEventListener("ds-create-error", this._onDSErrorListener);
		this.removeEventListener("ds-delete-error", this._onDSErrorListener);
		this.removeEventListener("ds-get-error", this._onDSErrorListener);
		this.removeEventListener("ds-perform-action-error", this._onDSErrorListener);
		this.removeEventListener("ds-remove-error", this._onDSErrorListener);
		this.removeEventListener("ds-update-error", this._onDSErrorListener);
	}

	_handeDSErrors(error) {
		if (error.detail && error.detail.errorType == "SecurityException") {
			return;
		}
		if (error.detail && error.detail.status == 401) {
			this.$.messageService.openUnauthorizedAccessToastMessage();
			setTimeout(() => location.reload(), 5000);
			return;
		}
		console.error(error.detail);
		this.$.messageService.openDefaultErrorPopup();
	}

	_loadRoomSearch(roomSearchRouteActive, loadedWebContextId) {
		if (roomSearchRouteActive && loadedWebContextId) {
			afterNextRender(this, () => this.shadowRoot.querySelector("#roomSearchRouteIf").if = true);
		}
	}

	_loadRoomDetail(roomDetailRouteActive, loadedWebContextId) {
		if (roomDetailRouteActive && loadedWebContextId) {
			afterNextRender(this, () => this.shadowRoot.querySelector("#roomDetailRouteIf").if = true);
		}
	}

	_loadFloorplan(floorplanRouteActive, loadedWebContextId) {
		if (floorplanRouteActive && loadedWebContextId) {
			afterNextRender(this, () => this.shadowRoot.querySelector("#floorplanRouteIf").if = true);
		}
	}

	_computeShowLoadingIndicator(loading, loadedWebContextId) {
		return loading || !loadedWebContextId;
	}

	_closeSSODialog(e) {
		if (e.detail.value) {
			afterNextRender(this, async () => {
				try {
					const exchangeIdentityToken = getDataFromLocal(OUTLOOK_TOKEN_KEY);
					deleteDataFromLocal(OUTLOOK_TOKEN_KEY);
					await getTriserviceLogin().saveEIT(exchangeIdentityToken);
				} catch (error) {
					console.error(error);
				} finally {
					getTriserviceOutlook().sendReloadMessageToParent();
				}
			});
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/trioutlook-room-reservation.js");
	}
}

window.customElements.define(TrioutlookRoomReservation.is, TrioutlookRoomReservation);