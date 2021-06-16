/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/paper-item/paper-item.js";
import "../@polymer/paper-listbox/paper-listbox.js";
import "../@polymer/paper-menu-button/paper-menu-button.js";

import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriPlatAccessibilityBehavior } from "../triplat-accessibility-behavior/triplat-accessibility-behavior.js";

import "./tricomp-dropdown-item.js";
import "./tristyles-task-list.js";

Polymer({
	_template: html`
		<style include="tristyles-theme task-list-filter">

				:host {
					display: block;
					background-color: var(--ibm-neutral-2);
				}

				.container {
					@apply --layout-vertical;
				}

				.sort-bar {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				:host(:not([small-layout])) .sort-bar {
					padding: 15px 20px 0px 20px;
				}

				:host([small-layout]) .sort-bar {
					padding: 10px;
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
				}

				.sort-button {
					background: transparent !important;
					margin: 0 !important;
					padding: 0 !important;
					text-align: left !important;
				}
				:host([small-layout]) .sort-button {
					display: block !important;
				}
				:host([dir="ltr"]) .sort-button {
					text-align: left !important;
				}
				:host([dir="rtl"]) .sort-button {
					text-align: right !important;
				}

				.sort-button-content {
					@apply --layout-horizontal;
					@apply --layout-center;
				}
				:host([small-layout]) .sort-button-content {
					@apply --layout-flex;
				}

				:host([dir="ltr"]) .selected-sort-label {
					padding-left: 10px;
				}
				:host([dir="rtl"]) .selected-sort-label {
					padding-right: 10px;
				}

				:host([small-layout]) .selected-sort-label {
					@apply --layout-flex;
				}

				paper-listbox {
					--paper-listbox: {
						padding: 0;
					}
				}

				paper-item {
					@apply --tri-font-family;
					cursor: pointer;
					font-size: 14px;
					font-weight: normal;
					line-height: 17px;
					white-space: nowrap;
					--paper-item-min-height: 0;
					--paper-item-selected-weight: normal;
					--paper-item: {
						padding: 10px;
					};
				}

				:host(:not([small-layout])) paper-item {
					background-color: white;
					color: var(--tri-primary-color);
				}

				:host(:not([small-layout])) paper-item.iron-selected {
					background-color: var(--tri-primary-color-10) !important;
				}
			
		</style>

		<div class="container">
			<div class="sort-bar">
				<span>Sort by:</span>
				<paper-menu-button opened="{{_dropdownOpened}}" allow-outside-scroll="" restore-focus-on-close="" horizontal-align="right">
					<paper-button id="sortButton" class="dropdown-trigger sort-button" aria-label="Sort by" slot="dropdown-trigger">
						<div class="sort-button-content">
							<span class="tri-link selected-sort-label">[[_sortByLabel]]</span>
							<iron-icon class="tri-link" icon="[[_dropdownArrowDirectionIcon]]"></iron-icon>
						</div>
					</paper-button>
					<paper-listbox class="dropdown-content" attr-for-selected="name" selected="{{selected}}" hidden="[[smallLayout]]" on-iron-select="_handleDropdownItemTapped" slot="dropdown-content">
						<paper-item name="priority">Priority</paper-item>
						<paper-item name="plannedStart">Planned Start</paper-item>
						<paper-item name="status">Status</paper-item>
						<paper-item name="location" hidden\$="[[ignoreLocation]]">Location</paper-item>
						<paper-item name="newest">Newest</paper-item>
					</paper-listbox>
				</paper-menu-button>
			</div>
			<div hidden\$="[[!smallLayout]]">
				<iron-selector class="dropdown-content" attr-for-selected="name" selected="{{selected}}" on-iron-select="_handleDropdownItemTapped" hidden="[[!_dropdownOpened]]">
					<tricomp-dropdown-item name="priority" label="Priority" small-layout ="[[smallLayout]]">Priority</tricomp-dropdown-item>
					<tricomp-dropdown-item name="plannedStart" label="Planned Start" small-layout ="[[smallLayout]]">Planned Start</tricomp-dropdown-item>
					<tricomp-dropdown-item name="status" label="Status" small-layout ="[[smallLayout]]" >Status</tricomp-dropdown-item>
					<tricomp-dropdown-item name="location" label="Location" small-layout ="[[smallLayout]]" hidden\$="[[ignoreLocation]]">Location</tricomp-dropdown-item>
					<tricomp-dropdown-item name="newest" label="Newest" small-layout ="[[smallLayout]]">Newest</tricomp-dropdown-item>
				</iron-selector>
			</div>
		</div>
	`,

	is: "tricomp-task-list-sort",

	behaviors: [
		TriPlatAccessibilityBehavior,
		TriDirBehavior
	],

	properties: {
		ignoreLocation: {
			type: Boolean,
			value: false
		},

		selected: {
			type: String,
			value: "priority",
			notify: true
		},
		_sortByLabel: String,
		_dropdownOpened: {
			type: Boolean,
			value: false,
			observer: '_toggleDropdownIcon'
		},
		_dropdownArrowDirectionIcon: {
			type: String,
			value: "icons:arrow-drop-down"
		},

		smallLayout: {
			type: Boolean,
			reflectToAttribute: true
		}
	},

	_toggleDropdownIcon: function (value) {
		var dropdownArrowDirectionIcon = value ? "icons:arrow-drop-up" : "icons:arrow-drop-down";
		this.set('_dropdownArrowDirectionIcon', dropdownArrowDirectionIcon);
		this.setAriaProperty(this.$.sortButton, value, "expanded");
	},

	_handleDropdownItemTapped: function (e) {
		this.fire("task-sort-selected", e.detail.item.getAttribute("name"));
		this.set('_sortByLabel', e.detail.item.innerText);
	}
});