/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";

import "../../triplat-ds/triplat-ds.js";
import "../../triplat-query/triplat-query.js";

import { groupBy } from "../utils/triutils-stacking.js";
import { TrimixinService } from "./trimixin-service.js";

class TriServiceStackPlans extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-stack-plans"; }

	static get template() {
		return html`
			<dom-if if="[[_isRootInstance]]">
				<template>
					<triplat-ds id="stackPlansDs" name="stackPlans" data="{{_stackPlansWithDuplicates}}" loading="{{_loadingStackPlans}}" manual></triplat-ds>

					<triplat-query data="[[_stackPlansWithBuildingsData]]" filtered-data-out="{{stackPlans}}">
						<triplat-query-sort name="[[stackPlansSortProp]]" desc="[[stackPlansSortDesc]]" type="[[stackPlansSortType]]"></triplat-query-sort>
					</triplat-query>
				</template>
			</dom-if>
		`;
	}

	static get properties() {
		return {
			stackPlans: {
				type: Array,
				notify: true
			},

			stackPlansSortProp: {
				type: String,
				notify: true,
				value: "name"
			},

			stackPlansSortDesc: {
				type: Boolean,
				notify: true,
				value: false
			},

			stackPlansSortType: {
				type: String,
				notify: true,
				value: "STRING"
			},

			loading: {
				type: Boolean,
				value: false,
				notify: true
			},

			_loadingStackPlans: {
				type: Boolean,
				value: false
			},

			_stackPlansWithDuplicates: Array,

			_stackPlansWithBuildingsData: {
				type: Array,
				value: function () { return []; }
			},

			noStackPlans: {
				type: Boolean,
				notify: true
			}
		};
	}

	static get observers() {
		return [
			"_handleLoadingChanged(_loadingStackPlans)"
		]
	}

	refreshStackPlans() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#stackPlansDs").refresh()
				.then(function(success) {
					this.set('_stackPlansWithBuildingsData', []);
					var stackPlansWithDupes = success.data;
					if (stackPlansWithDupes && stackPlansWithDupes.length > 0) {
						var groupedByRecordId = groupBy(stackPlansWithDupes, "_id");
						Object.keys(groupedByRecordId).forEach(function(key) {
							var group = groupedByRecordId[key];
							var merged = null;
							var buildingNames = [];
							if (group.length > 1) {
								group.forEach(function(stackPlan) {
									buildingNames.push(stackPlan.buildingName);
								}.bind(this));
							} else {
								buildingNames.push(group[0].buildingName);
							}
							merged = group[0];
							merged.buildingNames = buildingNames;
							this.push('_stackPlansWithBuildingsData', merged);
							buildingNames = [];
						}.bind(this));
						this.set('noStackPlans', false);
					}
					if(this._stackPlansWithBuildingsData.length == 0) 
						this.set('noStackPlans', true);
				}.bind(this));
		} else {
			return this._rootInstance.refreshStackPlans();
		}
	}
};

window.customElements.define(TriServiceStackPlans.is, TriServiceStackPlans);
