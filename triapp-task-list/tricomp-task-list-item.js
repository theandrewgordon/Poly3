/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/iron-flex-layout/iron-flex-layout.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "./tricomp-overflow-text.js";
import "./tricomp-task-priority.js";
import "./tricomp-task-lifecycle.js";
import "./tricomp-task-list-location.js";
import "./triservice-work-task-base.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="tristyles-theme">

				:host {
					@apply --layout-horizontal;
					background-color: white;
					border: 1px solid var(--ibm-gray-10);
					cursor: pointer;
					font-size: 13px;
					margin-right: 20px;
					max-width: 308px;
					min-width: 308px;
					position: relative;
				}
				:host(:hover) {
					border-color: var(--ibm-blue-50);
				}
				:host(:not([is-firefox]):hover) {
					@apply --shadow-elevation-3dp;
				}
				:host([small-layout]) {
					@apply --layout-flex;
					border: 0;
					border-bottom: 1px solid var(--ibm-gray-10);
					max-width: none;
					min-width: 0;
				}

				.new-task-indicator {
					border: 0 solid transparent;
					border-bottom-width: 22px;
					border-top-width: 0px;
					border-left: 22px solid var(--ibm-blue-70);
					height: 0;
					left: 0;
					position: absolute;
					top: 0;
					width: 0;
				}
				.new-task-indicator::after {
					background-color: white;
					border-radius: 100%;
					content: " ";
					display: inline-block;
					height: 5px;
					left: -18px;
					position: absolute;
					top: 4px;
					width: 5px;
				}

				.task-item-container {
					@apply --layout-horizontal;
					@apply --layout-start;
					flex-basis: 100%;
					min-width: 0;
					padding: 12px;
				}

				.task-details-container {
					@apply --layout-flex-8;
					@apply --layout-horizontal;
					@apply --layout-wrap;
					background-color: inherit;
					color: var(--ibm-gray-100);
					min-width: 0;
				}

				.task-details {
					background-color: inherit;
					flex-basis: 100%;
					min-width: 0;
				}
				.task-id {
					@apply --paper-font-common-nowrap;
				}
				.task-name {
					color: var(--ibm-blue-50);
				}

				.task-topic {
					@apply --layout-horizontal;
					flex-basis: 100%;
					padding-top: 8px;
				}
				.topic-label {
					color: var(--ibm-gray-50);
					white-space: nowrap;
				}
					:host([dir="ltr"]) .topic-label {
						padding-right: 3px;
					}
					:host([dir="rtl"]) .topic-label {
						padding-left: 3px;
					}
				.topic-value {
					@apply --layout-flex;
				}

				.status-readonly {
					color: var(--tri-danger-color);
				}

				.task-priority-actions {
					@apply --layout-center;
					@apply --layout-justified;
					@apply --layout-self-stretch;
					@apply --layout-vertical;
					@apply --layout-flex-2;
				}
					:host([dir="ltr"]) .task-priority-actions {
						padding-left: 5px;
					}
					:host([dir="rtl"]) .task-priority-actions {
						padding-right: 5px;
					}
				tricomp-task-lifecycle {
					margin-top: 10px;
					--tricomp-task-lifecycle-remove-delete: {
						height: 45px;
						width: 45px;
					}
				}
			
		</style>

		<triservice-work-task-base id="workTaskBaseService" current-user="{{_currentUser}}"></triservice-work-task-base>

		<div id="taskItem" class="task-item-container" on-tap="_handleOpenTask">
			<div class="new-task-indicator" hidden=""></div>

			<div class="task-details-container">
				<div class="task-details">
					<div class="task-id">[[taskItem.taskID]]</div>

					<tricomp-overflow-text lines="2" class="task-name" text="[[taskItem.taskName]]"></tricomp-overflow-text>
				</div>

				<tricomp-task-list-location location-path="[[taskItem.primaryWorkLocationPath]]" location-type-en-us="[[taskItem.primaryWorkLocationTypeENUS]]" show-label="">
				</tricomp-task-list-location>

				<div class="task-topic" hidden\$="[[!taskItem.status.value]]">
					<div class="topic-label">Status:</div>
					<div class="topic-value"><span class\$="[[_computeStatusClass(taskItem)]]">[[taskItem.status.value]]</span></div>
				</div>

				<div class="task-topic" hidden\$="[[!taskItem.plannedStart]]">
					<div class="topic-label">Planned start:</div>
					<div class="topic-value">
						<div>
							[[_displayDateAndTime(taskItem.plannedStart, _currentUser, _currentUser._DateFormat)]]
						</div>
						<div>
							[[_displayDateAndTime(taskItem.plannedStart, _currentUser, _userTimeFormat)]]
						</div>
					</div>
				</div>

				<div class="task-topic" hidden\$="[[!taskItem.taskType.value]]">
					<div class="topic-label">Type:</div>
					<div class="topic-value">[[taskItem.taskType.value]]</div>
				</div>
			</div>

			<div class="task-priority-actions">
				<tricomp-task-priority priority="[[taskItem.taskPriority]]" priority-en-us="[[taskItem.taskPriorityENUS]]" priority-color="[[taskItem.priorityColor]]"></tricomp-task-priority>

				<tricomp-task-lifecycle task-item="[[taskItem]]" refresh-task-list="" enable-delete="[[enableDelete]]" readonly="[[_computeReadOnlyAuth(auth)]]"></tricomp-task-lifecycle>
			</div>
		</div>
		<iron-a11y-keys id="tapKeys" target="[[_targetItem]]" keys="enter" on-keys-pressed="_handleOpenTask"></iron-a11y-keys>
	`,

    is: "tricomp-task-list-item",
		behaviors: [ 
			TriDateUtilities, 
			TriDirBehavior
		],

    properties: {
		taskItem: {
			type: Object
		},

		auth: Object,

		enableDelete: {
			type: Boolean,
			value: false
		},

		_currentUser: {
			type: Object,
			notify: true
		},

		_targetItem: {
			type: Object,
			value: function() {
				return this;
			}
		},

		_userTimeFormat: {
			type: String,
			value: "hh:mm a",
			computed: "_displayTimeFormat(_currentUser._DateTimeFormat)"
		},

		/*
		 * True if the application is running on Firefox browser.
		 */
		isFirefox: {
			type: Boolean,
			readOnly: true,
			reflectToAttribute: true,
			value: function() {
				var firefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

				return (firefox);
			}
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		},
	},

    hostAttributes: {
		tabindex: '0',
		role: 'option'
	},

    _handleOpenTask: function(e) {
		e.stopPropagation();
		this.fire("open-task", { "taskId": this.taskItem._id, "taskStatus": this.taskItem.statusENUS.value, "taskAssignmentStatusENUS": this.taskItem.assignmentStatusENUS });
	},

    /*
	 * Return only the time format from the user's date time format.
	 */
	_displayTimeFormat: function(datetime) {
		// Index of the "h" or "H" in the datetime format.
		// This index will be used to get only the time format from the datetime.
		var timeIndex = (datetime.indexOf("h") > 0) ? datetime.indexOf("h") : datetime.indexOf("H");
		return datetime.substr(timeIndex);
	},

    _displayDateAndTime: function(dateTime, currentUser, format) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return this.formatDateWithTimeZone(dateTime, currentUser._TimeZoneId, format, currentUser._Locale);
	},

    _computeStatusClass: function(task) {
		return (!task || !task.statusENUS ||
			task.statusENUS.value === "Closed" || 
			task.statusENUS.value === "Review In Progress" ||
			task.statusENUS.value === "Routing In Progress") ? "status-readonly" : "";
	},

    _computeReadOnlyAuth: function(auth) {
		return auth.canRead && !auth.canCreate && !auth.canDelete && !auth.canUpdate;
	}
});