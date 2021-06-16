/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import { formatDate } from "../../utils/triutils-date.js";
import "../people-image/tricomp-people-image.js";

class TricompAssignedPeopleCard extends PolymerElement {
	static get is() { return "tricomp-assigned-people-card"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					flex-shrink: 0;
					overflow: hidden;
					min-height: 45px;
				}

				:host(:hover) {
					background-color: #EEF6FE;
				}

				tricomp-people-image {
					height: 28px;
					width: 28px;
					min-width: 28px;
					margin: 0px 5px;
					--tricomp-people-image-size: {
						height: 26px;
						width: 26px;
					};
					--tricomp-people-image-name: {
						font-size: 14px;
						height: 26px;
						width: 26px;
					}
				}

				.name-container {
					@apply --layout-vertical;
					@apply --layout-flex;
					padding: 0px 5px;
					max-width: 200px;
					overflow-x: hidden;
				}

				.allocation-date {
					font-size: 12px;
				}
			</style>

			<tricomp-people-image image="[[people.picture]]" first-name="[[people.firstName]]" last-name="[[people.lastName]]"></tricomp-people-image>
			<div class="name-container">
				<div>[[people.name]]</div>
				<label class="allocation-date">Allocation: [[_formatDate(people.allocationDate, currentUser)]]</label>
			</div>
			<paper-icon-button class="remove-icon" icon="ibm-glyphs:remove" danger 
				on-tap="_handleRemoveTap" disabled="[[_computeDisabledRemoveButton(people, disableUnassign)]]">
			</paper-icon-button> 
		`;
	}

	static get properties() {
		return {
			people: {
				type: Object
			},

			currentUser: {
				type: Object
			},

			disableUnassign: {
				type: Boolean,
				value: false
			}
		};
	}

	_formatDate(date, currentUser) {
		if (!date || !currentUser) {
			return "";
		}
		return formatDate(date, currentUser._DateFormat, currentUser._Locale);
	}

	_hasResourceId(people) {
		return people && people.resourceRecordID;
	}

	_computeDisabledRemoveButton(people, disableUnassign) {
		return disableUnassign || !this._hasResourceId(people);
	}

	_handleRemoveTap(e) {
		e.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(
				"remove-assignment", 
				{
					detail: { people: this.people },
					bubbles: false, composed: false
				}
			)
		);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/edit-assignments/tricomp-assigned-people-card.js");
	}
}

window.customElements.define(TricompAssignedPeopleCard.is, TricompAssignedPeopleCard);