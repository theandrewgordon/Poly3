/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";

import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/paper-menu-button/paper-menu-button.js";
import "../@polymer/paper-radio-button/paper-radio-button.js"
import "../@polymer/paper-radio-group/paper-radio-group.js"

import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriPlatAccessibilityBehavior } from "../triplat-accessibility-behavior/triplat-accessibility-behavior.js";

import "./tricomp-code-scanner-buttons.js";
import "./tricomp-dropdown-item.js";
import "./tristyles-task-list.js";
import { TriroutesTaskList } from "./triroutes-task-list-base.js";

class SearchTypeComp extends mixinBehaviors([TriDirBehavior, TriPlatAccessibilityBehavior], PolymerElement) {
	static get is() { return "tricomp-search-type"; }

	static get template() {
		return html`
			<style include="tristyles-theme task-list-filter">

				.container {
					@apply --layout-vertical;
				}

				.filter-bar {
					@apply --layout-horizontal;
					@apply --layout-center;
					min-height: 45px;
				}

				:host([small-layout]) .filter-bar {
					margin: 15px 10px 0 10px;
				}

				#searchBy {
					font-size: 14px;
					color: var(--tri-primary-content-label-color);
				}

				paper-radio-group {
					padding-left: 5px;
				}

				paper-radio-button {
					--paper-radio-button-checked-color: var(--tri-primary-color-70);
					--paper-radio-button-unchecked-color: var(--ibm-gray-70);
					--paper-radio-button-label-color: var(--ibm-gray-70);
					--paper-radio-button-size: 24px;
				}

				paper-radio-button span {
					color: var(--tri-primary-content-label-color);
				}
				
				paper-radio-button[checked] span {
					font-family: var(--tri-font-family);
					color: #000000;
					font-weight: 400;
					font-size: 14px;
				}

				paper-radio-button span:hover {
					color: #000000;
				}

				#taskRadio {
					padding: 10px 10px 10px 5px;
				}

				.asset-location-radio {
					padding: 10px 10px 10px 20px;
				}

				.selected-filter-label {
					font-weight: 500;
					color: black;
				}

			</style>

			<div class="container">
				<div class="filter-bar">
					<span id="searchBy">Search by:</span>
					<paper-radio-group selected="{{selectedSearchType}}" hidden\$="[[smallLayout]]">
						<paper-radio-button name="task" id="taskRadio"><span>Task</span></paper-radio-button>
						<paper-radio-button name="asset" class="asset-location-radio"><span>Asset</span></paper-radio-button>
						<paper-radio-button name="location" class="asset-location-radio"><span>Location</span></paper-radio-button>
					</paper-radio-group>
					<paper-menu-button hidden\$="[[!smallLayout]]" opened="{{_dropdownOpened}}" allow-outside-scroll restore-focus-on-close horizontal-align="right">
						<paper-button id="filterButton" class="filter-button" aria-label="filter by" slot="dropdown-trigger">
							<div class="filter-button-content">
								<span class="selected-filter-label">[[selectedTypeLabel]]</span>
								<iron-icon class="tri-link" icon="[[_dropdownArrowDirectionIcon]]"></iron-icon>
							</div>
						</paper-button>
					</paper-menu-button>
					<template is="dom-if" if="[[smallLayout]]">
 						<tricomp-code-scanner-buttons
						 	disable-scanner="[[!searchWithDropdown]]"
							online="[[online]]"
							on-start-bar-code-scan="_startBarCodeScan"
							on-start-qr-code-scan="_startQrCodeScan">
							</tricomp-code-scanner-buttons>
 					</template>
				</div>
				<div hidden\$="[[!smallLayout]]">
					<iron-selector attr-for-selected="name" selected="{{selectedSearchType}}" on-iron-select="_handleDropdownItemTapped" hidden\$="[[!_dropdownOpened]]">
						<tricomp-dropdown-item name="task" label="Task" small-layout="[[smallLayout]]">Task</tricomp-dropdown-item>
						<tricomp-dropdown-item name="asset" label="Asset" small-layout="[[smallLayout]]">Asset</tricomp-dropdown-item>
						<tricomp-dropdown-item name="location" label="Location" small-layout="[[smallLayout]]">Location</tricomp-dropdown-item>
					</iron-selector>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {

			smallLayout: {
				type: Boolean,
				reflectToAttribute: true
			},

			_dropdownArrowDirectionIcon: {
				type: String,
				value: "icons:arrow-drop-down"
			},

			_dropdownOpened: {
				type: Boolean,
				value: false,
				observer: '_toggleDropdownIcon'
			},

			notifyDropdown: {
				type: Boolean,
				notify: true
			},

			online: {
				type: Boolean,
				notify: true
			},

			searchWithDropdown: {
				type: Boolean
			},

			selectedSearchType: {
				type: String,
				value: "task",
				notify: true
			},

			selectedTypeLabel: String

		};
	}

	_toggleDropdownIcon(value) {
		var dropdownArrowDirectionIcon = value ? "icons:arrow-drop-up" : "icons:arrow-drop-down";
		this.set('_dropdownArrowDirectionIcon', dropdownArrowDirectionIcon);
		this.notifyDropdown = (value) ? true :false;
		this.setAriaProperty(this.$.filterButton, value, "expanded");
	}

	_handleDropdownItemTapped(e) {
		this.set('selectedTypeLabel', e.detail.item.innerText);
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

window.customElements.define(SearchTypeComp.is, SearchTypeComp);