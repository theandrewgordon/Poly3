/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-a11y-keys/iron-a11y-keys.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					background-color: white;
				}

				.container {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				:host(:not([small-layout])) .container {
					padding: 20px 20px 10px 20px;
				}

				.label {
					@apply --paper-font-common-nowrap;
					@apply --layout-flex;
					margin-right: 10px;
					font-weight: 700;
				}

				:host([small-layout]) .action-bar {
					@apply --layout;
					background-color: var(--tri-footer-background-color);
					color: var(--tri-footer-color);
					padding: 5px;
					@apply --layout-center-center;
					@apply --layout-fixed-bottom;
					z-index: 2;
				}
			
		</style>

		<div class="container">
			<span class="label tri-h2" hidden\$="[[smallLayout]]">My Work Tasks</span>
			<div class="action-bar" hidden\$="[[_computeHideNewButton(showNewTaskButton, auth)]]">
				<paper-button footer\$="[[smallLayout]]" on-tap="_handleNewButtonTapped" noink="">New Task</paper-button>
			</div>
		</div>	
	`,

    is: "tricomp-task-list-header",

    properties: {
		auth: Object,
		showNewTaskButton: {
			type: Boolean,
			value: false
		},
		
		smallLayout: {
			type: Boolean,
			reflectToAttribute: true
		}
	},

    _handleNewButtonTapped: function(){
		this.fire("new-task-button-tapped");
	},

    _computeHideNewButton: function(showNewTaskButton, auth) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !showNewTaskButton || !auth.canCreate
	}
});