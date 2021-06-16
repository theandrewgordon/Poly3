/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { getTriserviceRoomFilters } from "../../services/triservice-room-filters.js";

import "./tricomp-amenity-checkbox.js";

class TricompRoomAmenitiesFilters extends PolymerElement {
	static get is() { return "tricomp-room-amenities-filters"; }

	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				tricomp-amenity-checkbox {
					padding: 5px 0;
				}
				tricomp-amenity-checkbox:first-child {
					padding-top: 0;
				}
				tricomp-amenity-checkbox:last-child {
					padding-bottom: 0;
				}
			</style>

			<div>
				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="catering"
					icon="carbon-16:restaurant" label="[[_cateringLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>

				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="accessibility"
					icon="carbon-16:accessibility" label="[[_accessibilityLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>

				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="projector"
					icon="carbon-16:video-on" label="[[_projectorLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>

				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="phone"
					icon="carbon-16:mobile" label="[[_phoneLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>

				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="whiteboard"
					icon="carbon-16:presentation" label="[[_whiteboardLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>

				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="tvscreen"
					icon="carbon-16:desktop" label="[[_tvscreenLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>

				<tricomp-amenity-checkbox temp-amenities-filter="[[tempAmenitiesFilter]]" amenity="networkConnection"
					icon="ibm-glyphs:wired" label="[[_networkConnectionLabel]]"
					on-add-amenity="_handleAddAmenity" on-remove-amenity="_handleRemoveAmenity"></tricomp-amenity-checkbox>
			</div>
		`;
	}

	static get properties() {
		return {
			tempAmenitiesFilter: {
				type: Array
			},

			_cateringLabel: {
				type: String
			},

			_accessibilityLabel: {
				type: String
			},

			_projectorLabel: {
				type: String
			},

			_phoneLabel: {
				type: String
			},

			_whiteboardLabel: {
				type: String
			},

			_tvscreenLabel: {
				type: String
			},

			_networkConnectionLabel: {
				type: String
			}
		};
	}

	ready() {
		super.ready();
		var __dictionary__cateringLabel = "Catering available";
		var __dictionary__accessibilityLabel = "Accessibility";
		var __dictionary__projectorLabel = "Projector";
		var __dictionary__phoneLabel = "Phone";
		var __dictionary__whiteboardLabel = "Whiteboard";
		var __dictionary__tvscreenLabel = "TV screen";
		var __dictionary__networkConnectionLabel = "Network Connection";

		this._cateringLabel = __dictionary__cateringLabel;
		this._accessibilityLabel = __dictionary__accessibilityLabel;
		this._projectorLabel = __dictionary__projectorLabel;
		this._phoneLabel = __dictionary__phoneLabel;
		this._whiteboardLabel = __dictionary__whiteboardLabel;
		this._tvscreenLabel = __dictionary__tvscreenLabel;
		this._networkConnectionLabel = __dictionary__networkConnectionLabel;
	}

	_handleAddAmenity(e) {
		const amenity = e.detail;
		getTriserviceRoomFilters().addToTempAmenitiesFilter(amenity);
	}

	_handleRemoveAmenity(e) {
		const amenity = e.detail;
		getTriserviceRoomFilters().removeFromTempAmenitiesFilter(amenity);
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-amenities-filters/tricomp-room-amenities-filters.js");
	}
}

window.customElements.define(TricompRoomAmenitiesFilters.is, TricompRoomAmenitiesFilters);