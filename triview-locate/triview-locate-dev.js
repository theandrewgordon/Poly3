/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../tricore-url/tricore-url.js";
import { TriHomeAppBehavior } from "../tricore-home-app-behavior/tricore-home-app-behavior.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import "../triblock-app-layout/triblock-app-layout.js";

import {
    TriBlockAppLayoutBannerPopupBehaviorImpl,
	TriBlockAppLayoutBannerPopupBehavior,
} from "../triblock-app-layout/triblock-app-layout-banner-popup-behavior.js";

import "./tristyles-locate-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";
import "./trimain-locate.js";

Polymer({
    _template: html`
		<style include="shared-app-layout-styles tristyles-theme">

				triblock-app-layout {
					--triblock-app-layout-mobile-drawer-z-index: 104;
				}

				trimain-locate {
					@apply --layout-flex;
				}
			
		</style>

		<tricore-url id="triurl" hidden=""></tricore-url>

		<triblock-app-layout disable-edge-swipe="" disable="[[disableHeader]]" home-app="[[homeApp]]" app-label="[[homeAppLabel]]" mobile-page-label="[[mobilePageLabel]]" show-mobile-back-button="[[showMobileBackButton]]" hide-signout-button="[[_isEmbedded]]">

			<template is="dom-if" if="[[homeApp]]">
				<triblock-banner-button tap-handler="_navigateHome" home="" slot="banner-button"></triblock-banner-button>
			</template>
			<triblock-banner-button back="" tap-handler="_handleBackButtonTap" slot="banner-button"></triblock-banner-button>

			<dom-if if="[[_loadMainPageComp]]">
				<template>
					<trimain-locate id="locateMain" route="locationContext" content="" home-app="[[homeApp]]" override-building-id="[[overrideBuildingId]]">
					</trimain-locate>
				</template>
			</dom-if>

		</triblock-app-layout>
	`,

    is: "triview-locate",

    behaviors: [
		TriPlatViewBehavior, 
		TriBlockAppLayoutBannerPopupBehavior,
		TriHomeAppBehavior
	],

    properties: {
		disableHeader: {
			type: Boolean,
			value: false
		},
		_loadMainPageComp: {
			type: Boolean,
			value: false
		},
		overrideBuildingId: String
	},

    listeners: {
		'navigate-home': '_navigateHome',
	},

    attached: function() {
		this._readOverrideBuildingIdFromUrl();
		afterNextRender(this, function(){
			this._loadMainPage();

			/* 
			 * Hide the navbar if in iframe; used in Work Task Services.
			 */
			if (!this.disableHeader) {
				var isInIframe = window.frameElement && window.frameElement.nodeName == "IFRAME";
				this.set("_isEmbedded", isInIframe);
			}
			document.querySelector("body").style.height = "100%";
		});
	},

    _navigateHome: function(e) {
		if (this.homeUrl) {
			location.assign(this.homeUrl);
		} else {
			this.fire('navigate-default', {}, {node: this.shadowRoot.querySelector("#locateMain")});
		}
	},

    _loadMainPage: function() {
			this.set("_loadMainPageComp", true);
	},

    _getDefaultAppLabel: function() {
		var __dictionary__appLabel =  "Locate";
		return __dictionary__appLabel;
	},

    _handleBackButtonTap: function() {
		var isPopupOpened = this.isPopupOpened();
		if(isPopupOpened){
			this.managePopupBackBehavior();
		}else{
			this.navigateToPreviousRoutedPage();
		}
	},

    _readOverrideBuildingIdFromUrl: function() {
		if (this.overrideBuildingId) {
			return;
		}
		var overrideBuildingId = this._getURLParameter("overrideBuildingId");
		if (overrideBuildingId) {
			this.overrideBuildingId = overrideBuildingId;
		}
	},

    importMeta: getModuleUrl("triview-locate/triview-locate-dev.js")
});