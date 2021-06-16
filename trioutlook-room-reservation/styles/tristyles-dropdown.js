/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";

import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

const dropdownStyles = `
<dom-module id="room-reservation-dropdown-styles">
	<template>
		<style>

			.content {
				@apply --layout-vertical;
				padding: 15px 20px;
				background-color: var(--carbon-field-01);
				border: 1px solid var(--carbon-ui-04);
				box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(dropdownStyles, "trioutlook-room-reservation/styles/tristyles-popup.js");
