/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";

import "../overflow-text/tricomp-overflow-text.js";

class StackPlansBuildingsComp extends PolymerElement {
	static get is() { return "tricomp-stack-plan-buildings" }

	static get template() {
		return html`

			<style>
				:host {
					@apply --layout-horizontal;
					@apply --layout-flex;
					flex-wrap: wrap;
				}
			</style>

			<tricomp-overflow-text lines="3" class="task-name" text="[[_computeBuildingNamesString(buildingNames)]]">
			</tricomp-overflow-text>
		`
	}

	static get properties() {
		return {
			buildingNames: Array,
		}
	}

	_computeBuildingNamesString(buildingNames) {
		if (buildingNames && buildingNames.length > 0)
			return buildingNames.join(", ");
	}
}

customElements.define('tricomp-stack-plan-buildings', StackPlansBuildingsComp);