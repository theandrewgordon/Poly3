/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../@polymer/paper-toggle-button/paper-toggle-button.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "./triservice-procedure.js";
import "./tristyles-work-task-app.js";
import "./tricomp-documents-section.js";
import "./tricomp-procedure-step-card.js";
import "./tricomp-procedure-step-list-filter.js";
import "./tricomp-procedure-status-bar.js";
import { TriLocationPinBehaviorImpl, TriLocationPinBehavior } from "./tribehav-location-pin.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";
import { TriroutesTask } from "./triroutes-task.js";
import "../triapp-task-list/tricomp-task-list-location.js";
import "../triapp-task-list/tricomp-overflow-text.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					color: var(--tri-primary-color-100);
					overflow: auto;
				}

				:host([small-layout]) {
					overflow: auto;
					padding-bottom: 102px;
				}

				.section-padding {
					padding-left: 40px;
					padding-right: 40px;
				}		

				:host([small-layout]) .section-padding {
					padding-left: 15px;
					padding-right: 15px;
				}

				.header-section {
					@apply --layout-vertical;
					background-color: var(--ibm-neutral-2);
					padding-top: 20px;
				}

				:host([small-layout]) .header-section {
					padding-top: 15px;
				}

				.header {
					@apply --layout-end;
					@apply --layout-horizontal;
					margin-bottom: 15px;
				}

				:host([small-layout]) .header {
					margin-bottom: 8px;
				}

				.header-name {
					@apply --layout-flex;
					font-size: 22px;
					font-weight: 500;
				}

				:host([small-layout]) .header-name {
					font-size: 16px;
					font-weight: 400;
				}

				.rule-section {
					margin-bottom: 20px;
				}

				:host([small-layout]) .rule-section {
					margin-bottom: 10px;
				}

				.description {
					margin-bottom: 20px;
				}

				:host([small-layout]) .description {
					color: var(--ibm-gray-50);
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					margin-bottom: 10px;
				}

				.rule-content {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.flex-vertical {
					@apply --layout-vertical;
				}

				.icons-divider {
					height: 25px;
					margin: 5px 10px;
				}

				.line-break {
					border-bottom: 1px solid var(--ibm-gray-10);
				}

				.documents-section {
					@apply --layout-vertical;
					border-bottom: 1px solid var(--ibm-gray-10);
					padding: 0 40px;
				}
				:host([small-layout]) .documents-section {
					padding-left: 15px;
					padding-right: 15px;
				}

				.location-icon {
					height: 22px;
					width: 22px;
					padding: 0px;
					color: var(--tri-primary-color);
				}

				.location-icon:hover {
					cursor: pointer;
				}

				.location-path {
					--tricomp-task-list-location-container: {
						padding-top: 0px;
					}
				}

				.steps-section {
					@apply --layout-vertical;
				}

				.steps-header {
					@apply --layout-horizontal;
					@apply --layout-top;
					@apply --layout-flex-none;
					padding-top: 20px;
				}

				:host([small-layout])	.steps-header {
					padding-top: 0px;
				}

				.steps-title {
					@apply --layout-flex;
					font-weight: 200;
				}

				:host([small-layout]) .status {
					margin-top: 5px;
					width: 95%;
				}

				:host(:not([small-layout])) .filter-section {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-left: 40px;
					padding-right: 40px;
				}

				:host([small-layout]) .filter-section {
					@apply --layout-vertical;
					padding-left: 0px;
					padding-right: 0px;
				}

				.filter {
					--tricomp-filter-desktop-container: {
						padding: 10px 0px 15px;
					}
				}

				:host([small-layout]) .filter {
					background-color: var(--ibm-neutral-2);
					--tricomp-filter-mobile-filter-label: {
						padding-left: 15px;
						padding-right: 15px;
					}
				}

				.filter-optional {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 0px 30px;
				}

				:host([small-layout]) .filter-optional {
					border-bottom: 1px solid var(--ibm-gray-10);
				}

				.optional-style {
					padding: 5px;
				}

				:host([small-layout]) .optional-style {
					padding: 10px 0px;
				}

				:host([small-layout]) .action-bar {
					@apply --layout-vertical;
					padding-bottom: 0px;
				}

				:host([small-layout]) .action-bar > * {
					margin-bottom: 10px;
				}
			
		</style>

		<triplat-route name="procedureDetails" on-route-active="_onRouteActive" active="{{opened}}" params="{{_procedureDetailsParam}}"></triplat-route>

		<triservice-procedure id="procedureService" procedure="{{_procedure}}" procedure-steps="{{_procedureSteps}}" steps-status-filter="[[_procedureStepsStatusFilter]]" steps-hide-optional-filter="[[_computeHideOptional(_hideOptional)]]" documents="{{_documents}}" loading-documents="{{_loadingDocuments}}"></triservice-procedure>

		<triplat-loading-indicator class="loading-indicator" show="[[_loadingDocuments]]"></triplat-loading-indicator>

		<div class="header-section">
			<div class="header section-padding">
				<span class="header-name">[[_procedure.procedureName]]</span>
				<div class="action-bar">
					<tricomp-procedure-status-bar class="status" hidden\$="[[!smallLayout]]" procedure="[[_procedure]]" opened="[[opened]]"></tricomp-procedure-status-bar>
					<paper-button footer\$="[[smallLayout]]" on-tap="_handleDoneButton">Done</paper-button>
				</div>
			</div>
			<tricomp-overflow-text class="section-padding description" lines="6" collapse="" hidden\$="[[!_procedure.description]]" text="[[_procedure.description]]">
				</tricomp-overflow-text>
		
			<div class="rule-section section-padding">
				<div class="rule-content" hidden\$="[[!_showLocation(_procedure)]]">
					<tricomp-task-list-location class="location-path" location-path="[[_procedure.location]]" location-type-en-us="[[_procedure.location.typeENUS]]"></tricomp-task-list-location>
					<div class="divider icons-divider"></div>
					<paper-icon-button class="location-icon" primary="" icon="ibm-glyphs:location" on-tap="_openLocationDetails" disabled="[[_disableLocationIcon(_hasGraphic, online)]]" alt="Open floor plan"></paper-icon-button>
				</div>
				<div class="rule-content" hidden\$="[[!_showAsset(_procedure)]]">
				<div class="flex-vertical">
					<span>[[_assetText]]</span>
					<span>[[_assetLocation]]</span>
					<span>[[_assetRoom]]</span>
				</div>
					<div class="divider icons-divider"></div>
					<paper-icon-button class="location-icon" primary="" icon="ibm-glyphs:location" disabled="[[!_assetHasLocation(_procedure)]]" on-tap="_openAssetLocationDetails" alt="Open floor plan"></paper-icon-button>
				</div>
			</div>
			<div class="line-break"></div>
			<div class="documents-section" hidden\$="[[!_hasDocuments(_documents)]]">
				<tricomp-documents-section id="documents" small-layout="[[smallLayout]]" documents="[[_documents]]" online="[[online]]"></tricomp-documents-section>
			</div>
		</div>
		
		<div class="steps-section">
			<div class="steps-header section-padding" hidden\$="[[smallLayout]]">
				<span class="steps-title tri-h2">Procedure Steps</span>
				<tricomp-procedure-status-bar class="status" procedure="[[_procedure]]" opened="[[opened]]"></tricomp-procedure-status-bar>
			</div>
			<div class="filter-section">
				<tricomp-procedure-step-list-filter class="filter" small-layout="[[smallLayout]]" selected="{{_procedureStepsStatusFilter}}"></tricomp-procedure-step-list-filter>
				<div class="filter-optional section-padding">
					<span class="optional-style secondary-text">Hide optional steps?:&nbsp;</span>
					<span>No</span>
					<paper-toggle-button class="toggle hide-toggle" checked="{{_hideOptional}}"></paper-toggle-button>
					<span>Yes</span>
				</div>
			</div>
			<div class="section-padding">
				<template id="stepsTemplateId" is="dom-repeat" items="{{_procedureSteps}}">
					<tricomp-procedure-step-card small-layout="[[smallLayout]]" task="[[task]]" opened="[[opened]]" readonly="[[readonly]]" current-user="[[currentUser]]" step="{{item}}" on-tap="_openStepDetailPage"></tricomp-procedure-step-card>
				</template>
				<template is="dom-if" if="[[_isStepsEmpty(_procedureSteps)]]">
					<div class="message-placeholder">
						<div>No steps are available.</div>
					</div>
				</template>
			</div>
		</div>
	`,

    is: "tripage-procedure-details",

    behaviors: [
		TriTaskDetailSectionBehavior,
		IronResizableBehavior,
		TriLocationPinBehavior,
		TriDirBehavior
	],

    properties: {
		currentUser: Object,

		online: {
			type: Boolean
		},

		readonly: Boolean,
		
		task: Object,

		_procedureDetailsParam: {
			type: Object,
			notify: true
		},

		_procedure: {
			type: Object,
			notify: true
		},

		_procedureSteps: {
			type: Array,
			notify: true
		},

		_procedureStepsStatusFilter: {
			type: String,
			notify: true
		},

		_hideOptional: {
			type: Boolean,
			notify: true,
			value: false
		},

		_assetText: {
			type: String,
			notify: true,
			computed: '_computeAssetText(_procedure)' 
		},

		_assetLocation: {
			type: String,
			notify: true,
			computed: '_computeAssetLocation(_procedure)'
		},

		_assetRoom: {
			type: String,
			notify: true,
			computed: '_computeAssetRoom(_procedure)'
		},

		_documents: {
			type: Array
		},

		_loadingDocuments: {
			type: Boolean
		}

	},

    observers: [
		"_notifyResize(_procedureSteps, opened, 500)",
		'_checkIfLocationHasGraphic(_procedure.location)'
	],

    _onRouteActive: function(e) {
		var rule = "per Task";
		this.set('_procedureStepsStatusFilter', "");
		this.set('_hideOptional', false);
		if (e.detail.active) {
			afterNextRender(this, function() {
				if (this._procedureSteps) this.$.stepsTemplateId.render();
				if (this._procedureDetailsParam.assetId != -1) { 
					rule = "per Asset";
				} else if (this._procedureDetailsParam.locationId != -1) {
					rule = "per Location";
				}
				this.$.procedureService.refreshProcedure(this._procedureDetailsParam.procedureId, this._procedureDetailsParam.assetId, this._procedureDetailsParam.locationId, rule)
					.then(function() {
						this.$.procedureService.refreshProcedureSteps(this._procedureDetailsParam.procedureId, this._procedureDetailsParam.assetId, this._procedureDetailsParam.locationId, rule, true)
					}.bind(this));

				this.$.procedureService.refreshProcedureDocuments(this._procedureDetailsParam.taskId, this._procedureDetailsParam.procedureId);
			});
		} else {
			this.$.documents.opened = false;
		}
	},

    _showAsset: function(procedure) {
		if (procedure)
			return procedure.rule == "per Asset";
	},

    _showLocation: function(procedure) {
		if (procedure)
			return procedure.rule == "per Location";
	},

    _handleDoneButton: function() {
		window.history.back();
	},

    _computeHideOptional: function(hide) {
		return (hide) ? true : "";
	},

    _openLocationDetails: function(e) {
		e.stopPropagation();
		var locationId = this._procedure.location.id;
		TriroutesTask.getInstance().openTaskLocationDetails(locationId);
	},

    _openAssetLocationDetails: function(e) {
		e.stopPropagation();
		var assetId = this._procedure.asset.id;
		TriroutesTask.getInstance().openTaskAssetDetails(assetId, this.task._id, true);
	},

    _assetHasLocation: function(procedure) {
		if (procedure) {
			var assetLocation = procedure.assetLocation;
			for (var member in assetLocation) {
				if (assetLocation[member] != null)
					return true;
			}
			return false;
		}
	},

    _computeAssetText: function(procedure) {
		if (procedure) {
			if (procedure.assetID){
				return procedure.assetID + ", " + procedure.asset.value;
			}
			else
				return "";
		}
	},

    _computeAssetLocation: function(procedure) {
		if (procedure) {
			if (procedure.assetID){
				let i = procedure.assetLocation.value;
				if(i!=null) {
					var loc = i.split('\\');
					loc.splice(0,2);
					loc.splice(loc.length-2,2);
					return loc;
				}
			}
			else
				return "";
		} 
	},

    _computeAssetRoom: function(procedure) {
		if (procedure) {
			if (procedure.assetID){
				let i = procedure.assetLocation.value;
				if(i!=null) {
					var loc = i.split('\\');
					var loc1=loc.splice(loc.length-2,2);
					var loc2=loc1.shift();
					return loc2+", "+loc1;
				}
			}
			else
				return "";
		} 
	},

    _isStepsEmpty: function(steps) {
		return (!steps || steps.length == 0) ? true : false;
	},

    _openStepDetailPage: function(e) {
		e.stopPropagation();
		if (this.smallLayout) {
			var step = e.detail.item || e.model.item;
			TriroutesTask.getInstance().openTaskProcedureStepDetails(step.stepNumber, this._procedureDetailsParam.procedureId, this._procedureDetailsParam.assetId, this._procedureDetailsParam.locationId);
		}
	},

    _hasDocuments: function(documents) {
		return documents && documents.length > 0;
	}
})