/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { getModuleUrl } from "../tricore-util/tricore-util.js";

import { pathFromUrl, resolveCss } from "../@polymer/polymer/lib/utils/resolve-url.js";
const importPath = pathFromUrl(getModuleUrl("triview-locate/tristyles-locate-app.js").url);
const sharedAppLayoutStyles = document.createElement("template");
sharedAppLayoutStyles.setAttribute("style", "display: none;");

sharedAppLayoutStyles.innerHTML = resolveCss(`
<dom-module id="shared-app-layout-styles">
	<template>
		<style>

			triplat-route-selector, iron-pages, iron-pages > div {
				@apply --layout-flex;
				@apply --layout-vertical;
			}

			iron-pages {
				background-color: white;
			}

			iron-pages > *, iron-pages > div > * {
				@apply --layout-flex;
			}
		
		</style>
	</template>
</dom-module>
`, importPath);

document.head.appendChild(sharedAppLayoutStyles.content);
const sharedPageStyles = document.createElement("template");
sharedPageStyles.setAttribute("style", "display: none;");

sharedPageStyles.innerHTML = resolveCss(`
<dom-module id="shared-page-styles">
	<template>
		<style>

			.page-header {
				@apply --layout-justified;
				@apply --layout-horizontal;
				@apply --layout-center;
			}

			.header-text {
				font-weight: bold;
			}
		
		</style>
	</template>
</dom-module>
`, importPath);

document.head.appendChild(sharedPageStyles.content);
const locationDetailsStyles = document.createElement("template");
locationDetailsStyles.setAttribute("style", "display: none;");

locationDetailsStyles.innerHTML = resolveCss(`
<dom-module id="location-details-styles">
	<template>
		<style>

			:host {
				@apply --layout-vertical;
			}

			triblock-tabs {
				border-bottom: 1px solid var(--tri-primary-content-accent-color);
				box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2); 
				z-index: 1;
			}

			:host(:not([small-screen-width])) triblock-tabs {
				padding: 0 20px;
			}

			:host([small-screen-width]) triblock-tabs {
				padding: 0 15px;
			}

			.floor-details {
				min-height: 110px;
			}
		
		</style>
	</template>
</dom-module>
`, importPath);

document.head.appendChild(locationDetailsStyles.content);
const sharedLocateAppStyles = document.createElement("template");
sharedLocateAppStyles.setAttribute("style", "display: none;");

sharedLocateAppStyles.innerHTML = resolveCss(`
<dom-module id="shared-locate-app-styles">
	<template>
		<style>

			.empty-placeholder {
				@apply --layout-vertical;
				@apply --layout-center;
				text-align: center;
			}

			:host(:not([small-screen-width])) .empty-placeholder {
				padding-top: 75px;
			}

			:host([small-screen-width]) .empty-placeholder {
				padding-top: 50px;
			}
			
			.min-max-icon {
				position: absolute;
				right: 15px;
				bottom: 15px;
				padding: 5px;
				background-color: var(--ibm-neutral-2);
				opacity: 0.9;
				border: 1px solid var(--tri-body-background-color);
			}
			
			.minMaxIcon {
				--iron-icon-fill-color: var(--tri-primary-color);
			}
		
		</style>
	</template>
</dom-module>
`, importPath);

document.head.appendChild(sharedLocateAppStyles.content);
const sharedGraphicStyles = document.createElement("template");
sharedGraphicStyles.setAttribute("style", "display: none;");

sharedGraphicStyles.innerHTML = resolveCss(`
<dom-module id="shared-graphic-styles">
	<template>
		<style>

			.graphic-footer-container {
				@apply --layout-vertical;
				position: absolute;
				right: 0;
				left: 0;
				bottom: 0;
				z-index:1;
			}

			.slider {
				@apply --layout-self-center;
				max-width: 280px;
				opacity: 0.9;
				background-color: var(--ibm-neutral-2);
				border: 1px solid var(--ibm-gray-10);
				margin-bottom: 10px;
			}
		
		</style>
	</template>
</dom-module>
`, importPath);

document.head.appendChild(sharedGraphicStyles.content);
const locateTabs = document.createElement("template");
locateTabs.setAttribute("style", "display: none;");

locateTabs.innerHTML = resolveCss(`
<dom-module id="locate-tabs">
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
`, importPath);

document.head.appendChild(locateTabs.content);