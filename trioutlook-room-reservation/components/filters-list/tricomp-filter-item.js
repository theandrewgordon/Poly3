/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { getTriserviceRoomFilters } from "../../services/triservice-room-filters.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompFilterItem extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-filter-item"; }

	static get template() {
		return html`
			<style include="carbon-style">
				:host {
					@apply --layout-center;
					@apply --layout-horizontal;
					background-color: var(--carbon-highlight);
					border-radius: 24px;
					color: var(--carbon-support-04);
				}
				:host([dir="ltr"]) {
					padding: 4px 5px 4px 8px;
				}
				:host([dir="rtl"]) {
					padding: 4px 8px 4px 5px;
				}

				.filter-name {
					color: var(--carbon-support-04);
				}
				:host([dir="ltr"]) .filter-name {
					margin-right: 5px;
				}
				:host([dir="rtl"]) .filter-name {
					margin-left: 5px;
				}

				:host paper-icon-button {
					@apply --layout-horizontal;
					border-radius: 50%;
					flex-shrink: 0;
					height: 20px;
					width: 20px;
					padding: 3px;
				}
				:host paper-icon-button:hover {
					background-color: var(--carbon-highlight-hover);
				}
			</style>

			<div class="filter-name label-01">[[filter.name]]</div>
			<paper-icon-button icon="ibm-glyphs:clear-input" on-tap="_removeFilter"></paper-icon-button>
		`;
	}

	static get properties() {
		return {
			filter: {
				type: Object
			}
		};
	}

	_removeFilter(e) {
		e.stopPropagation();

		const filterType = this.filter.type;
		if (filterType === "City" || filterType === "Property" || filterType === "Building") {
			getTriserviceRoomFilters().removeLocationFilter(this.filter);
		} else if (filterType === "roomLayout") {
			getTriserviceRoomFilters().removeLayoutFilter(this.filter);
		} else if (filterType === "amenity") {
			getTriserviceRoomFilters().removeAmenityFilter(this.filter);
		}
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/filters-list/tricomp-filter-item.js");
	}
}

window.customElements.define(TricompFilterItem.is, TricompFilterItem);