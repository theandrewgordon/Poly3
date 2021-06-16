/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import { TrimixinDropdownTargetElement } from "../dropdown/trimixin-dropdown-target-element.js";
import "./tricomp-select-field-dropdown.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompSelectField extends TrimixinDropdownTargetElement(PolymerElement) {
	static get is() { return "tricomp-select-field"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-vertical;
					min-width: 200px;
					width: 200px;
				}

				.dropdown-icon {
					--iron-icon-width: 12px;
					--iron-icon-height: 12px;
					-webkit-transition: -webkit-transform 110ms cubic-bezier(0.2, 0, 0.38, 0.9);
					transition: -webkit-transform 110ms cubic-bezier(0.2, 0, 0.38, 0.9);
					transition: transform 110ms cubic-bezier(0.2, 0, 0.38, 0.9);
					transition: transform 110ms cubic-bezier(0.2, 0, 0.38, 0.9), -webkit-transform 110ms cubic-bezier(0.2, 0, 0.38, 0.9);
					-webkit-transform-origin: 50% 45%;
					transform-origin: 50% 45%;
				}

				:host([readonly]) .dropdown-icon {
					--iron-icon-fill-color: var(--carbon-disabled-02);
				}

				:host(:not([opened])) .dropdown-icon {
					transform: rotate(90deg);
				}

				:host([opened]) .dropdown-icon {
					transform: rotate(-90deg);
				}

				.select-container {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 10px 12px;
					outline: 2px solid transparent;
					outline-offset: -2px;
					list-style: none;
					border: 1px solid var(--carbon-ui-03);
					color: var(--carbon-text-01);
					cursor: pointer;
				}

				.select-container:focus {
					outline: 2px solid var(--carbon-focus);
					outline-offset: -2px;
				}

				.select-container:hover {
					background-color: var(--carbon-hover-field);
				}

				label, .selected-value {
					@apply --layout-flex;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				:host([readonly]) label, :host([readonly]) .selected-value {
					color: var(--carbon-disabled-02);
				}

				:host([readonly]) .select-container {
					cursor: auto;
					background-color: var(--carbon-ui-background);
				}

				:host([readonly]) .select-container:focus {
					outline: none;
				}

			</style>

			<iron-a11y-keys target="[[_target]]" keys="enter space down" on-keys-pressed="_handleFieldTap"></iron-a11y-keys>

			<div id="selectContainer" class="select-container" on-tap="_handleFieldTap" role="listbox" aria-label="[[label]]" aria-expanded="[[opened]]" tabindex="0">
				<dom-if if="[[_computeShowLabel(label, selected)]]">
					<template>
						<label class="body-short-01">[[label]]</label>
					</template>
				</dom-if>
				<dom-if if="[[selected]]">
					<template>
						<span class="selected-value body-short-01">[[_computedSelected(selected)]]</span>
					</template>
				</dom-if>
				<iron-icon class="dropdown-icon" icon="ibm-glyphs:expand-open"></iron-icon>
			</div>
			<template id="dropdownTemplate">
				<tricomp-select-field-dropdown id="tricomp-select-field-dropdown" selected="{{selected}}"></tricomp-select-field-dropdown>
			</template>
		`
	}

	static get properties() {
		return {
			label: String,

			items: Array,

			selected: {
				type: String,
				notify: true
			},

			readonly: {
				type: Boolean,
				reflectToAttribute: true
			},

			_focused: {
				type: Boolean
			},

			_target: {
				type: Object
			}
		}
	}

	static get observers() {
		return [
			"_handleToggleDropdown(_focused)",
		]
	}

	connectedCallback() {
		super.connectedCallback();
		this._target = this.shadowRoot.querySelector("#selectContainer");
		this.$.selectContainer.addEventListener("blur", this._onBlur.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.$.selectContainer.removeEventListener("blur", this._onBlur.bind(this));
	}

	_handleToggleDropdown(focused, readonly) {
		if (focused && !this.opened && !readonly) {
			this._getDropdown().items = this.items;
			this._getDropdown().selected = this.selected;
			this._getDropdown().open(this.fitInto, this.scrollContainer, this, true);
		} else {
			this._getDropdown().close();
		}
	}

	_computedSelected(selected) {
		return selected ? this.items.filter(item => item.id === selected)[0].name : '';
	}

	_onFocus() {
		this._focused = true;
	}
	
	_onBlur() {
		setTimeout(() => {
			this.set('selected', this._getDropdown().selected);
			this._focused = false;
		}, 200);
	}

	_computeShowLabel(label, selected) {
		return label && !selected;
	}

	_handleFieldTap(e) {
		e.stopPropagation();
		if (!this.readonly) {
			this._focused = !this._focused;
		}
	}
}

window.customElements.define(TricompSelectField.is, TricompSelectField);