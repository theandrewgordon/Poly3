/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.container {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 10px;
				}
				
				.container:hover {
					cursor: pointer;
				}

				:host(:not([small-layout])) .container {
					background-color: white;
					color: var(--tri-primary-color);
				}

				:host(:not([small-layout]).iron-selected)  .container {
					background-color: var(--tri-primary-color-10);
				}

				:host([small-layout].iron-selected)  .container {
					background-color: var(--tri-primary-dark-color);
				}

				:host([small-layout]) .container {
					background-color: #325c80;
					border-bottom: 1px solid var(--tri-primary-dark-color);
					color: white;
				}
			
		</style>

		<div class="container" role="menuitem">
			<slot></slot>
		</div>
	`,

    is: "tricomp-priority-dropdown-item",

	properties: {
		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	}
});