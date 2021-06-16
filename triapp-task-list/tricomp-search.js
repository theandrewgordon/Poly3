/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";

import "../@polymer/iron-flex-layout/iron-flex-layout.js";

import "./tricomp-code-scanner-buttons.js";
import "./tricomp-search-input.js";
import "./tricomp-search-type.js";
import { TriroutesTaskList } from "./triroutes-task-list-base.js";

class SearchComp extends PolymerElement {
	static get is() { return "tricomp-search"; }

	static get template() {
		return html`
			<style include="tristyles-theme">

				.search {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.search-type-container, .search-input-container {
					@apply --layout-horizontal;
					min-height: 45px;
				}

				:host([small-layout]) .search-input-container {
					margin: 0 10px 15px 10px;
					padding-top: 5px;
				}

				tricomp-search-type, tricomp-search-input {
					@apply --layout-flex;
				}

				tricomp-search-input {
					min-width: 0;
				}

			</style>

			<div class="search">
				<div class="search-type-container">
					<tricomp-search-type notify-dropdown="{{_notifyDropdown}}" 
						online="[[online]]" 
						search-with-dropdown="[[_searchWithDropdown]]" 
						selected-search-type="{{selectedSearchType}}" 
						small-layout="[[smallLayout]]"></tricomp-search-type>
				</div>
				<div class="search-input-container" hidden\$="[[hideInputContent]]">
					<tricomp-search-input id="searchInput" 
						attr-to-display="[[attrToDisplay]]" 
						online="[[online]]" 
						placeholder="[[_searchPlaceholder]]" 
						record-id="{{recordId}}" 
						scanned-data="{{scannedData}}" 
						scroll-container="[[scrollContainer]]" 
						search-results="[[searchResults]]" 
						search-with-dropdown="[[_searchWithDropdown]]" 
						selected-item="{{selectedItem}}" 
						selected-search-type="[[selectedSearchType]]" 
						small-layout="[[smallLayout]]" 
						value="{{value}}">
					</tricomp-search-input>
					<template is="dom-if" if="[[!smallLayout]]">
						<tricomp-code-scanner-buttons
							disable-scanner="[[!_searchWithDropdown]]"
							online="[[online]]"
							on-start-bar-code-scan="_startBarCodeScan"
							on-start-qr-code-scan="_startQrCodeScan">
							</tricomp-code-scanner-buttons>
					</template>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {

			attrToDisplay: {
				type: String
			},

			_notifyDropdown: {
				type: Boolean,
				observer: "onSearchInputPositionChanged"
			},

			online: {
				type: Boolean,
				notify: true
			},

			scannedData: {
				type: String,
				notify: true
			},

			scrollContainer: {
				type: Object,
				notify: true
			},

			hideInputContent: Boolean,

			smallLayout: {
				type: Boolean,
				reflectToAttribute: true
			},

			selectedSearchType: {
				type: String,
				notify: true
			},

			_searchWithDropdown: {
				type: Boolean
			},

			_searchPlaceholder: {
				type: String
			},

			searchResults: {
				type: Array
			},

			recordId: {
				type: String,
				notify: true
			},

			selectedItem: {
				type: Object,
				notify: true
			},

			value: {
				type: String,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			"onSelectFilterType(selectedSearchType, smallLayout)"
		]
	}

	onSearchInputPositionChanged() {
		this.$.searchInput.notifyDropdownResize();
	}

	onSelectFilterType(selectedSearchType, smallLayout) {
		this.set("_searchWithDropdown", selectedSearchType != "task");
		this.$.searchInput.clearSearch();

		var __dictionary__task = "Search tasks by name, ID, priority or status";
		var __dictionary__asset = "Search assets by name, ID or barcode number";
		var __dictionary__location = "Search locations by building name, floor name, room name, address, city or country";
		var __dictionary__task__smallscreen = "name, ID, priority or status";
		var __dictionary__asset__smallscreen = "name, ID or barcode";
		var __dictionary__location__smallscreen = "building, address, city or country";

		if (this.selectedSearchType == "task") {
			this.set("_searchPlaceholder", (!smallLayout) ? __dictionary__task : __dictionary__task__smallscreen);
		}
		else if (this.selectedSearchType == "asset") {
			this.set("attrToDisplay", "computedAsset");
			this.set("_searchPlaceholder", (!smallLayout) ? __dictionary__asset : __dictionary__asset__smallscreen);
		}
		else {
			this.set("attrToDisplay", "computedLocation");
			this.set("_searchPlaceholder", (!smallLayout) ? __dictionary__location : __dictionary__location__smallscreen);
		}
	}

	_startBarCodeScan(e) {
		e.stopPropagation();
		TriroutesTaskList.getInstance().navigateToBarCodeScan();
	}

	_startQrCodeScan(e) {
		e.stopPropagation();
		TriroutesTaskList.getInstance().navigateToQRCodeScan();
	}
}

window.customElements.define(SearchComp.is, SearchComp);