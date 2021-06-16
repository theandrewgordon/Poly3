/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2020 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../triplat-date-picker/triplat-calendar-times.js";
import { TriDateUtilities } from "../triplat-date-utilities/triplat-date-utilities.js";
import "../triplat-datetime-picker/triplat-datetime-picker.js";
import "../triplat-loading-indicator/triplat-loading-indicator.js";
import "../triplat-routing/triplat-route.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import { TriBlockScrollFieldIntoViewBehavior } from "../triblock-scroll-field-into-view-behavior/triblock-scroll-field-into-view-behavior.js";
import "../triblock-popup/triblock-popup.js";
import "../triblock-confirmation-popup/triblock-confirmation-popup.js";
import "../@polymer/paper-button/paper-button.js";
import "../@polymer/paper-input/paper-textarea.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import { TriComputeLoadingBehavior } from "../triapp-task-list/tribehav-compute-loading.js";
import { TriWorkTaskTimeUtilitiesBehaviorImpl, TriWorkTaskTimeUtilitiesBehavior } from "./tribehav-work-task-time-utilities.js";
import "./tricomp-task-id.js";
import "./tristyles-work-task-app.js";
import "./triservice-time-log.js";
import { afterNextRender } from "../@polymer/polymer/lib/utils/render-status.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import "../triplat-select-input/triplat-select-input.js";

