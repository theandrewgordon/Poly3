/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriBlockAppLayoutBannerRoutingBehavior } from "../triblock-app-layout/triblock-app-layout-banner-routing-behavior.js";
import { TriHomeAppBehavior } from "../tricore-home-app-behavior/tricore-home-app-behavior.js";
import "../triblock-app-layout/triblock-app-layout.js";
import "./routes/triroutes-work-planner.js";
import "./app/trimain-work-planner.js";
import { getModuleUrl  } from "../tricore-util/tricore-util.js";

class TriviewWorkPlanner extends mixinBehaviors([TriPlatViewBehavior, TriBlockAppLayoutBannerRoutingBehavior, TriHomeAppBehavior], PolymerElement) {
	static get is() { return "triview-work-planner"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				triblock-app-layout {
					--triblock-app-layout-body-background-color: var(--primary-background-color);
					--triblock-app-layout-content-max-width: 100%;
				}
			</style>

			<triroutes-work-planner id="routesWorkPlanner"></triroutes-work-planner>

			<triblock-app-layout
				home-app="[[homeApp]]"
				app-label="[[homeAppLabel]]"
				mobile-page-label="[[mobilePageLabel]]"
				show-mobile-back-button="[[showMobileBackButton]]"
				disable-edge-swipe
				hide-signout-button="[[_isEmbedded(embedded)]]"
				display-button-label>

				<triblock-banner-button tap-handler="_navigateToHome" home slot="banner-button"></triblock-banner-button>
				<triblock-banner-button tap-handler="_navigateBack" back slot="banner-button"></triblock-banner-button>

				<dom-if id="mainWorkPlannerIf">
					<template>
						<trimain-work-planner id="mainWorkPlanner" content></trimain-work-planner>
					</template>
				</dom-if>
				
			</triblock-app-layout>
		`;
	}

	static get properties() {
		return {
			embedded: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();
		document.querySelector("body").style.height = "auto";

		var __dictionary__title =  "IBM TRIRIGA Work Planner";
		document.title = __dictionary__title;
		
		this.addEventListener("route-changed", (event) => this.manageBannerOnRouteChange(event.detail));
		afterNextRender(this, () => this._loadMainWorkPlanner());
	}

	_isEmbedded() {
		let _isInsideFrame = window.frameElement && window.frameElement.nodeName == "IFRAME";
		return this.embedded || _isInsideFrame;
	}

	_getDefaultAppLabel() {
		var __dictionary__appLabel =  "Work Planner";
		return __dictionary__appLabel;
	}

	_navigateToHome() {
		if (this.homeUrl) {
			location.assign(this.homeUrl);
		} else {
			this.$.routesWorkPlanner.openAssignment();
		}
	}

	_navigateBack() {
		this.navigateToPreviousRoutedPage();
	}

	_loadMainWorkPlanner() {
		this.shadowRoot.querySelector("#mainWorkPlannerIf").if = true;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/triview-work-planner-dev.js");
	}
}

window.customElements.define(TriviewWorkPlanner.is, TriviewWorkPlanner);