/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { TriHomeAppBehavior } from "../tricore-home-app-behavior/tricore-home-app-behavior.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import "../triplat-icon/ibm-icons.js";
import "../triblock-app-layout/triblock-app-layout.js";

import {
    TriBlockAppLayoutBannerRoutingBehaviorImpl,
	TriBlockAppLayoutBannerRoutingBehavior,
} from "../triblock-app-layout/triblock-app-layout-banner-routing-behavior.js";

import "../triblock-popup/triblock-popup.js";
import "../triblock-toast/triblock-toast.js";
import "./tristyles-work-task-app.js";
import { TriroutesWorkTaskApp } from "./triroutes-work-task-app.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { getModuleUrl } from "../tricore-util/tricore-util.js";
import "./trimain-work-task.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-popup tristyles-theme">

				triblock-app-layout {
					--triblock-app-layout-body-background-color: white;
					--triblock-app-layout-mobile-drawer-z-index: 104;
				}

				div[content],
				trimain-work-task {
					@apply --layout-flex;
					@apply --layout-vertical;
				}
			
		</style>

		<triroutes-work-task-app id="workTaskAppRoutes"></triroutes-work-task-app>

		<triblock-app-layout id="appLayout" home-app="[[homeApp]]" disable="[[embedded]]" app-label="[[homeAppLabel]]" mobile-page-label="[[mobilePageLabel]]" show-mobile-back-button="[[showMobileBackButton]]" hide-signout-button="[[!online]]" disable-edge-swipe="" display-button-label="">

			<triblock-banner-button tap-handler="_navigateHome" home="" slot="banner-button"></triblock-banner-button>
			<triblock-banner-button back="" tap-handler="_handleBackButtonTap" slot="banner-button"></triblock-banner-button>
			<triblock-banner-button tap-handler="_handleOfflineSettingsButtonTap" icon="ibm-glyphs:connection-status" label="Offline Status" slot="banner-button"></triblock-banner-button>
			<div content="">
				<dom-if if="[[_mainWorkTaskLoaded]]">
					<template>
						<trimain-work-task online="{{online}}" disable-offline="[[embedded]]" embedded="[[embedded]]"></trimain-work-task>
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

    is: "triview-work-task",

    behaviors: [
		TriPlatViewBehavior,
		TriBlockAppLayoutBannerRoutingBehavior,
		TriHomeAppBehavior
	],

    properties: {
		embedded: {
			type: Boolean,
			value: false
		},

		online: {
			type: Boolean,
			value: true
		},

		_toastOpened: {
			type: Boolean,
			observer: "_observeToastOpened"
		},

		_mainWorkTaskLoaded: Boolean,
		_popupAlertLoaded: Boolean
	},

    listeners: {
		"route-changed": "_manageBannerOnRouteChange",
		"work-task-alert": "_raiseToastAlert",
		"work-task-popup-alert": "_raisePopupAlert"
	},

    attached: function() {
		afterNextRender(this, function() {
			this.set("_mainWorkTaskLoaded", true);
			this.async(() => {
				this.set("_popupAlertLoaded", true);
			}, 1000);
		});
	},

    ready: function() {
		document.querySelector("body").style.height = "auto";
	},

    _manageBannerOnRouteChange: function(e) {
		this.manageBannerOnRouteChange(e.detail);
	},

    _navigateHome: function(e) {
		if (this.homeUrl) {
			this._goToHomeUrl();
		} else {
			this.$.workTaskAppRoutes.navigateHome();
		}
	},

    _goToHomeUrl: function() {
		location.assign(this.homeUrl);
	},

    _getDefaultAppLabel: function() {
		var __dictionary__appLabel =  "Work Task";
		return __dictionary__appLabel;
	},

    _handleBackButtonTap: function() {
		this.navigateToPreviousRoutedPage();
	},

    _handleOfflineSettingsButtonTap: function() {
		this.$.workTaskAppRoutes.openOfflineSettings();
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

    _observeToastOpened: function(opened) {
		if (!opened) {
			this.$.toastAlert.removeAttribute('role');
		}
	},

    importMeta: getModuleUrl("triview-work-task/triview-work-task-dev.js")
});