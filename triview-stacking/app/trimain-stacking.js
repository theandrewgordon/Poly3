/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../@polymer/polymer/lib/legacy/class.js";

import "../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../@polymer/iron-pages/iron-pages.js";

import { getModuleUrl } from "../../tricore-util/tricore-util.js";

import "../../triplat-auth-check/triplat-auth-check.js";
import "../../triplat-loading-indicator/triplat-loading-indicator.js";
import "../../triplat-routing/triplat-route-selector.js";

import "../../triblock-popup/triblock-popup.js";
import { TriBlockViewResponsiveBehavior } from "../../triblock-responsive-layout/triblock-view-responsive-behavior.js";	
import "../../triblock-toast/triblock-toast.js";

import "../pages/stack-plan-details/tripage-stack-plan-details.js";
import "../pages/stack-plan-edit/tripage-stack-plan-edit.js";
import "../pages/stack-plan-new/tripage-stack-plan-new.js";
import "../pages/stack-plan-summary/tripage-stack-plan-summary.js";
import "../pages/stack-plans/tripage-stack-plans.js";
import "../services/triservice-ad-hoc-demand.js";
import "../services/triservice-loading.js";
import "../services/triservice-lookup-data.js";
import "../services/triservice-stack-plan.js";
import "../services/triservice-stack-plans.js";
import "../services/triservice-stacking.js";
import "../styles/tristyles-stacking.js";

class TriMainStacking extends mixinBehaviors([TriBlockViewResponsiveBehavior], PolymerElement) {
	static get is() { return "trimain-stacking"; }

	static get template() {
		return html`
			<style include="stacking-layout-styles stacking-popup-styles tristyles-theme">
				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.loading-indicator {
					--triplat-loading-indicator-clear-background: transparent;
					z-index: 200;
				}

				triblock-toast {
					--triblock-toast-message-container: {
						padding-top: 13px;
					}
					--triblock-toast-icon: {
						padding-top: 5px;
					}
				}
			</style>

			<triservice-stacking></triservice-stacking>
			<triservice-stack-plans></triservice-stack-plans>
			<triservice-stack-plan></triservice-stack-plan>
			<triservice-lookup-data></triservice-lookup-data>
			<triservice-ad-hoc-demand></triservice-ad-hoc-demand>
			<triservice-loading
				loading="{{_loading}}"
				loading-contact-roles-app-new="[[_loadingContactRolesAppNew]]"
				loading-contact-roles-app-edit="[[_loadingContactRolesAppEdit]]"
				>
			</triservice-loading>

			<triplat-auth-check app-name="stacking" auth="{{_stackingAuth}}"></triplat-auth-check>

			<triplat-route-selector id="routeSelector">
				<iron-pages>
					<tripage-stack-plans id="stackPlansPage" route="stackPlans" readonly="[[_authReadonly]]" home-clicked="[[homeClicked]]" default-route></tripage-stack-plans>
					<tripage-stack-plan-details id="stackPlanDetailsPage" route="stackPlanDetail" readonly="[[_authReadonly]]"></tripage-stack-plan-details>
					<tripage-stack-plan-summary id="stackPlanSummaryPage" route="stackPlanSummary" readonly="[[_authReadonly]]"></tripage-stack-plan-summary>
					<tripage-stack-plan-new id="stackPlanNewPage" route="stackPlanNew" readonly="[[_authReadonly]]" loading-contact-roles-app-new="{{_loadingContactRolesAppNew}}"></tripage-stack-plan-new>
					<tripage-stack-plan-edit id="stackPlanEditPage" route="stackPlanEdit" auth-readonly="[[_authReadonly]]" loading-contact-roles-app-edit="{{_loadingContactRolesAppEdit}}"></tripage-stack-plan-edit>
				</iron-pages>
			</triplat-route-selector>

			<triblock-toast id="toastAlert" on-opened-changed="{{_handleToastOpenedChanged}}"></triblock-toast>
			<triblock-popup id="popupAlert" class="popup-alert" with-backdrop small-screen-max-width="0px">
				<div class="tri-h2 header-warning">Error</div>
				<div class="content">
					<p>An error occurred. Please contact your server administrator.</p>
					<p>You can <a on-tap="_handleRefreshPage">refresh the page</a> or return to the application.</p>
				</div>
				<div class="footer"><paper-button dialog-dismiss>Got it</paper-button></div>
			</triblock-popup>

			<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>
		`;
	}

