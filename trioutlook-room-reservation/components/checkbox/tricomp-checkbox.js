/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../styles/tristyles-carbon-theme.js";

export const CHECKED = "checked";
export const UNCHECKED = "unchecked";
export const INDETERMINATE = "indeterminate";

class TricompCheckbox extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-checkbox"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-center;
					@apply --layout-horizontal;
					cursor: pointer;
					font-size: 14px;
					user-select: none;
				}

				#checkbox {
					@apply --layout-center-center;
					@apply --layout-horizontal;
					background-color: transparent;
					border: 1px solid var(--carbon-ui-05);
					height: 14px;
					width: 14px;
					flex-shrink: 0;
				}

				#checkbox[state="checked"],
				#checkbox[state="indeterminate"] {
					background-color: var(--carbon-ui-05);
				}

				.checkbox-flag[state="unchecked"] {
					display: none;
				}

				.checkbox-flag[state="checked"] {
					border: solid var(--carbon-inverse-01);
					border-width: 0px 0px 2px 2px;
					display: inline-block;
					height: 3px;
					width: 7px;
					margin-top: -4px;
					transform: rotate(-45deg);
				}

				.checkbox-flag[state="indeterminate"] {
					background-color: var(--carbon-inverse-01);
					border-width: 0;
					display: inline-block;
					height: 2px;
					width: 8px;
					margin: 0;
					transform: none;
				}

				#checkbox:focus {
					border-color: var(--carbon-focus);
					outline: 1px solid var(--carbon-focus);
				}

				#checkboxLabel {
					@apply --layout-center;
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --tricomp-checkbox-label;
				}

				:host([dir="ltr"]) #checkboxLabel {
					padding-left: 8px;
				}
				:host([dir="rtl"]) #checkboxLabel {
					padding-right: 8px;
				}
			</style>

			<span id="checkbox" state\$="[[state]]" role="checkbox" tabindex="0" aria-labelledby="checkboxLabel">
				<span class="checkbox-flag" state\$="[[state]]"></span>
			</span>
			<span id="checkboxLabel" class="body-short-01"><slot></slot></span>
		`;
	}

	static get properties() {
		return {
			state: {
				type: String,
				value: UNCHECKED,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			"_setCheckboxState(state)"
		];
	}

	constructor() {
		super();
		this._boundCheckboxTapHandler = this._checkboxTapHandler.bind(this);
	}

	ready() {
		super.ready();
		this.$.checkbox.addEventListener("keydown", this._keydownHandler.bind(this));
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("tap", this._boundCheckboxTapHandler);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("tap", this._boundCheckboxTapHandler);
	}

	_checkboxTapHandler(e) {
		e.stopPropagation(); 
		if (this.state === CHECKED) {
			this.state = UNCHECKED;
		} else if (this.state === UNCHECKED || this.state === INDETERMINATE) {
			this.state = CHECKED;
		}
		this.dispatchEvent(new CustomEvent("user-checked", { detail: this.state, bubbles: false, composed: false }));
	}

	_setCheckboxState(state) {
		let ariaChecked;
		switch (state) {
			case CHECKED:
				ariaChecked = "true";
				break;
			case UNCHECKED:
				ariaChecked = "false";
				break;
			case INDETERMINATE:
				ariaChecked = "mixed";
				break;
		}
		this.$.checkbox.setAttribute("aria-checked", ariaChecked);
	}

	_keydownHandler(e) {
		let target = e.target;
		if (e.keyCode == 13 || e.keyCode == 32) { // ENTER, SPACE
			target.click();
			e.preventDefault(); 
			return;
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/checkbox/tricomp-checkbox.js");
	}
}

window.customElements.define(TricompCheckbox.is, TricompCheckbox);