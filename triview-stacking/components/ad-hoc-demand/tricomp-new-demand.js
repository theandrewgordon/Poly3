/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../services/triservice-ad-hoc-demand.js";
import "./tricomp-demand-table.js";

class NewDemandComponent extends PolymerElement {
	static get is() { return "tricomp-new-demand"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
				}
			</style>

			<triservice-ad-hoc-demand floors-for-search="{{_floors}}" new-demands="{{_demands}}"></triservice-ad-hoc-demand>

			<tricomp-demand-table id="demandTable" demands="{{_demands}}" fit-into="[[fitInto]]" floors="[[_floors]]"></tricomp-demand-table>
		`;
	}

	static get properties() {
		return {
			fitInto: {
				type: Object
			},

			_demands: {
				type: Array
			},

			_floors: {
				type: Array
			}
		}
	}

	validateDemandsFields() {
		return this.$.demandTable.validateRowFields();
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/ad-hoc-demand/tricomp-new-demand.js");
	}
}

window.customElements.define(NewDemandComponent.is, NewDemandComponent);