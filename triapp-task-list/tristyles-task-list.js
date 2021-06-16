/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { addDomStyleModule } from "../tricore-util/tricore-util.js";

const messagePlaceholder = `
<dom-module id="message-placeholder">
	<template>
		<style>

			.message-placeholder {
				@apply --layout-vertical;
				padding: 10px;
			}

			.message-placeholder > * {
				text-align: center;
			}

			:host(:not([small-layout])) .message-placeholder {
				padding-top: 75px;
			}

			:host([small-layout]) .message-placeholder {
				padding-top: 50px;
				padding-bottom: 100px;
			}
		
		</style>
	</template>
</dom-module>
`
addDomStyleModule(messagePlaceholder, "triapp-task-list/tristyles-task-list.js");

const taskListFilter = `
<dom-module id="task-list-filter">
	<template>
		<style>

			paper-menu-button {
				padding: 0;
			}

			:host([small-layout]) paper-menu-button {
				@apply --layout-flex;
			}

			.filter-button {
				@apply --layout-flex;
				background: transparent !important;
				display: block !important;
				margin: 0 !important;
				padding: 0 !important;
			}
		
			:host([dir="ltr"]) .filter-button {
				text-align: left !important;
			}

			:host([dir="rtl"]) .filter-button {
				text-align: right !important;
			}

			.filter-button-content {
				@apply --layout-horizontal;
				@apply --layout-center;
				@apply --layout-flex;
			}

			.selected-filter-label {
				@apply --layout-flex;
			}

			:host([dir="ltr"]) .selected-filter-label {
				padding-left: 10px;
			}

			:host([dir="rtl"]) .selected-filter-label {
				padding-right: 10px;
			}
		
		</style>
	</template>
</dom-module>
`

addDomStyleModule(taskListFilter, "triapp-task-list/tristyles-task-list.js");

const taskListScanner = `
<dom-module id="task-list-scanner">
	<template>
		<style>

			:host {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			.scanner-container {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			:host .scanner-action-bar {
				@apply --layout-horizontal;
				@apply --layout-justified;
				position:absolute;
				right: 0px;
				left: 0px;
				height: 40px;
				background-color: #ffffff;
				font-size: 14px;
				z-index: 1;
				opacity: 0.8;	
				padding: 20px;
			}

			.cancel-scan-button {
				@apply --layout-end-justified;
				margin-right: 40px;
			}

			.scanner-label{
				font-weight: bold;
			}

		</style>
	</template>
</dom-module>
`;

addDomStyleModule(taskListScanner, "triapp-task-list/tristyles-task-list.js");

const taskListScanPopup = `
<dom-module id="task-list-scan-popup">
	<template>
		<style>

			triblock-popup[small-layout] {
				padding: 0px;
			}

			triblock-popup:not([small-layout]) {
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

			.popup-alert .footer {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				margin-bottom: 0px;
			}

		</style>
	</template>
</dom-module>
`;

addDomStyleModule(taskListScanPopup, "triapp-task-list/tristyles-task-list.js");