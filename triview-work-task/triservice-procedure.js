/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import { TriPlatDs } from "../triplat-ds/triplat-ds.js";
import "../triplat-offline-manager/triplat-ds-offline.js";
import { TriplatQuery } from "../triplat-query/triplat-query.js";
import { TriPlatViewBehaviorImpl, TriPlatViewBehavior } from "../triplat-view-behavior/triplat-view-behavior.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import { TriTaskServiceBehavior } from "../triapp-task-list/tribehav-task-service.js";
import "../triapp-task-list/triservice-work-task-base.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

		</style>

		<template is="dom-if" if="[[_isRootInstance]]">
			<triplat-ds id="procedureStepsDS" name="procedureSteps" filtered-data="{{_unfilteredProcedureSteps}}" loading="{{loadingProcedures}}" on-filtered-data-changed="_buildProcedures" manual="">
				<triplat-ds-offline mode="CONTEXT"></triplat-ds-offline>
				<triplat-ds-context id="procedureStepsDSContext" name="myTasks"></triplat-ds-context>
				<triplat-query delay="0">
					<triplat-query-sort name="procedureRule"></triplat-query-sort>
					<triplat-query-sort name="procedureName"></triplat-query-sort>
					<triplat-query-sort name="assetID"></triplat-query-sort>
					<triplat-query-sort name="assetName" type="STRING_WITH_ID"></triplat-query-sort>
					<triplat-query-sort name="locationName" type="STRING_WITH_ID"></triplat-query-sort>
					<triplat-query-sort name="stepNumber"></triplat-query-sort>
				</triplat-query>
			</triplat-ds>

			<triplat-query data="[[_unfilteredProcedures]]" filtered-data-out="{{procedures}}">
				<triplat-query-filter name="rule" operator="equals" value="[[procedureRuleFilter]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-open-paren></triplat-query-open-paren>
				<triplat-query-filter name="procedureName" operator="contains" value="[[procedureSearch]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="asset" operator="contains" type="STRING_WITH_ID" value="[[procedureSearch]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="assetID" operator="contains" value="[[procedureSearch]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="location" operator="contains" type="STRING_WITH_ID" value="[[procedureSearch]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="locationID" operator="contains" type="STRING_WITH_ID" value="[[procedureSearch]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-close-paren></triplat-query-close-paren>
				<triplat-query-sort name="rule"></triplat-query-sort>
				<triplat-query-sort name="procedureName"></triplat-query-sort>
				<triplat-query-sort name="assetID"></triplat-query-sort>
				<triplat-query-sort name="asset" type="STRING_WITH_ID"></triplat-query-sort>
				<triplat-query-sort name="location" type="STRING_WITH_ID"></triplat-query-sort>
			</triplat-query>

			<triplat-query data="[[procedures]]" filtered-data-out="{{_filteredProcedure}}" delay="0">
				<triplat-query-filter name="_id" operator="equals" value="[[_procedureFilter.procedureId]]"></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-open-paren></triplat-query-open-paren>
				<triplat-query-filter name="asset.id" operator="equals" value="[[_procedureFilter.assetId]]"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="location.id" operator="equals" value="[[_procedureFilter.locationId]]"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="rule" operator="equals" value="per Task"></triplat-query-filter>
				<triplat-query-close-paren></triplat-query-close-paren>
			</triplat-query>

			<triplat-query data="[[_unfilteredProcedureSteps]]" filtered-data-out="{{procedureSteps}}" delay="0">
				<triplat-query-filter name="status" operator="equals" value="[[stepsStatusFilter]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-filter name="stepRequired" operator="equals" value="[[stepsHideOptionalFilter]]" ignore-if-blank=""></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-open-paren></triplat-query-open-paren>
				<triplat-query-filter name="procedureRecordID" operator="equals" value="[[_procedureStepsFilter.procedureId]]"></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-open-paren></triplat-query-open-paren>
				<triplat-query-filter name="assetName.id" operator="equals" value="[[_procedureStepsFilter.assetId]]"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="locationName.id" operator="equals" value="[[_procedureStepsFilter.locationId]]"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="procedureRule" operator="equals" value="per Task"></triplat-query-filter>
				<triplat-query-close-paren></triplat-query-close-paren>
				<triplat-query-close-paren></triplat-query-close-paren>
				<triplat-query-sort name="stepNumber"></triplat-query-sort>
			</triplat-query>

			<triplat-query data="[[_unfilteredProcedureSteps]]" filtered-data-out="{{_filteredStep}}" delay="0">
				<triplat-query-filter name="procedureRecordID" operator="equals" value="[[_procedureStepsFilter.procedureId]]"></triplat-query-filter>
				<triplat-query-and></triplat-query-and>
				<triplat-query-open-paren></triplat-query-open-paren>
				<triplat-query-filter name="assetName.id" operator="equals" value="[[_procedureStepsFilter.assetId]]"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="locationName.id" operator="equals" value="[[_procedureStepsFilter.locationId]]"></triplat-query-filter>
				<triplat-query-or></triplat-query-or>
				<triplat-query-filter name="procedureRule" operator="equals" value="per Task"></triplat-query-filter>
				<triplat-query-close-paren></triplat-query-close-paren>
				<triplat-query-and></triplat-query-and>
				<triplat-query-filter name="stepNumber" operator="equals" value="[[_stepNumberFilter]]"></triplat-query-filter>
			</triplat-query>

			<triplat-ds id="proceduresDS" name="procedures" manual="">
				<triplat-ds-context id="proceduresDSContext" name="myTasks"></triplat-ds-context>
			</triplat-ds>

			<triplat-ds id="documentsDS" name="documents" data="{{documents}}" loading="{{loadingDocuments}}" manual="">
				<triplat-ds-context id="documentsDSTaskContext" name="myTasks"></triplat-ds-context>
				<triplat-ds-context id="documentsDSProcedureContext" name="procedures"></triplat-ds-context>
			</triplat-ds>
		</template>
	`,

    is: "triservice-procedure",

    behaviors: [
		TriPlatViewBehavior,
		TriTaskServiceBehavior,
		TriDateUtilities
	],

    properties: {
		online: {
			type: Boolean
		},

		_unfilteredProcedureSteps: {
			type: Array,
			notify: true
		},

		_unfilteredProcedures: {
			type: Array,
			notify: true,
		},

		_filteredProcedure: {
			type: Array,
		},

		procedure: {
			type: Object,
			notify: true
		},

		procedures: {
			type: Array,
			notify: true
		},

		proceduresCount: {
			type: Number,
			notify: true
		},

		procedureSteps: {
			type: Array,
			notify: true
		},

		_filteredStep: {
			type: Array,
		},

		step: {
			type: Object,
			notify: true
		},

		procedureSearch: {
			type: String,
			notify: true,
			value: ""
		},

		procedureRuleFilter: {
			type: String,
			notify: true
		},

		stepsHideOptionalFilter: {
			type: Boolean,
			notify: true
		},

		stepsStatusFilter: {
			type: String,
			notify: true
		},

		locationProcedures: {
			type: Array,
			notify: true
		},

		assetProcedures: {
			type: Array,
			notify: true
		},

		_procedureFilter: {
			type: Object,
			notify: true,
			value: function() {
				return { procedureId: "", 
					assetId: "",
					locationId: "",
					rule: ""
				};
			}
		},

		_procedureStepsFilter: {
			type: Object,
			notify: true,
			value: function() {
				return { procedureId: "", 
					assetId: "",
					locationId: "",
					rule: ""
				};
			}
		},

		_stepNumberFilter: {
			type: String,
			notify: true
		},

		loadingProcedures: {
			type: Boolean,
			value: false,
			notify: true
		},

		documents: {
			type: Array,
			notify: true
		},

		loadingDocuments: {
			type: Boolean,
			value: false,
			notify: true
		},

		_offlineContext: {
			type: Object,
			value: function () {
				var __dictionary__updateProcedureStep = 'Update Step {1} in the "{2}" procedure ({3}) for Task ID {4}.';
				var __dictionary__updateActionProcedureStep = '{1} Step {2} in the "{3}" procedure ({4}) for Task ID {5}.';

				var _messages = {};
				_messages["UPDATE_PROCEDURE_STEP"] = __dictionary__updateProcedureStep;
				_messages["UPDATE_ACTION_PROCEDURE_STEP"] = __dictionary__updateActionProcedureStep;

				return _messages;
			}
		}
	},

    observers: [
		"singlefyProcedure(_filteredProcedure)",
		"singlefyStep(_filteredStep)"
	],

    refreshTaskProcedures: function(taskId, force) {
		if (this._isRootInstance) {
			var procedureStepsDSContext = this.$$("#procedureStepsDSContext");
			if (force || this._unfilteredProcedureSteps == null || procedureStepsDSContext.contextId != taskId) {
				procedureStepsDSContext.contextId = taskId;
				return this.$$("#procedureStepsDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this._unfilteredProcedureSteps);
			}
		} else {
			return this._rootInstance.refreshTaskProcedures(taskId, force);
		}
	},

    refreshProcedure: function(procedureId, assetId, locationId, rule, force) {
		if (this._isRootInstance) {
			if (force || this.procedure == null || this.procedure._id != procedureId) {
				this.set('_procedureFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
			} else if (rule == "per Asset") {
				if (this.procedure.asset.id != assetId) {
					this.set('_procedureFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
				}
			} else if (rule == "per Location") {
				if (this.procedure.location.id != locationId) {
					this.set('_procedureFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
				}
			}
			return Promise.resolve(this.procedure);
		} else {
			return this._rootInstance.refreshProcedure(procedureId, assetId, locationId, rule, force);
		}
	},

    refreshProcedureSteps: function(procedureId, assetId, locationId, rule, force) {
		if (this._isRootInstance) {
			if (force || this.procedureSteps == null || this.procedureSteps.length == 0) {
				this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
			} else if (this.procedureSteps[0].procedureRecordID != procedureId) {
				this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
			} else if (rule == "per Asset") {
				if (this.procedureSteps[0].assetName.id != assetId) {
					this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
				} 
			} else if (rule == "per Location") {
				if (this.procedureSteps[0].locationName.id != locationId) {
					this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId, rule: rule});
				}
			}
			return Promise.resolve(this.procedureSteps);
		} else {
			return this._rootInstance.refreshProcedureSteps(procedureId, assetId, locationId, rule, force);
		}
	},

    refreshLocationProcedures: function(taskId, locationId, force) {
		if (this._isRootInstance) {
			return this.refreshTaskProcedures(taskId, force).then(function() {
				var locationProcedures = [];
				if (this._unfilteredProcedures) {
					locationProcedures = this._unfilteredProcedures.filter(function(procedure) {
						return procedure.rule == "per Location" && procedure.location && procedure.location.id == locationId;
					});
				}
				this.locationProcedures = locationProcedures;
				return locationProcedures;
			}.bind(this));
		} else {
			return this._rootInstance.refreshLocationProcedures(taskId, locationId, force);
		}
	},

    refreshAssetProcedures: function(taskId, assetId, force) {
		if (this._isRootInstance) {
			return this.refreshTaskProcedures(taskId, force).then(function() {
				var assetProcedures = [];
				if (this._unfilteredProcedures) {
					assetProcedures = this._unfilteredProcedures.filter(function(procedure) {
						return procedure.rule == "per Asset" && procedure.asset && procedure.asset.id == assetId;
					});
				}
				this.assetProcedures = assetProcedures;
				return assetProcedures;
			}.bind(this));
		} else {
			return this._rootInstance.refreshAssetProcedures(taskId, assetId, force);
		}
	},

    refreshStep: function(stepNumber, procedureId, assetId, locationId, rule, force) {
		if (this._isRootInstance) {
			if (force || this.step == null || this.step.stepNumber != stepNumber) {
				this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId });
				this.set('_stepNumberFilter', stepNumber);
			} else if (this.step.procedureRecordID != procedureId) {
				this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId });
				this.set('_stepNumberFilter', stepNumber);
			} else if (rule == "per Asset") {
				if (this.step.assetName.id != assetId) {
					this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId });
					this.set('_stepNumberFilter', stepNumber);
				} 
			} else if (rule == "per Location") {
				if (this.step.locationName.id != locationId) {
					this.set('_procedureStepsFilter', {procedureId: procedureId, assetId: assetId, locationId: locationId });
					this.set('_stepNumberFilter', stepNumber);
				}
			}
			return Promise.resolve(this.step);
		} else {
			return this._rootInstance.refreshStep(stepNumber, procedureId, assetId, locationId, rule, force);
		}
	},

    _buildProcedures: function(e) {
		var tempProcedure = {};
		var tempProceduresList = [];
		var steps =  e.detail.value;
		if (steps && steps.length != 0) {
			steps.forEach(function(step, index, steps) {
				var stepRule = (step.procedureRule) ? step.procedureRule : "per Task";
				if (!tempProcedure._id) {
					tempProcedure = this._buildNewProcedure(step);
				} else if (tempProcedure._id == step.procedureRecordID && (stepRule == 'per Asset' && tempProcedure.asset.id == step.assetName.id || stepRule == 'per Location' && tempProcedure.location.id == step.locationName.id || stepRule == 'per Task')) {
					tempProcedure.stepsTotal++;
					if (step.status == "Completed") tempProcedure.stepsCompleted++;
					if (step.stepRequired) {
						tempProcedure.requiredStepsTotal++;
						if (step.status == "Completed") tempProcedure.requiredStepsCompleted++;
					}
				} else {
					tempProceduresList.push(tempProcedure);
					tempProcedure = this._buildNewProcedure(step);
				}
				if ((index+1) == steps.length) {
					tempProceduresList.push(tempProcedure);
				}
			}, this);
		}
		this.set('_unfilteredProcedures', tempProceduresList);
		this.set('proceduresCount', tempProceduresList.length);
	},

    _buildNewProcedure: function(step) {
		var procedure = {};
		procedure._id = step.procedureRecordID;
		procedure.procedureName = step.procedureName;
		procedure.description = step.procedureDescription;
		procedure.rule = step.procedureRule;
		procedure.requiredStepsTotal = 0;
		procedure.requiredStepsCompleted = 0;
		procedure.stepsTotal = 1;
		procedure.stepsCompleted = (step.status == "Completed") ? 1 : 0;
		if (step.stepRequired) {
			procedure.requiredStepsTotal++;
			procedure.requiredStepsCompleted = (step.status == "Completed") ? 1 : 0;
		}
		
		if (step.procedureRule == "per Asset")  {
			procedure.assetID = step.assetID;
			procedure.asset = {
				value: step.assetName.value,
				id: step.assetName.id,
			};
			procedure.assetLocation = { 
				value: step.assetLocation.value,
				id: step.assetLocation.id
			};
		} else if (step.procedureRule == "per Location") {
			procedure.location = { 
				value: step.locationPath,
				id: step.locationName.id,
				typeENUS: step.locationTypeENUS,
				parentFloorId: step.parentFloorId,
				hasGraphic: false
			};
			procedure.locationID = step.locationID;
		} 

		return procedure;
	},

    singlefyProcedure: function(lonelyProcedure) {
		this.set('procedure', lonelyProcedure[0]);
	},

    singlefyStep: function(steps) {
		if (steps && steps.length != 0 && this._stepNumberFilter) {
			var step = steps.find(function(step) {
				return step.stepNumber == this._stepNumberFilter;
			}.bind(this));
			this.set('step', step);
		}
	},

    updateStep: function(step, taskId, action) {
		if (this._isRootInstance) {
			if (action) {
				if (this.procedure) {
					var completeModifier = action == "complete" ? 1 : -1;
					this.set("procedure.stepsCompleted", this.procedure.stepsCompleted + completeModifier);
					if (step.stepRequired) {
						this.set("procedure.requiredStepsCompleted", this.procedure.requiredStepsCompleted + completeModifier);
					}
					var tempProcedure = this.procedure;
					this.procedure = null;
					this.set("procedure", tempProcedure);
				}

				return this.$$("#procedureStepsDS").updateRecord(
					step._id, TriPlatDs.RefreshType.CLIENT, "actions", action, null,
					this._buildOfflineContextMessage("UPDATE_ACTION_PROCEDURE_STEP", this._capitalize(action), step.stepNumber, step.procedureName, this._computeStepTypeValue(step), taskId));
			} else {
				return this.$$("#procedureStepsDS").updateRecord(
					step._id, TriPlatDs.RefreshType.CLIENT, null, null, null,
					this._buildOfflineContextMessage("UPDATE_PROCEDURE_STEP", step.stepNumber, step.procedureName, this._computeStepTypeValue(step), taskId));
			}
		} else {
			return this._rootInstance.updateStep(step, taskId, action);
		}

	},

    refreshProcedureDocuments: function(taskId, procedureId, force) {
		if (this._isRootInstance) {
			var documentsDSProcedureContext = this.$$("#documentsDSProcedureContext");
			var documentsDSTaskContext = this.$$("#documentsDSTaskContext");
			if (force || this.documents == null || documentsDSTaskContext.contextId != taskId || documentsDSProcedureContext.contextId != procedureId) {
				this.$$("#documentsDS").countOnly = false;
				documentsDSProcedureContext.contextId = procedureId;
				documentsDSTaskContext.contextId = taskId;

				return this.$$("#documentsDS").refresh().then(this._returnDataFromResponse.bind(this));
			} else {
				return Promise.resolve(this.documents);
			}
		} else {
			return this._rootInstance.refreshProcedureDocuments(taskId, procedureId, force);
		}
	},

    getProceduresAllDone: function() {
		if (this._isRootInstance) {
			return this.procedures.every(function(procedure) {
				return (procedure.requiredStepsCompleted == procedure.requiredStepsTotal);
			});
		} else {
			return this._rootInstance.getProceduresAllDone();
		}
	},

    _capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

    _computeStepTypeValue: function(step) {
		var __dictionary__task = "task";
		if (step.procedureRule == "per Asset")
			return step.assetName.value;
		else if (step.procedureRule == "per Location")
			return step.locationName.value;
		else
			return __dictionary__task;
	}
});