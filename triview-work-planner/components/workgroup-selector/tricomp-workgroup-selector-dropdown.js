/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/paper-item/paper-item.js";
import "../../../@polymer/paper-listbox/paper-listbox.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "../../styles/tristyles-work-planner.js";

class TricompWorkgroupSelectorDropdown extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-workgroup-selector-dropdown"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles work-planner-dropdown-styles tristyles-theme">
				paper-listbox {
					padding: 0;
				}

				.content {
					padding: 0px;
				}

				paper-item {
					font-family: var(--tri-font-family);
					font-size: 18px;
					cursor: pointer;
					white-space: nowrap;
					background-color: var(--primary-background-color);
					user-select: none;
					--paper-item-min-height: 0;
					--paper-item-selected-weight: normal;
					--paper-item: {
						padding: 10px;
					};
					--paper-item-focused-before: {
						opacity: 0;
					};
					--paper-item-focused: {
						background-color: #EEF6FE!important;
					};
				}

				paper-item.iron-selected {
					background-color: #F7FBFF;
				}

				paper-item:hover {
					background-color: #EEF6FE;
				}
			</style>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="27"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" scroll-action="[[_scrollAction]]">
				<paper-listbox class="content" slot="dropdown-content" selected="{{selected}}">
					<dom-repeat items="{{workgroups}}">
						<template>
							<paper-item>
								<span>[[item.name]]</span>
							</paper-item>
						</template>
					</dom-repeat>
				</paper-listbox>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			selected: {
				type: Number,
				notify: true
			},

			workgroups: {
				type: Array
			}
		};
	}

	toggle(targetElement) {
		if (!this._opened || this._targetElement != targetElement) {
			this._targetElement = targetElement;
			let targetWidth = targetElement.getBoundingClientRect().width;
			this.$.dropdown.style.minWidth = `${targetWidth}px`;
			this.$.dropdown.open();
		} else {
			this.close();
		}
	}

	close() {
		this.$.dropdown.close();
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/workgroup-selector/tricomp-workgroup-selector-dropdown.js");
	}
}

window.customElements.define(TricompWorkgroupSelectorDropdown.is, TricompWorkgroupSelectorDropdown);