	static get properties() {
		return {
			_authReadonly: {
				type: Boolean,
				value: false,
				computed: "_isAuthReadonly(_stackingAuth)"
			},

			_loading: {
				type: Boolean
			},

			homeClicked: {
				type: Boolean,
				notify: true
			},

			_loadingContactRolesAppNew: {
				type: Boolean
			},

			_loadingContactRolesAppEdit: {
				type: Boolean
			}
		};
	}

	constructor() {
		super();
		this._onDSErrorListener = this._handeDSErrors.bind(this);
		this._onToastListener = this._handleToast.bind(this);
		this._onCloseToastListener = this._closeToastAlert.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("ds-add-error", this._onDSErrorListener);
		this.addEventListener("ds-create-error", this._onDSErrorListener);
		this.addEventListener("ds-delete-error", this._onDSErrorListener);
		this.addEventListener("ds-get-error", this._onDSErrorListener);
		this.addEventListener("ds-perform-action-error", this._onDSErrorListener);
		this.addEventListener("ds-remove-error", this._onDSErrorListener);
		this.addEventListener("ds-update-error", this._onDSErrorListener);
		this.addEventListener("toast-alert", this._onToastListener);
		this.addEventListener("close-toast-alert", this._onCloseToastListener);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("ds-add-error", this._onDSErrorListener);
		this.removeEventListener("ds-create-error", this._onDSErrorListener);
		this.removeEventListener("ds-delete-error", this._onDSErrorListener);
		this.removeEventListener("ds-get-error", this._onDSErrorListener);
		this.removeEventListener("ds-perform-action-error", this._onDSErrorListener);
		this.removeEventListener("ds-remove-error", this._onDSErrorListener);
		this.removeEventListener("ds-update-error", this._onDSErrorListener);
		this.removeEventListener("toast-alert", this._onToastListener);
		this.removeEventListener("close-toast-alert", this._onCloseToastListener);
	}

	_handeDSErrors(error) {
		if (error.detail && error.detail.errorType == "SecurityException") {
			return;
		}
		if (error.detail && error.detail.status == 401) {
			var __dictionary__unauthorized = "Session timeout or unauthorized access.";
			var __dictionary__title = "Unauthorized";
			this._openToastAlert({
				detail: {
					type: "error", title: __dictionary__title, text: __dictionary__unauthorized
				}
			});
			this.async(
				function() {
					location.reload();
				},
				5000
			);
			return;
		}
		console.error(error.detail);
		this.$.popupAlert.openPopup();
	}

	_handleToastOpenedChanged(event) {
		if (!event.detail.value) {
			this.$.toastAlert.removeAttribute("role");
		}
	}

	_openToastAlert(e) {
		var alert = e.detail;
		if (alert && (alert.title != "" || alert.text != "")) {
			var alertToast = this.$.toastAlert;

			if (alertToast.opened) { alertToast.close(); }

			alertToast.setAttribute("role", "alert");
			alertToast.setAttribute("aria-label", alert.title);
			alertToast.type = alert.type;
			alertToast.title = alert.title;
			alertToast.text = alert.text;

			alertToast.open();
		}
	}

	_closeToastAlert() {
		var alertToast = this.$.toastAlert;
		if (alertToast.opened) alertToast.close();
	}

	_handleRefreshPage() {
		location.reload();
	}

	_isAuthReadonly(auth) {
		return auth.canRead && !auth.canCreate && !auth.canDelete && !auth.canUpdate;
	}

	_handleToast(e) {
		const detail = e.detail;
		this._openToastAlert({
			detail: detail
		});
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/app/trimain-stacking.js");
	}
};

window.customElements.define(TriMainStacking.is, TriMainStacking);
