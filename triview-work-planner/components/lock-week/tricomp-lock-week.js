/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../styles/tristyles-work-planner.js";
import "../../services/triservice-work-planner.js";

class TricompLockWeek extends PolymerElement {
	static get is() { return "tricomp-lock-week"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.lock-icon {
					width: 45px;
					height: 45px;
				}
			</style>

			<triservice-work-planner lock-week="{{_lockCheck}}"></triservice-work-planner>
			<paper-icon-button class="lock-icon" icon="[[_computeLockIcon(_lockCheck)]]" on-tap="_lock" primary></paper-icon-button>
		`;
	}
	static get properties() {
		return {
			_lockCheck: {
				type: Boolean
			},
		};
	}

	_computeLockIcon(lockCheck) {
		return lockCheck ? "ibm-glyphs:locked" : "ibm-glyphs:unlocked";
	}

	_lock(){
		this._lockCheck = !this._lockCheck;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/lock-week/tricomp-lock-week.js");
	}
}

window.customElements.define(TricompLockWeek.is, TricompLockWeek);