/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../styles/tristyles-work-planner.js";
import "../../services/triservice-work-planner.js";
import "../../components/week-selector/tricomp-week-selector.js";
import "../../components/people-list/tricomp-people-list.js";

class TricompPeopleSection extends PolymerElement {
	static get is() { return "tricomp-people-section"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
				}

				.workgroup-selector {
					@apply --layout-self-start;
					margin-top: 20px;
				}

				.people-list {
					@apply --layout-flex;
					margin-top: 15px;
				}
			</style>
			
			<triservice-work-planner people-start-date="{{_peopleStartDate}}" people-end-date="{{_peopleEndDate}}"></triservice-work-planner>
			<div class="section-title">People</div>
			<tricomp-week-selector class="workgroup-selector" start-date="{{_peopleStartDate}}" end-Date="{{_peopleEndDate}}"></tricomp-week-selector>
			<tricomp-people-list class="people-list"></tricomp-people-list>
		`;
	}

	static get properties() {
		return {
			_peopleStartDate: {
				type:String
			},
			_peopleEndDate: {
				type:String
			},
		};
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/pages/assignment/tricomp-people-section.js");
	}
}

window.customElements.define(TricompPeopleSection.is, TricompPeopleSection);