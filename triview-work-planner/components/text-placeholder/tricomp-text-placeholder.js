/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

class TricompTextPlaceholder extends PolymerElement {
	static get is() { return "tricomp-text-placeholder"; }

	static get template() {
		return html`
			<template is="dom-if" if="[[_hasValue]]" restamp>
				<slot></slot>
			</template>

			<template is="dom-if" if="[[!_hasValue]]" restamp>
				[[placeholder]]
			</template>
		`;
	}

	static get properties() {
		return {
			/**
			 * Value to be verified.
			 * If no value is provided then a placeholder will be displayed.
			 */
			value: {
				type: String
			},

			placeholder: {
				type: String,
				value: "―"
			},

			_hasValue: {
				type: Boolean,
				value: false,
				computed: "_computeHasValue(value)"
			}
		};
	}

	_computeHasValue(givenValue) {
		return givenValue && givenValue !== "";
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/text-placeholder/tricomp-text-placeholder.js");
	}
}

window.customElements.define(TricompTextPlaceholder.is, TricompTextPlaceholder);