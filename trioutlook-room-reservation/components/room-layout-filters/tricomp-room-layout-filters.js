/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { getTriserviceRoomFilters } from "../../services/triservice-room-filters.js";
import "./tricomp-layout-checkbox.js";

class TricompRoomLayoutFilters extends PolymerElement {
	static get is() { return "tricomp-room-layout-filters"; }

	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				tricomp-layout-checkbox {
					padding: 5px 0;
				}
				tricomp-layout-checkbox:first-child {
					padding-top: 0;
				}
				tricomp-layout-checkbox:last-child {
					padding-bottom: 0;
				}
			</style>

			<div>
				<dom-repeat items="[[layoutTypes]]" as="layout">
					<template>
						<tricomp-layout-checkbox model="[[layout]]" temp-layout-filter="[[tempLayoutFilter]]"
							on-add-layout="_handleAddLayout" on-remove-layout="_handleRemoveLayout"></tricomp-layout-checkbox>
					</template>
				</dom-repeat>
			</div>
		`;
	}

	static get properties() {
		return {
			layoutTypes: {
				type: Array
			},

			tempLayoutFilter: {
				type: Array
			}
		};
	}

	_handleAddLayout(e) {
		const layout = e.detail;
		getTriserviceRoomFilters().addToTempLayoutFilter(layout);
	}

	_handleRemoveLayout(e) {
		const layout = e.detail;
		getTriserviceRoomFilters().removeFromTempLayoutFilter(layout);
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-layout-filters/tricomp-room-layout-filters.js");
	}
}

window.customElements.define(TricompRoomLayoutFilters.is, TricompRoomLayoutFilters);