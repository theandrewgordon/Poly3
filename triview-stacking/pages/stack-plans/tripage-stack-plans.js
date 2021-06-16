/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { timeOut } from "../../../@polymer/polymer/lib/utils/async.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { IronResizableBehavior } from "../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/paper-spinner/paper-spinner.js";

import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../../triplat-routing/triplat-route.js";

import "../../../triblock-confirmation-popup/triblock-confirmation-popup.js";
import "../../../triblock-table/triblock-table.js";

import "../../components/overflow-text/tricomp-overflow-text.js";
import "../../components/stack-plan-buildings/tricomp-stack-plan-buildings.js";
import "../../routes/triroutes-stacking.js";
import "../../services/triservice-stack-plan.js";
import "../../services/triservice-stack-plans.js";
import "../../styles/tristyles-stacking.js";

class StackPlansPage extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
	static get is() { return "tripage-stack-plans"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles stacking-popup-styles tristyles-theme">

				:host {
					@apply --layout-flex;
					@apply --layout-vertical;
				}	

				.new-stack {
					width: 30px;
				}

				.header {
					padding: 20px;
				}

				.message-placeholder {
					@apply --layout-center;
					@apply --layout-vertical;
					padding-top: 75px;
				}

				.data-table-container {
					@apply --layout-flex;
					@apply --layout-vertical;
					padding: 20px;
					overflow-y: auto;
					-ms-overflow-style: none;
				}

				.id-column {
					--triblock-table-column-fixed-width: 80px;
				}

				.status-column {
					--triblock-table-column-fixed-width: 100px;
				}

				.action-column {
					@apply --layout-horizontal;
					@apply --layout-center-justified;
					--triblock-table-column-fixed-width: 50px;
				}

				.stackplan-name {
					@apply --layout-flex;
					flex-wrap: wrap;
				}

				#table {
					--triblock-table-cell: {
						padding: 10px;
					}
				}
			</style>

			<triroutes-stacking id="stackingRoute"></triroutes-stacking>

			<triplat-route name="stackPlans" on-route-active="_handleRouteActive"></triplat-route>

			<triservice-stack-plans id="stackPlansService" 
				stack-plans="{{_stackPlans}}" 
				stack-plans-sort-prop="{{_sortProp}}" 
				stack-plans-sort-desc="{{_sortDesc}}" 
				stack-plans-sort-type="{{_sortType}}" 
				stack-plans-loading="{{_stackPlansLoading}}" 
				no-stack-plans="{{noStackPlans}}">
			</triservice-stack-plans>

			<triservice-stack-plan id="stackPlanServiceForActions"></triservice-stack-plan>

			<div class="header">
				<div class="label-actions">
					<div class="page-title tri-h2">My Stack Plans</div>
					<div class="action-bar">
						<paper-button class="new-stack" on-tap="_navigateToNewPage" hidden\$="[[readonly]]">New Stack Plan</paper-button>
					</div>
				</div>
			</div>
			<div class="data-table-container">
				<template is="dom-if" if="[[_handleNoStackplansMessage(noStackPlans)]]">
					<div class="message-placeholder">
						<div>No stack plans are available.</div>
					</div>
				</template>
				<triblock-table id="table" fixed-header data="[[_stackPlans]]"
					sort-property="{{_sortProp}}" sort-descending="{{_sortDesc}}"
					sort-type="{{_sortType}}" on-row-tap="_handleOpenStackPlan"
					row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
					<triblock-table-column title="ID" property="id" class="id-column" sortable>
 						<template>
 							<div class="tri-link">[[item.id]]</div>
 						</template>
					</triblock-table-column>
					<triblock-table-column title="Name" property="name" class="stackplan-name-column" sortable>
						<template>
							<tricomp-overflow-text lines="3" class="stackplan-name">
								<span>[[item.name]]</span>
							</tricomp-overflow-text>
						</template>
					</triblock-table-column>
					<triblock-table-column title="Buildings" class="wide">
						<template>
							<tricomp-stack-plan-buildings building-names="[[item.buildingNames]]">
							</tricomp-stack-plan-buildings>
						</template>
					</triblock-table-column>
					<triblock-table-column title="Status" property="status" sortable class="status-column"></triblock-table-column>
					<triblock-table-column merge-with-previous-column hide="[[readonly]]" class="action-column">
 						<template>
							<paper-icon-button noink icon="ibm-glyphs:remove" on-tap="_removeTapped" danger 
							 	hidden\$="[[item.loading]]" alt="Delete stack plan" disabled="[[_disableDeleteButton(readonly, item.statusENUS)]]"></paper-icon-button>
 							<paper-spinner active="[[item.loading]]" hidden="[[!item.loading]]"></paper-spinner>
 						</template>
 					</triblock-table-column>
				</triblock-table>
			</div>

			<triblock-confirmation-popup id="deleteConfirmationPopup" class="conf-popup-alert" on-confirm-tapped="_deleteStackPlan">
				<div class="text" slot="text">
					<div class="header-warning tri-h2">Confirmation</div>
					<p>Are you sure you want to delete this stack plan?</p>
				</div>
			</triblock-confirmation-popup>
		`;
	}

	static get observers () {
		return [
			"_newStackplanPageAsLandingPage(noStackPlans, homeClicked)",
			"_observeStackPlans(_stackPlans.*)"
		];
	}

	static get properties () {
		return {
			_stackPlans: {
				type: Array,
				notify: true
			},

			_sortProp: {
				type: String,
				notify: true
			},
	
			_sortDesc: {
				type: Boolean,
				notify: true
			},
	
			_sortType: {
				type: String,
				notify: true
			},

			_computeRowAriaLabelCallback: {
				type: Function,
				value: function() {
					return this._computeRowAriaLabel.bind(this);
				}
			},

			_modelForDelete: Object,
			readonly: Boolean,

			homeClicked: {
				type: Boolean,
				notify: true
			}
		}
	}
	
	static get importMeta() {
		return getModuleUrl("triview-stacking/pages/stack-plans/tripage-stack-plans.js");
	}

	_handleRouteActive(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.stackPlansService.refreshStackPlans();
			});
		}
	}

	_handleNoStackplansMessage(noStackPlans) {
		return noStackPlans;
	}

	_newStackplanPageAsLandingPage(noStackPlans, homeClicked) {
		if(noStackPlans && !homeClicked) {
			this._navigateToNewPage();
		}
	}

	_observeStackPlans(stackPlansChange) {
		this._debounceObserveStackPlans = Debouncer.debounce(
			this._debounceObserveStackPlans,
			timeOut.after(500),
			() => {
				afterNextRender(this, () => {
					const tableEl = this.$.table;
					if (!stackPlansChange || stackPlansChange.path == "_stackPlans.length" || !tableEl) return;

					if (stackPlansChange.value && stackPlansChange.value.length > 0) {
						this.notifyResize();
					}
				});
			}
		);
	}

	_navigateToNewPage() {
		this.$.stackingRoute.navigateToStackPlanNewPage();
	}

	_handleOpenStackPlan(e) {
		e.stopPropagation();
		this.$.stackingRoute.navigateToStackPlanDetailsPage(e.detail.item._id);
	}

	_removeTapped(e) {
		e.stopPropagation();
		this._modelForDelete = e.model;
		this.$.deleteConfirmationPopup.openPopup();
	}

	_deleteStackPlan(e) {
		this._modelForDelete.set('item.loading', true);
		this.$.stackPlanServiceForActions.deleteStackPlan(this._modelForDelete.item._id)
			.then(success => {
				this.set('_modelForDelete', {});
				this.$.stackPlansService.refreshStackPlans();
			}).catch(() => {
				this._modelForDelete.set('item.loading', false);
				this.set('_modelForDelete', {});
			});
	}

	_computeRowAriaLabel(item) {
		var __dictionary__taskRowAriaLabel1 = "This stack plan is named";
		var __dictionary__taskRowAriaLabel2 = "with an ID of";
		return __dictionary__taskRowAriaLabel1 + " " + item.taskName + " " + __dictionary__taskRowAriaLabel2 + " " + item.taskID + "."
	}

	_disableDeleteButton(readonly, statusENUS) {
		return readonly || (statusENUS != "Draft");
	}
 }

window.customElements.define(StackPlansPage.is, StackPlansPage);
