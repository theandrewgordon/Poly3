/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-button/paper-button.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					display: block;
				}

				.container {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --tricomp-dropdown-item-container;
					align-items: flex-start !important;
					margin: 0 !important;
					padding: 10px !important;
				}

				:host(:not([small-layout])) .container {
					background-color: white !important;
					color: var(--tri-primary-color) !important;
				}

				:host(:not([small-layout]).iron-selected) .container {
					background-color: var(--tri-primary-color-10) !important;
				}

				:host([small-layout].iron-selected)  .container {
					background-color: var(--tri-primary-dark-color) !important;
				}

				:host([small-layout]) .container {
					background-color: #325c80 !important;
					border-bottom: 1px solid var(--tri-primary-dark-color);
					color: white !important;
				}

				:host([small-layout].iron-selected)  .container {
					background-color: var(--tri-primary-dark-color) !important;
				}
			
		</style>

		<paper-button class="container" role="menuitem">[[label]]</paper-button>
	`,

    is: "tricomp-dropdown-item",

    properties: {
		name: String,
		label: String,

		smallLayout: {
			type: Boolean,
			reflectToAttribute: true,
			notify: true
		}
	},
	
});