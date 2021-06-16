/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatAccessibilityBehavior } from "../triplat-accessibility-behavior/triplat-accessibility-behavior.js";
import "../triplat-icon/ibm-icons.js";
import "../@polymer/paper-item/paper-item.js";
import "../@polymer/paper-listbox/paper-listbox.js";
import "../@polymer/paper-menu-button/paper-menu-button.js";
import "../@polymer/iron-icon/iron-icon.js";
import "./tricomp-priority-dropdown-item.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.dropdown-container {
					@apply --layout-horizontal;
					@apply --layout-center;
				}
				:host([small-layout]) .dropdown-container {
					padding: 10px 15px;
				}

				paper-menu-button {
					padding: 0;
				}

				:host([small-layout]) paper-menu-button {
					@apply --layout-flex;
				}

				.dropdown-button {
					background: transparent !important;
					margin: 0 !important;
					min-width: auto !important;
					padding: 0 !important;
					text-align: left !important;
				}
				:host([small-layout]) .dropdown-button {
					display: block !important;
				}

				.dropdown {
					@apply --layout-horizontal;
					@apply --layout-center;
				}
				:host([small-layout]) .dropdown {
					@apply --layout-flex;
				}
				
				.dropdown-label {
					color: var(--ibm-gray-70) !important;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}

				:host([dir="ltr"]) .dropdown-label {
					padding-right: 5px;
				}
				:host([dir="rtl"]) .dropdown-label {
					padding-left: 5px;
				}
				:host([small-layout]) .selected-value {
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

				iron-icon.priority-icon {
					--iron-icon-height: 15px;
					--iron-icon-width: 15px;
				}

				:host([small-layout]) iron-icon.priority-icon {
					color: white;
				}

				:host([dir="ltr"]) iron-icon.priority-icon {
					margin-right: 6px;
				}

				:host([dir="rtl"]) iron-icon.priority-icon {
					margin-left: 6px;
				}

				:host([dir="ltr"]) .none-icon-margin {
					margin-left: 21px;
				}

				:host([dir="rtl"]) .none-icon-margin {
					margin-right: 21px;
				}

			
		</style>

		<div class="container">
			<div class="dropdown-container">
				<label class="dropdown-label">[[title]]:</label>
				<slot name="selected-icon"></slot>
				<template is="dom-if" if="[[readOnly]]">
					<span class="selected-value">[[_computeSelectedValue(itemSelected)]]</span>
				</template>
				<template is="dom-if" if="[[!readOnly]]">
					<paper-menu-button opened="{{_dropdownOpened}}" allow-outside-scroll="" restore-focus-on-close="" horizontal-align="right">
						<paper-button id="sortButton" class="dropdown-trigger dropdown-button" aria-label\$="[[title]]" slot="dropdown-trigger">
							<div class="tri-link dropdown">
								<span class="selected-value">[[_computeSelectedValue(itemSelected)]]</span>
								<iron-icon class="tri-link" icon="[[_dropdownArrowDirectionIcon]]"></iron-icon>
							</div>
						</paper-button>
						<template is="dom-if" if="[[!smallLayout]]" restamp="">
							<paper-listbox class="dropdown-content" attr-for-selected="label" selected="[[itemSelected.value]]" slot="dropdown-content">
								<paper-item label="[[_noneLabel]]" on-tap="_handleDropdownItemTapped">
									<span class="none-icon-margin">[[_noneLabel]]</span>
								</paper-item>
								<template id="dropdownTemplate" is="dom-repeat" items="{{items}}">
									<paper-item label="[[item.value]]" on-tap="_handleDropdownItemTapped">
										<iron-icon icon="[[_computePriorityIconName(item.name)]]" class="priority-icon" style\$="[[_computePriorityIconColor(item.color)]]"></iron-icon> 
										<span>[[item.value]]</span>
									</paper-item>
								</template>
							</paper-listbox>
						</template>
					</paper-menu-button>
				</template>
				
			</div>

			<template is="dom-if" if="[[smallLayout]]" restamp="">
				<iron-selector class="dropdown-content" attr-for-selected="label" selected="[[itemSelected.value]]" hidden="[[!_dropdownOpened]]">
					<tricomp-priority-dropdown-item on-tap="_handleDropdownItemTapped" small-layout="{{smallLayout}}">
						<span class="none-icon-margin">[[_noneLabel]]</span>
					</tricomp-priority-dropdown-item>
					<template id="dropdownTemplate" is="dom-repeat" items="{{items}}">
						<tricomp-priority-dropdown-item on-tap="_handleDropdownItemTapped" small-layout="{{smallLayout}}">
							<iron-icon icon="[[_computePriorityIconName(item.name)]]" class="priority-icon"></iron-icon> 
							<span>[[item.value]]</span>
						</tricomp-priority-dropdown-item>
					</template>
				</iron-selector>
			</template>
		</div>
	`,

    is: "tricomp-priority-dropdown",

    behaviors: [
	    TriPlatAccessibilityBehavior,
	    TriDirBehavior
	],

    properties: {
		/*
		 * Title text.
		 */
		title: String,

		/*
		 * Items to display in the dropdown.
		 */
		items: Array,

		/*
		 * Item selected object - current item selected in the dropdown.
		 */
		itemSelected: Object,

		/*
		 * If true, the dropdown will not be available.
		 */
		readOnly: {
			type: Boolean,
			value: false
		},

		/*
		 * Indicate dropdown open state.
		 */
		_dropdownOpened: {
			type: Boolean,
			value: false,
			observer: '_toggleDropdownIcon'
		},

		/*
		 * Dropdown arrow icon.
		 */
		_dropdownArrowDirectionIcon: {
			type: String,
			value: "icons:arrow-drop-down"
		},

		_noneLabel: { 
			type: String, 
			value: function () { 
				var __dictionary__noneLabel = "None"; 
				return __dictionary__noneLabel;
			}
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_setSortButtonAria(readOnly, _dropdownOpened)"
	],

    /*
	 * Handle toggle dropdown icon.
	 */
	_toggleDropdownIcon: function(value) {
		var arrowIcon = value ? "icons:arrow-drop-up" : "icons:arrow-drop-down";
		this.set('_dropdownArrowDirectionIcon', arrowIcon);
	},

    /*
	 * Handle dropdown selection.
	 */
	_handleDropdownItemTapped: function(e) {
		e.stopPropagation();
		var model = this.$$("#dropdownTemplate").modelForElement(e.target);
		var item = (model) ? model.item : {name: "", value: this._noneLabel};

		this.set("itemSelected", item);
		this.fire("dropdown-item-selected", item);
		if(this.smallLayout)
			this.set("_dropdownOpened", false);
	},

    _computeSelectedValue: function(itemSelected) {
		var value = typeof itemSelected === 'object' ? itemSelected.value : itemSelected;
		return (value=="") ? this._noneLabel : value;
	},

    _setSortButtonAria: function(readOnly, dropdownOpened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		afterNextRender(this, function() {
			if (this.$$("#sortButton")) {
				this.setAriaProperty(this.$$("#sortButton"), dropdownOpened, "expanded");
			}
		});
	},

    _computePriorityIconName: function(priority) {
		var className = "priority-";
		if (priority && priority !== "") {
			className += priority.toLowerCase();
		} else {
			className = "";
		}
		return "ibm:" + className;
	},

    _computePriorityIconColor: function(color) {
		if (color) {
			return "color: " + color;
		}
	}
});