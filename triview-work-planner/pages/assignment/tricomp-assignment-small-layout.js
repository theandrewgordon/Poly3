/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../components/task-section/tricomp-task-section-small-layout.js";

class TricompAssignmentSmallLayout extends PolymerElement {
	static get is() { return "tricomp-assignment-small-layout"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.task-section {
					@apply --layout-flex;
				}
			</style>
			
			<tricomp-task-section-small-layout class="task-section"></tricomp-task-section-small-layout>
		`;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/assignment/tricomp-assignment-small-layout.js");
	}
}

window.customElements.define(TricompAssignmentSmallLayout.is, TricompAssignmentSmallLayout);