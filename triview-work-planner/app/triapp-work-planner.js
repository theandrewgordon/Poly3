/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

class TriappWorkPlanner extends PolymerElement {
	static get is() { return "triapp-work-planner"; }

	static get template() {
		return html`
			<triview-work-planner model-and-view="triWorkPlanner" instance-id="-1" embedded>
			</triview-work-planner>
		`;
	}
}

window.customElements.define(TriappWorkPlanner.is, TriappWorkPlanner);