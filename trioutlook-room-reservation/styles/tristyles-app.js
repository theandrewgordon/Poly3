/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { addDomStyleModule } from "../../tricore-util/tricore-util.js";

import "./tristyles-carbon-theme.js";

const appStyles = `
<dom-module id="room-reservation-app-styles">
	<template>
		<style include="carbon-style">

			triplat-route-selector, iron-pages {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			iron-pages > div {
				@apply --layout-flex;
				@apply --layout-vertical;
				background-color: var(--carbon-ui-background);
				overflow-y: auto;
			}

			iron-pages > div > * {
				@apply --layout-flex;
			}

			.divider {
				background-color: var(--carbon-ui-03);
			}

			.divider-horizontal {
				@apply --layout-self-stretch;
				min-height: 1px;
			}

			.divider-vertical {
				@apply --layout-self-stretch;
				min-width: 1px;
			}

		</style>
	</template>
</dom-module>
`;
addDomStyleModule(appStyles, "trioutlook-room-reservation/styles/tristyles-app.js");