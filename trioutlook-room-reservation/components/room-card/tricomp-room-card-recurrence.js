/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../styles/tristyles-carbon-theme.js";

class TricompRoomCardRecurrence extends PolymerElement {
	static get is() { return "tricomp-room-card-recurrence"; }

	static get template() {
		return html`
			<style include="carbon-style">
				.recurrence {
					background-color: var(--carbon-overlay-01);
					color: var(--carbon-text-04);
					padding: 4px;
					text-align: center;
					overflow: hidden;
				}
			</style>

			<div class="helper-text-01 recurrence">[[room._availCount]] of [[room._maxOccurrenceCount]] matches</div>
		`;
	}

	static get properties() {
		return {
			room: {
				type: Object
			}
		};
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/room-card/tricomp-room-card-recurrence.js");
	}
}

window.customElements.define(TricompRoomCardRecurrence.is, TricompRoomCardRecurrence);