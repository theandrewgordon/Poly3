/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { templatize } from "../../../@polymer/polymer/lib/utils/templatize.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TrimixinDropdownComponent } from "../dropdown/trimixin-dropdown-component.js";
import "./tricomp-assigned-people-dropdown.js";

class TricompEditAssignment extends mixinBehaviors([TriDirBehavior], TrimixinDropdownComponent(PolymerElement)) {
	static get is() { return "tricomp-edit-assignment"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				.edit-assignment-btn {
					@apply --layout-horizontal;
					color: var(--tri-primary-icon-button-color);
					font-family: var(--tri-font-family);
					font-weight: 500;
					text-transform: none;
					padding: 0px;
					margin: 0px;
				}

				.edit-assignment-btn > iron-icon {
					width: 16px;
					height: 16px;
				}

				:host([dir="ltr"]) .edit-assignment-btn > iron-icon {
					margin-left: 5px;
				}

				:host([dir="rtl"]) .edit-assignment-btn > iron-icon {
					margin-right: 5px;
				}

				.edit-assignment-btn:hover {
					color: var(--tri-primary-icon-button-hover-color);
				}

				.edit-assignment-btn:hover > span {
					text-decoration: underline;
				}

				.edit-assignment-btn[pressed] {
					color: var(--tri-primary-icon-button-press-color);
				}
			</style>

			<paper-button id="editAssignmentBtn" class="edit-assignment-btn tri-disable-theme" on-tap="_onTapEditAssignment"><span>Edit assignment</span><iron-icon icon="ibm-glyphs:edit"></iron-icon></paper-button>
			<template id="dropdownTemplate">
				<tricomp-assigned-people-dropdown id="tricomp-edit-assignment-dropdown"></tricomp-assigned-people-dropdown>
			</template>
		`;
	}

	static get properties() {
		return {
			task: {
				type: Object
			},

			closeAfterSelectedMemberRemoval: {
				type: Boolean,
				value: false
			}
		};
	}

	_onTapEditAssignment(e) {
		e.stopPropagation();
		this._getDropdown().toggle(this.fitInto, this.scrollContainer, this.$.editAssignmentBtn, this.task, this.closeAfterSelectedMemberRemoval);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/edit-assignment/tricomp-edit-assignment.js");
	}
}

window.customElements.define(TricompEditAssignment.is, TricompEditAssignment);