/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

class StackingApp extends PolymerElement {
	static get is() { return "triapp-stacking"; }

	static get template() {
		return html`
			<triview-stacking model-and-view="triStacking" instance-id="-1" embedded>
			</triview-stacking>
		`;
	}
}

window.customElements.define(StackingApp.is, StackingApp);
