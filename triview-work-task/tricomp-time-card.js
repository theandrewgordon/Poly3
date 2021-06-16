/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "./tricomp-time-duration.js";
import "./tricomp-time-placeholder.js";
import "./tristyles-work-task-app.js";
import { TriWorkTaskTimeUtilitiesBehaviorImpl, TriWorkTaskTimeUtilitiesBehavior } from "./tribehav-work-task-time-utilities.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

Polymer ({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --layout-center;
					padding: 5px;
				}
				
				.top-line {
					@apply --layout-horizontal;
					@apply --layout-center;
					padding-bottom: 10px;
				}

				.mid-line {
					@apply --layout-horizontal;
					@apply --layout-start;	
					padding-bottom: 10px;
					width: 80%;
				}

				.separator {
					padding: 0px 10px;
				}

				.date-column {
					@apply --layout-vertical;
					@apply --layout-flex;
				}

				.comments {
					width: 85%;
					--paper-input-container: {
						padding: 0px;
					}
					--paper-input-container-input: {
						font-size: 14px;
						max-height: 100px;
					}
					--paper-input-container-label: {
						font-size: 14px;
					}
				}

				.details {
					@apply --layout-flex;
				}

				.icon { 
					height: 22px;
					width: 22px;
					padding: 0;
				}

				tricomp-time-placeholder {
					--tricomp-time-placeholder-container: {
						padding: 0px;
					}
				}

				.person-name[owner] {
					color: var(--ibm-blue-40);
				}

				.comments-section {
					@apply --layout-vertical;
					padding-top: 12px;
				}

				.time-category-field {
					padding-top: 4px;
				}
		</style>

		<div class="details">
			<div class="top-line">
				<span class="person-name" owner\$="[[_isTimeLogOwner(currentUser._id, timeLog.profileId)]]">[[timeLog.personName]]</span>
				<span class="separator">•</span>
				<tricomp-time-placeholder value="[[_convertHoursToMilliseconds(timeLog.hours)]]">
					<tricomp-time-duration duration="[[_convertHoursToMilliseconds(timeLog.hours)]]" tokens="h:m:s"></tricomp-time-duration>
				</tricomp-time-placeholder>
			</div>
			<div class="mid-line">
				<div class="date-column">
					<label>Start</label>
					<tricomp-time-placeholder value="[[timeLog.plannedStart]]">
						[[_convertDateAndTime(timeLog.plannedStart, currentUser, currentUser._DateFormat)]]
					</tricomp-time-placeholder>
					<tricomp-time-placeholder value="[[timeLog.plannedStart]]">
						[[_convertDateAndTime(timeLog.plannedStart, currentUser, _userTimeFormat)]]
					</tricomp-time-placeholder>
				</div>
				<div class="date-column">
					<label>End</label>
					<tricomp-time-placeholder value="[[timeLog.plannedEnd]]">
						[[_convertDateAndTime(timeLog.plannedEnd, currentUser, currentUser._DateFormat)]]
					</tricomp-time-placeholder>
					<tricomp-time-placeholder value="[[timeLog.plannedEnd]]">
						[[_convertDateAndTime(timeLog.plannedEnd, currentUser, _userTimeFormat)]]
					</tricomp-time-placeholder>
				</div>
			</div>

			<div class="time-category-section">
				<label>Time Category</label>
				<div class="time-category-field">[[timeLog.timeCategory]]</div>
			</div>

			<div class="comments-section" hidden\$="[[!timeLog.comments]]">
				<label>Comments</label>
				<span>[[timeLog.comments]]</span>
			</div>
		</div>
		<div>
			<paper-icon-button class="remove icon" noink="" icon="ibm-glyphs:remove" aria-label="Remove Time Entry" on-tap="_removeTapped" danger="" disabled="[[!_isTimeLogOwner(currentUser._id, timeLog.profileId)]]"></paper-icon-button>
		</div>
	`,

    is:"tricomp-time-card",

    behaviors: [
		TriWorkTaskTimeUtilitiesBehavior
	],

    properties: {
		timeLog: Object,
		currentUser: Object
	},

    _removeTapped: function(e) {
		e.stopPropagation();
		if (this.timeLog.plannedEnd)
			this.fire("open-remove-popup", {_id: this.timeLog._id, plannedStart: this.timeLog.plannedStart});
		else 
			this.fire("open-still-running-popup");
	},

    _isTimeLogOwner: function(userId, timeLogOwnerId) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return userId == timeLogOwnerId;
	}
});