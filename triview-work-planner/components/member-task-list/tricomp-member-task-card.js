/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import { MutableData } from "../../../@polymer/polymer/lib/mixins/mutable-data.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { TriDateUtilities } from "../../../triplat-date-utilities/triplat-date-utilities.js";
import "../../styles/tristyles-work-planner.js";
import { formatDate } from "../../utils/triutils-date.js";
import "../date-selector/tricomp-date-selector.js";
import "../hours-selector/tricomp-hours-selector.js";
import "../task-location/tricomp-task-location.js";
import "../task-priority/tricomp-task-priority.js";
import "../text-placeholder/tricomp-text-placeholder.js";
import "../edit-assignment/tricomp-edit-assignment.js";

class TricompMemberTaskCard extends mixinBehaviors([TriDateUtilities, TriDirBehavior], MutableData(PolymerElement)) {
	static get is() { return "tricomp-member-task-card"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-vertical;
					flex-shrink: 0;
					margin-top: -1px;
				}

				.card:hover {
					transform: translateZ(1px);
				}

				.card {
					@apply --layout-vertical;
					padding: 15px;
				}

				.row {
					@apply --layout-horizontal;
					padding-bottom: 10px
				}

				.card > div:last-child {
					padding-bottom: 0px;
				}

				.column {
					@apply --layout-vertical;
				}

				.col-1 {
					@apply --layout-flex-9;
				}

				.col-2 {
					@apply --layout-flex-9;
				}

				.col-3 {
					@apply --layout-flex-6;
				}

				.col-4 {
					@apply --layout-flex-5;
				}

				.col-5 {
					@apply --layout-flex-6;
				}

				.column.priority {
					@apply --layout-flex-11;
				}

				.column.edit-col {
					@apply --layout-center-justified;
				}

				:host([dir="ltr"]) .column {
					padding-right: 20px;
				}

				:host([dir="rtl"]) .column {
					padding-left: 20px;
				}

				:host([dir="ltr"]) .column.priority {
					padding-right: 40px;
				}

				:host([dir="rtl"]) .column.priority {
					padding-left: 40px;
				}

				.row > div:last-child {
					padding-left: 0px !important;
					padding-right: 0px !important;
				}

				tricomp-task-priority {
					@apply --layout-self-start;
				}
				
				tricomp-edit-assignment {
					@apply --layout-self-start;
				}

				.task-id::after {
					content: "-";
					padding-left: 2px;
					padding-right: 2px;
				}

				.task-id, .task-name {
					font-size: 16px;
				}
			</style>

			<div id="card" class="card">
				<div class="row">
					<div class="task-id">[[task.id]]</div>
					<div class="task-name">[[task.name]]</div>
				</div>
				<div class="row">
					<div class="column col-1">
						<div hidden$="[[!task.requestClass]]">[[task.requestClass]]</div>
						<div hidden$="[[!task.serviceClass]]">[[task.serviceClass]]</div>
					</div>
					<div class="column col-2">
						<template is="dom-if" if="[[task.locationPath]]">
							<tricomp-task-location 
								location-path="[[task.locationPath]]"
								location-type-en-us="[[task.locationTypeENUS]]"></tricomp-task-location>
						</template>
					</div>
					<div class="column priority">
						<label>Priority:</label>
						<tricomp-task-priority horizontal
							task="[[task]]" fit-into="[[fitInto]]"
							priority="[[task.priority]]"
							priority-en-us="[[task.priorityENUS]]"
							priority-color="[[task.priorityColor]]"
							read-only="[[disablePriority]]">
						</tricomp-task-priority>
					</div>
					<div class="column col-5 edit-col">
						<tricomp-edit-assignment task="[[task]]" fit-into="[[fitInto]]" close-after-selected-member-removal></tricomp-edit-assignment>
					</div>
				</div>

				<div class="row" hidden$="[[!task.description]]">[[task.description]]</div>

				<div class="row">
					<div class="column col-1">
						<label>Due by:</label>
						<div>[[formatDateWithTimeZone(task.plannedEnd, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</div>
					</div>
					<div class="column col-2">
						<label>Allocation:</label>
						<div>
							<tricomp-date-selector value="{{task.allocatedDate}}" task="[[task]]" current-user="[[currentUser]]" 
								fit-into="[[fitInto]]" read-only="[[disableAllocatedDate]]">
							</tricomp-date-selector>
						</div>
					</div>
					<div class="column col-3">
						<label>Allocated time:</label>
						<div>
							<tricomp-hours-selector value="{{task.allocatedHours}}" task="[[task]]" 
								fit-into="[[fitInto]]" read-only="[[disableAllocatedHours]]">
							</tricomp-hours-selector>
						</div>
					</div>
					<div class="column col-4">
						<label>Type:</label>
						<div>
							<tricomp-text-placeholder value="[[task.type]]">
								[[task.type]]
							</tricomp-text-placeholder>
						</div>
					</div>
					<div class="column col-5">
						<label>Status:</label>
						<div>[[task.status]]</div>
					</div>
				</div>
			</div>
		`;
	}

	static get properties() {
		return {
			task: {
				type: Object,
				notify: true
			},

			fitInto: {
				type: Object
			},

			currentUser: {
				type: Object
			},

			disableAllocatedHours: {
				type: Boolean,
				value: false
			},

			disableAllocatedDate: {
				type: Boolean,
				value: false
			},

			disablePriority: {
				type: Boolean,
				value: false
			}
		};
	}

	ready() {
		super.ready();
	}

	_formatDate(date, currentUser) {
		if (!date || !currentUser) {
			return "";
		}
		return formatDate(date, currentUser._DateFormat, currentUser._Locale);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/member-task-list/tricomp-member-task-card.js");
	}
}

window.customElements.define(TricompMemberTaskCard.is, TricompMemberTaskCard);