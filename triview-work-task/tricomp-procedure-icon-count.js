/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "./triservice-procedure.js";
import "../triplat-icon/ibm-icons.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "./tristyles-work-task-app.js";
import { TriroutesTask } from "./triroutes-task.js";
import { TriroutesTaskDetail } from "./triroutes-task-detail.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles work-task-detail-section tristyles-theme">

				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					cursor: pointer;
				}

				.icon-procedure {
					color: var(--tri-primary-color);
					padding: 0;
					height: 24px;
					width: 24px;
				}

				.procedure-count {
					color: var(--tri-primary-color);
					margin-right: 6px;
					margin-bottom: 10px;
				}
			
		</style>

		<triservice-procedure id="procedureService" procedures="{{_procedures}}"></triservice-procedure>

		<template is="dom-if" if="[[_displayProcedures(_procedures,item)]]">
			<div>
				<paper-icon-button primary="" icon="ibm:flow" disabled="[[_disabled]]" class="icon-procedure" alt="procedure count"></paper-icon-button>
			</div>
			<div class="procedure-count">
				<sup>[[_computeProcedureCount(_procedures,item)]]</sup>
			</div>
			<div class="divider icons-divider"></div>
		</template>
	`,

    is: "tricomp-procedure-icon-count",

    properties: {
		item: Object,

		_disabled: {
			type: Boolean,
			value: false
		},

		taskId: {
			type: String,
			notify: true
		},

		_rule: {
			type: String
		},

		_search: {
			type: String
		},

		_procedures: {
			type: Array,
			observer: "_handleProceduresChanged"
		}
	},

    listeners: {
		"tap": "_handleTap"
	},

    _displayProcedures: function (procedures, item) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		var proceduresCount = this._computeProcedureCount(procedures, item);
		return (proceduresCount > 0);
	},

    _computeProcedureCount: function (procedures, item) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		let itemId = item._id;
		this._search = item.id;
		var itemProcedures = [];

		if (procedures) {
			itemProcedures = procedures.filter(function (procedure) {
				return (procedure.rule == "per Location") ?
					procedure.rule == "per Location" && procedure.location && procedure.location.id == itemId
					: procedure.rule == "per Asset" && procedure.asset && procedure.asset.id == itemId;
			});
		}

		this._rule = itemProcedures[0] ? itemProcedures[0].rule : "";
		return itemProcedures.length;
	},

    _handleTap: function (e) {
		if (this._disabled) {
			return;
		}
		e.stopPropagation();
		if (this._procedures.length == 1) {
			var procedure = this._procedures[0];
			var assetId = (procedure.asset) ? procedure.asset.id : -1;
			var locationId = (procedure.location) ? procedure.location.id : -1;
			TriroutesTask.getInstance().openTaskProcedureDetails(procedure._id, assetId, locationId, this.taskId);
		} else {
			TriroutesTaskDetail.getInstance().openTaskProcedures(this.taskId, false, this._rule, this._search);
		}
	},

    _handleProceduresChanged: function (procedures) {
		this._disabled = !procedures || procedures.length == 0;
	},

    refreshLocationProcedures: function (taskId, location) {
		this._taskId = taskId;
		this._rule = "per Location";
		this._search = location.id;
		return this.$.procedureService.refreshLocationProcedures(taskId, location._id).then(function (procedures) {
			this._procedures = procedures;
		}.bind(this));
	},

    refreshAssetProcedures: function (taskId, asset) {
		this._taskId = taskId;
		this._rule = "per Asset";
		this._search = asset.id;
		return this.$.procedureService.refreshAssetProcedures(taskId, asset._id).then(function (procedures) {
			this._procedures = procedures;
		}.bind(this));
	}
});