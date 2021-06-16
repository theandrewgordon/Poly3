/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import { isIEorEdgeBrowser } from "../../utils/triutils-utilities.js"

import "../accordion/tricomp-accordion.js";
import { CHECKED, UNCHECKED, INDETERMINATE } from "../checkbox/tricomp-checkbox.js";
import "../checkbox/tricomp-checkbox.js";

class TricompHierarchyCheckboxItem extends mixinBehaviors([TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-hierarchy-checkbox-item"; }

	static get template() {
		return html`
			<style >
				tricomp-checkbox {
					padding: 5px 0;
				}

				:host([_ie-edge]) {
					--tricomp-checkbox-label: {
						max-width: calc(100% - 24px);
					};
				}

				tricomp-accordion {
					--tricomp-accordion-header: {
						padding: 0;
					};
				}

				.accordion-header {
					@apply --layout-horizontal;
					position: relative;
				}

				.header-spacer {
					visibility: hidden;
					padding: 5px 12px;
				}

				.accordion-checkbox {
					position: absolute;
					top: 0px;
					right: 0px;
					left: 0px;
					z-index: 1;
				}

				div.hierarchy-item-content {
					@apply --layout-vertical;
				}

				:host([dir="ltr"]) div.hierarchy-item-content {
					padding-left: 35px;
				}

				:host([dir="rtl"]) div.hierarchy-item-content {
					padding-right: 35px;
				}
			</style>

			<dom-if if="[[!model.children]]" restamp>
				<template>
					<tricomp-checkbox state="[[state.value]]" on-user-checked="_handleUserChecked">[[model.name]]</tricomp-checkbox>
				</template>
			</dom-if>

			<dom-if id="hasChildrenDomIf" if="[[model.children]]" restamp>
				<template>
					<tricomp-accordion opened>
						<div slot="accordion-header" class="accordion-header">
							<!-- use this spacer to position correctly the accordion expand button on IE11 -->
							<div class="header-spacer">[[model.name]]</div>
							<tricomp-checkbox class="accordion-checkbox" state="[[state.value]]" 
								on-user-checked="_handleUserChecked">[[model.name]]</tricomp-checkbox>
						</div>

						<div slot="accordion-content">
							<div class="hierarchy-item-content">
								<dom-repeat id="childrenDomRepeat" items="{{model.children}}">
									<template>
										<tricomp-hierarchy-checkbox-item model="{{item}}" 
											on-state-changed="_handleChildStateChange" on-user-changed="_handleUserChanged">
										</tricomp-hierarchy-checkbox-item>
									</template>
								</dom-repeat>
							</div>
						</div>
					</tricomp-accordion>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			state: {
				type: Object,
				notify: true,
				readOnly: true
			},

			selected: {
				type: Array,
				value: () => { return []; },
				readOnly: true
			},

			model: {
				type: Object,
				notify: true
			},

			_ieEdge: {
				type: Boolean,
				reflectToAttribute: true,
				value: isIEorEdgeBrowser()
			},

			_children: {
				type: Array
			},

			_delayedSelection: {
				type: Array
			},

			_ignoreChildStateChange: {
				type: Boolean
			},

			_isReady: {
				type: Boolean
			},

			_previousSavedState: {
				type: Object
			}
		};
	}

	static get observers() {
		return [
			"_handleModelChanges(model)"
		];
	}

	ready() {
		super.ready();
		this._isReady = true;
		if (this._delayedSelection) {
			this.select(this._delayedSelection);
		}
	}

	select(selection) {
		if (!this._isReady) {
			this._delayedSelection = selection;
			return;
		}
		if (selection == this.selected) return;
		this.clear();
		if (selection && selection.length > 0) {
			const model = this.model;
			const isSelected = selection.findIndex((item) => item.type == model.type && item._id == model._id) >= 0;
			if (isSelected) {
				this._selectThis(true);
				this._saveState();
			} else {
				this._selectChildren(selection);
			}
		}
	}

	clear() {
		this._clearSelected();
		this._clearChildren();
		this._setState({value: UNCHECKED});
	}

	_selectThis(clearChildren) {
		if (clearChildren) this._clearChildren();
		this._setSelected([this.model]);
		this._setState({value: CHECKED});
	}

	_selectChildren(selection) {
		const children = this._getChildren();
		for (let i = 0; i < children.length; i++) {
			children[i].select(selection);
		}
	}

	_handleUserChecked(e) {
		switch (e.detail) {
			case CHECKED:
				this._selectThis(true);
				this._saveState();
				this._fireUserChangedEvent();
				break;

			case UNCHECKED:
				this.clear();
				this._saveState();
				this._fireUserChangedEvent();
				break;
		}
	}

	_fireUserChangedEvent() {
		this.dispatchEvent(new CustomEvent("user-changed", { detail: this.selected, bubbles: false, composed: false }));
	}

	_handleUserChanged() {
		this._fireUserChangedEvent();
	}

	_saveState() {
		this._previousSavedState = this.state;
	}

	_handleChildStateChange() {
		if (this._ignoreChildStateChange) return;
		const children = this._getChildren();
		let allChecked = true;
		let allUnchecked = true;
		for (let i = 0; i < children.length; i++) {
			const stateValue = children[i].state != null ? children[i].state.value : null;
			switch (stateValue) {
				case CHECKED:
					allUnchecked = false;
					break;

				case INDETERMINATE:
					allUnchecked = false;
					allChecked = false;
					break;

				case UNCHECKED:
				default:
					allChecked = false;
					break;
			}
		}
		if (allChecked) {
			this._selectThis(false);
		} else if (allUnchecked) {
			if (this._previousSavedState != null && this._previousSavedState.value == CHECKED) {
				this._selectThis(false);
			} else {
				this.clear(true);
			}
		} else {
			this._setAsIndeterminate();
		}
	}

	_setAsIndeterminate() {
		const selected = [];
		const children = this._getChildren();
		for (let i = 0; i < children.length; i++) {
			Array.prototype.push.apply(selected, children[i].selected);
		}
		this._setSelected(selected);
		this._setState({value: INDETERMINATE});
	}

	_clearSelected() {
		this._setSelected([]);
	}

	_clearChildren() {
		const children = this._getChildren();
		this._ignoreChildStateChange = true;
		try {
			for (let i = 0; i < children.length; i++) {
				children[i].clear();
			}
		} finally {
			this._ignoreChildStateChange = false;
		}
	}

	_getChildren() {
		if (this._children == null) {
			const model = this.model;
			if (model && model.children) {
				this.$.hasChildrenDomIf.render();
				this.shadowRoot.querySelector("#childrenDomRepeat").render();
				this._children = this.shadowRoot.querySelectorAll("tricomp-hierarchy-checkbox-item");
			} else {
				this._children = [];
			}
		}
		return this._children;
	}

	_handleModelChanges(model) {
		this._children = null;
	}

	static get importMeta() {
		return getModuleUrl("trioutlook-room-reservation/components/location-hierarchy/tricomp-hierarchy-checkbox-item.js");
	}
}

window.customElements.define(TricompHierarchyCheckboxItem.is, TricompHierarchyCheckboxItem);