Polymer({
	_template: html`
		<style include="work-task-shared-page-styles work-task-popup tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				:host([small-layout]) .main-container {
					padding: 0 20px 20px 20px;
				}

				triplat-datetime-picker {
					display: block;
					margin-bottom: 5px;
					min-width: 280px;
					--triplat-date-picker-icon-color: var(--tri-primary-color);
				}

				:host([small-layout]) triplat-datetime-picker {
					--tri-datetime-picker-calendar-position-top: 50px;
				}

				.time-category-label {
					padding-top: 10px;
				}

				.required {
					color: var(--ibm-red-50);
				}

				.time-category-label label {
					font-size: 12px;
				}

				triplat-select-input {
					margin-top: -5px;
					--triplat-select-input-paper-item: {
						font-size: 14px;
						min-height: auto;
						padding: 10px;
					};
				}

				triblock-popup {
					width: 350px;
					--triblock-popup-close-button: {
						z-index: 1;
					};
				}

				@media (max-height: 470px) {
					triblock-popup {
						top: 0px;
						bottom: 0px;
					}

					.popup-content {
						max-height: 100%;
						overflow-y: auto;
					}
				}

				.popup-content {
					position: relative;
				}

				:host([small-layout]) #popup {
					overflow: auto;
				}

				:host([small-layout]) .popup-content {
					padding-bottom: 102px;
				}
				
				.comments {
					--paper-input-container: {
						padding: 8px 0px 20px;
					}
					--paper-input-container-input: {
						font-size: 14px;
						max-height: 100px;
					}
					--paper-input-container-label: {
						font-size: 14px;
					}
				}

				triplat-calendar-times {
					--iron-icon-fill-color: var(--tri-primary-color);
					--triplat-calendar-times-separator: {
						display: none;
					};
					--triplat-calendar-times-header: {
						display: none;
					};
					--triplat-calendar-times-time-section: {
						padding: 0px;
						@apply --layout-center-justified;
					};
				}
				.duration-label {
					padding-top: 16px;
					color: var(--ibm-gray-50);
				}

				paper-icon-button{
					padding: 0px;
					margin-right: 8px;
					height: 22px;
					width: 22px;
				}

				.delete-link {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-bottom: 20px;
					padding-bottom: 10px;
				}

				span.tri-link{
					@apply --layout-flex-auto;
				}

		</style>

		<triplat-route name="timeLogDetail" params="{{_timeLogDetailsParams}}" on-route-active="_onRouteActive" active="{{opened}}"></triplat-route>

		<triservice-time-log id="timeLogService" time-log="{{_timeLog}}" loading-time-log="{{_loadingTimeLog}}" loading-time-logs="{{_loadingTimeLogs}}" loading-time-log-action="{{_loadingTimeLogAction}}" filtered-time-categories="{{_filteredTimeCategories}}" search-time-category="{{_searchTimeCategory}}"></triservice-time-log>

		<triblock-popup id="popup" modal="" on-iron-overlay-canceled="_handlePopupCloseButton" aria-label="Edit Time Log" small-screen-width="[[smallLayout]]" disable-screen-size-detection>
			<div class="popup-content">
				<triplat-loading-indicator class="loading-indicator" show="[[_loading]]"></triplat-loading-indicator>

				<tricomp-task-id task="[[task]]" hidden\$="[[!smallLayout]]"></tricomp-task-id>
				<div class="tri-h2" hidden\$="[[smallLayout]]">Edit time log</div>

				<div class="main-container">

					<div class="duration-label">Duration</div>

					<triplat-calendar-times id="durationTime" on-triplat-calendar-time-updated="_durationChanged" hour="{{_hour}}" minute="{{_min}}" step-hour="1" step-minute="15" show-colon-separator="" show-label-under="" counters-only="" hour-min-digits="1">
						</triplat-calendar-times>

					<triplat-datetime-picker id="plannedStart" label="Start" value="{{_timeLog.plannedStart}}" display-format="[[currentUser._DateTimeFormat]]" time-zone="[[currentUser._TimeZoneId]]" readonly="[[readonly]]" always-float-label="" display-seconds="" focused="{{_fieldFocused}}" invalid="{{_fieldInvalidStart}}" on-datetime-picker-user-change="_handlePlannedStartChanged"></triplat-datetime-picker>
					
					<triplat-datetime-picker id="plannedEnd" label="Stop" value="{{_timeLog.plannedEnd}}" display-format="[[currentUser._DateTimeFormat]]" time-zone="[[currentUser._TimeZoneId]]" readonly="[[readonly]]" always-float-label="" display-seconds="" focused="{{_fieldFocused}}" invalid="{{_fieldInvalidEnd}}" on-datetime-picker-user-change="_handlePlannedEndChanged"></triplat-datetime-picker>

					<div class="time-category-label"><span class="required">*</span><label>Time Category</label></div>
					
					<triplat-select-input 
						select-src="{{_filteredTimeCategories}}"
						value-name="name"
						value="[[_selectedTimeCategory]]"
						search-value="{{_searchTimeCategory}}"
						on-value-changed="_onTimeCategorySelected"
						on-select-input-value-user-change="_onTimeCategoryFieldChanged"
						no-label-float
						tri-scroll-into-view>
					</triplat-select-input>

					<paper-textarea class="comments" label="Comments" value="{{_timeLog.comments}}" aria-label="Comments" maxlength="1000" max-rows="4" always-float-label="" tri-scroll-into-view="" role="textbox" contenteditable="true"></paper-textarea>

					<template is="dom-if" if="[[showDelBtn]]">
						<div class="delete-link" on-tap="_removeTapped">
							<paper-icon-button noink="" icon="ibm-glyphs:remove" danger=""></paper-icon-button>
							<span class="tri-link">Delete this time entry</span>
						</div>
					</template>
				</div>
				<div class="action-bar">
					<paper-button footer-secondary\$="[[smallLayout]]" secondary\$="[[!smallLayout]]" on-tap="_handleCancelChanges" disabled="[[_busy]]">Cancel</paper-button>
					<paper-button footer\$="[[smallLayout]]" on-tap="_handleDoneChanges" disabled="[[_disableDoneButton]]" hidden="[[readonly]]">Done</paper-button>
				</div>
			</div>

		</triblock-popup>
		<triblock-popup id="endBeforeStartTimePopup" class="popup-alert" with-backdrop="" small-screen-max-width="0px">
			<div class="header tri-h2">Warning</div>
			<div>You cannot set the End time before the Start time.</div>
			<div class="footer">
				<paper-button dialog-confirm="">OK</paper-button>
			</div>
		</triblock-popup>

		<triblock-confirmation-popup id="removeConfirmatioPopup" on-confirm-tapped="_removeConfirmedTapped">
			<div class="text" slot="text">
				<div class="header-warning tri-h2">Confirmation</div>
				<p>Do you want to remove this entry from the list?</p>
			</div>
		</triblock-confirmation-popup>
	`,

	is: "tripage-time-log",

	behaviors: [
		TriComputeLoadingBehavior,
		TriDateUtilities,
		TriWorkTaskTimeUtilitiesBehavior,
		TriBlockScrollFieldIntoViewBehavior
	],

	properties: {
		currentUser: Object,
		task: Object,
		readonly: Boolean,
		opened: {
			type: Boolean,
			notify: true,
			value: false,
		},
		
		showDelBtn:{
			type: Boolean,
			value: true	
		},
		_isNew: {
			type: Boolean,
			value: false
		},

		_timeLog: {
			type: Object
		},

		_disableDoneButton: {
			type: Boolean,
			value: true,
			computed: "_computeDisableDoneButton(_fieldFocused, _fieldInvalidStart, _fieldInvalidEnd, _fieldInvalidCategory, _loading, _duration)"
		},

		_fieldFocused: {
			type: Boolean,
			value: false,
			observer: "_validateDates"
		},

		_fieldInvalidEnd: {
			type: Boolean,
			value: false
		},

		_fieldInvalidStart: {
			type: Boolean,
			value: false
		},

		_fieldInvalidCategory: {
			type: Boolean,
			value: false,
			computed: "_computeFieldInvalidCategory(_timeLog.timeCategorySystemRecordID, _timeLog.timeCategory)"
		},

		_loadingTimeLog: {
			type: Boolean
		},

		_loadingTimeLogAction: {
			type: Boolean
		},

		_loadingTimeLogs: {
			type: Boolean
		},

		_timeLogDetailsParams: {
			type: Object,
			value: function() {
				return {};
			}
		},

		_duration: {
			type: Number,
			value: 0,
			observer: '_handleDurationChanged'
		},

		_busy: {
			type: Boolean,
			value: false
		},

		_hour: {
			type: Number
		},

		_min: {
			type: Number
		},

		_filteredTimeCategories: {
			type: Object
		},

		_searchTimeCategory: {
			type: String
		},

		_selectedTimeCategory: {
			type: Object,
			computed: "_computeSelectedTimeCategory(_timeLog.timeCategorySystemRecordID, _timeLog.timeCategory)"
		},

		smallLayout: {
			type: Boolean,
			notify: true,
			reflectToAttribute: true
		}

	},

	observers: [
		"_setValidLoadings(_loadingTimeLog, _loadingTimeLogs, _loadingTimeLogAction)"
	],

	_removeTapped:function(e){
		e.stopPropagation();
		this.$.removeConfirmatioPopup.openPopup();
	},

	_removeConfirmedTapped:function(e){
		e.stopPropagation();
		this._historyBack();
		this.$.timeLogService.removeTaskTimeLog(this._timeLogDetailsParams.taskId,this._timeLog._id,this._timeLog._plannedStart);
	},

	_onRouteActive: function(e) {
		if (e.detail.active) {
			afterNextRender(this, function() {
				this._cleanup();
				 if (this._timeLogDetailsParams.timeId === "-1") {
					this.set("showDelBtn",false);
				} else {
					this.set("showDelBtn",true);
				}
				// Check if it's a new time log and set `_isNew` to true.
				if (this._timeLogDetailsParams.timeId && this._timeLogDetailsParams.timeId === "-1") { this.set("_isNew", true); }
				this._refreshTimeLog();
				this.$.popup.openPopup();
			});
		} else {
			this.$.popup.closePopup();
		}
	},

	_refreshTimeLog: function() {
		var timeLogPromise;
		if (this._timeLogDetailsParams.timeId && this._timeLogDetailsParams.timeId != "-1") {
			timeLogPromise = this.$.timeLogService.refreshTaskTimeLog(this._timeLogDetailsParams.taskId, this._timeLogDetailsParams.timeId, true);
		} else {
			timeLogPromise = Promise.resolve(this._timeLog);
		}
		timeLogPromise.then(function () {
			this._setDuration(this._convertHoursToMilliseconds(this._timeLog.hours));
			this._setPlannedStart(this._timeLog.plannedStart);
			this._validatePlannedEnd(this._timeLog.plannedEnd);
		}.bind(this));
	},

	_cleanup: function() {
		this.set("_isNew", false);
		this._timeLog = { "plannedStart": "", "plannedEnd": "", "hours": 0, "timeCategorySystemRecordID": "", "timeCategory": "" };
		this.$.plannedStart.clearDatetimeValue();
		this.$.plannedEnd.clearDatetimeValue();
		this.set("_duration", 0);
		this.set("_hour", 0);
		this.set("_min", 0);
	},

	_validateDates: function(focused) {
		if (!focused && this._timeLog) {
			this._setPlannedStart(this._timeLog.plannedStart);
			this._validatePlannedEnd(this._timeLog.plannedEnd);
		}
	},

	_setPlannedStart: function(start) {
		if (!this._keepEmptyField()) {
			this.set("_timeLog.plannedStart", (!start || start === "") ? this.getCurrentDatetime() : start);
		}
	},

	_setDuration: function(duration) {
		if (!this._keepEmptyField() && duration) {
			this.set("_duration", duration);
		}
	},

	_validatePlannedEnd: function(end) {
		if (!this._keepEmptyField()) {
			var start = (this._timeLog && this._timeLog.plannedStart) ? this._timeLog.plannedStart : "";
			var duration = this._duration;
			var end = end;

			// Check if the end datetime is before the start datetime.
			if (start && start !== "") {
				if (!end || end === "") {
					var startInMilli = this.toMilliseconds(start);
					var endInMilli = startInMilli + duration;
					this.set("_timeLog.plannedEnd",  this.toDateIsoString(endInMilli));
				} else if (end !== "") {
					var startFormatted = moment(start);
					var endFormatted = moment(end);
					if (startFormatted.isBefore(endFormatted)) {
						this.set("_timeLog.plannedEnd", end);
					} else {
						this.set("_duration", 0);
					}
				}
			}
		}
	},

	// Keep planned start and planned end fields empty.
	// Should be true only when it's not a new time log, and when both fields are already empty.
	_keepEmptyField: function() {
		return ((!this._timeLog.plannedStart || this._timeLog.plannedStart === "") && (!this._timeLog.plannedEnd || this._timeLog.plannedEnd === "")) && !this._isNew;
	},

	_computeDisableDoneButton: function(focused, invalidStart, invalidEnd, invalidCategory, loading, duration) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		return focused || invalidStart || invalidEnd || invalidCategory || loading || this._isEndNullOrBeforeStart();
	},

	_historyBack: function() {
		window.history.back();
	},

    _handlePopupCloseButton: function(e) {
		if (e.target == this.$.popup) {
			e.stopPropagation();
			this._historyBack();
		}
	},

	_handleCancelChanges: function(e) {
		e.stopPropagation();
		this._historyBack();
	},

	_handleDoneChanges: function(e) {
		e.stopPropagation();

		if (this._timeLog._id && this._timeLog._id !== "") {
			this._timeLogChanged(this._timeLog);
		} else {
			this._timeLogAdded(this._timeLog);
		}
	},

	_timeLogChanged: function(timeLog) {
		this.$.timeLogService.updateTaskTimeLog(this._timeLogDetailsParams.taskId, timeLog)
			.then(function() {
				this._historyBack();
			}.bind(this));
	},

	_timeLogAdded: function(timeLog) {
		this.$.timeLogService.addTaskTimeLog(this._timeLogDetailsParams.taskId, timeLog)
			.then(function() {
				this._historyBack();
			}.bind(this));
	},

	_durationChanged: function(e) {
		if (!this.opened) return;
		if (this._timeLog) {
			var duration = this.calcDurationFromTime(e.detail.updatedDatetime);
			var startInIso = this._timeLog.plannedStart;
			this.set("_timeLog.hours", this._convertMillisecondsToHours(duration));
			this.set("_duration", duration);
			if (startInIso) {
				var dateInMilli = this.toMilliseconds(startInIso);
				dateInMilli += duration;
				this.set("_timeLog.plannedEnd", this.toDateIsoString(dateInMilli));
				this.set("_fieldInvalidEnd", false);
			}
		}
	},

	_handlePlannedStartChanged: function() {
		if (!this.opened) return;
		var duration = this._duration ? this._duration : 0;
		if (this._timeLog.plannedStart) {
			var startInMilli = this.toMilliseconds(this._timeLog.plannedStart);
			var endInMilli = startInMilli + duration;
			this.set("_timeLog.plannedEnd", this.toDateIsoString(endInMilli));
			this.set("_fieldInvalidEnd", false);
		}
	},

	_handlePlannedEndChanged: function() {
		if (!this.opened) return;
		if (this._timeLog.plannedStart && this._timeLog.plannedEnd) {
			var diff = this.toMilliseconds(this._timeLog.plannedEnd) - this.toMilliseconds(this._timeLog.plannedStart);
			if (diff >= 86340000) {
				this.set("_duration", 86340000);
				var endInMilli = this.toMilliseconds(this._timeLog.plannedStart) + 86340000;
				this.set("_timeLog.plannedEnd", this.toDateIsoString(endInMilli));
				this.set("_fieldInvalidEnd", false);
			}
			else if (diff >= 0 && diff <= 86340000) {
				this.set("_duration", diff);
				this.set("_fieldInvalidEnd", false);
			} else {
				this.set("_duration", 0);
				this.set("_fieldInvalidEnd", true);
				this.$.endBeforeStartTimePopup.openPopup();
			}
		}
	},

	_isEndNullOrBeforeStart: function() {
		if (!this._timeLog || !this._timeLog.plannedEnd || !this._timeLog.plannedStart) return true;
		var startFormatted = moment(this._timeLog.plannedStart);
		var endFormatted = moment(this._timeLog.plannedEnd);
		return endFormatted.isBefore(startFormatted);
	},

	calcDurationFromTime: function(datetime) {
		var hour = moment(datetime).hour();
		var minute = moment(datetime).minute();
		return hour * 3600000 + minute * 60000;
	},

	_handleDurationChanged: function(duration) {
		if (!this.opened || !this._timeLog) return;
		this.set("_hour", moment.duration(duration).hours());
		this.set("_min", moment.duration(duration).minutes());
	},

	_computeFieldInvalidCategory: function(timeCategorySystemRecordID, timeCategory) {
		return !timeCategorySystemRecordID || timeCategorySystemRecordID == "" || !timeCategory || timeCategory == "";
	},

	_onTimeCategorySelected: function(event) {
		if (event && event.detail && event.detail.value) {
			let category = event.detail.value;
			this.set("_timeLog.timeCategorySystemRecordID", category.id);
			this.set("_timeLog.timeCategory", category.value);
		}
	},

	_onTimeCategoryFieldChanged: function(event) {
		let category = (event && event.detail && event.detail.value) ? event.detail.value : "";
		if (!category || category == "") {
			this.set("_timeLog.timeCategorySystemRecordID", "");
			this.set("_timeLog.timeCategory", "");
		}
	},

	_computeSelectedTimeCategory: function(timeCategorySystemRecordID, timeCategory) {
		return {id: timeCategorySystemRecordID, value: timeCategory};
	}
});