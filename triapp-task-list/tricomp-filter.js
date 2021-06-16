/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import "../@polymer/iron-icon/iron-icon.js";
import "../@polymer/iron-selector/iron-selector.js";
import "../@polymer/paper-button/paper-button.js";

import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

import "./tristyles-task-list.js";

Polymer({
	_template: html`
		<style include="tristyles-theme task-list-filter">

				:host {
					display: block;
				}

				.desktop-container {
					padding: 0px 20px 0px 20px;
					@apply --tricomp-filter-desktop-container;
				}

				.desktop-selector {
					@apply --layout-horizontal;
				}

				.mobile-container {
					@apply --layout-vertical;
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
					border-top: 1px solid var(--tri-primary-content-accent-color);
				}

				.mobile-selector {
					@apply --layout-vertical;
				}

				.filter-label {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 10px;
					@apply --tricomp-filter-mobile-filter-label;
				}

				.filter-label:hover {
					cursor: pointer;
				}
			
		</style>

		<template is="dom-if" if="[[!smallLayout]]">
			<div class="desktop-container">
				<iron-selector class="desktop-selector" attr-for-selected="name" selected="{{selected}}" on-iron-select="_handleFilterSelected" role="listbox" aria-label="Filter by" tabindex="0">
					<slot name="bar"></slot>
				</iron-selector>
			</div>
		</template>

		<template is="dom-if" if="[[smallLayout]]">
			<div class="mobile-container">
				<div class="filter-label" on-tap="_toggleDisplayMobileSelector">
					<span>Filter by:</span>
					<paper-button class="filter-button">
						<div class="filter-button-content">
							<span class="selected-filter-label tri-link">[[_selectedFilterLabel]]</span>
							<iron-icon class="tri-link" icon="[[_dropdownArrowDirectionIcon]]"></iron-icon>
						</div>
					</paper-button>
				</div>
				<iron-selector class="mobile-selector" attr-for-selected="name" selected="{{selected}}" on-iron-activate="_handleDropdownActivate" on-iron-select="_handleFilterSelected" hidden="[[!_showMobileSelector]]">
					<slot name="dropdown"></slot>
				</iron-selector>
			</div>
		</template>
	`,

	is: "tricomp-filter",
	behaviors: [
		TriDirBehavior
	],

	properties: {
		selected: {
			type: String,
			notify: true
		},
		_selectedFilterLabel: String,
		_showMobileSelector: {
			type: Boolean,
			value: false
		},
		_dropdownArrowDirectionIcon: {
			type: String,
			value: "icons:arrow-drop-down"
		},

		smallLayout: {
			type: Boolean,
			notify: true
		}
	},

	observers: [
		'_closeMobileSelector(smallLayout)'
	],

	_toggleDisplayMobileSelector: function() {
		this.set('_showMobileSelector', !this._showMobileSelector);
		var dropdownArrowDirectionIcon = this._dropdownArrowDirectionIcon.endsWith("down") ? "icons:arrow-drop-up" : "icons:arrow-drop-down";
		this.set('_dropdownArrowDirectionIcon', dropdownArrowDirectionIcon);
	},

	_handleFilterSelected: function(e) {
		e.stopPropagation();
		this.set('_selectedFilterLabel', e.detail.item.label);
	},

	_closeMobileSelector: function(smallLayout) {
		if (this._showMobileSelector) {
			this._toggleDisplayMobileSelector();
		}
	},

	_handleDropdownActivate: function() {
		this._closeMobileSelector();
	}
});