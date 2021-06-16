/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-selector/iron-selector.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "./tricomp-task-status-tab-item.js";

class TricompTaskStatusTab extends PolymerElement {
	static get is() { return "tricomp-task-status-tab"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				.selector {
					@apply --layout-horizontal;
					max-width: 450px;
				}

				tricomp-task-status-tab-item {
					@apply --layout-flex-2;
				}
			</style>

			<iron-selector class="selector" attr-for-selected="name" selected="{{selected}}" role="listbox" aria-label="Filter by">
				<tricomp-task-status-tab-item name="unassigned" label="Unassigned" role="option"></tricomp-task-status-tab-item>
				<tricomp-task-status-tab-item name="assigned" label="Assigned" role="option"></tricomp-task-status-tab-item>
				<tricomp-task-status-tab-item name="overdue" label="Overdue" role="option"></tricomp-task-status-tab-item>
			</iron-selector>
		`;
	}

	static get properties() {
		return {
			selected: {
				type: String,
				notify: true
			}
		};
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-status-tab/tricomp-task-status-tab.js");
	}
}

window.customElements.define(TricompTaskStatusTab.is, TricompTaskStatusTab);