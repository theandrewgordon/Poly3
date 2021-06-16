/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../tricore-url/tricore-url.js";

import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceLogin() {
	return getService(TriserviceLogin.is);
};

export const AUTHENTICATION_REQUIRED = "user_authentication_required";
export const ALREADY_LOGGED = "already_logged";
export const UNAUTHORIZED = "unauthorized";
export const INTERNAL_SERVER_ERROR = "error";
export const SUCCESS = "success";

class TriserviceLogin extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-login"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<tricore-url raw-url="/p/websignon/exchangeit/signon" bind-url="{{_signonUrl}}"></tricore-url>
					<tricore-url raw-url="/p/websignon/exchangeit/save" bind-url="{{_saveEITUrl}}"></tricore-url>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			_loggingIn: {
				type: Boolean,
				value: false,
				notify: true
			},

			_signonUrl: {
				type: String
			},

			_saveEITUrl: {
				type: String
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loggingIn)",
		]
	}

	/**
	 * Signin using an Exchange Identity Token (from the Outlook Add-In).
	 * The exchangeToken parameter is always required.
	 * When the application is loaded this method will be called with empty username and password.
	 * If there is a Tririga user associated to the Exchange Indenty token, then the user will be authenticated.
	 * Otherwise this method will return AUTHENTICATION_REQUIRED.
	 * 
	 * In that case the application will display the login form and call this method again passing the exchangeToken, username and password.
	 */
	signin(exchangeToken, username, password, force) {
		this._loggingIn = true;
		return new Promise((resolve, reject) => {
			var ajax = document.createElement("iron-ajax");
			ajax.method="POST";
			ajax.contentType="application/json";
			ajax.body = JSON.stringify({token: exchangeToken, userName: username, password: password, normal: !force});
			ajax.handleAs = 'json';
			ajax.url = this._signonUrl;
			ajax.addEventListener("response", this._handleSigninResponse.bind(this, resolve, reject));
			ajax.addEventListener("error", this._handleError.bind(this, resolve, reject));
			ajax.generateRequest();
		});
	}

	/**
	 * Associate the current user to an Exchange Indenty token.
	 */
	saveEIT(exchangeToken) {
		this._loggingIn = true;
		return new Promise((resolve, reject) => {
			var ajax = document.createElement("iron-ajax");
			ajax.method="POST";
			ajax.contentType="application/json";
			ajax.body = JSON.stringify({token: exchangeToken});
			ajax.handleAs = 'json';
			ajax.url = this._saveEITUrl;
			ajax.addEventListener("response", this._handleSigninResponse.bind(this, resolve, reject));
			ajax.addEventListener("error", this._handleError.bind(this, resolve, reject));
			ajax.generateRequest();
		});
	}

	_handleSigninResponse(resolve, reject, e) {
		let loginResponse = e.detail.response;
		if (loginResponse.result == SUCCESS) {
			resolve();
		} else {
			reject(loginResponse.result);
		}
		this._loggingIn = false;
	}

	_handleError(resolve, reject, e) {
		if (e.detail.request.status === 403){
			reject(ALREADY_LOGGED);
		} else if (e.detail.request.status === 401){
			reject(UNAUTHORIZED);
		} else {
			reject(INTERNAL_SERVER_ERROR);
		}
		this._loggingIn = false;
	}
};

window.customElements.define(TriserviceLogin.is, TriserviceLogin);