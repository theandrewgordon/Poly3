/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triapp-task-list/tricomp-task-lifecycle.js";
import { TriWorkTaskTimeUtilitiesBehaviorImpl, TriWorkTaskTimeUtilitiesBehavior } from "./tribehav-work-task-time-utilities.js";
import "./tricomp-time-duration.js";
import "./tricomp-time-placeholder.js";
import "./tristyles-work-task-app.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-around-justified;
					@apply --layout-center;
					@apply --layout-horizontal;
					text-align: left;
					background-color: white;
				}
				:host([small-layout][opened]) {
					@apply --layout-wrap;
					border: 2px solid var(--ibm-gray-10);
					border-radius: 20px;
					margin: 0 15px;
				}

				.datetime-container {
					@apply --layout-flex;
				}
				:host([small-layout]) .datetime-container {
					padding: 5px 0;
				}
				:host([small-layout][opened]) .datetime-container {
					padding: 10px;
				}
				
				.value {
					color: var(--tri-primary-color-100);
					padding-top: 0px;
					font-size: 16px;
				}

				.date-time {
					text-transform: uppercase;
				}

				.date {
					font-weight: bold;
				}

				tricomp-time-placeholder {
					--tricomp-time-placeholder-container: {
						padding: 0;
					};
				}

				:host([small-layout][opened]) .duration {
					flex-basis: 100%;
					text-align: center;
				}
				:host([small-layout]:not([opened])) .duration {
					margin-bottom: 10px;
				}

				.divider {
					height: 100%;
					margin: 0 15px;
				}

				:host([small-layout]) .vertical-divider {
					height: 40px;
				}

				:host([small-layout]) .horizontal-divider {
					flex-basis: 100%;
					height: 1px;
				}

				:host([dir="ltr"][small-layout]) .lifecycle-container {
					padding-left: 10px;
				}
				:host([dir="rtl"][small-layout]) .lifecycle-container {
					padding-right: 10px;
				}

				tricomp-task-lifecycle {
					--tricomp-task-lifecycle-paper-icon-button: {
						min-height: 65px;
						padding: 8px;
						min-width: 65px;
					}
					--iron-icon: {
						top: -1px;
						left: 3px;
					}
				}

				label {
					font-size: 14px;
					padding-bottom: 0px;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}

			
		</style>

		<template is="dom-if" if="[[!_smallScreenWidthAndClosed(smallLayout, opened)]]" restamp="">
			<div class="datetime-container" tabindex="0" aria-label="Planned start">
				<label>Planned start</label>
				<div class="value date-time">
					<span class="date">[[_convertDateAndTime(task.plannedStart, currentUser, currentUser._DateFormat)]]</span>, 
					[[_convertDateAndTime(task.plannedStart, currentUser, _userTimeFormat)]]
				</div>
			</div>

			<div class="divider vertical-divider"></div>

			<div class="value datetime-container" tabindex="0" aria-label="Planned end">
				<label>Planned end</label>
				<div class="value date-time">
					<span class="date">[[_convertDateAndTime(task.plannedEnd, currentUser, currentUser._DateFormat)]]</span>, 
					[[_convertDateAndTime(task.plannedEnd, currentUser, _userTimeFormat)]]
				</div>
			</div>

			<div class="divider horizontal-divider"></div>

			<div class="datetime-container duration" tabindex="0" aria-label="Total work duration">
				<label>Total work duration</label>
				<div class="value date">
					<tricomp-time-placeholder value="[[_totalDuration]]">
						<tricomp-time-duration duration="[[_totalDuration]]" tokens="[[_durationToken(_totalDuration)]]"></tricomp-time-duration>
					</tricomp-time-placeholder>
				</div>
			</div>

			<div class="divider"></div>
		</template>

		<template is="dom-if" if="[[_smallScreenWidthAndClosed(smallLayout, opened)]]" restamp="">
			<div class="datetime-container">
				<label>Total work duration</label>
				<div class="value date duration">
					<tricomp-time-placeholder value="[[_totalDuration]]">
						<tricomp-time-duration duration="[[_totalDuration]]" tokens="[[_durationToken(_totalDuration)]]"></tricomp-time-duration>
					</tricomp-time-placeholder>
				</div>

				<label>Planned start</label>
				<div class="value date-time">
					<span class="date">[[_convertDateAndTime(task.plannedStart, currentUser, currentUser._DateFormat)]]</span>, 
					[[_convertDateAndTime(task.plannedStart, currentUser, _userTimeFormat)]]
				</div>
			</div>
		</template>

		<template is="dom-if" if="[[!_smallScreenWidthAndOpened(smallLayout, opened)]]" restamp="">
			<div class="datetime-container lifecycle-container">
				<tricomp-task-lifecycle task-item="[[task]]" timer-area="[[!_isTaskCompleted(task)]]" timer-text="" readonly="[[readonly]]"></tricomp-task-lifecycle>
			</div>
		</template>
	`,

    is: "tricomp-time-header",

    behaviors: [
	    TriWorkTaskTimeUtilitiesBehavior,
	    TriDirBehavior
	],

    properties: {
		currentUser: Object,

		readonly: {
			type: Boolean
		},

		opened: {
			type: Boolean,
			reflectToAttribute: true
		},

		task: Object,

		timeLogs: {
			type: Array
		},

		_totalDuration: {
			type: Number,
			value: 0
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}
	},

    observers: [
		"_totalWorkDuration(timeLogs)"
	],

    _totalWorkDuration: function(timeLogs) {
		var totalDuration = 0;
		this.set("_totalDuration", 0);

		if (timeLogs && timeLogs.length > 0) {
			timeLogs.forEach(function(timeLog) {
				var duration = this._convertHoursToMilliseconds(timeLog.hours);
				totalDuration += duration;
			}.bind(this));
		}

		this.set("_totalDuration", totalDuration);
	},

    _durationToken: function(duration) {
		return (duration < 3600000) ? "h:m:s" : "h:m";
	},

    _smallScreenWidthAndClosed: function(smallLayout, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return smallLayout && !opened;
	},

    _smallScreenWidthAndOpened: function(smallLayout, opened) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return smallLayout && opened;
	},

    _isTaskCompleted: function(task) {
		return (task && task.statusENUS && task.statusENUS.value == "Completed");
	}
});