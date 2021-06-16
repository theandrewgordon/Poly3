/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/paper-button/paper-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";

class TricompDropdownButton extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-dropdown-button"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				paper-button.dropdown-button {
					font-family: var(--tri-font-family);
					border-radius: 0px;
					text-transform: none;
					min-width: auto;
					margin: 0px;
					padding: 0px;
					-webkit-font-smoothing: auto;
					@apply --tricomp-dropdown-button;
				}

				.selected-item {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --tricomp-dropdown-button-selected-item;
				}
				
				:host([opened]) .selected-item {
					@apply --tricomp-dropdown-button-opened-selected;
				}

				:host([dir="ltr"]) .tri-link {
					padding-left: var(--icon-padding, 10px);
				}
				
				:host([dir="rtl"]) .tri-link {
					padding-right: var(--icon-padding, 10px);
				}
			</style>

			<dom-if if="[[readOnly]]" restamp>
				<template>
					<slot></slot>
				</template>
			</dom-if>
			<dom-if if="[[!readOnly]]" restamp>
				<template>
					<paper-button class="dropdown-button tri-disable-theme" on-tap="_onButtonTapped">
						<div class="selected-item">
							<slot></slot>
							<iron-icon class="tri-link" icon="[[_computeDropdownIcon(opened)]]"></iron-icon>
						</div>
					</paper-button>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			opened: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			readOnly: {
				type: Boolean,
				value: false
			}
		};
	}

	_onButtonTapped(e) {
		this.dispatchEvent(new CustomEvent("toggle-dropdown", { bubbles: false, composed: false } ));
	}

	_computeDropdownIcon(opened) {
		return opened ? "icons:arrow-drop-up" : "icons:arrow-drop-down";
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/dropdown/tricomp-dropdown-button.js");
	}
}

window.customElements.define(TricompDropdownButton.is, TricompDropdownButton);