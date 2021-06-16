/*
@license
IBM Confidential - OCO Source Materials - (C) COPYRIGHT IBM CORP. 2015-2020 - The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
import "../@polymer/iron-flex-layout/iron-flex-layout.js";

import {
  addDomStyleModule,
  addCustomStyle,
} from "../tricore-util/tricore-util.js";

const tristylesFonts = `
<dom-module id="tristyles-fonts">
	<template>
		<style>

			@font-face {
				font-family: 'IBM Plex Sans';
				src: url('IBMPlex/IBMPlexSans-Light.woff2') format('woff2'),
					 url('IBMPlex/IBMPlexSans-Light.woff') format('woff');
				font-weight: 100;
			}
		
			@font-face {
				font-family: 'IBM Plex Sans';
				src: url('IBMPlex/IBMPlexSans-Regular.woff2') format('woff2'),
					 url('IBMPlex/IBMPlexSans-Regular.woff') format('woff');
				font-weight: 400;
			}
		
			@font-face {
				font-family: 'IBM Plex Sans';
				src: url('IBMPlex/IBMPlexSans-Medium.woff2') format('woff2'),
					 url('IBMPlex/IBMPlexSans-Medium.woff') format('woff');
				font-weight: 500;
			}
		
			@font-face {
				font-family: 'IBM Plex Sans';
				src: url('IBMPlex/IBMPlexSans-SemiBold.woff2') format('woff2'),
					 url('IBMPlex/IBMPlexSans-SemiBold.woff') format('woff');
				font-weight: 900;
			}
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(tristylesFonts, "triplat-theme/triplat-theme.js");

const tristylesTheme = `
<dom-module id="tristyles-theme">
	<template>
		<style>
			/*
			* Overrides for Work Task Portal
			*/
			tricomp-portal-services {
				background-color: #282828;
			}

			div.service-item-container:hover {
				background-color: rgb(61,61,61);
				cursor: pointer;
			}

			/*
			 * Overrides for Work Planner
			 */
			tricomp-task-status-tab-item {
				border-color: var(--tri-primary-dark-color);
				background-color: white;
				color: var(--ibm-gray-80);
			}

			tricomp-task-status-tab-item:hover {
				background-color: #e5e5e5;
				color: var(--ibm-gray-100);
			}

			tricomp-task-status-tab-item.iron-selected {
				background-color: var(--tri-primary-dark-color);
				color: white;
			}

			div.name-initials {
				background-color: var(--ibm-magenta-70);
			}

			/*
			 * Overrides for Work Task
			 */
			.filter-optional > .toggle, .status > .toggle {
				margin-top: -10px;
				--paper-toggle-button-unchecked-bar: {
					opacity: 1;
					background-color: var(--ibm-gray-50);
					border-radius: 0.9375rem;
					width: 48px;
					height: 24px;
					margin: 0px;
				};
				--paper-toggle-button-checked-bar: {
					opacity: 1;
					background-color: var(--ibm-green-50);
				}
				--paper-toggle-button-checked-button-color: white;
				--paper-toggle-button-unchecked-button-color: var(--ibm-gray-20);
				--paper-toggle-button-unchecked-button: {
					background-color: var(--ibm-gray-20);
					top: 3px;
					left: 3px;
					height: 18px;
					width: 18px;
					border: none;
					box-shadow: none;
				};
			}

			:host([dir="rtl"]) .filter-optional > .toggle, :host([dir="rtl"]) .status > .toggle {
				margin-top: -10px;
				--paper-toggle-button-unchecked-bar: {
					opacity: 1;
					background-color: var(--ibm-gray-50);
					border-radius: 0.9375rem;
					width: 48px;
					height: 24px;
					margin: 0px;
				};
				--paper-toggle-button-checked-bar: {
					opacity: 1;
					background-color: var(--ibm-green-50);
				}
				--paper-toggle-button-checked-button-color: white;
				--paper-toggle-button-unchecked-button-color: var(--ibm-gray-20);
				--paper-toggle-button-unchecked-button: {
					background-color: var(--ibm-gray-20);
					top: 3px;
					left: -9px;
					height: 18px;
					width: 18px;
					border: none;
					box-shadow: none;
				};
			}

			.filter-optional > .toggle[disabled]:not([checked]), 
			.status > .toggle[disabled]:not([checked]) {
				--paper-toggle-button-unchecked-button: {
					top: 3px;
					left: 3px;
					height: 18px;
					width: 18px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: none;
					opacity: 1;
					box-shadow: none;
				};
			}

			:host([dir="rtl"]) .filter-optional > .toggle[disabled]:not([checked]), 
			:host([dir="rtl"]) .status > .toggle[disabled]:not([checked]) {
				--paper-toggle-button-unchecked-button: {
					top: 3px;
					left: -9px;
					height: 18px;
					width: 18px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: none;
					opacity: 1;
					box-shadow: none;
				};
			}

			.filter-optional > .toggle[disabled][checked],
			.status > .toggle[disabled][checked] {
				--paper-toggle-button-checked-button-color: var(--ibm-cool-neutral-2);
				--paper-toggle-button-unchecked-button: {
					top: 3px;
					left: 3px;
					height: 18px;
					width: 18px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: none;
					box-shadow: none;
					-webkit-transform: translate(24px, 0) !important; 
					transform: translate(24px, 0) !important;
					background-image: url("images/ready-disabled.svg");
					background-size: contain;
				};
			}

			:host([dir="rtl"]) .filter-optional > .toggle[disabled][checked],
			:host([dir="rtl"]) .status > .toggle[disabled][checked] {
				--paper-toggle-button-checked-button-color: var(--ibm-cool-neutral-2);
				--paper-toggle-button-unchecked-button: {
					top: 3px;
					left: -9px;
					height: 18px;
					width: 18px;
					background-color: var(--ibm-cool-neutral-2) !important;
					border: none;
					box-shadow: none;
					-webkit-transform: translate(24px, 0) !important; 
					transform: translate(24px, 0) !important;
					background-image: url("images/ready-disabled.svg");
					background-size: contain;
				};
			}

			.filter-optional > .hide-toggle {
				--paper-toggle-button-checked-button: {
					top: 3px;
					left: 3px;
					height: 18px;
					width: 18px;
					border: none;
					background-color: white !important;
					-webkit-transform: translate(24px, 0) !important; 
					transform: translate(24px, 0) !important;
				};
			}

			:host([dir="rtl"]) .filter-optional > .hide-toggle {
				--paper-toggle-button-checked-button: {
					top: 3px;
					left: -9px;
					height: 18px;
					width: 18px;
					border: none;
					background-color: white !important;
					-webkit-transform: translate(24px, 0) !important; 
					transform: translate(24px, 0) !important;
				};
			}

			.status > .toggle-step {
				--paper-toggle-button-checked-button: {
					top: 3px;
					left: 3px;
					height: 18px;
					width: 18px;
					border: none;
					background-color: var(--ibm-green-50) !important;
					-webkit-transform: translate(24px, 0) !important; 
					transform: translate(24px, 0) !important;
					background-image: url("images/ready.svg");
					background-size: contain;
				};
			}

			:host([dir="rtl"]) .status > .toggle-step {
				--paper-toggle-button-checked-button: {
					top: 3px;
					left: -9px;
					height: 18px;
					width: 18px;
					border: none;
					background-color: var(--ibm-green-50) !important;
					-webkit-transform: translate(24px, 0) !important; 
					transform: translate(24px, 0) !important;
					background-image: url("images/ready.svg");
					background-size: contain;
				};
			}

			:host(:not([small-layout])) tricomp-task-list-filter-item {
				color: var(--ibm-gray-80);
				border-color: var(--tri-primary-dark-color);
			}

			:host(:not([small-layout])) tricomp-task-list-filter-item:hover {
				background-color: #e5e5e5;
				color: var(--ibm-gray-100);
				cursor: pointer;
			}
			
			:host(:not([small-layout])) tricomp-task-list-filter-item.iron-selected {
				background-color: var(--tri-primary-dark-color);
				color: white;
			}

			.container > .filter-bar paper-radio-button {
				--paper-radio-button-checked-color: var(--tri-primary-dark-color);
				--paper-radio-button-unchecked-color: var(--tri-primary-dark-color);
				--paper-radio-button-label-color: var(--tri-primary-dark-color);
			}

			/* 
			 * overrides triplat-ds-search
			 */
			.footer-container .footer-loading-text, .footer-container .footer-loading-dots, .footer-container .footer-selected-text {
				color: white;
			}
			
			#main > .filters > .single {
				border-bottom-color: var(--ibm-gray-40);
			}

			graphic-actions[checked] {
				background-color: var(--ibm-blue-60);
			}

			/*
			* a (link tag) / class="tri-link"
			*/
			 a:not(.tri-disable-theme) {
				text-decoration: none;
				color: var(--tri-primary-color);
			}
			 .tri-link {
				cursor: pointer;
				color: var(--tri-primary-color);
			}
			 a:not(.tri-disable-theme).underline,
			 .tri-link.underline {
				text-decoration: underline;
			}
			 a:not(.tri-disable-theme):hover,
			 .tri-link:hover {
				text-decoration: underline;
			}
			/* footer */
			 a:not(.tri-disable-theme).footer,
			 a:not(.tri-disable-theme)[footer],
			 .tri-link.footer,
			 .tri-link[footer] {
				color: var(--ibm-blue-30);
			}

			/*
			* class="tri-h#" / class="tri-fine-print"
			* (<h#> and <small> elements are avoided here, since these elements have preset browser settings that we don't want)
			*/
			 .tri-h1 {
				font-size: 36px;
				font-weight: 100;
			}
			 .tri-h2 {
				font-size: 22px;
			}
			 .tri-h3 {
				font-size: 18px;
			}
			 .tri-fine-print {
				font-size: 12px;
				color: var(--ibm-gray-100);
			}

			/*
			* iron-icon
			*/
			/* primary */
			 iron-icon:not(.tri-disable-theme)[primary],
			 iron-icon:not(.tri-disable-theme).primary {
				color: var(--tri-primary-content-color);
			}
			/* secondary */
			 iron-icon:not(.tri-disable-theme)[secondary],
			 iron-icon:not(.tri-disable-theme).secondary {
				color: var(--tri-secondary-color);
			}
			/* info */
			 iron-icon:not(.tri-disable-theme)[info],
			 iron-icon:not(.tri-disable-theme).info {
				color: var(--tri-info-color);
			}
			/* success */
			 iron-icon:not(.tri-disable-theme)[success],
			 iron-icon:not(.tri-disable-theme).success {
				color: var(--tri-success-color);
			}
			/* warning */
			 iron-icon:not(.tri-disable-theme)[warning],
			 iron-icon:not(.tri-disable-theme).warning {
				color: var(--tri-warning-color);
			}
			/* major-warning */
			 iron-icon:not(.tri-disable-theme)[major-warning],
			 iron-icon:not(.tri-disable-theme).major-warning {
				color: var(--tri-major-warning-color);
			}
			/* danger */
			 iron-icon:not(.tri-disable-theme)[danger],
			 iron-icon:not(.tri-disable-theme).danger {
				color: var(--tri-danger-color);
			}
			/* error */
			 iron-icon:not(.tri-disable-theme)[error],
			 iron-icon:not(.tri-disable-theme).error {
				color: var(--tri-error-color);
			}
			/* footer */
			 iron-icon:not(.tri-disable-theme)[footer],
			 iron-icon:not(.tri-disable-theme).footer {
				color: var(--tri-footer-color);
			}

			/*
			* label
			*/
			 label:not(.tri-disable-theme) {
				color: var(--tri-primary-content-label-color);
			}

			/*
			* paper-button
			*/
			/* default */
			 paper-button:not(.tri-disable-theme) {
				@apply --layout-vertical;
				@apply --layout-center-center;
				font-family: var(--tri-font-family);
				font-weight: 400;
				border-radius: 0px;
				text-align: center;
				text-transform: none;
				width: auto;
				margin: 0 5px;
				@apply --tri-primary-button;
				
			}
			/* default hover */
			 paper-button:not(.tri-disable-theme):hover {
				@apply --tri-primary-button-hover;
			}
			/* default pressed */
			 paper-button:not(.tri-disable-theme)[pressed] {
				@apply --tri-primary-button-press;
			}
			/* primary-outline */
			paper-button:not(.tri-disable-theme)[primary-outline],
			paper-button:not(.tri-disable-theme).primary-outline {
				@apply(--tri-primary-outline-button);
			}
			/* primary-outline hover */
			paper-button:not(.tri-disable-theme)[primary-outline]:hover,
			paper-button:not(.tri-disable-theme).primary-outline:hover {
				@apply(--tri-primary-outline-button-hover);
			}
			/* primary-outline pressed */
			paper-button:not(.tri-disable-theme)[primary-outline][pressed],
			paper-button:not(.tri-disable-theme).primary-outline[pressed] {
				@apply(--tri-primary-outline-button-press);
			}
			/* secondary */
			 paper-button:not(.tri-disable-theme)[secondary],
			 paper-button:not(.tri-disable-theme).secondary {
				@apply --tri-secondary-button;
			}
			/* secondary hover */
			 paper-button:not(.tri-disable-theme)[secondary]:hover,
			 paper-button:not(.tri-disable-theme).secondary:hover {
				@apply --tri-secondary-button-hover;
			}
			/* secondary pressed */
			 paper-button:not(.tri-disable-theme)[secondary][pressed],
			 paper-button:not(.tri-disable-theme).secondary[pressed] {
				@apply --tri-secondary-button-press;
			}
			/* secondary disabled */
			 paper-button:not(.tri-disable-theme)[secondary][disabled],
			 paper-button:not(.tri-disable-theme).secondary[disabled] {
				@apply --tri-secondary-button-disabled;
			}
			/* info */
			 paper-button:not(.tri-disable-theme)[info],
			 paper-button:not(.tri-disable-theme).info {
				@apply --tri-info-button;
			}
			/* info hover */
			 paper-button:not(.tri-disable-theme)[info]:hover,
			 paper-button:not(.tri-disable-theme).info:hover {
				@apply --tri-info-button-hover;
			}
			/* info pressed */
			 paper-button:not(.tri-disable-theme)[info][pressed],
			 paper-button:not(.tri-disable-theme).info[pressed] {
				@apply --tri-info-button-press;
			}
			/* info-outline */
			 paper-button:not(.tri-disable-theme)[info-outline],
			 paper-button:not(.tri-disable-theme).info-outline {
				@apply --tri-info-outline-button;
			}
			/* info-outline hover */
			 paper-button:not(.tri-disable-theme)[info-outline]:hover,
			 paper-button:not(.tri-disable-theme).info-outline:hover {
				@apply --tri-info-outline-button-hover;
			}
			/* info-outline pressed */
			 paper-button:not(.tri-disable-theme)[info-outline][pressed],
			 paper-button:not(.tri-disable-theme).info-outline[pressed] {
				@apply --tri-info-outline-button-press;
			}
			/* success */
			 paper-button:not(.tri-disable-theme)[success],
			 paper-button:not(.tri-disable-theme).success {
				@apply --tri-success-button;
			}
			/* success hover */
			 paper-button:not(.tri-disable-theme)[success]:hover,
			 paper-button:not(.tri-disable-theme).success:hover {
				@apply --tri-success-button-hover;
			}
			/* success pressed */
			 paper-button:not(.tri-disable-theme)[success][pressed],
			 paper-button:not(.tri-disable-theme).success[pressed] {
				@apply --tri-success-button-press;
			}
			/* success-outline */
			 paper-button:not(.tri-disable-theme)[success-outline],
			 paper-button:not(.tri-disable-theme).success-outline {
				@apply --tri-success-outline-button;
			}
			/* success-outline hover */
			 paper-button:not(.tri-disable-theme)[success-outline]:hover,
			 paper-button:not(.tri-disable-theme).success-outline:hover {
				@apply --tri-success-outline-button-hover;
			}
			/* success-outline pressed */
			 paper-button:not(.tri-disable-theme)[success-outline][pressed],
			 paper-button:not(.tri-disable-theme).success-outline[pressed] {
				@apply --tri-success-outline-button-press;
			}
			/* warning */
			 paper-button:not(.tri-disable-theme)[warning],
			 paper-button:not(.tri-disable-theme).warning {
				@apply --tri-warning-button;
			}
			/* warning hover */
			 paper-button:not(.tri-disable-theme)[warning]:hover,
			 paper-button:not(.tri-disable-theme).warning:hover {
				@apply --tri-warning-button-hover;
			}
			/* warning pressed */
			 paper-button:not(.tri-disable-theme)[warning][pressed],
			 paper-button:not(.tri-disable-theme).warning[pressed] {
				@apply --tri-warning-button-press;
			}
			/* warning-outline */
			 paper-button:not(.tri-disable-theme)[warning-outline],
			 paper-button:not(.tri-disable-theme).warning-outline {
				@apply --tri-warning-outline-button;
			}
			/* warning-outline hover */
			 paper-button:not(.tri-disable-theme)[warning-outline]:hover,
			 paper-button:not(.tri-disable-theme).warning-outline:hover {
				@apply --tri-warning-outline-button-hover;
			}
			/* warning-outline pressed */
			 paper-button:not(.tri-disable-theme)[warning-outline][pressed],
			 paper-button:not(.tri-disable-theme).warning-outline[pressed] {
				@apply --tri-warning-outline-button-press;
			}
			/* major-warning */
			 paper-button:not(.tri-disable-theme)[major-warning],
			 paper-button:not(.tri-disable-theme).major-warning {
				@apply --tri-major-warning-button;
			}
			/* major-warning hover */
			 paper-button:not(.tri-disable-theme)[major-warning]:hover,
			 paper-button:not(.tri-disable-theme).major-warning:hover {
				@apply --tri-major-warning-button-hover;
			}
			/* major-warning pressed */
			 paper-button:not(.tri-disable-theme)[major-warning][pressed],
			 paper-button:not(.tri-disable-theme).major-warning[pressed] {
				@apply --tri-major-warning-button-press;
			}
			/* major-warning-outline */
			 paper-button:not(.tri-disable-theme)[major-warning-outline],
			 paper-button:not(.tri-disable-theme).major-warning-outline {
				@apply --tri-major-warning-outline-button;
			}
			/* major-warning-outline hover */
			 paper-button:not(.tri-disable-theme)[major-warning-outline]:hover,
			 paper-button:not(.tri-disable-theme).major-warning-outline:hover {
				@apply --tri-major-warning-outline-button-hover;
			}
			/* major-warning-outline pressed */
			 paper-button:not(.tri-disable-theme)[major-warning-outline][pressed],
			 paper-button:not(.tri-disable-theme).major-warning-outline[pressed] {
				@apply --tri-major-warning-outline-button-press;
			}
			/* danger */
			 paper-button:not(.tri-disable-theme)[danger],
			 paper-button:not(.tri-disable-theme).danger {
				@apply --tri-danger-button;
			}
			/* danger hover */
			 paper-button:not(.tri-disable-theme)[danger]:hover,
			 paper-button:not(.tri-disable-theme).danger:hover {
				@apply --tri-danger-button-hover;
			}
			/* danger pressed */
			 paper-button:not(.tri-disable-theme)[danger][pressed],
			 paper-button:not(.tri-disable-theme).danger[pressed] {
				@apply --tri-danger-button-press;
			}
			/* danger-outline */
			 paper-button:not(.tri-disable-theme)[danger-outline],
			 paper-button:not(.tri-disable-theme).danger-outline {
				@apply --tri-danger-outline-button;
			}
			/* danger-outline hover */
			 paper-button:not(.tri-disable-theme)[danger-outline]:hover,
			 paper-button:not(.tri-disable-theme).danger-outline:hover {
				@apply --tri-danger-outline-button-hover;
			}
			/* danger-outline pressed */
			 paper-button:not(.tri-disable-theme)[danger-outline][pressed],
			 paper-button:not(.tri-disable-theme).danger-outline[pressed] {
				@apply --tri-danger-outline-button-press;
			}
			/* footer */
			 paper-button:not(.tri-disable-theme)[footer],
			 paper-button:not(.tri-disable-theme).footer {
				@apply --tri-footer-button;
			}
			/* footer hover */
			 paper-button:not(.tri-disable-theme)[footer]:hover,
			 paper-button:not(.tri-disable-theme).footer:hover {
				@apply --tri-footer-button-hover;
			}
			/* footer pressed */
			 paper-button:not(.tri-disable-theme)[footer][pressed],
			 paper-button:not(.tri-disable-theme).footer[pressed] {
				@apply --tri-footer-button-press;
			}
			/* footer secondary */
			 paper-button:not(.tri-disable-theme)[footer-secondary],
			 paper-button:not(.tri-disable-theme).footer-secondary {
				@apply --tri-footer-secondary-button;
			}
			/* footer secondary hover */
			 paper-button:not(.tri-disable-theme)[footer-secondary]:hover,
			 paper-button:not(.tri-disable-theme).footer-secondary:hover {
				@apply --tri-footer-secondary-button-hover;
			}
			/* footer secondary pressed */
			 paper-button:not(.tri-disable-theme)[footer-secondary][pressed],
			 paper-button:not(.tri-disable-theme).footer-secondary[pressed] {
				@apply --tri-footer-secondary-button-press;
			}
			/* footer danger */
			 paper-button:not(.tri-disable-theme)[footer-danger],
			 paper-button:not(.tri-disable-theme).footer-danger {
				@apply --tri-footer-danger-button;
			}
			/* footer danger hover */
			 paper-button:not(.tri-disable-theme)[footer-danger]:hover,
			 paper-button:not(.tri-disable-theme).footer-danger:hover {
				@apply --tri-footer-danger-button-hover;
			}
			/* footer danger pressed */
			 paper-button:not(.tri-disable-theme)[footer-danger][pressed],
			 paper-button:not(.tri-disable-theme).footer-danger[pressed] {
				@apply --tri-footer-danger-button-press;
			}
			/* footer disabled */
			 paper-button:not(.tri-disable-theme)[footer][disabled],
			 paper-button:not(.tri-disable-theme)[footer-secondary][disabled],
			 paper-button:not(.tri-disable-theme)[footer-danger][disabled],
			 paper-button:not(.tri-disable-theme).footer[disabled],
			 paper-button:not(.tri-disable-theme).footer-secondary[disabled],
			 paper-button:not(.tri-disable-theme).footer-danger[disabled] {
				@apply --tri-footer-button-disabled;
			}
			/* default disabled */
			 paper-button:not(.tri-disable-theme)[disabled] {
				@apply --tri-disabled-button;
			}

			/*
			* paper-checkbox
			*/
			 paper-checkbox:not(.tri-disable-theme) {
				font-family: var(--tri-font-family);
			}

			/*
			* paper-icon-button
			*/
			/* primary */
			 paper-icon-button:not(.tri-disable-theme)[primary],
			 paper-icon-button:not(.tri-disable-theme).primary {
				color: var(--tri-primary-icon-button-color);
			}
			/* primary hover */
			 paper-icon-button:not(.tri-disable-theme)[primary]:hover,
			 paper-icon-button:not(.tri-disable-theme).primary:hover {
				color: var(--tri-primary-icon-button-hover-color);
			}
			/* primary press */
			 paper-icon-button:not(.tri-disable-theme)[primary][pressed],
			 paper-icon-button:not(.tri-disable-theme).primary[pressed] {
				color: var(--tri-primary-icon-button-press-color);
			}
			/* secondary */
			 paper-icon-button:not(.tri-disable-theme)[secondary],
			 paper-icon-button:not(.tri-disable-theme).secondary {
				color: var(--tri-secondary-icon-button-color);
			}
			/* secondary hover */
			 paper-icon-button:not(.tri-disable-theme)[secondary]:hover,
			 paper-icon-button:not(.tri-disable-theme).secondary:hover {
				color: var(--tri-secondary-icon-button-hover-color);
			}
			/* secondary press */
			 paper-icon-button:not(.tri-disable-theme)[secondary][pressed],
			 paper-icon-button:not(.tri-disable-theme).secondary[pressed] {
				color: var(--tri-secondary-icon-button-press-color);
			}
			/* info */
			 paper-icon-button:not(.tri-disable-theme)[info],
			 paper-icon-button:not(.tri-disable-theme).info {
				color: var(--tri-info-icon-button-color);
			}
			/* info hover */
			 paper-icon-button:not(.tri-disable-theme)[info]:hover,
			 paper-icon-button:not(.tri-disable-theme).info:hover {
				color: var(--tri-info-icon-button-hover-color);
			}
			/* info press */
			 paper-icon-button:not(.tri-disable-theme)[info][pressed],
			 paper-icon-button:not(.tri-disable-theme).info[pressed] {
				color: var(--tri-info-icon-button-press-color);
			}
			/* success */
			 paper-icon-button:not(.tri-disable-theme)[success],
			 paper-icon-button:not(.tri-disable-theme).success {
				color: var(--tri-success-icon-button-color);
			}
			/* success hover */
			 paper-icon-button:not(.tri-disable-theme)[success]:hover,
			 paper-icon-button:not(.tri-disable-theme).success:hover {
				color: var(--tri-success-icon-button-hover-color);
			}
			/* success press */
			 paper-icon-button:not(.tri-disable-theme)[success][pressed],
			 paper-icon-button:not(.tri-disable-theme).success[pressed] {
				color: var(--tri-success-icon-button-press-color);
			}
			/* warning */
			 paper-icon-button:not(.tri-disable-theme)[warning],
			 paper-icon-button:not(.tri-disable-theme).warning {
				color: var(--tri-warning-icon-button-color);
			}
			/* warning hover */
			 paper-icon-button:not(.tri-disable-theme)[warning]:hover,
			 paper-icon-button:not(.tri-disable-theme).warning:hover {
				color: var(--tri-warning-icon-button-hover-color);
			}
			/* warning press */
			 paper-icon-button:not(.tri-disable-theme)[warning][pressed],
			 paper-icon-button:not(.tri-disable-theme).warning[pressed] {
				color: var(--tri-warning-icon-button-press-color);
			}
			/* major-warning */
			 paper-icon-button:not(.tri-disable-theme)[major-warning],
			 paper-icon-button:not(.tri-disable-theme).major-warning {
				color: var(--tri-major-warning-icon-button-color);
			}
			/* major-warning hover */
			 paper-icon-button:not(.tri-disable-theme)[major-warning]:hover,
			 paper-icon-button:not(.tri-disable-theme).major-warning:hover {
				color: var(--tri-major-warning-icon-button-hover-color);
			}
			/* major-warning press */
			 paper-icon-button:not(.tri-disable-theme)[major-warning][pressed],
			 paper-icon-button:not(.tri-disable-theme).major-warning[pressed] {
				color: var(--tri-major-warning-icon-button-press-color);
			}
			/* danger */
			 paper-icon-button:not(.tri-disable-theme)[danger],
			 paper-icon-button:not(.tri-disable-theme).danger {
				color: var(--tri-danger-icon-button-color);
			}
			/* danger hover */
			 paper-icon-button:not(.tri-disable-theme)[danger]:hover,
			 paper-icon-button:not(.tri-disable-theme).danger:hover {
				color: var(--tri-danger-icon-button-hover-color);
			}
			/* danger press */
			 paper-icon-button:not(.tri-disable-theme)[danger][pressed],
			 paper-icon-button:not(.tri-disable-theme).danger[pressed] {
				color: var(--tri-danger-icon-button-press-color);
			}
			/* error */
			 paper-icon-button:not(.tri-disable-theme)[error],
			 paper-icon-button:not(.tri-disable-theme).error {
				color: var(--tri-error-icon-button-color);
			}
			/* error hover */
			 paper-icon-button:not(.tri-disable-theme)[error]:hover,
			 paper-icon-button:not(.tri-disable-theme).error:hover {
				color: var(--tri-error-icon-button-hover-color);
			}
			/* error press */
			 paper-icon-button:not(.tri-disable-theme)[error][pressed],
			 paper-icon-button:not(.tri-disable-theme).error[pressed] {
				color: var(--tri-error-icon-button-press-color);
			}
			/* footer */
			 paper-icon-button:not(.tri-disable-theme)[footer],
			 paper-icon-button:not(.tri-disable-theme).footer {
				color: var(--tri-footer-icon-button-color);
			}
			/* footer hover */
			 paper-icon-button:not(.tri-disable-theme)[footer]:hover,
			 paper-icon-button:not(.tri-disable-theme).footer:hover {
				color: var(--tri-footer-icon-button-hover-color);
			}
			/* footer press */
			 paper-icon-button:not(.tri-disable-theme)[footer][pressed],
			 paper-icon-button:not(.tri-disable-theme).footer[pressed] {
				color: var(--tri-footer-icon-button-press-color);
			}
			/* disabled */
			 paper-icon-button:not(.tri-disable-theme)[disabled],
			 paper-icon-button:not(.tri-disable-theme).disabled {
				/*opacity: var(--tri-button-disabled-opacity);*/
				color: var(--tri-disabled-icon-button-color);
			}

			/*
			* paper-item
			*/
			 paper-item:not(.tri-disable-theme) {
				font-family: var(--tri-font-family);
			}

			/*
			* paper-radio-button
			*/
			 paper-radio-button:not(.tri-disable-theme) {
				font-family: var(--tri-font-family);
			}

			/*
			* paper-toast
			*/
			 paper-toast:not(.tri-disable-theme) {
				font-family: var(--tri-font-family);
			}

			/*
			 * paper-toggle-button
			 */
			paper-toggle-button:not(.tri-disable-theme):not([disabled]) {
				cursor: pointer;
			}

			/*
			* table
			*/
			 div.tri-table:not(.tri-disable-theme),
			 div[tri-table]:not(.tri-disable-theme) {
				display: table;
				background-color: var(--tri-primary-content-background-color);
				border-collapse: collapse;
				border-spacing: 0;
				color: var(--tri-primary-content-color);
				font-size: 14px;
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-thead,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-thead] {
				display: table-header-group;
				background-color: var(--tri-primary-content-background-color);
				color: var(--tri-primary-color);
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-thead > div.tri-tr,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-thead] > div[tri-tr] {
				display: table-row;
				background-color: var(--tri-primary-content-background-color);
				color: var(--tri-primary-color);
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-thead div.tri-th,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-thead] div[tri-th] {
				display: table-cell;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				line-height: 30px;
				padding: 5px 10px 5px 0px;
				text-align: left;
				min-width: 100px;
				font-weight: bold;
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-thead div.tri-th::before,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-thead] div[tri-th]::before {
				border-left: 1px solid var(--tri-primary-content-accent-color);
				content: "";
				font-size: 18px;
				padding-right: 10px;
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-thead div.tri-th:first-child::before,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-thead] div[tri-th]:first-child::before {
				border-left: none !important;
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-tbody,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-tbody] {
				display: table-row-group;
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr] {
				display: table-row;
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr:nth-child(odd),
			 div[tri-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr]:nth-child(odd) {
				background-color: var(--tri-body-background-color);
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr:nth-child(even),
			 div[tri-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr]:nth-child(even) {
				background-color: var(--tri-primary-content-background-color);
			}
			 div.tri-table[clickable-rows]:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr:hover,
			 div[tri-table][clickable-rows]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr]:hover {
				cursor: pointer;
				background-color: var(--tri-primary-content-accent-color);
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr[selected],
			 div[tri-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr][selected] {
				background-color: var(--tri-primary-light-color) !important;
			}
			 div.tri-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr > div.tri-td,
			 div[tri-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr] > div[tri-td] {
				display: table-cell;
				vertical-align: middle;
				height: 45px;
				padding: 10px;
				min-width: 100px;
				/*position: relative;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;*/
			}
			/* div.tri-table:not(.tri-disable-theme) > tbody > tr > td > div:after,
			 div[tri-table]:not(.tri-disable-theme) > tbody > tr > td > div:after {
				content: '...';
				text-align: right;
				bottom: 0;
				right: 0;
				width: 25%;
				display: block;
				position: absolute;
				height: 14px;
				background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 75%);
			}*/

			/*
			* table - fixed header (requires defining your own column widths by wrapping tri-th's and tri-td's in <div>s with widths specified using --layout-flex-#)
			*/
			 div.tri-fixed-table:not(.tri-disable-theme),
			 div[tri-fixed-table]:not(.tri-disable-theme) {
				@apply --layout-vertical;
				background-color: var(--tri-primary-content-background-color);
				color: var(--tri-primary-content-color);
				font-size: 14px;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] {
				@apply --layout-vertical;
				background-color: var(--tri-primary-content-background-color);
				color: var(--tri-primary-color);
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
				min-height: 0;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead > div.tri-tr,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] > div[tri-tr] {
				@apply --layout-horizontal;
				background-color: var(--tri-primary-content-background-color);
				color: var(--tri-primary-color);
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead div.tri-th,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] div[tri-th] {
				@apply --layout-horizontal;
				@apply --layout-center;
				/*white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;*/
				line-height: 30px;
				height: 30px;
				padding: 5px 10px 5px 0px;
				text-align: left;
				min-width: 0;
				font-weight: bold;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead div.tri-th > span.tri-th-label,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] div[tri-th] > span[tri-th-label] {
				flex-shrink: 1;
				/*white-space: nowrap;*/
				overflow: hidden;
				/*text-overflow: ellipsis;*/
				min-width: 0;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead > div.tri-tr > div,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] > div[tri-tr] > div {
				min-width: 100px;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead div.tri-th::before,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] div[tri-th]::before {
				border-left: 1px solid var(--tri-primary-content-accent-color);
				content: "";
				font-size: 18px;
				padding-right: 10px;
				height: 20px;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead > div.tri-tr > div.tri-th:first-child::before,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] > div[tri-tr] > div[tri-th]:first-child::before {
				border-left: none !important;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-thead > div.tri-tr > div:first-child > div.tri-th::before,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-thead] > div[tri-tr] > div:first-child > div[tri-th]::before {
				border-left: none !important;
			}
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] {
				@apply --layout-vertical;
				@apply --layout-flex;
				@apply --layout-scroll;
				min-height: 0;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr] {
				@apply --layout-horizontal;
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
				flex-shrink: 0;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr:nth-child(odd),
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr]:nth-child(odd) {
				background-color: var(--tri-body-background-color);
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr:nth-child(even),
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr]:nth-child(even) {
				background-color: var(--tri-primary-content-background-color);
			}
			 div.tri-fixed-table[clickable-rows]:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr:hover,
			 div[tri-fixed-table][clickable-rows]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr]:hover {
				cursor: pointer;
				background-color: var(--tri-primary-content-accent-color);
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr[selected],
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr][selected] {
				background-color: var(--tri-primary-light-color) !important;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr div.tri-td,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr] div[tri-td] {
				@apply --layout-horizontal;
				@apply --layout-center;
				height: 45px;
				padding: 10px;
			}
			 div.tri-fixed-table:not(.tri-disable-theme) > div.tri-tbody > div.tri-tr > div,
			 div[tri-fixed-table]:not(.tri-disable-theme) > div[tri-tbody] > div[tri-tr] > div {
				min-width: 100px;
				overflow: hidden;
				/*position: relative;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;*/
			}

			[hidden] {
				display: none !important;
			}

		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(tristylesTheme, "triplat-theme/triplat-theme.js");

