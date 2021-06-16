/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";

import { addDomStyleModule, addCustomStyle } from "../../tricore-util/tricore-util.js";
import "./tristyles-ibm-plex.js";

const carbonLayoutStyles = `
<dom-module id="carbon-style">
	<template>
		<style>
			paper-button[outlook-primary],
			paper-button[outlook-secondary] {
				border: 1px solid transparent;
				outline: none;
				color: var(--carbon-text-04);
				min-width: auto;
				padding: 7px 16px;
				font-size: 14px;
				line-height: 18px;
				font-weight: 400;
				letter-spacing: .16px;
				border-radius: 0px;
				text-align: center;
				text-transform: none;
				margin: 0 5px;
				font-family: var(--carbon-font-family);
			}

			paper-button[outlook-primary] {
				background-color: var(--carbon-interactive-01);
			}

			paper-button[outlook-primary]:hover {
				background-color: var(--carbon-hover-primary);
			}

			paper-button[outlook-primary][pressed] {
				background-color: var(--carbon-active-primary);
			}
			
			paper-button[outlook-primary][disabled],
			paper-button[outlook-secondary][disabled]  {
				background-color: var(--carbon-disabled-02);
				color: var(--carbon-disabled-03);
			}

			paper-button[outlook-primary][focused],
			paper-button[outlook-secondary][focused]  {
				border-color: var(--carbon-ui-02);
				outline: 2px solid var(--carbon-focus);
			}

			paper-button[outlook-secondary] {
				background-color: var(--carbon-interactive-02);
			}

			paper-button[outlook-secondary]:hover {
				background-color: var(--carbon-hover-secondary);
			}

			paper-button[outlook-secondary][pressed] {
				background-color: var(--carbon-active-secondary);
			}

			paper-icon-button[outlook-secondary] {
				@apply --layout-horizontal;
				height: 16px;
				width: 16px;
				padding: 0;
				color: var(--carbon-interactive-02);
			}

			paper-icon-button[outlook-secondary]:hover {
				color: var(--carbon-hover-secondary);
			}

			paper-icon-button[outlook-secondary]:[pressed] {
				color: var(--carbon-active-secondary);
			}

			paper-icon-button[outlook-secondary][disabled]  {
				color: var(--carbon-disabled-02);
			}

			.top-16 {
				margin-top: 16px;
			}

			.top-8 {
				margin-top: 8px;
			}

			.bottom-40 {
				margin-bottom: 40px;
			}
			.bottom-32 {
				margin-bottom: 32px;
			}

			.bottom-20 {
				margin-bottom: 20px;
			}

			.bottom-16 {
				margin-bottom: 16px;
			}

			.bottom-8 {
				margin-bottom: 8px;
			}

			.productive-heading-01 {
				color: var(--carbon-text-01);
				font-size: 14px;
				line-height: 18px;
				font-weight: 600;
				letter-spacing: .16px;
				font-family: var(--carbon-font-family);
			}

			.productive-heading-02 {
				color: var(--carbon-text-01);
				font-size: 16px;
				line-height: 22px;
				font-weight: 600;
				letter-spacing: 0px;
				font-family: var(--carbon-font-family);
			}

			.productive-heading-03 {
				color: var(--carbon-text-01);
				font-size: 20px;
				line-height: 26px;
				font-weight: 400;
				letter-spacing: 0px;
				font-family: var(--carbon-font-family);
			}

			.productive-heading-05 {
				color: var(--carbon-text-01);
				font-size: 32px;
				line-height: 40px;
				font-weight: 400;
				letter-spacing: 0px;
				font-family: var(--carbon-font-family);
			}
			
			.body-short-01 {
				color: var(--carbon-text-01);
				font-size: 14px;
				line-height: 18px;
				font-weight: 400;
				letter-spacing: .16px;
				font-family: var(--carbon-font-family);
			}

			.label-01 {
				color: var(--carbon-text-02);
				font-size: 12px;
				line-height: 16px;
				font-weight: 400;
				letter-spacing: .32px;
				font-family: var(--carbon-font-family);
			}

			.helper-text-01 {
				color: var(--carbon-text-01);
				font-size: 12px;
				line-height: 16px;
				font-weight: 400;
				letter-spacing: .32px;
				font-family: var(--carbon-font-family);
			}

			.link-01 {
				color: var(--carbon-interactive-01);
				cursor: pointer;
				font-family: var(--carbon-font-family);
			}

			.link-01:focus {
				color: var(--carbon-focus);
			}

			.link-01:hover {
				color: var(--carbon-hover-primary-text);
			}
		</style>
	</template>
</dom-module>
`;
addDomStyleModule(carbonLayoutStyles, "trioutlook-room-reservation/styles/tristyles-carbon-theme.js");

