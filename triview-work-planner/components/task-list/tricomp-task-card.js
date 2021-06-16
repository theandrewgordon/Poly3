/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import { NeonAnimationRunnerBehavior } from "../../../@polymer/neon-animation/neon-animation-runner-behavior.js";
import "../../../@polymer/neon-animation/animations/slide-left-animation.js";
import { TriDirBehavior } from "../../../tricore-dir-behavior/tricore-dir-behavior.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import { TriDateUtilities } from "../../../triplat-date-utilities/triplat-date-utilities.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../styles/tristyles-work-planner.js";
import "../datetime-selector/tricomp-datetime-selector.js";
import "../hours-selector/tricomp-hours-selector.js";
import "../task-priority/tricomp-task-priority.js";
import "../text-placeholder/tricomp-text-placeholder.js";
import { TrimixinTaskCard } from "./trimixin-task-card.js";
import "./tricomp-task-assign-button.js";

class TricompTaskCard extends mixinBehaviors([TriDirBehavior, TriDateUtilities, NeonAnimationRunnerBehavior], TrimixinTaskCard(PolymerElement)) {
	static get is() { return "tricomp-task-card"; }

	static get template() {
		return html`
			<style include="work-planner-task-card-styles work-planner-shared-styles tristyles-theme">
				:host {
					padding: 5px 0;
				}

				:host(:not([small-layout])) {
					width: calc(100% - 20px)!important;
				}

				.card {
					@apply --layout-horizontal;
				}

				.card .checkbox-container {
					padding-top: 10px;
				}

				:host([dir="ltr"]:not([small-layout])) .card {
					margin-right: 0px;
				}

				:host([dir="rtl"]:not([small-layout])) .card {
					margin-left: 0px;
				}

				:host(:not([_small-or-medium])) .task-id-name {
					font-size: 18px;
				}

				.assign-button {
					@apply --layout-self-center;
				}
			</style>

			<div id="card" class="card" selected\$="[[selected]]" dragging\$="[[dragging]]" no-selection\$="[[noSelection]]">

				<dom-if if="[[!noSelection]]">
					<template>
						<div class="checkbox-container">
							<paper-checkbox class="checkbox" checked="{{selected}}" on-change="_handleCheckboxChange"></paper-checkbox>
						</div>
					</template>
				</dom-if>
				
				<div class="task-details-container">
					<div class="horizontal-details first-row">
						<div class="task-id-name">
							<div class="task-id">[[task.id]]</div>
							<div class="task-name">[[task.name]]</div>
						</div>
						<dom-if if="[[assignmentStatusField]]">
							<template>
								<div class="task-status" hidden\$="[[_smallOrMedium]]">[[task.assignmentStatus]]</div>
							</template>
						</dom-if>
					</div>

					<div class="horizontal-details" hidden\$="[[!_smallOrMedium]]">
						<div class="first-small-column">
							<div hidden\$="[[!task.requestClass]]">[[task.requestClass]]</div>
							<div hidden\$="[[!task.serviceClass]]">[[task.serviceClass]]</div>
						</div>
						<dom-if if="[[assignmentStatusField]]">
							<template>
								<div class="last-small-column">[[task.assignmentStatus]]</div>
							</template>
						</dom-if>
						<dom-if if="[[assignButton]]">
							<template>
								<tricomp-task-assign-button class="last-small-column assign-button" assignment-status="[[task.assignmentStatusENUS]]" 
									on-tap="_handleAssignButtonTap">
								</tricomp-task-assign-button>
							</template>
						</dom-if>
					</div>

					<div class="horizontal-details">
						<div class="first-column" hidden\$="[[_smallOrMedium]]">
							<div hidden\$="[[!task.requestClass]]">[[task.requestClass]]</div>
							<div hidden\$="[[!task.serviceClass]]">[[task.serviceClass]]</div>
						</div>
						<div class="middle-column first-small-column">[[task._location]]</div>
						<div class="last-column last-small-column priority-column">
							<label>Priority:</label>
							<tricomp-task-priority class="task-priority" horizontal text-overflow 
								task="[[task]]" scroll-container="[[scrollContainer]]" read-only="[[disablePriority]]"
								priority="[[task.priority]]"
								priority-en-us="[[task.priorityENUS]]"
								priority-color="[[task.priorityColor]]" opened="{{_priorityOpened}}"></tricomp-task-priority>
						</div>
					</div>

					<div hidden\$="[[!task.description]]">[[task.description]]</div>

					<div hidden\$="[[!_smallOrMedium]]">
						<label>Type:</label>
						<tricomp-text-placeholder value="[[task.type]]">
							[[task.type]]
						</tricomp-text-placeholder>
					</div>

					<div class="horizontal-details">
						<div class="first-column first-small-column">
							<dom-if if="[[plannedStartEndField]]">
								<template>
									<label>Planned start/end:</label>
									<div>
										<tricomp-datetime-selector label="Planned start" value="[[task.plannedStart]]" task="[[task]]" 
											current-user="[[currentUser]]" scroll-container="[[scrollContainer]]" opened="{{_plannedStartOpened}}" 
											planned-start read-only="[[disableDate]]">
										</tricomp-datetime-selector>
									</div>
									<div>
										<tricomp-datetime-selector label="Planned end" value="[[task.plannedEnd]]" task="[[task]]"
											current-user="[[currentUser]]" scroll-container="[[scrollContainer]]" opened="{{_plannedEndOpened}}"
											planned-end read-only="[[disableDate]]"></tricomp-datetime-selector>
									</div>
								</template>
							</dom-if>
							<dom-if if="[[duoOnField]]">
								<template>
									<label>Due on:</label>
									<div>[[formatDateWithTimeZone(task.plannedEnd, currentUser._TimeZoneId, currentUser._DateTimeFormat, currentUser._Locale)]]</div>
								</template>
							</dom-if>
						</div>
						<div class="middle-column last-small-column">
							<dom-if if="[[timeEstimateField]]">
								<template>
									<label>Time estimate:</label>
									<div>
										<tricomp-hours-selector value="[[task.workHours]]" task="[[task]]" scroll-container="[[scrollContainer]]" 
											opened="{{_workHoursOpened}}" work-hours read-only="[[disableDate]]">
										</tricomp-hours-selector>
									</div>
								</template>
							</dom-if>
							<dom-if if="[[typeFieldMiddle]]">
								<template>
									<label>Type:</label>
									<div>
										<tricomp-text-placeholder value="[[task.type]]">
											[[task.type]]
										</tricomp-text-placeholder>
									</div>
								</template>
							</dom-if>
						</div>
						<div class="last-column" hidden\$="[[_smallOrMedium]]">
							<dom-if if="[[typeFieldLast]]">
								<template>
									<label>Type:</label>
									<div>
										<tricomp-text-placeholder value="[[task.type]]">
											[[task.type]]
										</tricomp-text-placeholder>
									</div>
								</template>
							</dom-if>
						</div>
					</div>
					${this.viewFullTaskRowTemplate}
				</div>

				<div class="hover-icon-container" draggable\$="[[_computeDraggable(disableDrag)]]">
					<iron-icon icon="ibm-glyphs:drag-handle" primary></iron-icon>
				</div>
			</div>
		`;
	}

	ready() {
		super.ready();
		this._initializeSetupDraggable(this);
	}

	_handleAssignButtonTap() {
		this.dispatchEvent(
			new CustomEvent(
				"task-assign-button-tap", 
				{
					detail: { task: this.task },
					bubbles: false, composed: false
				}
			)
		);
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-task-card.js");
	}
}

window.customElements.define(TricompTaskCard.is, TricompTaskCard);