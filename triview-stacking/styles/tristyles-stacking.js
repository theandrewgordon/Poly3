/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

const stackingLayoutStyles = `
<dom-module id="stacking-layout-styles">
	<template>
		<style>

			triplat-route-selector, iron-pages {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			iron-pages {
				background-color: white;
			}

			iron-pages > * {
				@apply --layout-flex;
			}

			.sub-header-text {
				color: var(--ibm-gray-70);
				padding-top: 5px;
				@apply --layout-horizontal;
			}

			.id-org-divider {
				margin-left: 8px;
				margin-right: 8px;
			}

			.header-content {
				@apply --layout-flex;
			}

			.page-title {
				@apply --layout-flex;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(stackingLayoutStyles, "triview-stacking/styles/tristyles-stacking.js");

const stackingSharedStyles = `
<dom-module id="stacking-shared-styles">
	<template>
		<style>

			.page-title {
				font-weight: bold;
			}

			.table-container {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			:host .action-bar {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				font-size: 14px;
			}

			.label-actions {
				@apply --layout-horizontal;
				@apply --layout-justified;
				@apply --layout-center;
			}

			.noselect {
				-webkit-touch-callout: none; /* iOS Safari */
				-webkit-user-select: none; /* Safari */
				-moz-user-select: none; /* Firefox */
				user-select: none; /* Non-prefixed version, currently
									supported by Chrome and Opera */
			}

			.divider {
				height: 25px;
				min-width: 1px;
				background-color: var(--tri-primary-content-accent-color);
				margin: 0px 15px;
			}

			.secondary-text {
				color: var(--tri-secondary-color);
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}

			.toggle {
				margin: 1px 0px 0px 8px;
				-webkit-font-smoothing: auto;
				--paper-toggle-button-unchecked-ink-color: transparent;
				--paper-toggle-button-checked-ink-color: transparent;
				--paper-toggle-button-checked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-unchecked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-checked-button-color: var(--tri-primary-color);
				--paper-toggle-button-unchecked-button-color: var(--tri-primary-color);
				--paper-toggle-button-unchecked-bar: {
					width: 48px;
					height: 5px;
					border-radius: 0px;
					opacity: 0.5;
					margin: 5px 0px;
				};
				--paper-toggle-button-unchecked-button: {
					top: -4px;
					left: -2px;
					height: 24px;
					width: 24px;
					box-shadow: none;
				};
				--paper-toggle-button-checked-button: {
					-webkit-transform: translate(28px, 0); 
					transform: translate(28px, 0);
				};
				--paper-toggle-button-label-spacing: 20px;
			}

			:host([dir="rtl"]) .toggle {
				-webkit-transform: scaleX(-1);
				transform: scaleX(-1);
				margin: 1px 0px 0px 8px;
				-webkit-font-smoothing: auto;
				--paper-toggle-button-unchecked-ink-color: transparent;
				--paper-toggle-button-checked-ink-color: transparent;
				--paper-toggle-button-checked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-unchecked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-checked-button-color: var(--tri-primary-color);
				--paper-toggle-button-unchecked-button-color: var(--tri-primary-color);
				--paper-toggle-button-unchecked-bar: {
					width: 48px;
					height: 5px;
					border-radius: 0px;
					opacity: 0.5;
					margin: 5px 0px;
				};
				--paper-toggle-button-unchecked-button: {
					top: -4px;
					left: -14px;
					height: 24px;
					width: 24px;
					box-shadow: none;
				};
				--paper-toggle-button-checked-button: {
					-webkit-transform: translate(28px, 0); 
					transform: translate(28px, 0);
				};
				--paper-toggle-button-label-spacing: 20px;
			}

			.small-button {
				padding: 10px !important;
			}
			.small-button[secondary]:hover {
				padding: 12px !important;
			}

			paper-slider {
				--paper-slider-active-color: var(--tri-primary-color);
				--paper-slider-container-color: var(--ibm-gray-50);
				--paper-slider-knob-color:var(--tri-primary-color);
				--paper-slider-pin-color: var(--tri-primary-color);
				--paper-slider-knob-start-color: var(--tri-primary-color);
				--paper-slider-knob-start-border-color:  var(--tri-primary-color);
				--paper-slider-height: 4px;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(stackingSharedStyles, "triview-stacking/styles/tristyles-stacking.js");

const stackingPopupStyles = `
<dom-module id="stacking-popup-styles">
	<template>
		<style>

			triblock-popup[small-screen-width] {
				padding: 0px;
			}

			triblock-popup:not([small-screen-width]) {
				padding: 20px;
			}

			.popup-alert {
				border: 4px solid var(--tri-primary-content-accent-color);
				font-size: 14px;
				line-height: 20px;
				margin: 15px;
			}

			.popup-alert > * {
				margin-bottom: 20px;
			}

			.popup-alert .header-warning {
				color: var(--tri-major-warning-color);
				font-weight: 300;
				margin-top: 0px;
			}

			.popup-alert .header-general {
				color: var(--ibm-gray-70);
				font-weight: 300;
				margin-top: 0px;
			}

			.popup-alert a {
				cursor: pointer;
			}

			.popup-alert .footer {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				margin-bottom: 0px;
			}

			.conf-popup-alert .header-warning, .popup-alert .header-warning {
				color: var(--tri-major-warning-color);
				font-weight: 300;
				margin-top: 0px;
			}

			.conf-popup-alert .header-general, .popup-alert .header-general {
				color: var(--ibm-gray-70);
				font-weight: 300;
				margin-top: 0px;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(stackingPopupStyles, "triview-stacking/styles/tristyles-stacking.js");

const stackingDemandTableStyles = `
<dom-module id="stacking-demand-table-styles">
	<template>
		<style>

			.row {
				@apply --layout-horizontal;
			}

			.column-2 {
				@apply --layout-flex-2;
			}

			.column-1 {
				@apply --layout-flex;
			}

			.column-icon-expand {
				width: 28px;
			}

			.column-icon-delete {
				width: 38px;
			}

			.cell {
				@apply --layout-center;
				@apply --layout-horizontal;
				box-sizing: border-box;
				min-width: 0;
				overflow: hidden;
				padding: 20px 10px;
			}

			.cell > div,
			.cell > span {
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.table-body .cell {
				min-height: 60px;
			}

			.cell-expand-icon {
				padding: 10px 0 10px 10px;
			}

			.number-cell {
				@apply --layout-flex;
				text-align: right;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(stackingDemandTableStyles, "triview-stacking/styles/tristyles-stacking.js");

const stackingDropdownStyles = `
<dom-module id="stacking-dropdown-styles">
	<template>
		<style>

			.content {
				@apply --layout-vertical;
				padding: 15px 10px;
				background-color: var(--primary-background-color);
				border: 1px solid var(--ibm-gray-30);
				box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(stackingDropdownStyles, "triview-stacking/styles/tristyles-stacking.js");