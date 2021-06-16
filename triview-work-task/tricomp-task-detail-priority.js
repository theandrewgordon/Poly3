/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-icon/ibm-icons.js";
import "../@polymer/iron-icon/iron-icon.js";
import "./triservice-work-task.js";
import "./tricomp-priority-dropdown.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				tricomp-priority-dropdown {
					@apply --layout-flex;
				}

				iron-icon {
					--iron-icon-height: 15px;
					--iron-icon-width: 15px;
					margin: 0 4px;
				}
			
		</style>

		<triservice-work-task id="workTaskService" priorities="{{_priorities}}"></triservice-work-task>
		
		<tricomp-priority-dropdown title="Priority" small-layout="{{smallLayout}}" item-selected="[[priority]]" items="[[_priorities]]" on-dropdown-item-selected="_handlePrioritySelected" read-only="[[readonly]]">
			<iron-icon icon="[[_computePriorityIconName(priorityEnUs)]]" style\$="[[_computePriorityIconColor(priorityColor)]]" selected-icon="" slot="selected-icon"></iron-icon> 
		</tricomp-priority-dropdown>
	`,

    is: "tricomp-task-detail-priority",

    properties: {
		ignoreDsUpdate: {
			type: Boolean,
			value: false
		},

		task: {
			type: Object
		},

		priority: {
			type: String,
			notify: true,
			value: function() {
				return this._noneLabel;
			}
		},

		priorityEnUs: {
			type: String,
			notify: true,
			value: ""
		},

		_priorities: {
			type: Array
		},

		readonly: {
			 type: Boolean
		},

		_noneLabel: {
			type: String,
			value: "None"
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		'_setPriorityIconColorOnTaskChanged(task)'
	],

    _setPriorityIconColorOnTaskChanged: function(task) {
		if (task && task.priorityColor) {
			this.set('priorityColor', task.priorityColor);
		}
	},

    _computePriorityIconName: function(priority) {
		var className = "priority-";
		if (priority && priority !== "") {
			className += priority.toLowerCase();
		} else {
			className = "";
		}
		return "ibm:" + className;
	},

    _computePriorityIconColor: function(color) {
		if (color) {
			return "color: " + color;
		}
	},

    _handlePrioritySelected: function(e) {
		var priority = e.detail;
		if (priority) {
			this.set("priority", priority.value);
			this.set("priorityEnUs", priority.name);
			this.set("priorityColor", priority.color);
			if (!this.ignoreDsUpdate) {
				this.$.workTaskService.updateTaskPriority(this.task._id, priority);
			}
		}
	}
});