const customStyle0 = `
<custom-style>
	<style is="custom-style" include="tristyles-fonts">

		html {
			/*
			 * IBM Colors
			 */
			--ibm-blue-10: #edf5ff;
			--ibm-blue-20: #d0e2ff;
			--ibm-blue-30: #a6c8ff;
			--ibm-blue-40: #78a9ff;
			--ibm-blue-50: #4589ff;
			--ibm-blue-60: #0f62fe;
			--ibm-blue-70: #0043ce;
			--ibm-blue-80: #002d9c;
			--ibm-blue-90: #001d6c;
			--ibm-blue-100: #001141;

			--ibm-green-10: #defbe6;
			--ibm-green-20: #a7f0ba;
			--ibm-green-30: #6fdc8c;
			--ibm-green-40: #42be65;
			--ibm-green-50: #24a148;
			--ibm-green-60: #198038;
			--ibm-green-70: #0e6027;
			--ibm-green-80: #044317;
			--ibm-green-90: #022d0d;
			--ibm-green-100: #071908;

			--ibm-teal-10: #d9fbfb;
			--ibm-teal-20: #9ef0f0;
			--ibm-teal-30: #3ddbd9;
			--ibm-teal-40: #08bdba;
			--ibm-teal-50: #009d9a;
			--ibm-teal-60: #007d79;
			--ibm-teal-70: #005d5d;
			--ibm-teal-80: #004144;
			--ibm-teal-90: #022b30;
			--ibm-teal-100: #081a1c;

			--ibm-purple-10: #f6f2ff;
			--ibm-purple-20: #e8daff;
			--ibm-purple-30: #d4bbff;
			--ibm-purple-40: #be95ff;
			--ibm-purple-50: #a56eff;
			--ibm-purple-60: #8a3ffc;
			--ibm-purple-70: #6929c4;
			--ibm-purple-80: #491d8b;
			--ibm-purple-90: #31135e;
			--ibm-purple-100: #1c0f30;

			--ibm-magenta-10: #fff0f7;
			--ibm-magenta-20: #ffd6e8;
			--ibm-magenta-30: #ffafd2;
			--ibm-magenta-40: #ff7eb6;
			--ibm-magenta-50: #ee5396;
			--ibm-magenta-60: #d12771;
			--ibm-magenta-70: #9f1853;
			--ibm-magenta-80: #740937;
			--ibm-magenta-90: #510224;
			--ibm-magenta-100: #2a0a18;

			--ibm-red-10: #fff1f1;
			--ibm-red-20: #ffd7d9;
			--ibm-red-30: #ffb3b8;
			--ibm-red-40: #ff8389;
			--ibm-red-50: #fa4d56;
			--ibm-red-60: #da1e28;
			--ibm-red-70: #a2191f;
			--ibm-red-80: #750e13;
			--ibm-red-90: #520408;
			--ibm-red-100: #2d0709;

			--ibm-orange-10: #fff2e8;
			--ibm-orange-20: #ffd9Be;
			--ibm-orange-30: #ffb784;
			--ibm-orange-40: #ff832b;
			--ibm-orange-50: #eb6200;
			--ibm-orange-60: #ba4e00;
			--ibm-orange-70: #8a3800;
			--ibm-orange-80: #5e2900;
			--ibm-orange-90: #3e1a00;
			--ibm-orange-100: #231000;

			--ibm-yellow-10: #fcf4d6;
			--ibm-yellow-20: #fddc69;
			--ibm-yellow-30: #f1c21b;
			--ibm-yellow-40: #d2a106;
			--ibm-yellow-50: #b28600;
			--ibm-yellow-60: #8e6a00;
			--ibm-yellow-70: #684e00;
			--ibm-yellow-80: #483700;
			--ibm-yellow-90: #302400;
			--ibm-yellow-100: #1c1500;

			--ibm-gray-10: #f4f4f4;
			--ibm-gray-20: #e0e0e0;
			--ibm-gray-30: #c6c6c6;
			--ibm-gray-40: #a8a8a8;
			--ibm-gray-50: #8d8d8d;
			--ibm-gray-60: #6f6f6f;
			--ibm-gray-70: #525252;
			--ibm-gray-80: #393939;
			--ibm-gray-90: #262626;
			--ibm-gray-100: #161616;

			--ibm-cool-gray-10: #f2f4f8;
			--ibm-cool-gray-20: #dde1e6;
			--ibm-cool-gray-30: #c1c7cd;
			--ibm-cool-gray-40: #a2a9b0;
			--ibm-cool-gray-50: #878d96;
			--ibm-cool-gray-60: #697077;
			--ibm-cool-gray-70: #4d5358;
			--ibm-cool-gray-80: #343a3f;
			--ibm-cool-gray-90: #21272a;
			--ibm-cool-gray-100: #121619;

			--ibm-warm-gray-10: #f7f3f2;
			--ibm-warm-gray-20: #e5e0df;
			--ibm-warm-gray-30: #cac5c4;
			--ibm-warm-gray-40: #ada8a8;
			--ibm-warm-gray-50: #8f8b8b;
			--ibm-warm-gray-60: #736f6f;
			--ibm-warm-gray-70: #565151;
			--ibm-warm-gray-80: #3c3838;
			--ibm-warm-gray-90: #272525;
			--ibm-warm-gray-100: #171414;
	
			--ibm-neutral-1: rgb(253, 253, 253);
			--ibm-neutral-2: rgb(249, 249, 249);
			--ibm-neutral-3: rgb(244, 244, 244);
			--ibm-neutral-4: rgb(236, 236, 236);
	
			--ibm-cool-neutral-1: rgb(251, 253, 253);
			--ibm-cool-neutral-2: rgb(249, 249, 251);
			--ibm-cool-neutral-3: rgb(240, 242, 244);
			--ibm-cool-neutral-4: rgb(236, 240, 242);
	
			--ibm-warm-neutral-1: rgb(253, 251, 251);
			--ibm-warm-neutral-2: rgb(253, 251, 251);
			--ibm-warm-neutral-3: rgb(247, 245, 245);
			--ibm-warm-neutral-4: rgb(242, 238, 238);
	
			/*
			 * Theme Colors
			 */
			--tri-primary-dark-color: var(--ibm-gray-100);
			--tri-primary-color: var(--ibm-blue-60);
			--tri-primary-light-color: var(--ibm-blue-40);
	
			--tri-primary-color-10: var(--ibm-blue-10);
			--tri-primary-color-20: var(--ibm-blue-20);
			--tri-primary-color-30: var(--ibm-blue-30);
			--tri-primary-color-40: var(--ibm-blue-40);
			--tri-primary-color-50: var(--ibm-blue-50);
			--tri-primary-color-60: var(--ibm-blue-60);
			--tri-primary-color-70: var(--ibm-blue-70);
			--tri-primary-color-80: var(--ibm-blue-80);
			--tri-primary-color-90: var(--ibm-blue-90);
			--tri-primary-color-100: var(--ibm-blue-100);
	
			--tri-secondary-color: var(--ibm-gray-60);
			--tri-info-color: var(--ibm-blue-70);
			--tri-success-color: var(--ibm-green-50);
			--tri-warning-color: var(--ibm-yellow-30);
			--tri-major-warning-color: var(--ibm-orange-40);
			--tri-danger-color: var(--ibm-red-60);
			--tri-error-color: var(--ibm-red-60);
	
			--tri-disabled-dark-color: rgba(0,0,0,0.3); /* note: will not appear on black background */
			--tri-disabled-light-color: rgba(255,255,255,0.3); /* note: will not appear on white background */
	
			/*
			 * Overwriting Polymer's theme variables
			 */
			--primary-text-color: var(--tri-primary-content-color);
			--primary-background-color: var(--tri-primary-content-background-color);
			--secondary-text-color: var(--tri-primary-content-label-color);
			--disabled-text-color: var(--tri-disabled-light-color);
			--divider-color: var(--tri-primary-content-accent-color);
			--error-color: var(--tri-error-color);
			--primary-color: var(--tri-primary-color);
			--light-primary-color: var(--tri-primary-light-color);
			--dark-primary-color: var(--tri-primary-dark-color);
			--accent-color: var(--tri-primary-color);
			--light-accent-color: var(--tri-primary-light-color);
			--dark-accent-color: var(--tri-primary-dark-color);

			--triplat-date-picker-icon-color: var(--tri-primary-content-color);
			--triblock-tab-selected-band-color: rgb(15,98,254);
			--triblock-tab-selected-band-height: 3px;
			--triblock-tab-focused-band-height: 3px;
			--triblock-tab-focused-band-background-color: rgb(141,141,141);
			--triblock-tab-unselected-color : rgb(126,126,126);
			
			/*
			 * Font
			 */
			--tri-font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
			font-family: var(--tri-font-family);
			font-size: 14px;
			color: var(--tri-primary-content-color);
			/*
			 * General Content
			 */
			/* body */
			--tri-body-background-color: var(--ibm-gray-10);
			/* header */
			--tri-header-background-color: var(--tri-primary-dark-color);
			--tri-header-color: white;
			/* footer */
			--tri-footer-background-color: rgb(0,0,0);
			--tri-footer-color: white;
			--tri-footer-button: {
				background-color: var(--ibm-blue-60);
				color: white;
				height:40px;
			};
			--tri-footer-button-hover: {
				background-color: var(--ibm-blue-70);
				color: white;
			};
			--tri-footer-button-press: {
				background-color: var(--ibm-blue-80);
				color: white;
			};
			--tri-footer-secondary-button: {
				background-color: var(--tri-secondary-color);
				color: white;
				height:40px
			};
			--tri-footer-secondary-button-hover: {
				background-color: rgb(76,76,76);
				color: white;
			};
			--tri-footer-secondary-button-press: {
				background-color: var(--ibm-blue-70);
				color: white;
			};
			--tri-footer-danger-button: {
				border: 1px solid white;
				padding: var(--tri-button-1px-border-padding);
				background-color: var(--tri-footer-background-color);
				color: white;
			};
			--tri-footer-danger-button-hover: {
				background-color: var(--ibm-orange-30);
				color: white;
			};
			--tri-footer-danger-button-press: {
				background-color: var(--tri-danger-color);
				color: white;
			};
			--tri-footer-button-disabled: {
				border-color: var(--ibm-gray-60);
				background-color: var(--ibm-gray-70);
				color: var(--ibm-gray-40);
			};
			--tri-footer-icon-button-color: var(--ibm-blue-30);
			--tri-footer-icon-button-hover-color: var(--ibm-blue-50);
			--tri-footer-icon-button-press-color: var(--ibm-blue-10);
			/* primary content */
			--tri-primary-content-background-color: white;
			--tri-primary-content-color: black;
			--tri-primary-content-accent-color: var(--ibm-gray-20);
			--tri-primary-content-label-color: var(--ibm-gray-60);
			/*
			 * Buttons
			 */
			--tri-button-padding: 12px 24px;
			--tri-button-1px-border-padding: 11px 23px; /* subtracting the 1px border from the default padding */
			--tri-button-2px-border-padding: 10px 22px; /* subtracting the 2px border from the default padding */
			--tri-button-3px-border-padding: 9px 21px; /* subtracting the 3px border from the default padding */
			/* primary */
			--tri-primary-button: {
				padding: var(--tri-button-padding);
				background-color:var(--ibm-blue-60);
				color: white;
			};
			--tri-primary-button-hover: {
				background-color: #0353e9;
				color: white;
			};
			--tri-primary-button-press: {
				background-color: var(--ibm-blue-80);
				color: white;
			};
			/* primary-outline */
			--tri-primary-outline-button: {
				border: 1px solid var(--ibm-blue-60);
				padding: var(--tri-button-1px-border-padding);
				background-color: white;
				color: var(--ibm-blue-60);
			};
			--tri-primary-outline-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-blue-70);
				color: white;
			};
			--tri-primary-outline-button-press: {
				background-color: var(--ibm-blue-70);
				color: white;
			};
			/* secondary */
			--tri-secondary-button: {
				padding: var(--tri-button-padding);
				background-color: var(--ibm-gray-80);
				color: white;
			};
			--tri-secondary-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: #4c4c4c;
				color: white;
			};
			--tri-secondary-button-press: {
				background-color: var(--ibm-gray-60);
				color: white;
			};
			--tri-secondary-button-disabled: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-gray-30);
				color: var(--ibm-gray-40);
			};
			/* info */
			--tri-info-button: {
				padding: var(--tri-button-padding);
				background-color: var(--ibm-blue-30);
				color: white;
			};
			--tri-info-button-hover: {
				background-color: var(--ibm-blue-20);
				color: white;
			};
			--tri-info-button-press: {
				background-color: var(--ibm-blue-40);
				color: white;
			};
			/* info-outline */
			--tri-info-outline-button: {
				border: 2px solid var(--ibm-blue-30);
				padding: var(--tri-button-2px-border-padding);
				background-color: white;
				color: var(--ibm-blue-30);
			};
			--tri-info-outline-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-blue-30);
				color: white;
			};
			--tri-info-outline-button-press: {
				background-color: var(--ibm-blue-40);
				color: white;
			};
			/* success */
			--tri-success-button: {
				padding: var(--tri-button-padding);
				background-color: var(--ibm-green-40);
				color: white;
			};
			--tri-success-button-hover: {
				background-color: var(--ibm-green-30);
				color: white;
			};
			--tri-success-button-press: {
				background-color: var(--ibm-green-60);
				color: white;
			};
			/* success-outline */
			--tri-success-outline-button: {
				border: 2px solid var(--ibm-green-40);
				padding: var(--tri-button-2px-border-padding);
				background-color: white;
				color: var(--ibm-green-40);
			};
			--tri-success-outline-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-green-40);
				color: white;
			};
			--tri-success-outline-button-press: {
				background-color: var(--ibm-green-60);
				color: white;
			};
			/* warning */
			--tri-warning-button: {
				padding: var(--tri-button-padding);
				background-color: var(--ibm-yellow-30);
				color: white;
			};
			--tri-warning-button-hover: {
				background-color: var(--ibm-yellow-20);
				color: white;
			};
			--tri-warning-button-press: {
				background-color: var(--ibm-yellow-40);
				color: white;
			};
			/* warning-outline */
			--tri-warning-outline-button: {
				border: 2px solid var(--ibm-yellow-30);
				padding: var(--tri-button-2px-border-padding);
				background-color: white;
				color: var(--ibm-yellow-30);
			};
			--tri-warning-outline-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-yellow-30);
				color: white;
			};
			--tri-warning-outline-button-press: {
				background-color: var(--ibm-yellow-40);
				color: white;
			};
			/* major-warning */
			--tri-major-warning-button: {
				padding: var(--tri-button-padding);
				background-color: var(--ibm-orange-40);
				color: white;
			};
			--tri-major-warning-button-hover: {
				background-color: var(--ibm-orange-20);
				color: white;
			};
			--tri-major-warning-button-press: {
				background-color: var(--ibm-orange-60);
				color: white;
			};
			/* major-warning-outline */
			--tri-major-warning-outline-button: {
				border: 2px solid var(--ibm-orange-40);
				padding: var(--tri-button-2px-border-padding);
				background-color: white;
				color: var(--ibm-orange-40);
			};
			--tri-major-warning-outline-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-orange-40);
				color: white;
			};
			--tri-major-warning-outline-button-press: {
				background-color: var(--ibm-orange-60);
				color: white;
			};
			/* danger */
			--tri-danger-button: {
				padding: var(--tri-button-padding);
				background-color: var(--ibm-red-60);
				color: white;
			};
			--tri-danger-button-hover: {
				background-color: #ba1b23;
				color: white;
			};
			--tri-danger-button-press: {
				background-color: var(--ibm-red-80);
				color: white;
			};
			/* danger-outline */
			--tri-danger-outline-button: {
				border: 1px solid var(--ibm-gray-30);
				padding: var(--tri-button-1px-border-padding);
				background-color: white;
				color: var(--ibm-orange-50);
			};
			--tri-danger-outline-button-hover: {
				border: none;
				padding: var(--tri-button-padding);
				background-color: var(--ibm-orange-50);
				color: white;
			};
			--tri-danger-outline-button-press: {
				background-color: var(--ibm-orange-70);
				color: white;
			};
			/* disabled */
			--tri-disabled-button: {
				padding: var(--tri-button-2px-border-padding);
				background-color: var(--ibm-gray-30);
				color: var(--ibm-gray-40);
			};
	
			/*
			 * Icon Buttons
			 */
			/* primary */
			--tri-primary-icon-button-color: var(--ibm-gray-80);
			--tri-primary-icon-button-hover-color: #4c4c4c;
			--tri-primary-icon-button-press-color: var(--ibm-gray-60);
			/* secondary */
			--tri-secondary-icon-button-color: var(--ibm-gray-50);
			--tri-secondary-icon-button-hover-color: var(--ibm-gray-30);
			--tri-secondary-icon-button-press-color: var(--ibm-gray-70);
			/* info */
			--tri-info-icon-button-color: var(--ibm-blue-30);
			--tri-info-icon-button-hover-color: var(--ibm-blue-20);
			--tri-info-icon-button-press-color: var(--ibm-blue-40);
			/* success */
			--tri-success-icon-button-color: var(--ibm-green-40);
			--tri-success-icon-button-hover-color: var(--ibm-green-30);
			--tri-success-icon-button-press-color: var(--ibm-green-60);
			/* warning */
			--tri-warning-icon-button-color: var(--ibm-yellow-30);
			--tri-warning-icon-button-hover-color: var(--ibm-yellow-20);
			--tri-warning-icon-button-press-color: var(--ibm-yellow-40);
			/* major-warning */
			--tri-major-warning-icon-button-color: var(--ibm-orange-40);
			--tri-major-warning-icon-button-hover-color: var(--ibm-orange-20);
			--tri-major-warning-icon-button-press-color: var(--ibm-orange-60);
			/* danger */
			--tri-danger-icon-button-color: var(--ibm-orange-50);
			--tri-danger-icon-button-hover-color: var(--ibm-orange-30);
			--tri-danger-icon-button-press-color: var(--ibm-orange-70);
			/* error */
			--tri-error-icon-button-color: var(--ibm-red-50);
			--tri-error-icon-button-hover-color: var(--ibm-red-30);
			--tri-error-icon-button-press-color: var(--ibm-red-70);
			/* disabled */
			--tri-disabled-icon-button-color: var(--ibm-gray-30);
	
			/*
			 * paper-button
			 */		
			--paper-button-flat-keyboard-focus: {
				outline: 3px double var(--ibm-gray-50);
			}

			/*
			* triblock-app-layout drawer
			*/
	
			--triblock-app-layout-mobile-drawer-background-color: var(--tri-primary-dark-color);
			--triblock-app-layout-mobile-drawer-hover-background-color: rgb(61,61,61);

			/*
			* triblock-slide-animation
			*/
			--triblock-slide-animation-background-color: rgb(61,61,61);
			--triblock-side-nav-item-selected-color: rgb(61,61,61);
			--triblock-side-nav-item-selected: {
				background-color: rgb(61,61,61);
			};
	
			/*
			 * paper-checkbox
			 */
			--paper-checkbox-unchecked-color: var(--tri-primary-dark-color);
			--paper-checkbox-unchecked-ink-color: var(--tri-primary-dark-color);
			--paper-checkbox-checked-color: var(--tri-primary-dark-color);
			--paper-checkbox-checked-ink-color: var(--tri-primary-dark-color);
			--paper-checkbox-label-color: var(--tri-primary-dark-color);
	
			/*
			 * paper-toggle-button
			 */
			--paper-toggle-button-unchecked-bar: {
				opacity: 1;
				background-color: var(--ibm-gray-50);
				border-radius: 0.9375rem;
				width: 48px;
				height: 24px;
			};
			--paper-toggle-button-unchecked-button-color: var(--ibm-gray-20);
			--paper-toggle-button-unchecked-button: {
				background-color: var(--ibm-gray-20);
				top: 3px;
				left: 3px;
				height: 18px;
				width: 18px;
				box-shadow: none;
			}
			--paper-toggle-button-checked-bar: {
				opacity: 1;
				background-color: var(--ibm-green-50);
			};
			--paper-toggle-button-checked-button-color: white;
			--paper-toggle-button-checked-button: {
				background-color: white;
				-webkit-transform: translate(24px, 0) !important;
				transform: translate(24px, 0) !important;
				top: 3px;
				left: 3px;
				height: 18px;
				width: 18px;
			}

			/*
			 * paper-dialog
			 */
			--paper-dialog: {
				font-family: var(--tri-font-family);
			};
			--paper-dialog-title: {
				font-family: var(--tri-font-family);
			};
	
			/*
			 * paper-icon-button
			 */
			--paper-icon-button-disabled-text: var(--tri-disabled-dark-color);
	
			/*
			 * paper-input
			 */
			--paper-input-container-color: var(--tri-primary-content-label-color);
			--paper-input-container-input-color: var(--tri-primary-content-color);
			--paper-input-container-focus-color: var(--tri-primary-color);
			--paper-input-container-invalid-color: var(--tri-error-color);
			--paper-input-container-input: {
				font-family: var(--tri-font-family);
			};
			--paper-input-container-label: {
				font-family: var(--tri-font-family);
			};
	
			/*
			 * paper-item
			 */
			--paper-item: {
				font-family: var(--tri-font-family);
			};
			--paper-item-disabled-color: var(--tri-disabled-dark-color);
			--triplat-select-input-paper-item: {
				font-family: var(--tri-font-family);
			};
			
			/*
			 * paper-radio-button
			 */
			--paper-radio-button-unchecked-color: var(--tri-primary-dark-color);
			--paper-radio-button-unchecked-ink-color: var(--tri-primary-dark-color);
			--paper-radio-button-checked-color: var(--tri-primary-dark-color);
			--paper-radio-button-checked-ink-color: var(--tri-primary-dark-color);
			--paper-radio-button-label-color: var(--tri-primary-dark-color);
			
			/*
			 * paper-spinner
			 */
			--paper-spinner-layer-1-color: var(--tri-primary-color);
			--paper-spinner-layer-2-color: var(--tri-secondary-color);
			--paper-spinner-layer-3-color: var(--tri-primary-color);
			--paper-spinner-layer-4-color: var(--tri-secondary-color);
	
			/*
			 * paper-toolbar
			 */
			--paper-toolbar-height: 50px;
			--paper-toolbar-sm-height: 50px;
			--paper-toolbar-background: var(--tri-header-background-color);
			--paper-toolbar-color: var(--tri-header-color);
			--paper-toolbar-title: {
				font-family: var(--tri-font-family);
			};
			--paper-toolbar-content: {
				padding: 0 0 0 0;
			};
	
			/*
			 * paper-tooltip
			 */
			--paper-tooltip: {
				font-family: var(--tri-font-family);
				font-size: 14px;
			};

			/*
			 * triplat-ds-search-input
			 */
			--triplat-ds-search-input-dropdown-item-hover-border-color: #0353e9;
			--triplat-ds-search-input-dropdown-item-background-color: var(--tri-body-background-color);
			--triplat-ds-search-input-dropdown-header-background-color: var(--ibm-gray-30);
			--triplat-ds-search-input-dropdown-header-text-color: var(--tri-primary-content-color);
			--triplat-ds-search-input-dropdown-item-border-color: var(--ibm-gray-40);
			--triplat-ds-search-input-primary-text-color: var(--tri-primary-content-color);
			--triplat-ds-search-input-expand-filters-background-color: var(--tri-body-background-color);
			--triplat-ds-search-input-expand-filters-remove-icon-color: var(--tri-primary-content-color);
			--triplat-ds-search-input-filter-operator-background-color: var(--ibm-gray-30);
			--triplat-ds-search-input-border-color: var(--tri-body-background-color);
			
			/*
			 * triplat-search-input
			 */
			--triplat-search-input-dropdown-item-hover-border-color: #0353e9;
			--triplat-search-input-dropdown-item-background-color: var(--tri-body-background-color);
			--triplat-search-input-dropdown-header-background-color: var(--ibm-gray-30);
			--triplat-search-input-dropdown-header-text-color: var(--tri-primary-content-color);
			--triplat-search-input-dropdown-item-border-color: var(--ibm-gray-40);
			--triplat-search-input-primary-text-color: var(--tri-primary-content-color);
			--triplat-search-input-expand-filters-background-color: var(--tri-body-background-color);
			--triplat-search-input-expand-filters-remove-icon-color: var(--tri-primary-content-color);
			--triplat-search-input-filter-operator-background-color: var(--ibm-gray-30);
			--triplat-search-input-border-color: var(--tri-body-background-color);
			
			/*
			 * triplat-graphic-legend
			 */
			--triplat-graphic-legend-checkbox-color:  var(--tri-primary-dark-color);
			--triplat-graphic-legend-radio-color:  var(--tri-primary-dark-color);
		}
	
	</style>
</custom-style>
`;

addCustomStyle(customStyle0);
