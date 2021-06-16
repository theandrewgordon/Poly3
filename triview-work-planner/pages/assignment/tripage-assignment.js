/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../services/triservice-work-planner.js";
import "./tricomp-assignment-small-layout.js";
import "./tricomp-assignment-large-layout.js";

class TripageAssignment extends PolymerElement {
	static get is() { return "tripage-assignment"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				tricomp-assignment-large-layout, tricomp-assignment-small-layout {
					@apply --layout-flex;
				}
			</style>

			<triservice-work-planner small-layout="{{_smallLayout}}"></triservice-work-planner>

			<dom-if id="largeLayoutIf" restamp>
				<template>
					<tricomp-assignment-large-layout></tricomp-assignment-large-layout>
				</template>
			</dom-if>

			<dom-if id="smallLayoutIf" restamp>
				<template>
					<tricomp-assignment-small-layout></tricomp-assignment-small-layout>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			_smallLayout: {
				type: Boolean,
				observer: "_handleSmallLayoutChange"
			}
		};
	}

	_handleSmallLayoutChange(smallLayout) {
		if (smallLayout === undefined) return;
		this.shadowRoot.querySelector("#smallLayoutIf").if = false;
		this.shadowRoot.querySelector("#largeLayoutIf").if = false;
		afterNextRender(this, () => {
			if (smallLayout) {
				this.shadowRoot.querySelector("#smallLayoutIf").if = true;
			} else {
				this.shadowRoot.querySelector("#largeLayoutIf").if = true;
			}
		});
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/assignment/tripage-assignment.js");
	}
}

window.customElements.define(TripageAssignment.is, TripageAssignment);