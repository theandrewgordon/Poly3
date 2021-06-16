/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "./triservice-procedure.js";
import "../@polymer/iron-icon/iron-icon.js";
import "../triplat-icon/ibm-icons.js";
import { TriroutesTaskDetail } from "./triroutes-task-detail.js";
import { TriroutesTask } from "./triroutes-task.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-center;
					font-size: 16px;
					font-weight: 700;
					cursor: pointer;
				}

				:host([_disabled]) {
					cursor: auto;
				}

				.procedures-title {
					@apply --layout-horizontal;
					@apply --layout-flex;
				}

				.procedures-text {
					color: var(--tri-primary-color);
					font-weight: 400;
				}

				:host([dir="ltr"]) .procedures-count {
					margin-left: 7px;
					color: var(--tri-primary-color);
				}

				:host([dir="rtl"]) .procedures-count {
					margin-right: 7px;
					color: var(--tri-primary-color);
				}

				:host([dir="rtl"]) .procedure-link{
					transform: scaleX(-1);
				}

				.procedure-link {
					height: 22px;
					padding: 0px;
					width: 22px;
					color: var(--tri-primary-color);
				}

				:host(:not([small-layout])) .procedures-title {	
					padding: 15px 60px 15px 15px;
				}
			
		</style>

		<triservice-procedure id="procedureService"></triservice-procedure>

		<div class="procedures-title" hidden\$="[[procedureCountZero]]">
			<iron-icon class="procedure-link" icon="ibm:flow" primary="" noink="" disabled="[[_disabled]]"></iron-icon>
			<div class="procedures-text">&nbsp;Procedures</div>
			<div class="procedures-count">[[_procedures.length]]</div>
		</div>
	`,

	is: "tricomp-procedures-link",
	
    properties: {
		_procedures: {
			type: Array,
			observer: "_handleProceduresChanged"
		},

		_taskId: {
			type: String
		},

		_rule: {
			type: String
		},

		_search: {
			type: String
		},

		_disabled: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    listeners: {
		"tap": "_handleTap"
	},

    refreshLocationProcedures: function(taskId, location) {
		this._taskId = taskId;
		this._rule = "per Location";
		this._search = location.id;
		return this.$.procedureService.refreshLocationProcedures(taskId, location._id).then(function (procedures) {
			this._procedures = procedures;
			(this._procedures.length==0) ? this.procedureCountZero = true : this.procedureCountZero = false;
		}.bind(this));
	},

    refreshAssetProcedures: function(taskId, asset) {
		this._taskId = taskId;
		this._rule = "per Asset";
		this._search = asset.id;
		return this.$.procedureService.refreshAssetProcedures(taskId, asset._id).then(function (procedures) {
			this._procedures = procedures;
			(this._procedures.length==0) ? this.procedureCountZero = true : this.procedureCountZero = false;
		}.bind(this));
	},

    _handleTap: function(e) {
		if (this._disabled) {
			return;
		}
		if (this._procedures.length == 1) {
			var procedure = this._procedures[0];
			var assetId = (procedure.asset) ? procedure.asset.id : -1;
			var locationId = (procedure.location) ? procedure.location.id : -1;
			TriroutesTask.getInstance().openTaskProcedureDetails(procedure._id, assetId, locationId, this._taskId);
		} else {
			TriroutesTaskDetail.getInstance().openTaskProcedures(this._taskId, false, this._rule, this._search);
		}
	},

    _handleProceduresChanged: function(procedures) {
		this._disabled = !procedures || procedures.length == 0;
	},

    behaviors: [TriDirBehavior]
});