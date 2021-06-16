/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2017-2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { html } from "../@polymer/polymer/lib/utils/html-tag.js";

import { Polymer } from "../@polymer/polymer/lib/legacy/polymer-fn.js";
import { IronResizableBehavior } from "../@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "../@polymer/paper-icon-button/paper-icon-button.js";
import "../triplat-icon/ibm-icons-glyphs.js";
import "../triblock-table/triblock-table.js";
import { TriWorkTaskTimeUtilitiesBehaviorImpl, TriWorkTaskTimeUtilitiesBehavior } from "./tribehav-work-task-time-utilities.js";
import "./tricomp-time-duration.js";
import "./tricomp-time-placeholder.js";
import "./tricomp-time-card.js";
import "./tristyles-work-task-app.js";
import { TriroutesTimeLog } from "./triroutes-time-log.js";
import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriTaskDetailSectionBehaviorImpl, TriTaskDetailSectionBehavior } from "./tribehav-task-detail-section.js";

Polymer({
    _template: html`
		<style include="work-task-shared-page-styles tristyles-theme">

				:host {
					@apply --layout-vertical;
				}

				:host([small-layout]) {
					margin-top: 15px;
				}

				triblock-table {
					border-bottom: 1px solid var(--ibm-gray-30);
					min-height: 50px;

					--triblock-table-cell: {
						height: auto !important;
						min-height: 44px;
					};

					--triblock-table-column-divider: {
						display: none;
					};

					--triblock-table-row-detail-divider-color: transparent;
					--triblock-table-row-detail: {
						padding: 0px;
					};
					--paper-input-container: {
						padding: 0 0 15px;
					};
					--paper-input-container-input: {
						font-size: 14px;
						max-height: 100px;
					};
					--paper-input-container-label: {
						font-size: 14px;
					};
					--paper-input-container-underline: {
						display: none;
					};
					--paper-input-container-underline-focus: {
						display: none;
					};
				}
				:host([dir="ltr"]) triblock-table {
					text-align: left;
				}
				:host([dir="rtl"]) triblock-table {
					text-align: right;
				}

				.link-column {
					--triblock-table-column-fixed-width: 50px;
					--triblock-table-column-body-flex-alignment: center;
				}

				.icon { 
					height: 22px;
					width: 22px;
					padding: 0;
				}

				.table-small {
					--triblock-table-header: {
						display: none;
					}
				}

				.person-name[owner] {
					color: var(--ibm-blue-40);
				}

				.comments-section {
					padding-bottom: 10px;
					@apply --layout-vertical;
				}

			
		</style>

		<template is="dom-if" if="[[smallLayout]]" restamp="">
			<triblock-table class="table-small" data="{{timeLogs}}" on-dom-change="_tableChanged" on-row-tap="_timeLogSelected">
				<triblock-table-column>
					<template>
						<tricomp-time-card time-log="[[item]]" small-layout="[[smallLayout]]" current-user="[[currentUser]]"></tricomp-time-card>
					</template>
				</triblock-table-column>
			</triblock-table>
		</template>

		<template is="dom-if" if="[[!smallLayout]]" restamp="">
			<triblock-table id="timeLogsTable" data="{{timeLogs}}" on-dom-change="_tableChanged" on-row-tap="_timeLogSelected" always-show-row-detail="" row-aria-label-callback="[[_computeRowAriaLabelCallback]]">
				<triblock-table-column title="Person">
					<template>
						<span class="person-name" owner\$="[[_isTimeLogOwner(currentUser._id, item.profileId)]]">[[item.personName]]</span>
					</template>
				</triblock-table-column>

				<triblock-table-column title="Start Date">
					<template>
						<div>
							<tricomp-time-placeholder value="[[item.plannedStart]]">
								[[_convertDateAndTime(item.plannedStart, currentUser, currentUser._DateFormat)]]
							</tricomp-time-placeholder>
						</div>
					</template>
				</triblock-table-column>

				<triblock-table-column title="Start Time">
					<template>
						<div>
							<tricomp-time-placeholder value="[[item.plannedStart]]">
								[[_convertDateAndTime(item.plannedStart, currentUser, _userTimeFormat)]]
							</tricomp-time-placeholder>
						</div>
					</template>
				</triblock-table-column>

				<triblock-table-column title="End Date">
					<template>
						<div>
							<tricomp-time-placeholder value="[[item.plannedEnd]]">
								[[_convertDateAndTime(item.plannedEnd, currentUser, currentUser._DateFormat)]]
							</tricomp-time-placeholder>
						</div>
					</template>
				</triblock-table-column>

				<triblock-table-column title="End Time">
					<template>
						<div>
							<tricomp-time-placeholder value="[[item.plannedEnd]]">
								[[_convertDateAndTime(item.plannedEnd, currentUser, _userTimeFormat)]]
							</tricomp-time-placeholder>
						</div>
					</template>
				</triblock-table-column>

				<triblock-table-column title="Time Category">
					<template>
						<div>
							<span>[[item.timeCategory]]</span>
						</div>
					</template>
				</triblock-table-column>

				<triblock-table-column title="Duration">
					<template>
						<div>
							<tricomp-time-placeholder value="[[_convertHoursToMilliseconds(item.hours)]]">
								<tricomp-time-duration duration="[[_convertHoursToMilliseconds(item.hours)]]" tokens="h:m:s"></tricomp-time-duration>
							</tricomp-time-placeholder>
						</div>
					</template>
				</triblock-table-column>
				
				<triblock-table-column class="link-column" hide="[[readonly]]">
					<template>
						<paper-icon-button class="icon" noink="" icon="ibm-glyphs:remove" aria-label="Remove Time Entry" on-tap="_removeTapped" danger="" disabled="[[!_isTimeLogOwner(currentUser._id, item.profileId)]]"></paper-icon-button> 
					</template>
				</triblock-table-column>

				<triblock-table-row-detail>
					<template>
						<div class="comments-section" hidden\$="[[!item.comments]]">
							<label>Comments</label>
							<span>[[item.comments]]</span>
						</div>
					</template>
				</triblock-table-row-detail>
			</triblock-table>
		</template>
	`,

    is: "tricomp-time-table",

    behaviors: [
	    IronResizableBehavior,
	    TriWorkTaskTimeUtilitiesBehavior,
		TriDirBehavior,
		TriTaskDetailSectionBehavior
	],

    properties: {
		currentUser: Object,

		readonly: Boolean,

		timeLogs: Object,

		_computeRowAriaLabelCallback: {
			type: Function,
			value: function() {
				return this._computeRowAriaLabel.bind(this);
			}
		}
	},

	observers: [
		"_notifyResize(timeLogs, opened, 500)",
	],

    _tableChanged: function() {
		this.debounce("tableChanged", function() {
			this.notifyResize();
		}.bind(this), 300);
	},

    _timeLogSelected: function(e) {
		e.stopPropagation();
		
		// Selected Time Log
		var selectedTimeLog = e.detail.item;
		if (!this._isTimeLogOwner(this.currentUser._id, selectedTimeLog.profileId)) return;

		TriroutesTimeLog.getInstance().openTimeLogDetail(selectedTimeLog._id);
	},

    _removeTapped: function(e) {
		e.stopPropagation();
		if (e.model.item.plannedEnd)
			this.fire("open-remove-popup", {_id: e.model.item._id, plannedStart: e.model.item.plannedStart});
		else 
			this.fire("open-still-running-popup");
	},

    _isTimeLogOwner: function(userId, timeLogOwnerId) {
	    if (!assertParametersAreDefined(arguments)) {
		    return;
		}

		return userId == timeLogOwnerId;
	},

    _computeRowAriaLabel: function(item) {
		var __dictionary__timeRowAriaLabel = "This time log is for";
		return __dictionary__timeRowAriaLabel + " " + item.personName + "."
	}
});