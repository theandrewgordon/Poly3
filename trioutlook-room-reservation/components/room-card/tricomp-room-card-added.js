/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-icons/iron-icons.js";

class TricompRoomCardAdded extends PolymerElement {
	static get is() { return "tricomp-room-card-added"; }

	static get template() {
		return html `
			<style>
				.added-icon {
					--iron-icon-fill-color: var(--carbon-text-04);
					--iron-icon-stroke-color: var(--carbon-text-04);
					background-color: var(--carbon-inverse-support-02);
					border-radius: 100%;
					height: 18px;
					width: 18px;
					position: absolute;
					top: 10px;
					left: 10px;
					padding: 5px;
				}
			</style>

			<iron-icon class="added-icon" icon="icons:check"></iron-icon>
		`
	}
}

window.customElements.define(TricompRoomCardAdded.is, TricompRoomCardAdded);