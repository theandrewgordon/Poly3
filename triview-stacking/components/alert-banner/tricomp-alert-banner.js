/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import { getModuleUrl, assertParametersAreDefined } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons.js";

class AlertBannerComponent extends PolymerElement {
	static get is() { return "tricomp-alert-banner"; }

	static get template() {
		return html`
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
			</style>

			<div class="status-icon-container">
				<iron-icon class="status-icon" icon="[[_computeIcon(icon, info, success, warning, majorWarning, danger, error)]]"></iron-icon>
			</div>

			<div class="message-container">
				<div class="message">
					<slot></slot>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			icon: {
				type: String,
				value: ""
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
			}
		}
	}

	_computeIcon(icon, info, success, warning, majorWarning, danger, error) {
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

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/alert-banner/tricomp-alert-banner.js");
	}
}

window.customElements.define(AlertBannerComponent.is, AlertBannerComponent);