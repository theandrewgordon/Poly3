/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { addDomStyleModule } from "../tricore-util/tricore-util.js";

const workTaskSharedAppLayoutStyles = `
<dom-module id="work-task-shared-app-layout-styles">
	<template>
		<style>

			triplat-route-selector, iron-pages, iron-pages > div, iron-selector {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			iron-pages > *, iron-pages > div > * {
				@apply --layout-flex;
			}
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(
    workTaskSharedAppLayoutStyles,
	"triview-work-task/tristyles-work-task-app.js"
);

const workTaskSharedPageStyles = `
<dom-module id="work-task-shared-page-styles">
	<template>
		<style>

			.divider {
				background-color: var(--tri-primary-content-accent-color);
				min-width: 1px;
			}

			:host .action-bar {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				font-size: 14px;
			}

			:host([small-layout]) .action-bar {
				background-color: var(--tri-footer-background-color);
				color: var(--tri-footer-color);
				padding: 5px;
				@apply --layout-center-center;
				@apply --layout-fixed-bottom;
				z-index: 2;
			}

			.secondary-text {
				color: var(--ibm-gray-50);
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}

			.toggle {
				margin: 1px 0px 0px 10px;
				-webkit-font-smoothing: auto;
				--paper-toggle-button-unchecked-ink-color: transparent;
				--paper-toggle-button-checked-ink-color: transparent;
				--paper-toggle-button-checked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-unchecked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-checked-button-color: var(--tri-primary-color);
				--paper-toggle-button-unchecked-bar: {
					width: 45px;
					height: 5px;
					border-radius: 0px;
					opacity: 0.5;
					margin: 5px 0px;
				};
				--paper-toggle-button-unchecked-button: {
					top: -6px;
					height: 24px;
					width: 24px;
					border: 2px solid var(--tri-primary-color);
					box-shadow: none;
				};
				--paper-toggle-button-checked-button: {
					-webkit-transform: translate(20px, 0); 
					transform: translate(20px, 0);
				};
				--paper-toggle-button-label-spacing: 20px;
			}

			:host([dir="rtl"]) .toggle {
				-webkit-transform: scaleX(-1);
				transform: scaleX(-1);
				margin: 1px 0px 0px 10px;
				-webkit-font-smoothing: auto;
				--paper-toggle-button-unchecked-ink-color: transparent;
				--paper-toggle-button-checked-ink-color: transparent;
				--paper-toggle-button-checked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-unchecked-bar-color: var(--ibm-gray-90);
				--paper-toggle-button-checked-button-color: var(--tri-primary-color);
				--paper-toggle-button-unchecked-bar: {
					width: 45px;
					height: 5px;
					border-radius: 0px;
					opacity: 0.5;
					margin: 5px 0px;
				};
				--paper-toggle-button-unchecked-button: {
					top: -6px;
					left: -10px;
					height: 24px;
					width: 24px;
					border: 2px solid var(--tri-primary-color);
					box-shadow: none;
				};
				--paper-toggle-button-checked-button: {
					-webkit-transform: translate(20px, 0); 
					transform: translate(20px, 0);
				};
				--paper-toggle-button-label-spacing: 20px;
			}

			.toggle[disabled]:not([checked]) {
				--paper-toggle-button-unchecked-button: {
					top: -6px;
					height: 24px;
					width: 24px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: 2px solid var(--ibm-gray-10);
					opacity: 1;
					box-shadow: none;
				};
			}

			:host([dir="rtl"]) .toggle[disabled]:not([checked]) {
				--paper-toggle-button-unchecked-button: {
					top: -6px;
					left: -10px;
					height: 24px;
					width: 24px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: 2px solid var(--ibm-gray-10);
					opacity: 1;
					box-shadow: none;
				};
			}

			.toggle[disabled][checked] {
				--paper-toggle-button-checked-button-color: var(--ibm-cool-neutral-2);
				--paper-toggle-button-unchecked-button: {
					top: -8px;
					height: 32px;
					width: 32px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: none;
					box-shadow: none;
					-webkit-transform: translate(20px, 0) !important; 
					transform: translate(20px, 0) !important;
					background-image: url("ready-disabled.svg");
					background-size: contain;
				};
			}

			:host([dir="rtl"]) .toggle[disabled][checked] {
				--paper-toggle-button-checked-button-color: var(--ibm-cool-neutral-2);
				--paper-toggle-button-unchecked-button: {
					top: -8px;
					left: -10px;
					height: 32px;
					width: 32px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: none;
					box-shadow: none;
					-webkit-transform: translate(20px, 0) !important; 
					transform: translate(20px, 0) !important;
					background-image: url("ready-disabled.svg");
					background-size: contain;
				};
			}

			.toggle-step {
				--paper-toggle-button-checked-button-color: white;
				--paper-toggle-button-checked-button: {
					top: -8px;
					height: 32px;
					width: 32px;
					border: none;
					-webkit-transform: translate(20px, 0) !important; 
					transform: translate(20px, 0) !important;
					background-image: url("ready.svg");
					background-size: contain;
				};
			}

			:host([dir="rtl"]) .toggle-step {
				--paper-toggle-button-checked-button-color: white;
				--paper-toggle-button-checked-button: {
					top: -8px;
					left: -10px;
					height: 32px;
					width: 32px;
					border: none;
					-webkit-transform: translate(20px, 0) !important; 
					transform: translate(20px, 0) !important;
					background-image: url("ready.svg");
					background-size: contain;
				};
			}

			.hide-toggle {
				--paper-toggle-button-checked-button: {
					top: -6px;
					height: 28px;
					width: 28px;
					border: none;
					background-color: var(--tri-primary-color) !important;
					-webkit-transform: translate(20px, 0) !important; 
					transform: translate(20px, 0) !important;
				};
			}

			:host([dir="rtl"]) .hide-toggle {
				--paper-toggle-button-checked-button: {
					top: -6px;
					left: -10px;
					height: 28px;
					width: 28px;
					border: none;
					background-color: var(--tri-primary-color) !important;
					-webkit-transform: translate(20px, 0) !important; 
					transform: translate(20px, 0) !important;
				};
			}
			
			.loading-indicator {
				--triplat-loading-indicator-clear-background: transparent;
			}

			.loading-indicator-fixed {
				--triplat-loading-indicator-container: {
					position: fixed;
				};
			}

			.message-placeholder {
				@apply --layout-center-center;
				@apply --layout-vertical;
				padding: 10px;
				background-color: white;
			}

			.message-placeholder > * {
				text-align: center;
				margin: 10px 0;
			}
						
			.section-content {
				min-height: 50px;
			}

			:host(:not([small-layout])) .page-tabs {
				-moz-box-shadow: 0 4px 4px var(--tri-primary-content-accent-color);
				-webkit-box-shadow: 0 4px 4px var(--tri-primary-content-accent-color);
				box-shadow: 0 4px 4px var(--tri-primary-content-accent-color);
			}
			:host([small-layout]) .page-tabs {
				border-bottom: 1px solid var(--tri-secondary-color);
			}

			label {
				padding-bottom: 5px;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}

			label.small {
				font-size: 12px;
			}
		
			.remove-column {
				--triblock-table-column-body-flex-alignment: flex-end;
			}

			.remove-icon {
				@apply --layout-end;
			}

		</style>
	</template>
