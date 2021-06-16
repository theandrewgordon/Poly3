/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import "../triplat-icon/ibm-icons.js";
import "../triblock-app-layout/triblock-app-layout.js";

import {
    TriBlockAppLayoutBannerRoutingBehaviorImpl,
	TriBlockAppLayoutBannerRoutingBehavior,
} from "../triblock-app-layout/triblock-app-layout-banner-routing-behavior.js";

import "../triblock-popup/triblock-popup.js";
import "../triblock-toast/triblock-toast.js";
import "../triview-work-task/triview-work-task-dev.js";
import "./tristyles-work-task-services-app.js";
import { TriroutesWorkTaskServices } from "./triroutes-work-task-services.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import "./trimain-work-task-services.js";

Polymer({
    _template: html`
		<style include="work-task-popup tristyles-theme">

				triblock-app-layout {
					--triblock-app-layout-body-background-color: var(--tri-primary-content-background-color);
					--triblock-app-layout-mobile-drawer-z-index: 104;
				}

				div[content],
				trimain-work-task-services {
					@apply --layout-flex;
					@apply --layout-vertical;
				}
			
		</style>

		<triroutes-work-task-services id="routes"></triroutes-work-task-services>

		<triblock-app-layout id="appLayout" app-label="[[_appLabel]]" mobile-page-label="[[mobilePageLabel]]" show-mobile-back-button="[[showMobileBackButton]]" hide-signout-button="[[_hideSignout(_isEmbedded, _online)]]" disable-edge-swipe="" display-button-label="">
			
			<triblock-banner-button back="" tap-handler="_handleBackButtonTap" slot="banner-button"></triblock-banner-button>
			<triblock-banner-button home="" tap-handler="_navigateHome" slot="banner-button"></triblock-banner-button>
			<triblock-banner-button tap-handler="_handleOfflineSettingsButtonTap" icon="ibm-glyphs:connection-status" label="Offline Status" slot="banner-button"></triblock-banner-button>

			<div content="">
				<dom-if if="[[_mainWorkTaskServicesLoaded]]">
					<template>
						<trimain-work-task-services online="{{_online}}" disable-offline="[[_isEmbedded]]"></trimain-work-task-services>
					</template>
				</dom-if>
			</div>
		</triblock-app-layout>

		<triblock-toast id="toastAlert" opened="{{_toastOpened}}"></triblock-toast>
		<triblock-popup id="popupAlert" class="popup-alert" with-backdrop="" small-screen-max-width="0px">
			<div class="tri-h2 header-warning">Error</div>
			<div class="content">
				<p>An error occurred. Please contact your server administrator.</p>
				<p>You can <a on-tap="_handleRefreshPage">refresh the page</a> or return to the application.</p>
			</div>
			<div class="footer">
				<dom-if if="[[_popupAlertLoaded]]">
					<template>
						<paper-button dialog-dismiss="">Got it</paper-button>
					</template>
				</dom-if>
			</div>
		</triblock-popup>
	`,

    is: "triview-work-task-services",

    behaviors: [
		TriPlatViewBehavior,
		TriBlockAppLayoutBannerRoutingBehavior
	],

    properties: {
		_online: {
			type: Object,
			value: true
		},

		_appLabel: {
			type: String
		},

		_isEmbedded: {
			type: Boolean
		},

		_toastOpened: {
			type: Boolean,
			observer: "_observeToastOpened"
		},

		_mainWorkTaskServicesLoaded: Boolean,
		_popupAlertLoaded: Boolean
	},

    listeners: {
		"route-changed": "_manageBannerOnRouteChange",
		"work-task-alert": "_raiseToastAlert",
		"work-task-popup-alert": "_raisePopupAlert"
	},

    ready: function() {
		var __dictionary__title =  "IBM TRIRIGA Work Task Services";
		document.title = __dictionary__title;

		var __dictionary__appLabel =  "Work Task Services";
		this._appLabel = __dictionary__appLabel;
		sessionStorage.setItem("workTaskServicesAppLabel", __dictionary__appLabel);

		afterNextRender(this, function() {
			this.set("_mainWorkTaskServicesLoaded", true);
			this.async(() => {
				this.set("_popupAlertLoaded", true);
			}, 1000);
			
			var isInIframe = window.frameElement && window.frameElement.nodeName == "IFRAME";
			this.set("_isEmbedded", isInIframe);
		});

		document.querySelector("body").style.height = "auto";
	},

    _navigateHome: function(e) {
		this.$.routes.navigateHome();
	},

    _handleBackButtonTap: function() {
		this.navigateToPreviousRoutedPage();
	},

    _manageBannerOnRouteChange: function(e) {
		this.manageBannerOnRouteChange(e.detail);
	},

    _handleOfflineSettingsButtonTap: function() {
		this.$.routes.openOfflineSettings();
	},

    _raiseToastAlert: function(e) {
		var alert = e.detail;
		if (alert && (alert.title != "" || alert.text != "")) {
			var alertToast = this.$.toastAlert;

			if (alertToast.opened) { alertToast.close(); }

			alertToast.setAttribute('role', 'alert');
			alertToast.setAttribute('aria-label', alert.title);
			alertToast.type = alert.type;
			alertToast.title = alert.title;
			alertToast.text = alert.text;

			alertToast.open();
		}
	},

    _raisePopupAlert: function() {
		this.$.popupAlert.openPopup();
	},

    _handleRefreshPage: function() {
		location.reload();
	},

    _hideSignout: function(isEmbedded, online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return isEmbedded || !online;
	},

    _observeToastOpened: function(opened) {
		if (!opened) {
			this.$.toastAlert.removeAttribute('role');
		}
	},

    importMeta: getModuleUrl("triview-work-task-services/triview-work-task-services-dev.js")
});