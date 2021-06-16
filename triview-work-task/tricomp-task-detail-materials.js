/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-routing/triplat-route-selector.js";
import "../triplat-number-input/triplat-number-input.js";
import "../triblock-confirmation-popup/triblock-confirmation-popup.js";
import "../triblock-table/triblock-table.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-spinner/paper-spinner.js";
import "../@polymer/paper-button/paper-button.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./tristyles-work-task-app.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import { TriroutesMaterial } from "./triroutes-material.js";
import "./triservice-work-task.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined, getModuleUrl } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import "./tripage-material.js";
import { computeHideActionBar } from "./triutils.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-detail-section work-task-popup tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				.section-content {
					overflow: auto;
					padding: 0 0 5px 0;
				}

				:host([small-layout]) .section-content {
					padding: 0 0 50px 0;
				}

				.data-table-small {
					@apply --layout-flex;
					border-bottom:1px solid var(--ibm-gray-30); 
					--triblock-table-header: {
					display: none;
				};
					--triblock-table-row-container: {
						padding: 5px 15px;
					}
				}

				.data-table-large {
					@apply --layout-flex;
					margin:0px 15px 15px 15px;
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};
					--triblock-table-column-divider: {
						display: none;
					};
				}

				paper-icon-button {
					height: 22px;
					width: 22px;
					padding: 0px;
					color: var(--ibm-blue-50);
				}

				.material-section {
					@apply --layout-horizontal;
					@apply --layout-center;
					@apply --layout-flex;
				}

				.material-data {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.quantity-text {
					@apply --layout-horizontal;
				}

				:host([dir="ltr"]) .quantity-text > * {
					padding-right: 3px;
				}

				:host([dir="rtl"]) .quantity-text > * {
					padding-left: 3px;
				}

				.material-id {
					color: var(--ibm-blue-40);
				}
			
		</style>

		<triplat-route name="taskMaterials" params="{{_taskMaterialsParams}}" on-route-active="_onRouteActive"></triplat-route>

		<triservice-work-task id="workTaskService" materials="{{_materials}}" materials-count="{{_materialsCount}}" quantities="{{_quantities}}" loading-materials="{{_loadingMaterials}}" loading-material-remove-action="{{_loadingMaterialRemoveAction}}"></triservice-work-task>

		<triroutes-material detail-route-active="{{_materialPageOpened}}"></triroutes-material>

		<triplat-route-selector no-initial-route="">
			<iron-selector>
				<tricomp-task-detail-section small-layout="[[smallLayout]]" route="taskMaterialHome" default-route="" header="[[_header]]" aria-label="[[_header]]" opened="{{opened}}" count="[[_materialsCount]]" enable-add="" readonly="[[readonly]]" loading="[[_loading]]" alt-add-new="[[_altAddNew]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">
					<div class="section-content" slot="section-content">
						<tricomp-task-id task="[[task]]" hidden\$="[[!smallLayout]]"></tricomp-task-id>
		
						<template is="dom-if" if="[[_materials]]" restamp="">
							<template is="dom-if" if="[[smallLayout]]">
								<triblock-table class="data-table-small" data="[[_materials]]" on-row-tap="_materialSelected">
									<triblock-table-column>
										<template>
											<div class="material-section">
												<div class="material-data">
													<div class="material-id">[[item.id]]</div>
													<div>[[item.description]]</div>
													<div class="quantity-text">
														<span>Quantity:</span>
														<triplat-number-input readonly="" unformatted-value="{{item.quantity}}" user="[[currentUser]]" uom="[[item.quantityUOM]]" uom-list="[[_quantities]]">
															</triplat-number-input>
														<span>[[item.quantityUOMDisplay]]</span>
													</div>
												</div>
												<paper-icon-button class="remove-icon" noink="" icon="ibm-glyphs:remove" on-tap="_removeTapped" disabled="[[readonly]]" danger="" hidden\$="[[item.loading]]"></paper-icon-button> 
												<paper-spinner active="[[item.loading]]" hidden="[[!item.loading]]"></paper-spinner>
											</div>
										</template>
									</triblock-table-column>
								</triblock-table>
							</template>
							<template is="dom-if" if="[[!smallLayout]]" restamp="">
								<triblock-table class="data-table-large" data="[[_materials]]" fixed-header="" on-row-tap="_materialSelected">
									<triblock-table-column class="wide" title="ID">
										<template>
											<div class="material-id">[[item.id]]</div>
										</template>
									</triblock-table-column>
									<triblock-table-column class="wide" title="Item" property="description"></triblock-table-column>
									<triblock-table-column title="Quantity">
										<template>
											<div class="quantity-text">
												<triplat-number-input readonly="" unformatted-value="{{item.quantity}}" user="[[currentUser]]" uom="[[item.quantityUOM]]" uom-list="[[_quantities]]">
													</triplat-number-input>
												<span>[[item.quantityUOMDisplay]]</span>
											</div>
										</template>
									</triblock-table-column>
									<triblock-table-column class="remove-column">
										<template>
											<paper-icon-button noink="" icon="ibm-glyphs:remove" on-tap="_removeTapped" disabled="[[readonly]]" danger="" hidden\$="[[item.loading]]" alt="Remove material"></paper-icon-button>
											<paper-spinner active="[[item.loading]]" hidden="[[!item.loading]]"></paper-spinner>
										</template>
									</triblock-table-column>
								</triblock-table>
							</template>
						</template>
						<div class="action-bar" hidden\$="[[_computeHideActionBar(smallLayout, opened, _isMaterialPageActive, readonly)]]">
							<paper-button footer="" on-tap="_addTapped">Add Item</paper-button>
						</div>	
					</div>
				</tricomp-task-detail-section>

				<div route="taskMaterialDetail">
					<dom-if if="[[_materialPageOpened]]">
						<template>
							<tripage-material small-layout="[[smallLayout]]" current-user="[[currentUser]]" readonly="[[readonly]]" task="[[task]]" opened="{{_isMaterialPageActive}}"></tripage-material>
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

    is: "tricomp-task-detail-materials",

    behaviors: [
	    TriComputeLoadingBehavior,
	    TriTaskDetailSectionBehavior,
	    IronResizableBehavior,
	    TriDirBehavior
	],

    properties: {
		currentUser: Object,
		readonly: Boolean,
		task: Object,

		_isMaterialPageActive: {
			type: Boolean,
			value: false
		},

		_loadingMaterialRemoveAction: {
			type: Boolean
		},

		_loadingMaterials: {
			type: Boolean
		},

		_materials: {
			type: Array,
			notify: true
		},

		_quantities: {
			type: Array
		},

		_materialsCount: {
			type: Number
		},

		_modelForDelete: {
			type: Object
		},

		online: {
			type: Boolean,
			notify: true
		},

		_altAddNew: {
			type: String
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		},

		_taskMaterialsParams: {
			type: Object
		},

		_header: {
			type: String
		},

		_materialPageOpened: Boolean

	},

    observers: [
		"_notifyResize(_materials, opened, 500)",
		"_setLoadingBlockers(_sectionLoadingBlocker, _isMaterialPageActive, _loadingMaterialRemoveAction)",
		"_setValidLoadings(_loadingMaterials)"
	],

    listeners: {
		'add-tapped' : '_addTapped'
	},

    attached: function() {
		var __dictionary__header = "Materials";
		this.set("_header", __dictionary__header);

		var __dictionary__altAddNew = "Add material";
		var __dictionary__altExpand = "Expand materials section";
		var __dictionary__altCollapse = "Collapse materials section";
		this.set("_altAddNew", __dictionary__altAddNew);
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this.$.workTaskService.refreshMaterials(this._taskMaterialsParams.taskId);
			});
		} else {
			this.set('_modelForDelete', {});
		}
	},

    _computeHideActionBar: function(smallLayout, opened, isPageActive, readonly) {
	    return computeHideActionBar(smallLayout, opened, isPageActive, readonly);
	},

    _materialSelected: function(e) {
		e.stopPropagation();

		if (this._modelForDelete && this._modelForDelete.item && this._modelForDelete.item.loading) { return; }
		
		var selectedMaterial = e.detail.item;
		TriroutesMaterial.getInstance().openTaskMaterial(selectedMaterial._id, this._taskMaterialsParams.taskId);
	},

    _addTapped: function(e) {
		e.stopPropagation();
		TriroutesMaterial.getInstance().openTaskMaterial("-1", this.task._id);
	},

    _removeTapped: function(e) {
		e.stopPropagation();

		this._modelForDelete = e.model;

		if (this._modelForDelete && this._modelForDelete.item && this._modelForDelete.item.loading) { return; }

		this.$.removeConfPopup.openPopup();
	},

    _removeConfirmedTapped: function(e) {
		this._modelForDelete.set('item.loading', true);

		this.$.workTaskService.removeMaterial(this._taskMaterialsParams.taskId, this._modelForDelete.item._id)
			.then(function() {
				this.set('_modelForDelete', {});
			}.bind(this));
	},

    importMeta: getModuleUrl("triview-work-task/tricomp-task-detail-materials.js")
});