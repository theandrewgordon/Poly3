/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons.js";
import "../../services/triservice-work-planner.js";

class TricompUndoButton extends PolymerElement {
	static get is() { return "tricomp-undo-button"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.undo-icon {
					width: 45px;
					height: 45px;
					padding: 10px;
					transform: rotate(90deg);
				}
			</style>

			<triservice-work-planner id="serviceWorkPlanner" has-undo-changes="{{_hasUndoChanges}}"></triservice-work-planner>
			<paper-icon-button class="undo-icon" icon="ibm:reset-revert" primary title="undo" disabled="[[!_hasUndoChanges]]"
				on-tap="_handleUndoTap">
			</paper-icon-button>
		`;
	}
	static get properties() {
		return {
			_hasUndoChanges: {
				type: Boolean
			}
		};
	}

	_handleUndoTap() {
		this.$.serviceWorkPlanner.undo();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/undo-button/tricomp-undo-button.js");
	}
}

window.customElements.define(TricompUndoButton.is, TricompUndoButton);