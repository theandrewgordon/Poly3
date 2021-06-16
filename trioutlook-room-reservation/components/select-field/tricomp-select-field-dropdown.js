/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "./tricomp-select-item.js";
import "../../styles/tristyles-carbon-theme.js";

class TricompSelectFieldDropdown extends mixinBehaviors([IronResizableBehavior], TrimixinDropdown(PolymerElement)) {
	static get is() { return "tricomp-select-field-dropdown"; }

	static get template() {
		return html `
			<style include="room-reservation-dropdown-styles carbon-style">
				iron-dropdown {
					max-height: 500px;
				}

				.content {
					overflow-y: auto;
					padding: 0;
				}
			</style>
			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="40"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]" no-auto-focus>
				<div class="content" slot="dropdown-content">
					<dom-repeat items="[[items]]">
						<template>
							<tricomp-select-item id="[[item.id]]" name="[[item.name]]" on-select-item-selected="_onItemSelected"></tricomp-select-item>
						</template>
					</dom-repeat>
				</div>
			</iron-dropdown>
		`
	}

	static get properties() {
		return {
			items: Array,
			selected: {
				type: String,
				notify: true
			}
		}
	}

	toggle(fitInto = window, scrollContainer, targetElement, sameTargetWidth) {
		if (!this._opened || this._targetElement != targetElement) {
			this.open(fitInto, scrollContainer, targetElement, sameTargetWidth);
		} else {
			this.close();
		}
	}

	open(fitInto = window, scrollContainer, targetElement, sameTargetWidth) {
		this._fitInto = fitInto;
		this._scrollContainer = scrollContainer;
		this._targetElement = targetElement;
		this._sameTargetWidth = sameTargetWidth;
		this.$.dropdown.open();
	}

	close() {
		this.$.dropdown.close();
	}

	_onItemSelected(e) {
		e.stopPropagation();
		this.set('selected', e.detail.id);
		this.close();
	}
}

window.customElements.define(TricompSelectFieldDropdown.is, TricompSelectFieldDropdown);