</dom-module>
`;

addDomStyleModule(workTaskSharedPageStyles, "triview-work-task/tristyles-work-task-app.js");

const workTaskPopup = `
<dom-module id="work-task-popup">
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

			.popup-alert a {
				cursor: pointer;
			}
			
			.popup-alert .footer {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				margin-bottom: 0px;
			}

			.resolution-popup {
				width: 600px;
				min-height: 300px;
				@apply --layout-vertical;
			}

			.popup-alert .resolution-textarea {
				border: 1px solid var(--ibm-gray-30);
				resize: none;
				outline: none;
				box-shadow: none;
				font-size: inherit;
				font-family: inherit;
				width: 98%;
			}
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(workTaskPopup, "triview-work-task/tristyles-work-task-app.js");

const workTaskDetailSection = `
<dom-module id="work-task-detail-section">
	<template>
		<style>

			:host([opened]:not([small-layout])) {
				@apply --shadow-elevation-4dp;
				margin: 2px -10px 3px -10px;
			}

			.fixed-width-column {
				--triblock-table-column-fixed-width: 120px;  
			}

			.icons-divider {
				height: 25px;
			}
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(workTaskDetailSection, "triview-work-task/tristyles-work-task-app.js");

const workTaskTabs = `
<dom-module id="work-task-tabs">
	<template>
		<style>

			triblock-tabs {
				--triblock-tab-focused-tricontent: {
					outline: 1px solid var(--tri-primary-color-40);
				};
			}
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(workTaskTabs, "triview-work-task/tristyles-work-task-app.js");