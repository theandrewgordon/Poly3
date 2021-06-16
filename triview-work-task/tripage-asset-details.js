/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../@polymer/iron-pages/iron-pages.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-tabs/triblock-tabs.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import "./triservice-asset.js";
import "./triservice-work-task.js";
import "./tristyles-work-task-app.js";
import "./tricomp-task-id.js";
import "./tricomp-asset-detail-card.js";
import "./tricomp-asset-specific-detail.js";
import "./tricomp-floor-plan.js";
import "./tricomp-procedures-link.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import "../triplat-bim/triplat-bim-model.js";
import "../triplat-bim/triplat-bim-viewer.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-shared-app-layout-styles work-task-tabs tristyles-theme">

				:host {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.container {
					@apply --layout-vertical;
					@apply --layout-flex;
				}
				
				#floorPlanPage {
					@apply --layout-flex; 
					@apply --layout-vertical;
				}

				#detailsPage {
					padding: 10px 15px;
					overflow: auto;
				}

				:host(:not([_small-layout])) #detailsPage {
					padding: 20px 45px
				}

				.asset-basic-details {
					@apply --layout-horizontal;
					@apply --layout-center;
					background-color: rgb(244, 244, 244);
				}

				:host(:not([_small-layout])) tricomp-asset-detail-card {
					background-color: var(--ibm-neutral-3);	
					padding: 20px 40px 20px;
				}

				triblock-tabs {
					--triblock-tabs-background-color: white;
					--triblock-tab-background-color: white;
					--triblock-tabs: {
						padding: 0 20px;
					}
				}

				:host(:not([_small-layout])) triblock-tabs {
					--triblock-tabs-background-color: var(--ibm-neutral-3);
					--triblock-tab-background-color: var(--ibm-neutral-3);
					--triblock-tabs: {
						padding: 0px 45px;
					}
				}

				tricomp-floor-plan {
					--tricomp-floor-plan-expand-icon: {
						bottom: 60px;
					};

					--tricomp-floor-plan-footer-container: {
						bottom: 53px;
					}
				}

				#bimPage {
					@apply --layout-flex;
				}
			
		</style>

		<triplat-route name="assetDetails" params="{{_assetDetailsParams}}" active="{{_opened}}" on-route-active="_onRouteActive"></triplat-route>

		<triservice-asset id="assetService" asset="{{_asset}}" loading-asset="{{_loadingAsset}}" loading-documents="{{_loadingDocuments}}"></triservice-asset>

		<triservice-work-task id="workTaskService" small-layout="{{_smallLayout}}" space-label-styles="{{_spaceLabelStyles}}"></triservice-work-task>

		<dom-if if="[[_loadBIM]]">
			<template>
				<triplat-bim-model id="bimModel" buildingspec="[[_buildingId]]" hasmodel="{{_hasBimModel}}" model="{{_bimModel}}"></triplat-bim-model>
			</template>
		</dom-if>

		<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>

		<tricomp-task-id task="[[task]]" hidden\$="[[!_smallLayout]]"></tricomp-task-id>

		<div class="container">
			<div class="asset-basic-details">
				<tricomp-asset-detail-card small-layout="[[_smallLayout]]" asset="[[_asset]]" map-link="[[_buildMapLink(_asset)]]" hide-procedure-count="" hide-remove-asset></tricomp-asset-detail-card>
				<tricomp-procedures-link id="proceduresLink" small-layout="[[_smallLayout]]" hidden\$="[[_smallLayout]]"></tricomp-procedures-link>
			</div>
			<triblock-tabs id="assetDetailTabs" class="page-tabs" hide-scroll-buttons="" fit-container="[[_smallLayout]]" selected="{{_selectedTab}}">
				<triblock-tab id="detailsTab" label="Asset Details" slot="tab"></triblock-tab>
				<triblock-tab id="floorPlanTab" label="Floor Plan" slot="tab"></triblock-tab>
				<template is="dom-if" if="[[_displayBimTab(_hasBimModel, online)]]" restamp="">
					<triblock-tab id="bimTab" label="BIM" slot="tab"></triblock-tab>
				</template>
			</triblock-tabs>
			<iron-pages id="assetDetailsTabPages" selected="[[_selectedTab]]" attr-for-selected="tab">
				<div id="detailsPage" tab="detailsTab">
					<tricomp-asset-specific-detail id="specificDetail" asset="[[_asset]]" current-user="[[currentUser]]" online="[[online]]"></tricomp-asset-specific-detail>
				</div>
				<div id="floorPlanPage" tab="floorPlanTab">
					<tricomp-floor-plan id="floorPlan" small-layout="[[_smallLayout]]" online="[[online]]"></tricomp-floor-plan>
				</div>
				<div id="bimPage" tab="bimTab">
					<dom-if if="[[_loadBIM]]">
						<template>
							<triplat-bim-viewer id="bim" features="[[_viewerFeatures]]" recordkey="[[task._id]]"></triplat-bim-viewer>
						</template>
					</dom-if>
				</div>
			</iron-pages>
		</div>
	`,

    is: "tripage-asset-details",

    behaviors: [
		TriComputeLoadingBehavior,
		TriLocationDetailsBehavior
	],

    properties: {
		currentUser: Object,
		task: Object,

		_asset: {
			type: Object
		},

		_assetDetailsParams: {
			type: Object,
			value: function() {
				return {};
			}
		},

		_opened: {
			type: Boolean,
			value: false
		},

		_spaceLabelStyles: {
			type: Array
		},

		online: {
			type: Boolean,
			value: false
		},

		_loadingAsset: {
			type: Boolean
		},

		_loadingDocuments: {
			type: Boolean
		},

		_selectedTab: {
			type: String,
			value: "detailsTab"
		},

		_bimModel: {
			type: Object
		},

		_hasBimModel: {
			type: Boolean,
			value: false
		},

		_buildingId: {
			type: String,
			value: ""
		},

		_viewerFeatures: {
			type: Object,
			value: function() {
				return {
					views: true,
					markup: true,
					measure: true
				};
			}
		},

		_loadBIM: {
			type: Boolean,
			value: false
		},

		_smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_onAssetTabChanged(_asset, _selectedTab, online)",
		"_onAssetChanged(_asset, _opened)",
		"_onOnlineStatusChanged(online)",
		"_setValidLoadings(_loadingAsset, _loadingDocuments)"
	],

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() { 
				this._refreshAsset(e.detail.params.defaultFloorPlan);
				this.$.assetService.refreshAssetDocuments(this._assetDetailsParams.taskId, this._assetDetailsParams.assetId, true);
				this.$.specificDetail.scrollIntoView(true);
				this.$.detailsPage.scrollTop -= 10;
				if (this.online) {
					this.set("_loadBIM", true);	
				}
			});
		} else {
			this._selectedTab = "detailsTab";
			this.$.floorPlan.location = {};
			this.$.floorPlan.locationId = "";
			this.$.specificDetail.documentsOpened = false;
		}
	},

    _refreshAsset: function(defaultFloorPlan) {
		if (this._assetDetailsParams.assetId) {
			this.$.assetService.refreshAsset(this._assetDetailsParams.taskId, this._assetDetailsParams.assetId, true).then(function() {
				if (defaultFloorPlan == "true") {
					this._selectedTab = "floorPlanTab";
				}
				this._buildingId = this._computeBuildingId(this._asset);
			}.bind(this));
		}
	},

    _onAssetTabChanged: function(asset, selectedTab, online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (asset && asset._id && selectedTab && selectedTab == "floorPlanTab" && online) {
			// Set floor plan values when the page is opened, to avoid the missing graphic.
			this.$.floorPlan.location = asset;
			this.$.floorPlan.locationId = asset.spaceId;
			this.$.floorPlan.labelStyles = this._spaceLabelStyles;
			this.$.floorPlan.opened = this._opened;
		} else if (asset && asset._id && selectedTab && selectedTab == "bimTab" && online) {
			this.shadowRoot.querySelector("#bim").model = this._bimModel;
			this.shadowRoot.querySelector("#bim").value = asset.bimGuid;
		}
	},

    _onAssetChanged: function(asset, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		if (asset && opened) {
			afterNextRender(this, function() {
				this.$.proceduresLink.refreshAssetProcedures(this._assetDetailsParams.taskId, asset);
			});
		}
	},

    _computeBuildingId: function(asset) {
		return (asset && asset.parentBuildingId != "") ? asset.parentBuildingId : "";
	},

    _onOnlineStatusChanged: function(online) {
		if (!online && this._selectedTab == "bimTab") { this.set("_selectedTab", "detailsTab"); }
	},

    _displayBimTab: function(hasBimModel, online) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return hasBimModel && online;
	},

	importMeta: getModuleUrl("triview-work-task/tripage-asset-details.js")
})