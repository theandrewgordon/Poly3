/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triblock-popup/triblock-popup.js";
import "../../triblock-toast/triblock-toast.js";
import "../styles/tristyles-popup.js";
import "../styles/tristyles-carbon-theme.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceMessage() {
	return getService(TriserviceMessage.is);
};

class TriserviceMessage extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-message"; }

	static get template() {
		return html`
			<style include="room-reservation-popup-styles carbon-style">
			</style>

			<dom-if if="[[_isRootInstance]]" on-dom-change="_handleDomIfChange">
				<template>
					<triblock-toast id="toastAlert" on-opened-changed="_handleToastOpenedChanged" allow-click-through></triblock-toast>
					<triblock-popup id="defaultErrorPopup" class="popup-alert" with-backdrop small-screen-max-width="0px" hidden>
						<div class="productive-heading-03 header-warning">Error</div>
						<div class="content">
							<p>An error occurred. Please contact your server administrator.</p>
							<p>You can <a on-tap="_handleRefreshPage">refresh the page</a> or return to the application.</p>
						</div>
						<div class="footer"><paper-button dialog-dismiss>Got it</paper-button></div>
					</triblock-popup>
				</template>
			</dom-if>
		`;
	}

	openDefaultErrorPopup() {
		if (this._isRootInstance) {
			setTimeout(() => this.shadowRoot.querySelector("#defaultErrorPopup").open(), 500);
		} else {
			this._rootInstance.openDefaultErrorPopup();
		}
	}

	openUnauthorizedAccessToastMessage() {
		if (this._isRootInstance) {
			var __dictionary__unauthorized = "Session timeout or unauthorized access.";
			var __dictionary__title = "Unauthorized";
			this.openToastMessage("error", __dictionary__title, __dictionary__unauthorized);
		} else {
			this._rootInstance.openUnauthorizedAccessToastMessage();
		}
	}

	openToastMessage(type, title, text) {
		if (this._isRootInstance) {
			if (title != "" || text != "") {
				const alertToast = this.shadowRoot.querySelector("#toastAlert");

				if (alertToast.opened) { alertToast.close(); }

				alertToast.setAttribute("role", "alert");
				alertToast.setAttribute("aria-label", title);
				alertToast.type = type;
				alertToast.title = title;
				alertToast.text = text;

				alertToast.open();
			}
		} else {
			this._rootInstance.openToastMessage(type, title, text);
		}
	}

	_handleToastOpenedChanged(event) {
		if (!event.detail.value) {
			const alertToast = this.shadowRoot.querySelector("#toastAlert");
			if (alertToast) alertToast.removeAttribute("role");
		}
	}

	_handleRefreshPage(e) {
		e.stopPropagation();
		location.reload();
	}

	_handleDomIfChange() {
		if (this._isRootInstance) {
			let defaultErrorPopup = this.shadowRoot.querySelector("#defaultErrorPopup");
			if (defaultErrorPopup) setTimeout(() => defaultErrorPopup.removeAttribute("hidden"), 500);
		}
	}
};

window.customElements.define(TriserviceMessage.is, TriserviceMessage);