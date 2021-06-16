/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";

class TricompTaskAssignButton extends  mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-task-assign-button"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
				}

				.assign-btn  {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-flex;
					color: var(--tri-primary-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px;
				}

				.people-icon {
					width: 16px;
					height: 16px;
				}

				:host([dir="ltr"]) .people-icon {
					margin-right: 5px;
				}

				:host([dir="rtl"]) .people-icon {
					margin-left: 5px;
				}

				.label {
					@apply --layout-flex;
				}

				.expand-icon {
					height: 16px;
					width: 16px;
				}

				:host([dir="ltr"]) .expand-icon {
					margin-left: 5px;
				}

				:host([dir="rtl"]) .expand-icon {
					margin-right: 5px;
				}
			</style>

			<paper-button class="assign-btn tri-disable-theme">
				<dom-if if="[[_isUnassigned(assignmentStatus)]]">
					<template>
						<iron-icon class="people-icon" icon="ibm-glyphs:user"></iron-icon>
					</template>
				</dom-if>
				<span class="label">[[_computeLabelButton(assignmentStatus)]]</span>
				<iron-icon class="expand-icon" icon="ibm-glyphs:expand-open"></iron-icon>
			</paper-button>
		`;
	}
	static get properties() {
		return {
			assignmentStatus: {
				type: String
			}
		};
	}

	_computeLabelButton(assignmentStatus) {
		switch (assignmentStatus) {
			case "Assigned":
				const __dictionary__Assignees = "Assignees";
				return __dictionary__Assignees;
			case "Unassigned":
				const __dictionary__Assign = "Assign";
				return __dictionary__Assign;
			default:
				return "";
		}
	}

	_isUnassigned(assignmentStatus) {
		return assignmentStatus && assignmentStatus == "Unassigned";
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-task-assign-button.js");
	}
}

window.customElements.define(TricompTaskAssignButton.is, TricompTaskAssignButton);