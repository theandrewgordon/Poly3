/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import { TrimixinService } from "./trimixin-service.js";
import "./triservice-lookup-data.js";
import "./triservice-stack-plan.js";
import "./triservice-stack-plans.js";
import "./triservice-stacking.js";

class TriserviceLoading extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-loading"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triservice-lookup-data loading="{{_loadingLookupData}}"></triservice-lookup-data>
					<triservice-stack-plan loading="{{_loadingStackPlan}}"></triservice-stack-plan>
					<triservice-stack-plan loading="{{_loadingPlanningMoveItems}}"></triservice-stack-plan>
					<triservice-stack-plans loading="{{_loadingStackPlans}}"></triservice-stack-plans>
					<triservice-stacking loading="{{_loadingStacking}}"></triservice-stacking>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingLookupData: {
				type: Boolean,
				value: false
			},

			_loadingStackPlan: {
				type: Boolean,
				value: false
			},

			_loadingPlanningMoveItems: {
				type: Boolean,
				value: false
			},

			_loadingStackPlans: {
				type: Boolean,
				value: false
			},

			_loadingStacking: {
				type: Boolean,
				value: false
			},

			loadingContactRolesAppNew: {
				type: Boolean,
				value: false
			},

			loadingContactRolesAppEdit: {
				type: Boolean,
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingLookupData, _loadingStackPlan, _loadingPlanningMoveItems, _loadingStackPlans, _loadingStacking, _loadingPlanningMoveItems, loadingContactRolesAppNew, loadingContactRolesAppEdit)"
		]
	}
};

window.customElements.define(TriserviceLoading.is, TriserviceLoading);