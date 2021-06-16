/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

const workPlannerLayoutStyles = `
<dom-module id="work-planner-layout-styles">
	<template>
		<style>

			triplat-route-selector, iron-pages {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			iron-pages {
				background-color: var(--primary-background-color);
			}

			iron-pages > * {
				@apply --layout-flex;
			}

			iron-pages > div {
				@apply --layout-vertical;
			}

			iron-pages > div > * {
				@apply --layout-flex;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(workPlannerLayoutStyles, "triview-work-planner/styles/tristyles-work-planner.js");

const workPlannerSharedStyles = `
<dom-module id="work-planner-shared-styles">
	<template>
		<style>

			.section-title {
				font-size: 22px;
				font-weight: bold;
				padding-bottom: 5px;
				border-bottom: 2px solid var(--tri-primary-content-accent-color);
			}

			.loading-indicator {
				--triplat-loading-indicator-clear-background: transparent;
				z-index: 200;
			}

			.checkbox {
				--paper-checkbox-label: {
					display: none;
				};
				--paper-checkbox-size: 25px;
				padding: 10px;
			}

			.card {
				background-color: var(--primary-background-color);
			}

			:host(:not([small-layout])) .card {
				border: 1px solid var(--tri-primary-content-accent-color);
			}

			:host([dir="ltr"]:not([small-layout])) .card {
				margin-right: 10px;
			}

			:host([dir="rtl"]:not([small-layout])) .card {
				margin-left: 10px;
			}

			:host([small-layout]) .card {
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
			}

			:host([small-layout]) .task-sort-header {
				padding-left: 5px;
				padding-right: 5px;
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
				flex-shrink: 0;
			}

			.card[selected] {
				background-color: #F7FBFF;
			}

			:host(:not([small-layout])) .card:hover {
				background-color: #EEF6FE !important;
				border-color: var(--tri-primary-color-30);
			}

			.message-placeholder {
				@apply --layout-center-center;
				@apply --layout-vertical;
				height: 150px;
			}

			.task-message-placeholder, .task-empty-message-placeholder {
				@apply --layout-fit;
				@apply --layout-vertical;
				@apply --layout-center;
				background-color: var(--ibm-neutral-2);
				z-index: 1;
				padding-top: 75px;
				text-align: center;
			}

			.task-empty-message-placeholder {
				z-index: 2;
			}

			:host([small-layout]) .task-message-placeholder, :host([small-layout]) .task-empty-message-placeholder {
				padding-left: 15px;
				padding-right: 15px;
				background-color: var(--primary-background-color);
				top: 46px;
			}

			.expand-button {
				height:35px;
				width:35px;
				padding: 10px;
			}

			.name-container {
				@apply --layout-vertical;
				overflow-x: hidden;
			}

			.labor-list {
				@apply --layout-horizontal;
				@apply --layout-wrap;
			}

			.labor {
				font-size: 12px;
			}
			:host([dir="ltr"]) .labor {
				padding-right: 2px;
			}
			:host([dir="rtl"]) .labor {
				padding-left: 2px;
			}

			.availability-text {
				@apply --layout-flex;
				@apply --layout-horizontal;
				@apply --layout-wrap;
				pointer-events: none;
			}

			.task-list:not([small-layout]) {
				@apply --layout-flex;
			}

			.iron-list {
				@apply --layout-vertical;
			}

			:host(:not([small-layout])) .iron-list {
				@apply --layout-flex;
				overflow-y: auto;
				overflow-x: hidden;
			}

			:host([small-layout]) .iron-list {
				@apply --layout-flex;
				overflow-y: visible!important;
			}

			.task-card[first] {
				padding-top: 0px;
			}

			:host([small-layout]) .task-card {
				padding-top: 0px;
				padding-bottom: 0px;
			}

			.divider {
				background-color: var(--tri-primary-content-accent-color);
				width: 2px;
				height: 20px;
			}

			.search-input {
				border-top: 1px solid var(--tri-primary-content-accent-color);
				border-left: 1px solid var(--tri-primary-content-accent-color);
				border-right: 1px solid var(--tri-primary-content-accent-color);
				border-bottom: 2px solid var(--ibm-gray-30);
				font-family: var(--tri-font-family);
				font-size: 14px;
				--triplat-search-input-input: {
					font-family: var(--tri-font-family);
					font-size: 14px;
				};
				--triplat-search-input-border-height: 0px;
			}

			.search-input:focus-within {
				border-bottom: 2px solid var(--tri-primary-color);
			}

			.people-sort-header {
				height: 45px;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(workPlannerSharedStyles, "triview-work-planner/styles/tristyles-work-planner.js");

const workPlannerTaskCardStyles = `
<dom-module id="work-planner-task-card-styles">
	<template>
		<style>

			:host {
				flex-shrink: 0;
			}
			:host([focused]) {
				transform: translateZ(1px);
			}

			.card {
				padding: 0px 10px 20px 0px;
			}
			:host([_small-or-medium]) .card {
				padding: 0px 15px 20px 5px;
			}

			:host([_small-or-medium]) .card[no-selection] {
				padding: 0px 15px 20px 15px;
			}
			.card[selected][dragging] {
				opacity: 0.6;
			}

			.card > div {
				padding-top: 20px;
			}

			.task-details-container {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			.task-details-container > div {
				margin-bottom: 10px;
			}
			.task-details-container > div:last-child {
				margin-bottom: 0;
			}

			.horizontal-details {
				@apply --layout-horizontal;
			}

			.first-row {
				min-height: 25px;
				@apply --layout-center;
			}

			:host(:not([_small-or-medium])) .first-column {
				@apply --layout-flex-2;
			}

			:host(:not([_small-or-medium])) .middle-column {
				@apply --layout-flex-3;
				margin: 0 15px;
			}

			:host(:not([_small-or-medium])) .last-column {
				@apply --layout-flex-2;
			}

			:host([_small-or-medium]) .first-small-column {
				@apply --layout-flex-3;
			}

			:host([_small-or-medium]) .last-small-column {
				@apply --layout-flex-2;
			}
			
			:host([dir="ltr"][_small-or-medium]) .last-small-column {
				margin-left: 15px;
			}

			:host([dir="rtl"][_small-or-medium]) .last-small-column {
				margin-right: 15px;
			}

			.table-checkbox-column,
			.table-expand-column {
				@apply --layout-center-center;
				@apply --layout-horizontal;
				padding: 0;
			}

			.table-checkbox-column {
				width: 45px;
			}

			.table-expand-column {
				width: 30px;
			}

			.table-first-column {
				@apply --layout-flex-3;
			}

			.table-middle-column  {
				@apply --layout-flex-2;
				margin: 0 30px;
			}

			.table-last-column {
				@apply --layout-flex;
				min-width: auto;
			}

			.task-id-name {
				@apply --layout-flex;
				@apply --layout-horizontal;
			}

			.task-id::after {
				content: "-";
				padding-left: 2px;
				padding-right: 2px;
			}

			.task-name {
				@apply --layout-flex;
				word-wrap: break-word;
				word-break: break-word;
				overflow: hidden;
			}

			:host([dir="ltr"]:not([_small-or-medium])) .task-status {
				margin-right: -25px;
			}
			:host([dir="rtl"]:not([_small-or-medium])) .task-status {
				margin-left: -25px;
			}

			.task-priority {
				@apply --layout-self-start;
			}

			.priority-column {
				min-width: 0px;
			}

			tricomp-datetime-selector {
				white-space: nowrap;
			}

			.hover-icon-container {
				@apply --layout-horizontal;
				@apply --layout-end-justified;
				@apply --layout-center;
				width: 35px;
				visibility: hidden;
			}
			.hover-icon-container:not([draggable]) {
				display: none;
				margin: 0 !important;
			}
			:host([dir="ltr"]) .hover-icon-container {
				margin-right: -5px;
			}
			:host([dir="rtl"]) .hover-icon-container {
				margin-left: -5px;
			}
			:host([small-layout]) .hover-icon-container {
				width: 25px;
			}

			.hover-icon-container > iron-icon {
				pointer-events: none;
			}

			.card:hover .hover-icon-container[draggable] {
				visibility: visible;
				cursor: pointer;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(workPlannerTaskCardStyles, "triview-work-planner/styles/tristyles-work-planner.js");

const workPlannerPopupStyles = `
<dom-module id="work-planner-popup-styles">
	<template>
		<style>

			triblock-popup {
				border: 4px solid var(--tri-primary-content-accent-color);
				font-size: 14px;
			}

			.popup-alert {
				line-height: 20px;
				margin: 15px;
				padding: 20px;
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

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(workPlannerPopupStyles, "triview-work-planner/styles/tristyles-work-planner.js");

const workPlannerDropdownStyles = `
<dom-module id="work-planner-dropdown-styles">
	<template>
		<style>

			.content {
				@apply --layout-vertical;
				padding: 15px 10px;
				background-color: var(--primary-background-color);
				border: 1px solid var(--ibm-gray-30);
				box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
			}

			.buttons {
				@apply --layout-end-justified;
				@apply --layout-horizontal;
				margin-top: 10px;
			}

			paper-button {
				padding: 7px 12px !important;
				min-width: auto !important;
			}

			paper-button[primary-outline]:not(:hover) {
				padding: 5px 10px !important;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(workPlannerDropdownStyles, "triview-work-planner/styles/tristyles-work-planner.js");