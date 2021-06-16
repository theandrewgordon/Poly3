/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import "../triplat-icon/ibm-icons.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "./triservice-work-task-base.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				.actions-container {
					@apply --layout-center;
					@apply --layout-center-justified;
					@apply --layout-horizontal;
				}

				paper-icon-button {
					height: 45px;
					padding: 0;
					width: 45px;
					
					@apply --tricomp-task-lifecycle-paper-icon-button;
				}

				.remove-delete{
					@apply --tricomp-task-lifecycle-remove-delete;/*@apply --tricomp-task-lifecycle-remove-delete;height:22px;width: 22px;*/
				}
				
				:host([timer-area]) paper-icon-button {
					background-color: rgba(192, 230, 255, 0.3);
					border: 2px solid var(--tri-primary-light-color);
					border-radius: 100%;
				}

				:host([dir="ltr"]) .text {
					padding-left: 6px;
				}
				:host([dir="rtl"]) .text {
					padding-right: 6px;
				}
			
		</style>

		<triservice-work-task-base id="workTaskBaseService"></triservice-work-task-base>

		<div class="actions-container" hidden="[[!_lifecyleEnable]]">
			<template is="dom-if" if="[[!_hideStartWorkButton(_workTaskInProgress, _workTaskInDraft)]]" restamp="">
				<paper-icon-button icon="ibm:timer-start" primary="" noink="" on-tap="_startWorkTask" disabled="[[_disabled]]" aria-label="Start timer"></paper-icon-button>
				<div class\$="[[_computeLinkClass(_disabled)]]" on-tap="_startWorkTask" hidden="[[!timerText]]">Start timer</div>
			</template>
			<template is="dom-if" if="[[!_hideStopWorkButton(_workTaskInProgress, _workTaskInDraft)]]" restamp="">
				<paper-icon-button icon="ibm:timer-stop" primary="" noink="" on-tap="_stopWorkTask" disabled="[[_disabled]]" aria-label="Stop timer"></paper-icon-button>
				<div class\$="[[_computeLinkClass(_disabled)]]" on-tap="_stopWorkTask" hidden="[[!timerText]]">Stop timer</div>
			</template>
			<template is="dom-if" if="[[!_hideDeleteTaskButton(_workTaskInProgress, _workTaskInDraft, enableDelete)]]">
				<paper-icon-button class="remove-delete" icon="ibm:remove-delete" danger="" noink="" on-tap="_deleteTapped" disabled="[[_disabled]]" aria-label="Delete task"></paper-icon-button>
				<div class="text" hidden="[[!timerText]]" on-tap="_deleteTapped">Delete</div>
			</template>
		</div>

		<div class="actions-container" hidden="[[_lifecyleEnable]]">
			<div class="actions-container" hidden="[[!_isTaskCompleted(taskItem)]]">
				<paper-icon-button icon="ibm:timer-complete" disabled="" noink="" aria-label="Work task complete"></paper-icon-button>
				<div class="text" hidden="[[!timerText]]">Work task complete</div>
			</div>
			<div class="actions-container" hidden="[[!_isTaskUnassigned(taskItem)]]">
				<paper-icon-button icon="ibm:timer-start" disabled="" noink="" aria-label="Pending assignment"></paper-icon-button>
				<div class="text" hidden="[[!timerText]]">Pending assignment</div>
			</div>
		</div>
	`,

    is: "tricomp-task-lifecycle",

    properties: {
		taskItem: Object,

		readonly: {
			type: Boolean
		},

		refreshTaskList: {
			type: Boolean,
			value: false
		},

		timerArea: {
			type: Boolean,
			value: false,
			reflectToAttribute: true
		},

		timerText: {
			type: Boolean,
			value: false
		},

		_disabled: {
			type: Boolean,
			value: false,
			computed: "_computeDisable(taskItem, readonly)"
		},

		/*
		 * If true, the Work Task is in progress.
		 */
		_lifecyleEnable: {
			type: Boolean,
			value: false,
			computed: "_computeLifecyleEnable(taskItem)"
		},

		/*
		 * If true, the Work Task is in progress.
		 */
		_workTaskInProgress: {
			type: Boolean,
			value: false,
			computed: "_computeWorkTaskInProgress(taskItem)"
		},

		_workTaskInDraft: {
			type: Boolean,
			value: false,
			computed: '_computeIsDraftTask(taskItem)'
		},

		enableDelete: {
			type: Boolean,
			value: false
		}
	},

    /*
	 * Compute if Lifecyle buttons should be displayed.
	 */
	_computeLifecyleEnable: function(task) {
		return task && task.assignmentStatusENUS != "Unassigned" && task.statusENUS 
			&& (task.statusENUS.value === "Active" || task.statusENUS.value.startsWith("Hold") 
				|| task.statusENUS.value === "Draft" || task.statusENUS.value === "Review In Progress"
				|| task.statusENUS.value === "Routing In Progress");
	},

    _computeDisable: function(task, readonly) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return task && task.statusENUS && (task.statusENUS.value == "Routing In Progress" || task.statusENUS.value == "Review In Progress") || readonly;
	},

    /*
	 * Compute if Work Task is in progress.
	 */
	_computeWorkTaskInProgress: function(task) {
		var workTaskInProgress = false;

		if (task && task.assignmentStatusENUS === "On Site") {
			workTaskInProgress = true;
		}

		return workTaskInProgress;
	},

    /*
	 * Determine when to hide the Start and Stop buttons.
	 */
	_hideStartWorkButton: function(workTaskInProgress, workTaskInDraft) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return workTaskInProgress || workTaskInDraft;
	},

    _hideStopWorkButton: function(workTaskInProgress, workTaskInDraft) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return !workTaskInProgress || workTaskInDraft;
	},

    _hideDeleteTaskButton: function(workTaskInProgress, workTaskInDraft, enableDelete) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return workTaskInProgress || !workTaskInDraft || !enableDelete;
	},

    _startWorkTask: function(e) {
		e.stopPropagation();

		if (this._disabled) {
			return;
		}

		this.$.workTaskBaseService.startTask(this.taskItem._id, this.refreshTaskList);
	},

    _stopWorkTask: function(e) {
		e.stopPropagation();

		if (this._disabled) {
			return;
		}

		this.$.workTaskBaseService.stopTask(this.taskItem._id, this.refreshTaskList);
	},

    _deleteTapped: function(e) {
		e.stopPropagation();
		this.fire("draft-delete-tapped", {taskIdForDelete: this.taskItem._id});
	},

    _isTaskCompleted: function(task) {
		return task && task.assignmentStatusENUS === "Completed";
	},

    _isTaskUnassigned: function(task) {
		return task && task.assignmentStatusENUS === "Unassigned";
	},

    _computeIsDraftTask: function(task) {
		return task && task.statusENUS && task.statusENUS.value === "Draft";
	},

    _computeLinkClass: function(disabled) {
		return disabled ? "text" : "tri-link text";
	},

    behaviors: [TriDirBehavior]
});