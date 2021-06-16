/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icons/iron-icons.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import "../../../@polymer/paper-input/paper-input.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "./tricomp-select-input-dropdown.js"

class SelectInputComponent extends TrimixinDropdownComponent(PolymerElement) {
	static get is() { return "tricomp-select-input"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				paper-input {
					--paper-input-container-invalid-color: var(--ibm-orange-60);
					--paper-input-container-input: {
						font-family: var(--tri-font-family);
						font-size: 14px;
						padding-bottom: 5px;
					};
				}

				paper-icon-button {
					width: 23px; 
					height: 23px;
					margin-top: -5px;
					padding: 0px 4px;
				}
			</style>

			<template is="dom-if" if="[[readonly]]">[[value]]</template>

			<template is="dom-if" if="[[!readonly]]">
				<paper-input id="input" value="{{value}}" placeholder="[[placeholder]]" no-label-float
					invalid="[[invalid]]" on-tap="_onInputTapped" on-keyup="_getFocusByTabAndArrow">
					<paper-icon-button slot="suffix" on-tap="_clearInput" icon="clear" alt="clear"
						title="clear" noink hidden\$="[[_hideClearIcon(value)]]">
					</paper-icon-button>
				</paper-input>
			</template>

			<template id="dropdownTemplate">
				<tricomp-select-input-dropdown id="tricomp-select-input-dropdown"></tricomp-select-input-dropdown>
			</template>
		`;
	}

	static get properties() {
		return {
			attrToDisplay: {
				type: String
			},

			data: {
				type: Array,
				observer: "_observeData"
			},

			dropdownHorizontalAlign: {
				type: String, 
				value: "left"
			},

			invalid: {
				type: Boolean,
				value: false
			},

			itemSelected: {
				type: Object,
				notify: true,
				value: () => {
					return null;
				}
			},

			placeholder: {
				type: String
			},

			value: {
				type: String,
				notify: true
			},

			readonly: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			}
		}
	}

	static get observers() {
		return [
			"_resetValue(opened, itemSelected)"
		];
	}

	_getFocusByTabAndArrow(event) {
		if(event.code == "Tab" || event.code == "ArrowDown" || event.code == "ArrowUp") {
			this._getDropdown().focus();
		}
	}

	dispatchItemSelectedEvent(item) {
		this.dispatchEvent(
			new CustomEvent(
				"item-selected",
				{
					detail: { item: item },
					bubbles: true, composed: true
				}
			)
		);
	}

	_observeData(data) {
		this._getDropdown().updateData(data);
	}

	_onInputTapped(e) {
		e.stopPropagation();
		this._getDropdown().toggle(this.fitInto, this.scrollContainer, this, this.dropdownHorizontalAlign, this.data, this.attrToDisplay, this.setTargetWidth);
	}

	_clearInput() {
		this.value = "";
		this.itemSelected = {};
		this.dispatchItemSelectedEvent({});
		setTimeout(() => {
			this._getDropdown().dropdownNotifyResize();
		}, 500);
	}

	_hideClearIcon(value) {
		return !value || value == "";
	}

	_resetValue(opened, itemSelected) {
		if (!opened && itemSelected && itemSelected[this.attrToDisplay] && this.value != itemSelected[this.attrToDisplay]) {
			this.value = itemSelected[this.attrToDisplay];
		} else if (!opened && itemSelected && !itemSelected[this.attrToDisplay]) {
			this.value = "";
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/select-input/tricomp-select-input.js");
	}
}

window.customElements.define(SelectInputComponent.is, SelectInputComponent);