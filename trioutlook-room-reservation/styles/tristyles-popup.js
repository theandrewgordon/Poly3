/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

const popupStyles = `
<dom-module id="room-reservation-popup-styles">
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

			.close {
				position: absolute;
				top: 20px;
				cursor: pointer;
				width: 20px;
				height: 20px;
				--paper-icon-button: {
					padding: 0px;
				};
			}

			:host([dir="ltr"]) .close {
				right: 20px;
			}

			:host([dir="rtl"]) .close {
				left: 20px;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(popupStyles, "trioutlook-room-reservation/styles/tristyles-popup.js");
