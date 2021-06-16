/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../triplat-icon/ibm-icons.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-horizontal;
					flex-shrink: 0;
					background-color: var(--tri-primary-color);
				}

				:host([info]) {
					background-color: var(--tri-info-color);
				}

				:host([success]) {
					background-color: var(--tri-success-color);
				}

				:host([warning]) {
					background-color: var(--tri-warning-color);
				}

				:host([major-warning]) {
					background-color: var(--tri-major-warning-color);
				}

				:host([danger]) {
					background-color: var(--tri-danger-color);
				}

				:host([error]) {
					background-color: var(--tri-error-color);
				}

				.status-icon-container {
					@apply --layout-vertical;
					@apply --layout-start;
					padding: 5px;
				}

				.status-icon {
					--iron-icon-height: 24px;
					--iron-icon-width: 24px;
					color: white;
				}

				.message-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					@apply --layout-center-justified;
					background-color: rgba(255, 255, 255, 0.8);
					padding: 5px 5px 5px 10px;
				}

				.title {
					font-weight: bold;
				}

				.tooltip-indicator-icon-container {
					@apply --layout-vertical;
					@apply --layout-start;
					background-color: rgba(255, 255, 255, 0.8);
					padding: 5px;
				}

				.tooltip-indicator-icon {
					--iron-icon-height: 24px;
					--iron-icon-width: 24px;
					color: var(--tri-primary-color);
				}

				:host([info]) .tooltip-indicator-icon {
					color: var(--tri-info-color);
				}

				:host([success]) .tooltip-indicator-icon {
					color: var(--tri-success-color);
				}

				:host([warning]) .tooltip-indicator-icon {
					color: var(--tri-warning-color);
				}

				:host([major-warning]) .tooltip-indicator-icon {
					color: var(--tri-major-warning-color);
				}

				:host([danger]) .tooltip-indicator-icon {
					color: var(--tri-danger-color);
				}

				:host([error]) .tooltip-indicator-icon {
					color: var(--tri-error-color);
				}
			
		</style>

		<div class="status-icon-container">
			<iron-icon class="status-icon" icon="[[_computeIcon(icon, info, success, warning, majorWarning, danger, error)]]"></iron-icon>
		</div>

		<div class="message-container">
			<div class="title">[[title]]</div>
			<div class="message">
				<slot></slot>
			</div>
		</div>

		<div class="tooltip-indicator-icon-container" hidden\$="[[!showTooltipIndicatorIcon]]">
			<iron-icon class="tooltip-indicator-icon" icon="ibm:menuoverflow"></iron-icon>
		</div>
	`,

    is: 'tricomp-fixed-alert',

    properties: {
		title: {
			type: String,
			value: ""
		},
		icon: {
			type: String,
			value: ""
		},
		showTooltipIndicatorIcon: {
			type: Boolean,
			value: false
		},

		info: {
			reflectToAttribute: true,
			type: Boolean,
			value: false
		},
		success: {
			reflectToAttribute: true,
			type: Boolean,
			value: false
		},
		warning: {
			reflectToAttribute: true,
			type: Boolean,
			value: false
		},
		majorWarning: {
			reflectToAttribute: true,
			type: Boolean,
			value: false
		},
		danger: {
			reflectToAttribute: true,
			type: Boolean,
			value: false
		},
		error: {
			reflectToAttribute: true,
			type: Boolean,
			value: false
		},
	},

    hostAttributes: {
		role: 'alert'
	},

    _computeIcon: function (icon, info, success, warning, majorWarning, danger, error) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (icon && icon != "") return icon;
		else if (info) return "ibm:status-info";
		else if (success) return "ibm:status-success";
		else if (warning) return "ibm:status-warning";
		else if (majorWarning) return "ibm:status-warning-major";
		else if (danger) return "ibm:status-warning-major";
		else if (error) return "ibm:status-error";
		else return "";
	}
});