/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-routing/triplat-route.js";

import { closeAllDropdowns } from "../components/dropdown/trimixin-dropdown.js";
import { TrimixinService } from "../services/trimixin-service.js";

class TriRoutesStacking extends TrimixinService(PolymerElement) {
	static get is() { return "triroutes-stacking"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-route id="stackPlansRoute" name="stackPlans" path="/" on-route-active="_onStackPlansRouteActive"></triplat-route>
					<triplat-route id="stackPlanDetailsRoute" name="stackPlanDetail" path="/:stackPlanId" on-route-active="_onStackPlanDetailsRouteActive"></triplat-route>
					<triplat-route id="stackPlanSummaryRoute" name="stackPlanSummary" path="/:stackPlanId/summary" on-route-active="_onStackPlanSummaryRouteActive"></triplat-route>
					<triplat-route id="stackPlanNewRoute" name="stackPlanNew" path="/new" on-route-active="_onStackPlanNewRouteActive"></triplat-route>
					<triplat-route id="stackPlanEditRoute" name="stackPlanEdit" path="/:stackPlanId/edit" on-route-active="_onStackPlanSetupScreenRouteActive"></triplat-route>
				</template>
			</dom-if>
		`;
	}

	navigateToStackPlansPage() {
		if (this._isRootInstance) {
			if (!location.hash || location.hash === "#!/") {
				location.reload();
			} else {
				this.shadowRoot.querySelector("#stackPlansRoute").navigate();
			}
		} else {
			this._rootInstance.navigateToStackPlansPage();
		}
	}

	navigateToStackPlanDetailsPage(stackPlanId) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanDetailsRoute").navigate({ stackPlanId: stackPlanId });
		} else {
			this._rootInstance.navigateToStackPlanDetailsPage(stackPlanId);
		}
	}

	navigateToStackPlanSummaryPage(stackPlanId) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanSummaryRoute").navigate({ stackPlanId: stackPlanId });
		} else {
			this._rootInstance.navigateToStackPlanSummaryPage(stackPlanId);
		}
	}

	navigateToStackPlanSetupScreenPage(id) {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanEditRoute").navigate({ stackPlanId: id});
		} else {
			this._rootInstance.navigateToStackPlanSetupScreenPage(id);
		}
	}

	navigateToStackPlanPage() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanDetailsRoute").navigate();
		} else {
			this._rootInstance.navigateToStackPlanPage();
		}
	}

	navigateToStackPlanNewPage() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlanNewRoute").navigate();
		} else {
			this._rootInstance.navigateToStackPlanNewPage();
		}
	}

	_onStackPlansRouteActive(e) {
		if (e.detail.active) closeAllDropdowns();
		this.dispatchEvent(
			new CustomEvent(
				"route-changed",
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: false },
					bubbles: true, composed: true
				}
			)
		);
	}

	_onStackPlanDetailsRouteActive(e) {
		if (e.detail.active) closeAllDropdowns();
		this.dispatchEvent(
			new CustomEvent(
				"route-changed",
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: true },
					bubbles: true, composed: true
				}
			)
		);
	}

	_onStackPlanSetupScreenRouteActive(e) {
		if (e.detail.active) closeAllDropdowns();
		this.dispatchEvent(
			new CustomEvent(
				"route-changed",
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: true },
					bubbles: true, composed: true
				}
			)
		);
	}

	_onStackPlanSummaryRouteActive(e) {
		if (e.detail.active) closeAllDropdowns();
		this.dispatchEvent(
			new CustomEvent(
				"route-changed",
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: true },
					bubbles: true, composed: true
				}
			)
		);
	}

	_onStackPlanNewRouteActive(e) {
		this.dispatchEvent(
			new CustomEvent(
				"route-changed",
				{
					detail: { active: e.detail.active, pageLabel: null, hasBackButton: true },
					bubbles: true, composed: true
				}
			)
		);
	}

};

window.customElements.define(TriRoutesStacking.is, TriRoutesStacking);
