/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "../../@polymer/paper-input/paper-input.js";
import "../../@polymer/paper-button/paper-button.js";
import "../../@polymer/paper-dialog/paper-dialog.js";
import { getModuleUrl } from "../../tricore-util/tricore-util.js";

import "../styles/tristyles-carbon-theme.js";

class TrioutlookLoginUI extends PolymerElement {

	constructor() {
		super();
		this._loadedLowRes = false;
		this._loadedHighRes = false;
	}

	static get is() { return "trioutlook-login-ui"; }

	static get template() {
		return html`
			<style include="iron-flex iron-flex-alignment carbon-style">
				:host {
					font-family: var(--carbon-font-family); 
					overflow-y: auto;
				}

				.bg-picture {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: -1;
					background-image: url('images/BuildingsLowResBlur.svg');
					background-size: cover;
				}

				.bg-picture:after {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					content: "";
					display: block;
					background-size: cover;
					background-image: url('images/Buildings.jpg');
					transition-property: opacity;
					transition-duration: 2s;
					transition-timing-function: ease;
					opacity: 0;
				}

				.bg-picture[enhanced]:after {
					opacity: 1;
				}

				.login-box {
					width: 80%;
					padding: 16px;
					margin-top: 50px;
					margin-left: auto;
					margin-right: auto;
					background-color: white;
				}
				
				.button-container {
					margin-top: 30px;
				}
				
				.error, .processing {
					font-size: 13px;
					text-align: center;
					padding-top: 16px;
					padding-bottom: 16px;
				}

				.processing {
					color: grey;
				}

				.error {
					color: #da1e28;
				}

				.login-title {
					margin-bottom: 0px;
					margin-top: 0px;
					clear: left;
					color: var(--carbon-text-02);
				}

				paper-button {
					font-size: small;
					text-transform: none;
					border:2px solid #90a4ae; 
					font-weight: bold;
					border-radius:0;
				}

				paper-input {
					width: 90%;
					--paper-input-container-input: {
						font-family: var(--carbon-font-family); 
						font-size:14px;
						background-color: #f3f3f3;
					};
					--paper-input-container-label: {
						font-family: var(--carbon-font-family); 
					};
				}

				.dialog-header { 
					background-color: var(--carbon-ui-05);
					margin: 0;
					padding: 15px;
					color: white;
				}

				.dialog-body {
					margin-top: .5em;
					padding: 10px 15px;
					text-align:justify;
				}

				paper-dialog {
					margin-bottom: -2em;
					width: 310px;
					background-color: white;
					max-height: 400px;
					top:22.5% !important;
					white-space: normal;
					@apply --layout-vertical;
				}

				.active-user {
					color: #FFFFC2;
				}

				.login-input {
					margin-top: 19px;
				}

				.login-btn {
					padding: 6px 32px 6px 8px !important;
					align-items: start !important;
				}

				.message-container {
					width: 100%;
					height: 34px;
					@apply(--layout-vertical);
					@apply(--layout-center-center);
				}
			</style>

			<div class="bg-picture" enhanced\$="[[_imagesLoaded]]"></div>

			<dom-if if="[[!_imagesLoaded]]" restamp>
				<template>
					<img hidden src="[[importPath]]images/BuildingsLowResBlur.svg" on-load="_handleLoadLowRes">
					<img hidden src="[[importPath]]images/Buildings.jpg" on-load="_handleLoadHighRes">
				</template>
			</dom-if>

			<div class="login-box">
				<div class="login-title productive-heading-03">[[loginTitle]]</div>
				
				<dom-if if="[[!loginButtonOnly]]">
					<template>
						<div class="login-input" hidden\$="[[loginButtonOnly]]">
							<paper-input label="User ID" value="{{username}}" auto-validate on-keypress="_keyPressHandler"
											tabIndex="1" autofocus required always-float-label>
							</paper-input>
							<paper-input label="Password" value="{{password}}" auto-validate type="password" on-keypress="_keyPressHandler"
											tabIndex="2" required always-float-label>
							</paper-input>
						</div>
					</template>
				</dom-if>
				<dom-if if="[[loginButtonOnly]]">
					<template>
						<div class="login-input body-long-01">Click Continue to authenticate.</div>
					</template>
				</dom-if>

				<div class="layout horizontal button-container">
					<paper-button id="loginButton" outlook-primary class="login-btn" tabIndex="3" on-tap="_handleLoginTap">Continue</paper-button>
				</div>
				<div class="message-container">
					<dom-if if="[[_logging]]">
						<template>
							<div class="processing">Logging in...</div>
						</template>
					</dom-if>
					<dom-if if="[[_unauthorized]]">
						<template>
							<div class="error">Invalid User ID or Password.</div>
						</template>
					</dom-if>
					<dom-if if="[[_error]]">
						<template>
							<div class="error">Login failed</div>
						</template>
					</dom-if>
				</div>
			</div>

			<paper-dialog id="message" modal>
				<div class="dialog-header productive-heading-02">The user <span class="active-user">{{username}}</span> is already active.</div>
				<div class="dialog-body body-long-01">You may end the active session or click cancel to log in as another user.</div>
				
				<div class="buttons">
					<paper-button id="forceLogin" outlook-primary on-tap="_handleForceLogin">End Session</paper-button>&nbsp;
					<paper-button outlook-secondary on-tap="_closeDialog">Cancel</paper-button>
				</div>
			</paper-dialog>
		`;
	}

