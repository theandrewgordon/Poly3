/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";

import "../@polymer/iron-dropdown/iron-dropdown.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/iron-input/iron-input.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../@polymer/paper-input/paper-input-container.js";
import "../@polymer/paper-item/paper-item.js";
import "../@polymer/paper-listbox/paper-listbox.js";
import "../triplat-word-highlight/triplat-word-highlight.js";

class InputSearchComp extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
	static get is() { return "tricomp-search-input"; }

	static get template() {
		return html`
			<style include="tristyles-theme">

				paper-input-container {
					border: 1px solid var(--ibm-gray-10);
					border-bottom: 0;
					color: black;
					padding-bottom: 0px;
					padding-top: 1px;
					background-color: white;
					@apply --tricomp-search-field-paper-input-container;
					--paper-input-container-underline: {
 						border-bottom: 2px solid var(--ibm-gray-30);
	 				}
					--paper-input-container-underline-focus: {
 						border-bottom: 2px solid var(--ibm-blue-50);
	 				}
				}

				paper-input-container iron-icon {
					--iron-icon-width: 20px;
					--iron-icon-height: 20px;
					--iron-icon-fill-color: var(--tri-secondary-color);
				}

				paper-input-container iron-icon.icon-clear {
					cursor: pointer;
					margin: 10px 10px 10px 15px;
				}

				paper-input-container input {
					font-family: var(--tri-font-family);
					font-size: 14px;
					height: 30px;
					padding-left: 9px;
				}

				paper-input-container input::-webkit-contacts-auto-fill-button {
					display: none !important;
					pointer-events: none;
					position: absolute;
					right: 0;
					visibility: hidden;
				}

				paper-input-container input::-ms-clear {
					display: none;
				}

				#operator {
					@apply --layout-horizontal;
				}

				:host(:not([small-layout])) #operator {
					margin: 5px 0 5px 10px;
				}

				:host([small-layout]) #operator {
					margin: 5px 0 5px 5px;
				}

				#contains {
					@apply --layout-vertical;
					@apply --layout-center-justified;
					font-size: 14px;
					font-family: var(--tri-font-family);
					margin-right: 1px;
					padding: 5px;
					height: 20px;
					background-color: var(--tri-primary-content-accent-color);
				}

				#equalTo {
					margin-right: 1px;
					padding: 5px;
					background-color: var(--tri-primary-content-accent-color);
					flex-shrink: 0;
				}

				#selectedValue {
					@apply --layout-vertical;
					@apply --layout-center-justified;
					font-size: 14px;
					font-family: var(--tri-font-family);
					height: 30px;
					padding: 0 10px 0 9px;
					background-color: var(--tri-primary-content-accent-color);
					min-width: 0;
					cursor: pointer;
				}

				iron-input {
					@apply --layout-horizontal;
					@apply --layout-flex;
				}

				input {
					@apply --paper-input-container-shared-input-style;
				}

				::placeholder {
					font-style: italic;
					color: var(--tri-secondary-color);
					font-family: var(--tri-font-family);
					font-size: 14px;
				}

				#searchDropdown {
					padding: 0;
					box-shadow: 0 0 4px 2px rgba(0,0,0,0.3);
					border: 1px solid var(--tri-primary-content-accent-color);
					border-bottom: 0px;
					border-top: 0px;
				}

				paper-listbox {
					padding: 0;
				}

				paper-item {
					cursor: pointer;
					padding: 10px;
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
					min-height: 35px;
					font-family: var(--tri-font-family);
					font-size: 14px;
					--paper-item-disabled-color: black;
				}

				paper-item:hover {
					background-color: #DEEEFE;
				}

				.value-container {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

			</style>

			<paper-input-container id="searchField" no-label-float>
				<div id="operator" slot="prefix">
					<div id="contains" hidden\$="[[searchWithDropdown]]">Contains</div>
					<iron-icon id="equalTo" icon="ibm-glyphs:equals" hidden\$="[[!searchWithDropdown]]"></iron-icon>
					<div id="selectedValue" hidden\$="[[!_handleInputDisplay(selectedItem)]]" tabindex="0" aria-label\$="[[value]]" on-tap="_handleSelectedValueTapped">
						<span class="value-container">{{value}}</span>
					</div>
				</div>
				<iron-input bind-value="{{value}}" slot="input">
					<input id="searchInput" hidden\$="[[_handleInputDisplay(selectedItem)]]" placeholder="[[placeholder]]">
				</iron-input>
				<iron-icon class="icon-clear" icon="ibm-glyphs:clear-input" on-tap="_clearSearch" hidden\$="[[_hideSearchClearBtn(value)]]" tabindex="0" aria-label="clear search" on-keypress="_clearSearch" slot="suffix"></iron-icon>
			</paper-input-container>

			<iron-dropdown id="searchDropdown" 
				allow-outside-scroll 
				dynamic-align 
				hidden\$="{{!searchWithDropdown}}" 
				horizontal-align="left" 
				no-auto-focus
				no-cancel-on-outside-click="[[_noCancelOnOutsideClick]]"
				no-overlap 
				opened="{{_opened}}" 
				fit-into="[[scrollContainer]]" 
				position-target="[[_targetElement]]" 
				vertical-align="top">
				<paper-listbox attr-for-selected="record-id" selected="{{selectedItemHighlight}}" slot="dropdown-content">
					<template is="dom-if" if="[[_showList]]">
						<template is="dom-repeat" items="[[searchResults]]">
							<paper-item name="[[_computeItemValue(item)]]" record-id="[[item._id]]" item="[[item]]" on-tap="_handleDropdownItemTapped">
								<triplat-word-highlight value="[[_computeItemValue(item)]]" search-value="[[value]]"></triplat-word-highlight>
							</paper-item>
						</template>
					</template>
					<template is="dom-if" if="[[_showNoMessage]]">
						<paper-item disabled>No matches found</paper-item>
					</template>
					<template is="dom-if" if="[[selectedItem]]">
						<paper-item on-tap="_closeDropdown">
							<triplat-word-highlight value="[[value]]" search-value="[[value]]"></triplat-word-highlight>
						</paper-item>
					</template>
				</paper-listbox>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {

			attrToDisplay: {
				type: String,
			},

			_opened: Boolean,

			online: {
				type: Boolean
			},

			placeholder: {
				type: String
			},

			recordId: {
				type: String,
				notify: true,
				value: ""
			},

			_showNoMessage: Boolean,
			_showList: Boolean,

			scannedData: {
				type: String,
				notify: true
			},

			scrollContainer: Object,

			smallLayout: {
				type: Boolean,
				reflectToAttribute: true
			},

			selectedItemHighlight: {
				type: String
			},

			searchResults: {
				type: Array,
				value: function () {
					return [];
				}
			},

			searchWithDropdown: {
				type: Boolean,
				value: true
			},

			selectedItem: {
				type: Object,
				notify: true
			},

			selectedSearchType: String,

			_targetElement: {
				type: Object
			},

			value: {
				type: String,
				notify: true
			},
			
			_searchResultItems: {
				type: Array,
				value: []
			},

			_isCodeScanned: {
				type: Boolean,
				value: true
			},
			
			_noCancelOnOutsideClick:{
				type: Boolean,
				value: true
			}
		};
	}

	static get observers() {
		return [
			"_toggleDropdown(value)",
			"_handleDropdown(searchResults)",
			"_setInputFromScannerCode(scannedData)",
			"_setNoCancelOnOutsideClick(selectedItem)"
		]
	}

	ready() {
		super.ready();
		this.set("_targetElement", this.$.searchField);
		this.$.searchField.shadowRoot.querySelector(".prefix").style.minWidth = "0";
	}
 
	constructor() {
		super();
		this._onResizeListener = this._handleOnResize.bind(this);
		this._handleOnScrollListener = this._handleOnScroll.bind(this);
	}
 
	connectedCallback() { 
		super.connectedCallback();
		this.addEventListener("iron-resize", this._onResizeListener);
	}

	disconnectedCallback() { 
		super.disconnectedCallback(); 
		this.addEventListener("iron-resize", this._onResizeListener);
	}

	notifyDropdownResize() {
		this._handleDropdownClose(this.scrollContainer);
		this.$.searchDropdown.notifyResize();
	}

	_toggleDropdown(searchValue) {
		if (searchValue != "" && this.online) {
			if(this.scannedData == "" && this.selectedSearchType != "task") {
				this._openDropdown();
			}
		} else {
			this._closeDropdown();
			this.set("selectedItem", null);
			this.set("_showList", null);
			this.set("_showNoMessage", null);
		}
	}

	_openDropdown() {
		this.$.searchDropdown.hidden = false;
		this.$.searchDropdown.open();
		this._setSameTargetWidth();
		this.scrollContainer.addEventListener(
			"scroll", 
			this._handleOnScrollListener,
			{
				capture: true,
				passive: true,
			}
		);
	}

	_handleOnScroll(e) {
		this._handleDropdownClose(e.target);
	}

	_handleDropdownClose(scrollContainer) {
		if(scrollContainer && this.value) {
			let searchFieldRect = this.$.searchField.getBoundingClientRect();
			let scrollContainerRect = scrollContainer.getBoundingClientRect();
			if (searchFieldRect.top < scrollContainerRect.top || searchFieldRect.bottom > scrollContainerRect.bottom) {
				this._closeDropdown();
			} else {
				if(!this.selectedItem)
					this._openDropdown();
			}
		}
	}

	_handleOnResize() {
		this._handleDropdownClose(this.scrollContainer);
		this._setSameTargetWidth();
	}

	_setSameTargetWidth() { 
		if (this._targetElement && this._opened) {
			const targetRect = this._targetElement.getBoundingClientRect();
			const targetWidth = targetRect.width;
			this.$.searchDropdown.style.width = targetWidth-2 + "px";
		}
	}

	_handleDropdown(list) {
		if(list) {	
			this.set("_showList", (list.length > 0));
			this.set("_showNoMessage", !(list.length > 0));
			setTimeout(() => { this.notifyResize(); }, 300);
			if(this.scannedData) {
				let index = list.findIndex(item => item.barCode == this.scannedData);
				if(list && list.length > 0 && index > -1) {
					if (list.length == 1) {
						this.set("selectedItem", list[index]);
						this.$.searchDropdown.hidden = true;
						this.set("value", this._computeItemValue(list[index]));
						this.set("recordId", list[index]._id);
					} else if (list.length > 1 && this._isCodeScanned == true) {
						this.set("selectedItemHighlight", null);
						this._openDropdown();
					}
				} else if (index == -1) {
					this._openDropdown();
				}
			}
		}
	}

	_setInputFromScannerCode(scannedData) {
		this._isCodeScanned = true;
		if(this.selectedItem)
			this.recordId = "";
		this.set("value", scannedData);
	}
	
	_computeItemValue(item) {
		return (item[this.attrToDisplay] == undefined) ? "" : item[this.attrToDisplay];
	}

	_handleDropdownItemTapped(e) {
		this._isCodeScanned = false;
		this.set("recordId", e.model.item._id);
		this.set("selectedItem", e.model.item);
		this.set("value", this._computeItemValue(e.model.item));
		this._closeDropdown();
	}

	_handleInputDisplay(item) {
		let id = item ? item._id : "";
		return (id != "");
	}

	_hideSearchClearBtn(value) {
		return (value == "") ? true : false;
	}

	clearSearch() {
		this.set("recordId", "");
		this.set("selectedItem", null);
		this.set("value", "");
		this.set("scannedData", "");
		this.set("selectedItemHighlight", null);
		this.set("_showList", null);
		this.set("_showNoMessage", null)
	}

	_clearSearch(e) {
		e.stopPropagation();
		this._focusSearchField();
		this.clearSearch();
	}

	_focusSearchField() {
		this.$.searchInput.focus();
	}

	_handleSelectedValueTapped(e) {
		e.stopPropagation();
		this._openDropdown();
		setTimeout(() => { this.notifyResize(); }, 300);
		this.set("_showNoMessage", false);
		this.set("_showList", false);
	}

	_closeDropdown() {
		this.$.searchDropdown.close();
	}

	_setNoCancelOnOutsideClick(selectedItem) {
		if (selectedItem) {
			this.set("_noCancelOnOutsideClick", false);
		} else {
			this.set("_noCancelOnOutsideClick", true);
		}
	}
}

window.customElements.define(InputSearchComp.is, InputSearchComp);