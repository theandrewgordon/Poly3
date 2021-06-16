/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/paper-icon-button/paper-icon-button.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import "../../../tricore-url/tricore-url.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../styles/tristyles-stacking.js";

class DetailsHeaderComp extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-details-header"; }

	static get template() {
		return html`
			<style include="stacking-layout-styles tristyles-theme">
				.classic-link {
					cursor: pointer;
				}
				.classic-link:hover {
					text-decoration: underline;
				}

				:host([dir="ltr"]) .classic-link-icon {
					padding-left: 10px;
				}
				:host([dir="rtl"]) .classic-link-icon {
					padding-right: 10px;
				}
			</style>

			<tricore-url id="tricoreUrl"></tricore-url>

			<div class="header-content">
				<div class="page-title tri-h2">
					<span>[[label]]</span>
					<span class="classic-link" on-tap="_openClassicStackPlan">[[stackPlan.name]]</span>
					<paper-icon-button primary class="classic-link-icon" icon="ibm-glyphs:maximize" on-tap="_openClassicStackPlan"></paper-icon-button>
				</div>
				<div class="sub-header-text">
					<span>ID[[stackPlan.id]]</span>
					<div class="id-org-divider">|</div>
					<span>Stack from [[stackPlan.orgType]] Allocations</span>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			stackPlan: Object,
			label: String
		};
	}

	_openClassicStackPlan(e) {
		e.stopPropagation();
		if (!this.stackPlan._id) return "";
		let stackPlanId = this.stackPlan._id;
		var url = this.$.tricoreUrl.getUrl("/WebProcess.srv?objectId=750000&actionId=750011&propertyId=208133&projectId=1&specClassType=57&specId=" + stackPlanId + "&specTypeId=10035880&action=Edit&managerType=query&altGuiListId=-1");
		window.open(url, "_blank");
	}
}

window.customElements.define(DetailsHeaderComp.is, DetailsHeaderComp);
