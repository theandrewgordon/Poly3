/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatAccessibilityBehavior } from "../triplat-accessibility-behavior/triplat-accessibility-behavior.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/paper-item/paper-item.js";
import "../@polymer/paper-listbox/paper-listbox.js";
import "../@polymer/paper-menu-button/paper-menu-button.js";
import "../@polymer/iron-icon/iron-icon.js";
import { dom } from "../@polymer/polymer/lib/legacy/polymer.dom.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				paper-menu-button {
					padding: 0;

					--paper-menu-button-content: {
						@apply --shadow-none;
						border-radius: 0px;
					};
				}

				.icon-dropdown {
					transform: rotate(90deg);
					--iron-icon-height: 18px;
					--iron-icon-width: 18px;
				}

				:host([dir="ltr"]) .action-text {
					padding-right: 10px;
				}

				:host([dir="rtl"]) .action-text {
					padding-left: 10px;
				}

				.button-contents {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				paper-listbox {
					padding: 0;
				}
				
				.item-container:hover {
					background-color: var(--ibm-blue-70) !important;
				}

				.item-container {
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					align-items: flex-start !important;
					background-color: var(--ibm-blue-50) !important;
					color: white !important;
					cursor: pointer;
					font-size: 14px;
					font-weight: 400;
					min-height: auto;
					padding: 12px 15px !important;
					white-space: nowrap;
				}

				.hold-button {
					margin: 0 !important;
				}

				.hold-button:hover {
					background-color: var(--ibm-blue-70) !important;
					color: white !important;
				}

				:host([_dropdown-opened]) .hold-button {
					background-color: var(--ibm-blue-70) !important;
					color: white !important;
					border: 2px solid var(--ibm-blue-70) !important;
					padding: 10px 22px !important;
				}
			
		</style>

		<paper-menu-button opened="{{_dropdownOpened}}" allow-outside-scroll="" restore-focus-on-close="" vertical-align="top" vertical-offset="[[_getComputedMenuHeight(_dropdownOpened)]]" horizontal-align="right">
			<paper-button id="holdButton" class="dropdown-trigger hold-button" aria-label="Hold" secondary="" disabled="[[disabled]]" slot="dropdown-trigger">
				<div class="button-contents">
					<span class="action-text">Hold</span>
					<iron-icon class="icon-dropdown" icon="ibm-glyphs:expand-open"></iron-icon>
				</div>
			</paper-button>
			<paper-listbox class="dropdown-content" attr-for-selected="name" on-iron-select="_handleDropdownItemTapped" slot="dropdown-content">
				<template id="dropdownTemplate" is="dom-repeat" items="{{_holdOptions}}">
					<paper-item class="item-container" name="[[item.name]]">[[item.value]]</paper-item>
				</template>
			</paper-listbox>
		</paper-menu-button>
	`,

    is: "tricomp-hold-dropdown-selector",
    behaviors: [TriPlatAccessibilityBehavior, TriDirBehavior],

    properties: {
		disabled: Boolean,

		_holdOptions: {
			type: Array
		},

		_dropdownOpened: {
			type: Boolean,
			reflectToAttribute: true,
			value: false,
			observer: "_observeDropdownOpened"
		}
	},

    attached: function() {
		var __dictionary__holdForParts = "Hold for Parts";
		var __dictionary__holdPerRequester = "Hold per Requester";
		var holdOptions = [];
		holdOptions.push({name: "holdForParts", value: __dictionary__holdForParts});
		holdOptions.push({name: "holdPerRequester", value: __dictionary__holdPerRequester});
		this.set('_holdOptions', holdOptions);

	},

    _handleDropdownItemTapped: function(e) {
		var selected = e.detail.item.name;
		if(selected) {
			this.fire('hold-dropdown-selected', {holdOption: selected})
		}
	},

    _observeDropdownOpened: function(value) {
		this.setAriaProperty(this.$.holdButton, value, "expanded");
	},

    _getComputedMenuHeight: function(dropdownOpened) {
		if (dropdownOpened) {
			let menu = dom(this.root).querySelector("paper-menu-button");
			return menu.offsetHeight;
		} else {
			return 0;
		}
	}
});