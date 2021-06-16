/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-routing/triplat-route.js";
import "../triblock-table/triblock-table.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import "./tristyles-work-task-app.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import "./tricomp-task-detail-section.js";
import "./tricomp-task-id.js";
import "./tricomp-procedure-detail-card.js";
import "./tricomp-procedure-status-bar.js";
import "./tricomp-procedure-list-filter.js";
import "../triapp-task-list/tricomp-search-field.js";
import "../triapp-task-list/tricomp-task-list-location.js";
import { TriroutesTask } from "./triroutes-task.js";
import "./triservice-procedure.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";

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

				:host(:not([small-layout])) .section-content {
					margin-left: 15px;
					margin-right: 15px;
				}

				.data-table-small {
					@apply --layout-flex;
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
					margin: 0px 0px 15px 0px;
					border-bottom:1px solid var(--ibm-gray-30);
					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};
					--triblock-table-header: {
						display: none;
					}
				}

				.column-center {
					--triblock-table-column-header-flex-alignment: center;
					--triblock-table-column-body-flex-alignment: center;
				}

				:host(:not([small-layout])) .filter {
					--tricomp-filter-desktop-container: {
						padding: 20px 0px 20px;
					}
				}

				:host([small-layout]) tricomp-search-field {
					--tricomp-search-field-paper-input-container: {
						margin: 0px 15px 10px;
					}
				}

				:host([small-layout]) .section-content {
					background-color: var(--ibm-neutral-3);
				}

				.table-border {
					border-bottom: 1px solid var(--ibm-gray-30);
					height: 1px;
					width: 100%;
				}

			
		</style>

		<triplat-route name="taskProcedures" on-route-active="_onRouteActive" params="{{_taskProcedureParams}}"></triplat-route>

		<triservice-procedure id="procedureService" procedures="{{_procedures}}" procedure-search="[[_search]]" procedure-rule-filter="[[_procedureRuleFilter]]" loading-procedures="{{_loadingProcedures}}"></triservice-procedure>

		<tricomp-task-detail-section small-layout="[[smallLayout]]" header="[[_header]]" aria-label="[[_header]]" count="[[count]]" opened="{{opened}}" loading="[[_loading]]" alt-expand="[[_altExpand]]" alt-collapse="[[_altCollapse]]">
			<div class="section-content" slot="section-content">
				<tricomp-task-id task="[[task]]" hidden="[[!smallLayout]]"></tricomp-task-id>
				<tricomp-search-field value="{{_search}}" placeholder="[[_searchPlaceholder]]"></tricomp-search-field>
				<tricomp-procedure-list-filter small-layout="[[smallLayout]]" class="filter" selected="{{_procedureRuleFilter}}"></tricomp-procedure-list-filter>

				<template is="dom-if" if="[[smallLayout]]" restamp="">
					<triblock-table class="data-table-small" data="[[_procedures]]" on-row-tap="_openProcedureDetails">
						<triblock-table-column remove-default-cell-padding="">
							<template>
								<tricomp-procedure-detail-card procedure="[[item]]" opened="[[opened]]" online="[[online]]"></tricomp-procedure-detail-card>
							</template>
						</triblock-table-column>
					</triblock-table>
				</template>

				<template is="dom-if" if="[[!smallLayout]]" restamp="">
					<div class="table-border"></div>
					<triblock-table class="data-table-large" data="[[_procedures]]" on-row-tap="_openProcedureDetails">
						<triblock-table-column property="procedureName"></triblock-table-column>
						<triblock-table-column>
							<template>
								<template is="dom-if" if="[[_showAsset(item)]]">
									<div>
										<span>[[item.assetID]],</span>
										<span>[[item.asset.value]]</span>
									</div>
								</template>
								<template is="dom-if" if="[[_showLocation(item)]]">
									<tricomp-task-list-location location-path="[[item.location]]" location-type-en-us="[[item.location.typeENUS]]" location-id="[[item.location.id]]" enable-open-detail="" online="[[online]]" location-id-field="[[item.locationID]]"></tricomp-task-list-location>
								</template>
							</template>
						</triblock-table-column>
						<triblock-table-column class="right-aligned">
							<template>
								<tricomp-procedure-status-bar procedure="[[item]]" opened="[[opened]]"></tricomp-procedure-status-bar>
							</template>
						</triblock-table-column>
					</triblock-table>
				</template>
				<template is="dom-if" if="[[_isProceduresEmpty(_procedures)]]">
					<div class="message-placeholder">
						<div>No procedures are available.</div>
					</div>
				</template>
			</div>
		</tricomp-task-detail-section>
	`,

    is: "tricomp-task-detail-procedures",

    behaviors: [
		TriComputeLoadingBehavior,
		TriTaskDetailSectionBehavior,
		IronResizableBehavior
	],

    properties: {
		task: Object,

		online: {
			type: Boolean
		},

		_procedures: {
			type: Array
		},

		count: {
			type: Number
		},

		_header: {
			type: String,
			value: ""
		},

		_loadingProcedures: {
			type: Boolean
		},

		_taskProcedureParams: {
			type: Object
		},

		_search: {
			type: String,
			notify: true
		},

		_searchPlaceholder: {
			type: String
		},

		_procedureRuleFilter: {
			type: String,
			notify: true
		},

		_altExpand: {
			type: String
		},

		_altCollapse: {
			type: String
		}

	},

    observers: [
		"_notifyResize(_procedures, opened, 500)",
		"_setLoadingBlockers(_sectionLoadingBlocker)",
		"_setValidLoadings(_loadingProcedures)"
	],

    listeners: {
		'location-tapped': '_handleLocationTapped'
	},

    attached: function() {
		var __dictionary__header = "Procedures";
		var __dictionary__searchPlaceholder = "Search by keyword";
		this.set("_header", __dictionary__header);
		this.set("_searchPlaceholder", __dictionary__searchPlaceholder);

		var __dictionary__altExpand = "Expand procedures section";
		var __dictionary__altCollapse = "Collapse procedures section";
		this.set("_altExpand", __dictionary__altExpand);
		this.set("_altCollapse", __dictionary__altCollapse);
	},

    _onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this._procedureRuleFilter = this._taskProcedureParams.rule == "-1" ? "" : decodeURIComponent(this._taskProcedureParams.rule);
				this._search = this._taskProcedureParams.search == "-1" ? "" : decodeURIComponent(this._taskProcedureParams.search);
				this.$.procedureService.refreshTaskProcedures(this._taskProcedureParams.taskId, true);
			});
		}
	},

    emptySearchProcedures:function(taskId){
		this._procedureRuleFilter ="";
		this._search ="";
		this.$.procedureService.refreshTaskProcedures(taskId, true);
	},

    _openProcedureDetails: function(e) {
		if(this.count == 1){
			var oneprocedure = this._procedures[0];
			var assetId = (oneprocedure.asset) ? oneprocedure.asset.id : -1;
			var locationId = (oneprocedure.location) ? oneprocedure.location.id : -1;
			TriroutesTask.getInstance().openTaskProcedureDetails(oneprocedure._id, assetId,
			 locationId, this.task._id);
		 }else{
			e.stopPropagation();
			var selected = e.detail.item || e.model.item;
			var assetId = (selected.asset) ? selected.asset.id : -1;
			var locationId = (selected.location) ? selected.location.id : -1;
			TriroutesTask.getInstance().openTaskProcedureDetails(selected._id, assetId, locationId, this._taskProcedureParams.taskid);
		}
	},

    _handleLocationTapped: function(e) {
		e.stopPropagation();
		var locationId = e.detail.locationId;
		TriroutesTask.getInstance().openTaskLocationDetails(locationId);
	},

    _showAsset: function(procedure) {
		return procedure.rule == "per Asset";
	},

    _showLocation: function(procedure) {
		return procedure.rule == "per Location";
	},

    _isProceduresEmpty: function(procedures) {
		return (procedures.length == 0) ? true : false;
	}
});