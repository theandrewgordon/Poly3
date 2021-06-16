/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-item/paper-item.js";
import "../../../@polymer/paper-listbox/paper-listbox.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../styles/tristyles-stacking.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";

class SelectInputDropdownComponent extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-select-input-dropdown"; }

	static get template() {
		return html`
			<style include="stacking-dropdown-styles tristyles-theme">
				.content {
					padding: 1px;
				}

				paper-listbox {
					padding: 0;
				}

				paper-item {
					box-sizing: border-box;
					--paper-item-min-height: auto;
					--paper-item: {
						font-family: var(--tri-font-family);
						font-size: 14px;
						padding: 5px 10px;
					};
				}
				paper-item:hover {
					background-color: var(--tri-primary-light-color);
					cursor: pointer;
				}
			</style>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{opened}}" vertical-offset="40"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]"
				horizontal-align="[[_horizontalAlign]]" focus-target="[[_focusTarget]]">
				<div class="content" slot="dropdown-content">
					<paper-listbox id="listBox">
						<dom-if if="[[_hasData(_data)]]">
							<template>
								<dom-repeat items="[[_data]]">
									<template>
										<paper-item name="[[_computeDisplayedValue(item, _attrToDisplay)]]" on-tap="_itemSelected">
											[[_computeDisplayedValue(item, _attrToDisplay)]]
										</template>
								</dom-repeat>
							</template>
						</dom-if>
						<dom-if if="[[!_hasData(_data)]]">
							<template>
								<paper-item>
									No results.
								</paper-item>
							</template>
						</dom-if>
					</paper-listbox>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			_attrToDisplay: {
				type: String,
				value: "name"
			},

			_data: {
				type: Array
			},

			_horizontalAlign: {
				type: String
			},

			_focusTarget: {
				type: Object
			}
		}
	}

	focus() {
		this.$.listBox.focus();
	}

	toggle(fitInto = window, scrollContainer, targetElement, horizontalAlign, data, attrToDisplay, setTargetWidth) {
		if (!this.opened || this._targetElement != targetElement) {
			document.body.appendChild(this);
			this._attrToDisplay = (attrToDisplay && attrToDisplay != "") ? attrToDisplay : this._attrToDisplay;
			this._data = data;
			this._fitInto = fitInto;
			this._horizontalAlign = horizontalAlign;
			this._scrollContainer = scrollContainer;
			this._targetElement = targetElement;
			this._setTargetWidth = setTargetWidth;
			if (setTargetWidth) this._setDropdownWidth();
			this._focusTarget = targetElement;
			this.$.dropdown.open();
		} else {
			this.close();
		}
	}

	close() {
		this.$.dropdown.close();
	}

	updateData(data) {
		this._data = data;
		this.dropdownNotifyResize();
	}

	dropdownNotifyResize() {
		this.$.dropdown.notifyResize();
	}

	_hasData(data) {
		return data && data.length > 0;
	}

	_itemSelected(e) {
		e.stopPropagation();
		let item = e.model.item;
		this._targetElement.value = item[this._attrToDisplay];
		this._targetElement.itemSelected = item;
		this._targetElement.dispatchItemSelectedEvent(item);
		this.close();
	}

	_computeDisplayedValue(item, attrToDisplay) {
		return item[attrToDisplay];
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/select-input/tricomp-select-input-dropdown.js");
	}
}

window.customElements.define(SelectInputDropdownComponent.is, SelectInputDropdownComponent);