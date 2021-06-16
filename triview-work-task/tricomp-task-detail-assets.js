/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import "../tricore-url/tricore-url.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-routing/triplat-route-selector.js";
import "../triblock-table/triblock-table.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/iron-selector/iron-selector.js";
import "../triapp-task-list/tricomp-overflow-text.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./tristyles-work-task-app.js";
import { TriLocationDetailsBehavior } from "./tribehav-location-details.js";
import { TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-asset-detail-card.js";
import "./tricomp-location-map-link.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import { TriroutesTask } from "./triroutes-task.js";
import { getTriRoutesAsset } from "./triroutes-asset.js";
import "./triservice-asset.js";
import "./tricomp-procedure-icon-count.js";
import "./tripage-asset-add.js";
import { computeHideActionBar, computeReadonly} from "./triutils.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				.section-content {
					max-height: 400px;
					overflow: auto;
				}
				:host([small-layout]) .section-content {
					max-height: 100%;
				}

				tricomp-task-id {
					margin-bottom: 5px;
				}

				.data-table-small {
					@apply --layout-flex;
					word-break: break-word;
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-header: {
						display: none;
					};

					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};
				}

				.data-table-large {
					@apply --layout-flex;
					word-break: break-word;
					margin:0px 15px 15px 15px;
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-column-divider: {
						display: none;
					};
				}

				.asset-id {
					color: var(--ibm-blue-40);
				}

				.icons-group {
					max-width: 180px;
				}

				.remove-spinner {
					padding: 8px;
					height: 24px;
					width: 24px;
				}
			
		</style>

		<triplat-route name="taskAssets" on-route-active="_onRouteActive" params="{{_taskAssetsParams}}"></triplat-route>

		<triservice-asset id="assetService" assets="{{_assets}}" assets-count="{{_assetsCount}}" loading-assets="{{_loadingAssets}}" loading-asset-remove-action="{{_loadingAssetRemoveAction}}"></triservice-asset>

		<triroutes-asset add-route-active="{{_assetAddPageIf}}"></triroutes-asset>

		<triplat-route-selector no-initial-route>
			<iron-selector>
				<tricomp-task-detail-section small-layout="[[smallLayout]]" route="taskAssetHome" default-route header="[[_header]]" aria-label="[[_header]]" count="[[_assetsCount]]" opened="{{opened}}" loading="[[_loading]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]" readonly="[[_computeReadonly(readonly, online)]]" enable-add on-add-tapped="_addTapped">
					<div class="section-content" slot="section-content">
						<template is="dom-if" if="[[smallLayout]]" restamp="">
							<tricomp-task-id task="[[task]]"></tricomp-task-id>

							<triblock-table class="data-table-small" data="[[_assets]]" on-row-tap="_openAssetDetails">
								<triblock-table-column remove-default-cell-padding="">
									<template>
										<tricomp-asset-detail-card
											small-layout="[[smallLayout]]"
											asset="[[item]]"
											task-id="[[_taskAssetsParams.taskId]]"
											map-link="[[_buildMapLink(item)]]"
											show-pin-icon 
											online="[[online]]"
											on-location-tapped="_openAssetFloorPlan"
											readonly="[[readonly]]"
											on-remove-tapped="_removeTapped"
											>
											</tricomp-asset-detail-card>
									</template>
								</triblock-table-column>
							</triblock-table>
						</template>

						<template is="dom-if" if="[[!smallLayout]]" restamp="">
							<triblock-table class="data-table-large" data="[[_assets]]" on-row-tap="_openAssetDetails" fixed-header="">
								<triblock-table-column title="ID">
									<template>
										<div class="asset-id">[[item.id]]</div>
									</template>
								</triblock-table-column>
								<triblock-table-column title="Name" property="name" class="wide"></triblock-table-column>
								<triblock-table-column title="Description" class="wide">
									<template>
										<tricomp-overflow-text lines="2" text="[[item.description]]"></tricomp-overflow-text>
									</template>
								</triblock-table-column>
								<triblock-table-column title="Building" property="buildingName"></triblock-table-column>
								<triblock-table-column title="Floor" property="floorName"></triblock-table-column>
								<triblock-table-column title="Room" property="roomName"></triblock-table-column>
								<triblock-table-column class="fixed-width-column icons-group right-aligned">
									<template>
										<tricomp-procedure-icon-count id="proceduresLink" class="procedure-count" item="{{item}}" task-id="[[_taskAssetsParams.taskId]]"></tricomp-procedure-icon-count>
										<paper-icon-button primary="" icon="ibm-glyphs:location" on-tap="_openAssetFloorPlan" disabled="[[_disableLocationIcon(item.hasGraphic, online)]]" alt="Open floor plan"></paper-icon-button>
										<div class="divider icons-divider"></div>
										<tricomp-location-map-link location="[[item]]" map-link="[[_buildMapLink(item)]]"></tricomp-location-map-link>
										<div class="divider icons-divider"></div>
										<div>
											<paper-icon-button noink icon="ibm-glyphs:remove" on-tap="_removeTapped" disabled="[[readonly]]" danger hidden\$="[[item.loading]]" alt="Remove asset"></paper-icon-button>
											<paper-spinner class="remove-spinner" active="[[item.loading]]" hidden\$="[[!item.loading]]"></paper-spinner>
										</div>
									</template>
								</triblock-table-column>
							</triblock-table>
						</template>
						<div class="action-bar" hidden\$="[[_computeHideActionBar(smallLayout, opened, _isAssetAddPageActive, readonly)]]">
							<paper-button footer on-tap="_addTapped">Add Item</paper-button>
						</div>	
					</div>
				</tricomp-task-detail-section>

				<div route="taskAssetAdd">
					<dom-if if="[[_assetAddPageIf]]">
						<template>
							<tripage-asset-add small-layout="[[smallLayout]]" task-id="[[task._id]]" opened="{{_isAssetAddPageActive}}" assets="[[_assets]]" readonly="[[_computeReadonly(readonly, online)]]">
							</tripage-asset-add>
						</template>
					</dom-if>
				</div>
			</iron-selector>
		</triplat-route-selector>

		<triblock-confirmation-popup id="removeConfPopup" class="conf-popup-alert" on-confirm-tapped="_removeConfirmedTapped">
			<div class="text" slot="text">
				<div class="header-warning tri-h2">Confirmation</div>
				<p>Do you want to remove this item from the list?</p>
			</div>
		</triblock-confirmation-popup>
	`,

    is: "tricomp-task-detail-assets",

    behaviors: [ 
		TriComputeLoadingBehavior,
		TriTaskDetailSectionBehavior,
		TriLocationDetailsBehavior
	],

    properties: {
		online: {
			type: Boolean
		},

		readonly: Boolean,

		task: Object,

		_assets: {
			type: Array
		},

		_assetsCount: {
			type: Number
		},

		_header: {
			type: String,
			value: ""
		},

		_loadingAssets: {
			type: Boolean
		},

		_taskAssetsParams: {
			type: Object
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		},

		_assetAddPageIf: Boolean,

		_isAssetAddPageActive: {
			type: Boolean,
			value: false
		},

		_modelForDelete: {
			type: Object
		},

		_loadingAssetRemoveAction: {
			type: Boolean
		},
	},

    observers: [
		"_notifyResize(_assets, opened, 500)",
		"_setLoadingBlockers(_sectionLoadingBlocker, _loadingAssetRemoveAction)",
		"_setValidLoadings(_loadingAssets)"
	],

    attached: function() {
		var __dictionary__header = "Assets";
		this.set("_header", __dictionary__header);

		var __dictionary__altExpand = "Expand assets section";
		var __dictionary__altCollapse = "Collapse assets section";
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.assetService.refreshTaskAssets(this._taskAssetsParams.taskId);
			});
		}
	},

    _openAssetDetails: function(e) {
		e.stopPropagation();
		var selectedAsset = e.detail.item || e.model.item;
		TriroutesTask.getInstance().openTaskAssetDetails(selectedAsset._id, this._taskAssetsParams.taskId);
	},

    _openAssetFloorPlan: function(e) {
		e.stopPropagation();
		var selectedAsset = (e.detail.item && e.detail.item._id) ? e.detail.item : e.model.item;
		TriroutesTask.getInstance().openTaskAssetDetails(selectedAsset._id, this._taskAssetsParams.taskId, true);
	},

	_addTapped: function (e) {
		e.stopPropagation();
		getTriRoutesAsset().openTaskAssetAdd();
	},

	_computeHideActionBar: function(smallLayout, opened, isPageActive, readonly) {
	    return computeHideActionBar(smallLayout, opened, isPageActive, readonly);
	},

	_removeTapped: function(e) {
		e.stopPropagation();

		this._modelForDelete = e.model;

		if (this._modelForDelete && this._modelForDelete.item && this._modelForDelete.item.loading) { return; }

		this.$.removeConfPopup.openPopup();
	},

	_removeConfirmedTapped: function(e) {
		this._modelForDelete.set('item.loading', true);

		this.$.assetService.removeAsset(this._taskAssetsParams.taskId, this._modelForDelete.item._id)
			.then(function() {
				this._modelForDelete.set('item.loading', false);
				this.set('_modelForDelete', {});
			}.bind(this));
	},

	_computeReadonly(readonly, online) {
		return computeReadonly(readonly, online);
	}
});