/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-item/paper-item.js";
import "../../../@polymer/paper-listbox/paper-listbox.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";

class RoleSelectInputDropdownComponent extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-role-select-input-dropdown"; }

	static get template() {
		return html`
			<style>
				.content {
					padding: 1px;
					background-color: var(--primary-background-color);
					border: 1px solid var(--ibm-gray-30);
					box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
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

				paper-item.iron-selected {
					background-color: #F7FBFF;
					font-weight: normal;
				}

				.divider {
					background-color: var(--tri-primary-content-accent-color);
					height: 1px;
					width: auto;
				}
			</style>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="30" no-auto-focus
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
										</paper-item>
									</template>
								</dom-repeat>
								<template is="dom-if" if="[[_hasSeeAll(disableSeeAll)]]">
									<div class="divider"></div>
									<paper-item name="seeAll" on-tap="_seeAllSelected">
										See All
									</paper-item>
								</template>
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

			disableSeeAll: Boolean,

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

	toggle(fitInto = window, scrollContainer, targetElement, horizontalAlign, data, attrToDisplay, setTargetWidth, linkedBO) {
		if (!this._opened || this._targetElement != targetElement) {
			document.body.appendChild(this);
			this._attrToDisplay = (attrToDisplay && attrToDisplay != "") ? attrToDisplay : this._attrToDisplay;
			this.disableSeeAll = (linkedBO);
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
		if (this._opened) {
			this.$.dropdown.close();
			this.$.dropdown.open();
		}
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

	_hasSeeAll(show) {
		return show;
	}

	_seeAllSelected(e) {
		this.disableSeeAll = false;
		this._targetElement.loadFullListDS(e);

	}

	static get importMeta() {
		return getModuleUrl("triapp-contact-roles/components/role-select-input/tricomp-role-select-input-dropdown.js");
	}
}

window.customElements.define(RoleSelectInputDropdownComponent.is, RoleSelectInputDropdownComponent);