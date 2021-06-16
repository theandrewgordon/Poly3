/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/carbon-icons-16.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-icon/triplat-icon.js";

import { isEmptyArray } from "../../utils/triutils-utilities.js";
import "../checkbox/tricomp-checkbox.js";
import { CHECKED, UNCHECKED } from "../checkbox/tricomp-checkbox.js";

class TricompAmenityCheckbox extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-amenity-checkbox"; }

	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				triplat-icon {
					--triplat-icon-height: 20px;
					--triplat-icon-width: 20px;
				}
				:host([dir="ltr"]) triplat-icon {
					margin-right: 8px;
				}
				:host([dir="rtl"]) triplat-icon {
					margin-left: 8px;
				}
			</style>

			<tricomp-checkbox state="{{_state}}" on-user-checked="_handleUserChecked">
				<triplat-icon icon="[[icon]]"></triplat-icon>[[label]]
			</tricomp-checkbox>
		`;
	}

	static get properties() {
		return {
			tempAmenitiesFilter: {
				type: Array
			},

			amenity: {
				type: String
			},

			icon: {
				type: String
			},

			label: {
				type: String
			},

			_state: {
				type: String
			}
		};
	}

	static get observers() {
		return [
			"_setState(tempAmenitiesFilter.*)",
		];
	}

	_setState(tempAmenitiesFilterChange) {
		const tempAmenitiesFilter = tempAmenitiesFilterChange.base;
		if (isEmptyArray(tempAmenitiesFilter)) {
			this._state = UNCHECKED;
		} else {
			const amenityIndex = tempAmenitiesFilter.findIndex(filter => filter.amenity === this.amenity);
			this._state = amenityIndex > -1 ? CHECKED : UNCHECKED;
		}
	}

	_handleUserChecked(e) {
		const amenityObj = {
			type: "amenity",
			amenity: this.amenity,
			name: this.label
		};
		if (this._state === CHECKED) {
			this.dispatchEvent(new CustomEvent("add-amenity", { detail: amenityObj, bubbles: false, composed: false }));
		} else if (this._state === UNCHECKED) {
			this.dispatchEvent(new CustomEvent("remove-amenity", { detail: amenityObj, bubbles: false, composed: false }));
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-amenities-filters/tricomp-amenity-checkbox.js");
	}
}

window.customElements.define(TricompAmenityCheckbox.is, TricompAmenityCheckbox);