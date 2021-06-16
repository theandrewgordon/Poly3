/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../styles/tristyles-carbon-theme.js";

class TricompSelectItem extends PolymerElement {
	static get is() { return "tricomp-select-item"; }

	static get template() {
		return html `
			<style include="carbon-style">
				:host {
					cursor: pointer;
				}

				.dropdown-item {
					outline: 2px solid transparent;
					outline-offset: -2px;
					display: block;
					padding: 10px 12px;
					border: 1px solid transparent;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				.dropdown-item:focus {
					outline: 2px solid var(--carbon-focus);
					outline-offset: -2px;
					background-color: var(--carbon-ui-03) !important;
				}

				.dropdown-item:hover {
					background-color: var(--carbon-hover-field);
				}

			</style>
			<div class="dropdown-item body-short-01" tabindex="0" on-tap="_onSelectItem" role="option" aria-label="[[name]]">[[name]]</div>
		`
	}

	static get properties() {
		return {
			id: String,
			name: String
		}
	}

	_onSelectItem(e) {
		e.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(
				"select-item-selected", 
				{
					detail: { id: this.id, name: this.name },
					bubbles: true, composed: true
				}
			)
		);
	}
}

window.customElements.define(TricompSelectItem.is, TricompSelectItem);