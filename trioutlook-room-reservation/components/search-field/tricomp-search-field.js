/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-input/iron-input.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../styles/tristyles-carbon-theme.js";

class TricompSearchField extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-search-field"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					background-color: var(--carbon-field-01);
					@apply --layout-horizontal;
					@apply --layout-center;
					border: 1px solid transparent;
					border-bottom-color: var(--carbon-ui-04);
					position: relative;
					outline: none;
				}

				:host([focused]) {
					border-color: var(--carbon-focus);
				}

				.search-icon {
					color: var(--carbon-icon-01);
					height: 16px;
					padding: 0px 8px;
					width: 16px;
				}

				iron-input {
					@apply --layout-flex;
					@apply --layout-horizontal;
				}

				:host([dir="ltr"]) input {
					padding-right: 32px;
				}

				:host([dir="rtl"]) input {
					padding-left: 32px;
				}

				input {
					@apply --layout-flex;
					font-family: var(--carbon-font-family);
					font-size: 14px;
					color: var(--carbon-text-01);
					border: none;
					height: 30px;
					outline: none;
					padding: 0px;
				}

				input::-webkit-contacts-auto-fill-button {
					display: none !important;
					pointer-events: none;
					position: absolute;
					right: 0;
					visibility: hidden;
				}

				input::-ms-clear {
					display: none;
				}

				.clear-button {
					color: var(--carbon-icon-01);
					height: 16px;
					padding: 7px;
					width: 16px;
					border: 1px solid transparent;
					position: absolute;
					top: -1px;
					outline: none;
				}

				:host([dir="ltr"]) .clear-button {
					right: -1px;
				}

				:host([dir="rtl"]) .clear-button {
					left: -1px;
				}

				.clear-button:hover {
					background-color: var(--carbon-hover-field);
					border-color: var(--carbon-hover-field);
					border-bottom-color: var(--carbon-ui-04);
				}

				:host([focused]) .clear-button:hover {
					border-color: var(--carbon-focus);
				}

				:host([dir="ltr"][focused]) .clear-button:hover {
					border-left: 0px;
				}

				:host([dir="rtl"][focused]) .clear-button:hover {
					border-right: 0px;
				}

				.clear-button:focus {
					border-color: var(--carbon-focus);
				}
			</style>

			<iron-icon class="search-icon" icon="ibm:search"></iron-icon>
			<iron-input bind-value="{{value}}">
				<input id="searchInput" readonly\$="[[readonly]]">
			</iron-input>
			<iron-icon class="clear-button" icon="ibm-glyphs:clear-input" hidden\$="[[_hideClearButton(value)]]" tabindex="0"
				on-tap="_handleClearTap" on-keypress="_handleClearKeyPress">
			</iron-icon>
		`;
	}

	static get properties() {
		return {
			focused: {
				type: Boolean,
				notify: true,
				reflectToAttribute: true
			},

			value: {
				type: String,
				value: "",
				notify: true
			},

			readonly: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();
		this.$.searchInput.addEventListener("focus", this._onFocus.bind(this), true);
		this.$.searchInput.addEventListener("blur", this._onBlur.bind(this), true);
	}

	clear() {
		this.value = "";
	}

	focus() {
		this.$.searchInput.focus();
	}

	_hideClearButton(value) {
		return !value || value === "";
	}

	_handleClearTap(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent("clear-field", { bubbles: false, composed: false }));
	}

	_onFocus() {
		this.focused = true;
	}
	
	_onBlur() {
		this.focused = false;
	}

	_handleClearKeyPress(e) {
		var code = e.keyCode;
		if (code == 13 || code == 32 ) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("clear-field", { bubbles: false, composed: false }));
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/search-field/tricomp-search-field.js");
	}
}

window.customElements.define(TricompSearchField.is, TricompSearchField);