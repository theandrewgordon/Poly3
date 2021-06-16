/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "./tricomp-hierarchy-checkbox-item.js";

class TricompLocationHierarchy extends PolymerElement {
	static get is() { return "tricomp-location-hierarchy"; }

	static get template() {
		return html`
			<tricomp-hierarchy-checkbox-item id="checkboxItem" model="[[locationHierarchy]]" 
				on-user-changed="_handleUserChanged">
			</tricomp-hierarchy-checkbox-item>
		`;
	}

	static get properties() {
		return {
			locationHierarchy: {
				type: Object
			},

			selected: {
				type: Array,
				observer: "_handleSelectedChanged"
			},

			_isReady: {
				type: Boolean
			}
		};
	}

	ready() {
		super.ready();
		this._isReady = true;
		this._handleSelectedChanged(this.selected);
	}

	_handleSelectedChanged(newSelected) {
		if (this._isReady && this.$.checkboxItem) this.$.checkboxItem.select(newSelected);
	}

	_handleUserChanged(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent("user-changed", { detail: e.detail, bubbles: false, composed: false }));
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/location-hierarchy/tricomp-location-hierarchy.js");
	}
}

window.customElements.define(TricompLocationHierarchy.is, TricompLocationHierarchy);