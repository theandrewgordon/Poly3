/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { isEmptyArray } from "../../utils/triutils-utilities.js";
import "../checkbox/tricomp-checkbox.js";
import { CHECKED, UNCHECKED } from "../checkbox/tricomp-checkbox.js";

class TricompLayoutCheckbox extends PolymerElement {
	static get is() { return "tricomp-layout-checkbox"; }

	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>

			<tricomp-checkbox state="{{_state}}" on-user-checked="_handleUserChecked">
				[[model.name]]
			</tricomp-checkbox>
		`;
	}

	static get properties() {
		return {
			model: {
				type: Object
			},

			tempLayoutFilter: {
				type: Array
			},

			_state: {
				type: String
			}
		};
	}

	static get observers() {
		return [
			"_setState(tempLayoutFilter.*)",
		];
	}

	_setState(tempLayoutFilterChange) {
		const tempLayoutFilter = tempLayoutFilterChange.base;
		if (isEmptyArray(tempLayoutFilter)) {
			this._state = UNCHECKED;
		} else {
			const layoutIndex = tempLayoutFilter.findIndex(filter => filter._id === this.model._id);
			this._state = layoutIndex > -1 ? CHECKED : UNCHECKED;
		}
	}

	_handleUserChecked(e) {
		if (this._state === CHECKED) {
			this.dispatchEvent(new CustomEvent("add-layout", { detail: this.model, bubbles: false, composed: false }));
		} else if (this._state === UNCHECKED) {
			this.dispatchEvent(new CustomEvent("remove-layout", { detail: this.model, bubbles: false, composed: false }));
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-layout-filters/tricomp-layout-checkbox.js");
	}
}

window.customElements.define(TricompLayoutCheckbox.is, TricompLayoutCheckbox);