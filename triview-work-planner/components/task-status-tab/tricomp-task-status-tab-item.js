/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";

class TricompTaskStatusTabItem extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-task-status-tab-item"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center-center;
					background-color: transparent;
					border: 1px solid var(--ibm-blue-70);
					margin: 0;
					padding: 8px 15px;
					text-align: center;
				}

				:host(:hover) {
					background-color: var(--tri-primary-color);
					color: white;
					cursor: pointer;
				}

				:host([dir="ltr"]:not(:last-of-type)) {
					border-right: none;
				}

				:host([dir="ltr"]:first-of-type) {
					border-radius: 8px 0 0 8px;
				}

				:host([dir="ltr"]:last-of-type) {
					border-radius: 0 8px 8px 0;
				}

				:host([dir="rtl"]:not(:last-of-type)) {
					border-left: none;
				}

				:host([dir="rtl"]:first-of-type) {
					border-radius: 0 8px 8px 0;
				}

				:host([dir="rtl"]:last-of-type) {
					border-radius: 8px 0 0 8px;
				}

				:host(.iron-selected) {
					background-color: var(--ibm-blue-70);
					color: white;
				}
			</style>

			[[label]]
		`;
	}

	static get properties() {
		return {
			label: {
				type: String,
				value: ""
			},
	
			name: {
				type: String,
				value: ""
			}
		};
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-status-tab/tricomp-task-status-tab-item.js");
	}
}

window.customElements.define(TricompTaskStatusTabItem.is, TricompTaskStatusTabItem);