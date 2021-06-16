/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";

import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/iron-pages/iron-pages.js";

import "../../../@polymer/paper-button/paper-button.js";

import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";

import "../../../triplat-icon/ibm-icons-glyphs.js";

import "../../../triblock-popup/triblock-popup.js";
import { TriBlockViewResponsiveBehavior } from "../../../triblock-responsive-layout/triblock-view-responsive-behavior.js";
import "../../../triblock-tabs/triblock-tabs.js";

import "../../services/triservice-ad-hoc-demand.js";
import { getTriServiceStackPlan } from "../../services/triservice-stack-plan.js";
import "../../styles/tristyles-stacking.js";
import "./tricomp-history-demand.js";
import "./tricomp-new-demand.js";

class AdHocDemandComponent extends mixinBehaviors([TriBlockViewResponsiveBehavior, TriDirBehavior], PolymerElement) {
	static get is() { return "tricomp-ad-hoc-demand"; }

	static get template() {
		return html`
			<style include="stacking-shared-styles tristyles-theme">
				triblock-popup {
					@apply --layout-vertical;
					padding: 30px 20px 20px 20px;
				}
				triblock-popup:not([small-screen-width]) {
					border: 4px solid var(--tri-primary-content-accent-color);
					height: 80%;
					width: 80%;
				}

				.header {
					font-size: 28px;
					font-weight: 300;
					margin-bottom: 5px;
				}

				.content {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				triblock-tabs {
					border-bottom: 1px solid var(--tri-primary-content-accent-color);
					font-size: 14px;
					margin-bottom: 10px;

					--triblock-tabs-height: 45px;
					--triblock-tab: {
						font-size: 14px;
					};
				}

				iron-pages {
					@apply --layout-flex;
					@apply --layout-vertical;
				}

				.invalid-container {
					@apply --layout-center-justified;
					@apply --layout-end;
					@apply --layout-vertical;
					color: var(--ibm-orange-60);
					max-height: 40px;
					min-height: 40px;
					padding: 5px;
				}

				.invalid-text {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				iron-icon {
					padding: 0;
					height: 18px;
					width: 18px;
				}
				:host([dir="ltr"]) iron-icon {
					margin-right: 5px;
				}
				:host([dir="rtl"]) iron-icon {
					margin-left: 5px;
				}

				.footer {
					@apply --layout-end-justified;
					@apply --layout-horizontal;
				}
			</style>

			<triservice-ad-hoc-demand id="adHocDemandService"
				new-demands="{{_newDemands}}" history-demands="{{_historyDemands}}"></triservice-ad-hoc-demand>

			<triblock-popup id="adHocDemandPopup" modal on-iron-overlay-opened="_onPopupOpened" on-iron-overlay-closed="_onPopupClosed">
				<div class="header">Add Demand</div>

				<div class="content">
					<triblock-tabs selected="{{_selectedDemandTab}}" attr-for-selected="index" badge-max-number="99" hide-scroll-buttons>
						<triblock-tab id="newDemandTab" index="0" label="New Demand" badge-max-number="99" badge-number="[[_computeLength(_newDemands.*)]]" slot="tab"></triblock-tab>
						<triblock-tab id="demandHistoryTab" index="1" label="Demand History" badge-max-number="99" badge-number="[[_computeLength(_historyDemands.*)]]" slot="tab"></triblock-tab>
					</triblock-tabs>

					<iron-pages selected="[[_selectedDemandTab]]">
						<tricomp-new-demand id="newDemand" fit-into="[[_fitInto]]"></tricomp-new-demand>

						<tricomp-history-demand></tricomp-history-demand>
					</iron-pages>

					<div class="invalid-container">
						<dom-if if="[[_invalidFields]]">
							<template>
								<div class="invalid-text">
									<iron-icon icon="ibm-glyphs:close-cancel-error"></iron-icon> Please complete the required fields above
								</div>
							</template>
						</dom-if>
					</div>
				</div>

				<div class="footer">
					<paper-button class="small-button" dialog-dismiss secondary noink>Cancel</paper-button>
					<paper-button class="small-button" secondary noink on-tap="_saveAndClose">Save and close</paper-button>
					<paper-button class="small-button" noink on-tap="_addToStack">Add to stack</paper-button>
				</div>
			</triblock-popup>
		`;
	}

	static get properties() {
		return {
			_fitInto: {
				type: Object
			},

			_selectedDemandTab: {
				type: Number,
				value: 0
			},

			_newDemands: {
				type: Array
			},

			_historyDemands: {
				type: Array
			},

			_invalidFields: {
				type: Boolean
			}
		}
	}

	ready() {
		super.ready();
		afterNextRender(this, () => {
			if (!this._fitInto) this._fitInto = this.$.adHocDemandPopup;
		});
	}

	open() {
		let spaceClassList = getTriServiceStackPlan().spaceClassList;
		if (!spaceClassList || spaceClassList.length == 0) getTriServiceStackPlan().refreshSpaceClassList();
		let organizationList = getTriServiceStackPlan().organizationList;
		if (!organizationList || organizationList.length == 0) getTriServiceStackPlan().refreshOrganizationList();

		this.$.adHocDemandService.getDemands();

		this.$.adHocDemandPopup.openPopup();
	}

	close() {
		this.$.adHocDemandPopup.closePopup();
	}

	_onPopupOpened() {
		let popup = this.$.adHocDemandPopup;
		let currentZIndex = +popup.style.zIndex;
		let newZIndex = currentZIndex + 1;
		popup.style.zIndex = newZIndex.toString();
	}

	_onPopupClosed() {
		this._selectedDemandTab = 0;
		this._invalidFields = false;
	}

	_computeLength(arrayBase) {
		let array = arrayBase.base
		return (array) ? array.length : "";
	}

	_saveAndClose() {
		this.$.adHocDemandService.saveDemands()
			.then(() => {
				this.close();
			})
			.catch(() => {
				this.close();
			});
	}

	_addToStack() {
		if (this._newDemands && this._newDemands.length > 0) {
			this.$.newDemand.validateDemandsFields().then((result) => {
				this._invalidFields = result;
	
				if (!this._invalidFields) {
					this.$.adHocDemandService.addDemandToStack().then(() => {
						this.dispatchEvent(new CustomEvent('ad-hoc-demand-added', {
							bubbles: true,
							composed: true
						}));
						this.close();
					}, this);
				}
			}, this);
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-stacking/components/ad-hoc-demand/tricomp-ad-hoc-demand.js");
	}
}

window.customElements.define(AdHocDemandComponent.is, AdHocDemandComponent);