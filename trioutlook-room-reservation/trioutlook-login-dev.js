/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

import "../@polymer/iron-flex-layout/iron-flex-layout.js";

import "../triplat-loading-indicator/triplat-loading-indicator.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";
import "../tricore-properties/tricore-properties.js";

import "./login/trioutlook-login-ui.js";
import { ALREADY_LOGGED, UNAUTHORIZED, getTriserviceLogin } from "./services/triservice-login.js";
import { getTriserviceOutlook } from "./services/triservice-outlook.js";
import "./services/triservice-loading.js";
import { saveDataToLocal, getDataFromLocal, deleteDataFromLocal, OUTLOOK_TOKEN_KEY } from "./utils/triutils-localstorage.js";

class TrioutlookLogin extends PolymerElement {

	static get is() { return "trioutlook-login"; }

	static get template() {
		return html`
			<style>
				.loading-indicator {
					--triplat-loading-indicator-clear-background: transparent;
					z-index: 200;
					--triplat-loading-indicator-container: {
						position: fixed;
					};
				}
			</style>
			<tricore-properties id="properties" sso="{{_sso}}"></tricore-properties>
			<triservice-loading loading="{{_loading}}"></triservice-loading>
			<triservice-login id="serviceLogin"></triservice-login>
			<triservice-outlook id="serviceOutlook"></triservice-outlook>

			<dom-if if="[[_displayLoginPage]]">
				<template>
					<trioutlook-login-ui id="loginUI" on-login="_handleLogin" on-force-login="_handleForceLogin" login-button-only="[[_loginButtonOnly]]">
					</trioutlook-login-ui>
				</template>
			</dom-if>
			<triplat-loading-indicator class="loading-indicator" show="[[_computeShowLoading(_displayLoginPage, _loading)]]"></triplat-loading-indicator>
		`;
	}

	static get properties() {
		return {
			_displayLoginPage: {
				type: Boolean,
				value: false
			},

			_loginButtonOnly: {
				type: Boolean,
				value: false
			},

			_loading: {
				type: Boolean
			},

			_sso: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();
		afterNextRender(this, this._initLogin);
	}

	async _initLogin() {
		if (getTriserviceOutlook().isAuthDialog()) {
			this._outlookIdentityToken = getDataFromLocal(OUTLOOK_TOKEN_KEY);
			deleteDataFromLocal(OUTLOOK_TOKEN_KEY);
			await this._loginUsingOutlookIdentityToken();
		} else {
			this._outlookIdentityToken = await getTriserviceOutlook().getIdentityToken();
			if (getTriserviceOutlook().isOutlookWebOnSafari()) {
				this._displayLoginPage = true;
				this._loginButtonOnly = true;
			} else {
				await this._loginUsingOutlookIdentityToken();
			}
		}
	}

	async _loginUsingOutlookIdentityToken() {
		try {
			await getTriserviceLogin().signin(this._outlookIdentityToken);
			this._reloadApp();
		} catch (error) {
			if (this._sso && getTriserviceOutlook().isAuthDialog()) {
				saveDataToLocal(this._outlookIdentityToken, OUTLOOK_TOKEN_KEY);
				getTriserviceOutlook().openSSODialog();
			} else {
				this._displayLoginPage = true;
				this._loginButtonOnly = this._sso;
			}
		}
	}

	_reloadApp() {
		if (getTriserviceOutlook().isAuthDialog()) {
			getTriserviceOutlook().sendReloadMessageToParent();
		} else {
			location.reload();
		}
	}

	_computeShowLoading(displayLoginPage, loading) {
		return !displayLoginPage || loading;
	}

	_handleLogin() {
		if (this._loginButtonOnly) {
			saveDataToLocal(this._outlookIdentityToken, OUTLOOK_TOKEN_KEY);
			if (this._sso && !getTriserviceOutlook().isAuthDialog() && !getTriserviceOutlook().isOutlookWebOnSafari()) {
				getTriserviceOutlook().openSSODialog();
			} else {
				getTriserviceOutlook().openAuthDialog();
			}
		} else {
			this._login(false);
		}
	}

	async _login(force) {
		let loginUI = this.shadowRoot.querySelector("#loginUI");
		try {
			await getTriserviceLogin().signin(this._outlookIdentityToken, loginUI.username, loginUI.password, force);
			this._reloadApp();
		} catch (error) {
			switch (error) {
				case ALREADY_LOGGED:
					this._handleAlreadyLogged();
					break;

				case UNAUTHORIZED:
					this._handleUnauthorized();
					break;
			
				default:
					this._handleError();
					break;
			}
		}
	}

	_handleForceLogin() {
		this._login(true);
	}

	_handleUnauthorized() {
		this.shadowRoot.querySelector("#loginUI").showUnauthorizedMessage();
	}

	_handleAlreadyLogged() {
		this.shadowRoot.querySelector("#loginUI").showAlreadyLoggedMessage();
	}

	_handleError() {
		this.shadowRoot.querySelector("#loginUI").showErrorMessage();
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/trioutlook-login.js");
	}
}

window.customElements.define(TrioutlookLogin.is, TrioutlookLogin);