	static get properties() {
		return {
			username: {
				type: String,
				notify: true,
				value:""
			},

			password:  {
				type: String,
				notify: true,
				value: ""
			},

			loginTitle: {
				type: String,
				value: "Log in"
			},

			loginButtonOnly: {
				type: Boolean,
				value: false
			},

			_imagesLoaded: {
				type: Boolean,
				value: false
			},

			_unauthorized: {
				type: Boolean,
				value: false
			},

			_logging: {
				type: Boolean,
				value: false
			},

			_error: {
				type: Boolean,
				value: false
			}
		};
	}

	showAlreadyLoggedMessage() {
		this.shadowRoot.querySelector("#message").open();
		this._logging = false;
		setTimeout(
			() => {
				this.shadowRoot.querySelector("#forceLogin").focus();
			},
			100
		);
	}

	showUnauthorizedMessage() {
		this._unauthorized = true;
		this._logging = false;
	}

	showErrorMessage() {
		this._error = true;
		this._logging = false;
	}

	_handleLoginTap(e) {
		e.stopPropagation();
		this._logging = true;
		this._unauthorized = false;
		this._error = false;
		this.dispatchEvent(new CustomEvent("login", { detail: e, bubbles: false, composed: false }));
		this.shadowRoot.querySelector("#loginButton").focus();
	}

	_handleForceLogin(e){
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent("force-login", { detail: e, bubbles: false, composed: false }));
	}

	_keyPressHandler(e) {
		var code = e.keyCode;
		if (code == 13) {
			this._handleLoginTap(e);
			this.shadowRoot.querySelector("#loginButton").focus();
		}
	}

	_closeDialog(){
		this.$.message.close();
	}

	_computeShowError(unauthorize, error) {
		return unauthorize ? false : error;
	}

	_populateFields(username, password) {
		this.set("username", username);
		this.set("password", password);
	}

	_handleLoadLowRes() {
		this._loadedLowRes = true;
		this._computeImagesLoaded();
	}

	_computeImagesLoaded() {
		if (this._loadedLowRes && this._loadedHighRes) setTimeout(() => this._imagesLoaded = true, 1000);
	}

	_handleLoadHighRes() {
		this._loadedHighRes = true;
		this._computeImagesLoaded();
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/login/trioutlook-login-ui.js");
	}
}

window.customElements.define(TrioutlookLoginUI.is, TrioutlookLoginUI);