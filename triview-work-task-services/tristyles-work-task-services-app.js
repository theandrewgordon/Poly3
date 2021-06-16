/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { addDomStyleModule } from "../tricore-util/tricore-util.js";

const workTaskServicesSharedAppLayoutStyles = `
<dom-module id="work-task-services-shared-app-layout-styles">
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
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(
    workTaskServicesSharedAppLayoutStyles,
	"triview-work-task-services/tristyles-work-task-services-app.js"
);

const workTaskServicesPopup = `
<dom-module id="work-task-services-popup">
	<template>
		<style>

			.popup-alert {
				border: 4px solid var(--tri-primary-content-accent-color);
				font-size: 14px;
				line-height: 20px;
				margin: 15px;
			}
			.popup-alert > * {
				margin-bottom: 20px;
			}
			.popup-alert .header {
				color: var(--tri-major-warning-color);
				font-weight: 300;
			}
			.popup-alert a {
				cursor: pointer;
			}
			.popup-alert .footer {
				@apply --layout-horizontal;
				@apply --layout-center-justified;
				margin-bottom: 0px;
			}
			.popup-alert paper-button {
				display: inline-block !important;
			}
		
		</style>
	</template>
</dom-module>
`;

addDomStyleModule(
    workTaskServicesPopup,
	"triview-work-task-services/tristyles-work-task-services-app.js"
);