const carbonThemeStyles = `
	<custom-style>
		<style is="carbon-theme-gray-10" include="tristyles-ibm-plex-fonts">

			html {
				--carbon-blue-10: #edf4ff;
				--carbon-blue-20: #c9deff;
				--carbon-blue-30: #97c1ff;
				--carbon-blue-40: #6ea6ff;
				--carbon-blue-50: #408bfc;
				--carbon-blue-60: #0062ff;
				--carbon-blue-60-hover: #0353e9;
				--carbon-blue-70: #054ada;
				--carbon-blue-80: #0530ad;
				--carbon-blue-90: #061f80;
				--carbon-blue-100: #051243;

				--carbon-gray-10: #f3f3f3;
				--carbon-gray-10-hover: #e5e5e5;
				--carbon-gray-20: #dcdcdc;
				--carbon-gray-30: #bebebe;
				--carbon-gray-40: #a4a4a4;
				--carbon-gray-50: #8c8c8c;
				--carbon-gray-60: #6f6f6f;
				--carbon-gray-70: #565656;
				--carbon-gray-80: #3d3d3d;
				--carbon-gray-80-hover: #4c4c4c;
				--carbon-gray-90: #282828;
				--carbon-gray-100: #171717;

				--carbon-green-10: #dafbe4;
				--carbon-green-20: #9deeb2;
				--carbon-green-30: #56d679;
				--carbon-green-40: #3dbb61;
				--carbon-green-50: #24a148;
				--carbon-green-60: #198038;
				--carbon-green-70: #10642a;
				--carbon-green-80: #054719;
				--carbon-green-90: #01330f;
				--carbon-green-100: #081b09;

				--carbon-red-50: #fb4b53;

				--carbon-white: #FFFFFF;

				--carbon-font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;

				font-family: var(--carbon-font-family);

				--carbon-active-primary: var(--carbon-blue-80);
				--carbon-active-secondary: var(--carbon-gray-60);

				--carbon-disabled-02: var(--carbon-gray-30);
				--carbon-disabled-03: var(--carbon-gray-50);

				--carbon-field-01: white;

				--carbon-focus: var(--carbon-blue-60);

				--carbon-icon-01: var(--carbon-gray-100);
				--carbon-icon-02: var(--carbon-gray-70);

				--carbon-interactive-01: var(--carbon-blue-60);
				--carbon-interactive-02: var(--carbon-gray-80);
				--carbon-interactive-04: var(--carbon-blue-60);

				--carbon-inverse-01: white;

				--carbon-hover-primary: var(--carbon-blue-60-hover);
				--carbon-hover-secondary: var(--carbon-gray-80-hover);

				--carbon-hover-primary-text: var(--carbon-blue-70);
				--carbon-hover-field: var(--carbon-gray-10-hover);

				--carbon-highlight: var(--carbon-blue-20);
				--carbon-highlight-hover: var(--carbon-blue-30);

				--carbon-link-01: var(--carbon-blue-60);

				--carbon-overlay-01: rgba(23, 23, 23, 0.7);

				--carbon-text-01: var(--carbon-gray-100);
				--carbon-text-02: var(--carbon-gray-70);
				--carbon-text-04: white;

				--carbon-ui-background: var(--carbon-gray-10);
				--carbon-ui-01: var(--carbon-white);
				--carbon-ui-02: var(--carbon-gray-10);
				--carbon-ui-03: var(--carbon-gray-20);
				--carbon-ui-04: var(--carbon-gray-50);
				--carbon-ui-05: var(--carbon-gray-100);

				--carbon-support-02: var(--carbon-green-50);
				--carbon-support-04: var(--carbon-blue-70);

				--carbon-inverse-support-01: var(--carbon-red-50);
				--carbon-inverse-support-02: var(--carbon-green-40);
				--carbon-inverse-support-04: var(--carbon-blue-50);
			}
		</style>
	</custom-style>
`;
addCustomStyle(carbonThemeStyles);