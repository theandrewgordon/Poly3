/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

import { TriHomeAppBehavior } from "../tricore-home-app-behavior/tricore-home-app-behavior.js";
import { getModuleUrl, importJs } from "../tricore-util/tricore-util.js";

import { TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";

import "../triblock-app-layout/triblock-app-layout.js";
import { TriBlockAppLayoutBannerRoutingBehavior } from "../triblock-app-layout/triblock-app-layout-banner-routing-behavior.js";
import "../triblock-popup/triblock-popup.js";

import "./app/trimain-stacking.js";
import "./routes/triroutes-stacking.js";
import "./styles/tristyles-stacking.js";

const animationsImportPromise = importJs("../web-animations-js/web-animations-next-lite.min.js", "app/trimain-stacking.js");

animationsImportPromise.then(() => {
	class StackingView extends mixinBehaviors([TriPlatViewBehavior, TriBlockAppLayoutBannerRoutingBehavior, TriHomeAppBehavior], PolymerElement) {
		static get is() { return "triview-stacking"; }

		static get template() {
			return html`
				<style include="stacking-popup-styles tristyles-theme">
					triblock-app-layout {
						--triblock-app-layout-body-background-color: var(--primary-background-color);
						--triblock-app-layout-content-max-width: 1728px;
					}

					[content] {
						@apply --layout-flex;
					}
				</style>

				<triroutes-stacking id="routesStacking"></triroutes-stacking>

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

					<dom-if if="[[_loadMainStackingComp]]">
						<template>
							<trimain-stacking home-clicked="[[_homeClicked]]"content></trimain-stacking>
						</template>
					</dom-if>
				</triblock-app-layout>

				<triblock-popup id="localStorageAlert" class="popup-alert" with-backdrop small-screen-max-width="0px">
					<div class="tri-h2 header-warning">Warning</div>
					<div class="content">
						<p>Your browser reached its local storage limit. To free up space, either save or delete any unsaved stack plans.</p>
					</div>
					<div class="footer"><paper-button dialog-dismiss>Got it</paper-button></div>
				</triblock-popup>
			`;
		}

		static get properties() {
			return {
				embedded: {
					type: Boolean,
					value: false
				},

				_homeClicked: {
					type: Boolean,
					notify: true
				},

				_loadMainStackingComp: {
					type: Boolean,
					value: false
				}
			};
		}

		ready() {
			super.ready();
			document.querySelector("body").style.height = "auto";

			var __dictionary__title =  "IBM TRIRIGA Stacking";
			document.title = __dictionary__title;
			
			this.addEventListener("route-changed", (event) => this.manageBannerOnRouteChange(event.detail));
			afterNextRender(this, () => this._loadMainStacking());
		}

		connectedCallback() {
			super.connectedCallback();
			this.addEventListener("local-storage-open-popup", this._handleLocalStorageOpenPopup);
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this.removeEventListener("local-storage-open-popup", this._handleLocalStorageOpenPopup);
		}

		_isEmbedded() {
			let _isInsideFrame = window.frameElement && window.frameElement.nodeName == "IFRAME";
			return this.embedded || _isInsideFrame;
		}

		_getDefaultAppLabel() {
			var __dictionary__appLabel =  "Stacking";
			return __dictionary__appLabel;
		}

		_navigateToHome() {
			this._homeClicked = true;
			if (this.homeUrl) {
				location.assign(this.homeUrl);
			} else {
				this.$.routesStacking.navigateToStackPlansPage();
			}
		}

		_navigateBack() {
			this.navigateToPreviousRoutedPage();
		}

		_loadMainStacking() {
			this.set("_loadMainStackingComp", true);
		}

		_handleLocalStorageOpenPopup(e) {
			e.stopPropagation();
			this.$.localStorageAlert.openPopup();
		}

		static get importMeta() {
			return getModuleUrl("triview-stacking/triview-stacking-dev.js");
		}
	}

	window.customElements.define(StackingView.is, StackingView);
});