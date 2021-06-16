/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "../../../@polymer/polymer/lib/legacy/class.js";
import "../../../@polymer/iron-collapse/iron-collapse.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import "../../../@polymer/paper-icon-button/paper-icon-button.js";
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

class TricompTaskTableCard extends mixinBehaviors([TriDirBehavior, TriDateUtilities, NeonAnimationRunnerBehavior], TrimixinTaskCard(PolymerElement)) {
	static get is() { return "tricomp-task-table-card"; }

	static get template() {
		return html`
			<style include="work-planner-task-card-styles work-planner-shared-styles tristyles-theme">
				:host {
					width: calc(100% - 20px)!important;
				}

				.card {
					@apply --layout-vertical;
				}

				:host([dir="ltr"]:not([small-layout])) .card {
					margin-right: 0px;
				}

				:host([dir="rtl"]:not([small-layout])) .card {
					margin-left: 0px;
				}

				.main-container {
					@apply --layout-horizontal;
				}

				.expand-button {
					height: 30px;
					width: 30px;
					padding: 0;
				}
				.card:not([expanded]) .expand-button {
					transform: rotate(-90deg);
				}

				.task-id-name {
					font-size: 16px;
				}

				iron-collapse {
					@apply --layout-horizontal;
				}

				iron-collapse > div {
					margin-top: 10px;
				}
			</style>

			<div id="card" class="card" selected\$="[[selected]]" dragging\$="[[dragging]]" expanded\$="[[_expanded]]">
				<div class="main-container">
					<div class="table-checkbox-column">
						<paper-checkbox class="checkbox" checked="{{selected}}" on-change="_handleCheckboxChange"></paper-checkbox>
					</div>
					<div class="table-expand-column">
						<paper-icon-button primary class="expand-button" icon="[[_computeExpandIcon(_expanded)]]"
							on-tap="_toggleCollapse"></paper-icon-button>
					</div>
					<div class="task-details-container">
						<div class="horizontal-details">
							<div class="task-id-name">
								<div class="task-id">[[task.id]]</div>
								<div class="task-name">[[task.name]]</div>
							</div>
							<dom-if if="[[assignmentStatusField]]">
								<template>
									<div class="task-status">[[task.assignmentStatus]]</div>
								</template>
							</dom-if>
						</div>

						<div class="horizontal-details">
							<div class="table-first-column">
								<div hidden\$="[[!task.requestClass]]">[[task.requestClass]]</div>
								<div hidden\$="[[!task.serviceClass]]">[[task.serviceClass]]</div>
							</div>
							<div class="table-middle-column">[[task._location]]</div>
							<div class="table-last-column">
								<tricomp-task-priority class="task-priority" horizontal icon-only
									task="[[task]]" scroll-container="[[scrollContainer]]" read-only="[[disablePriority]]"
									priority="[[task.priority]]"
									priority-en-us="[[task.priorityENUS]]"
									priority-color="[[task.priorityColor]]" opened="{{_priorityOpened}}"
									dropdown-horizontal-align="right">
								</tricomp-task-priority>
							</div>
						</div>
					</div>

					<div class="hover-icon-container" draggable\$="[[_computeDraggable(disableDrag)]]">
						<iron-icon icon="ibm-glyphs:drag-handle" primary></iron-icon>
					</div>
				</div>

				<iron-collapse id="collapse" opened="{{_expanded}}" no-animation>
					<div class="table-checkbox-column"></div>
					<div class="table-expand-column"></div>

					<div class="task-details-container">
						<div hidden\$="[[!task.description]]">[[task.description]]</div>

						<div class="horizontal-details">
							<div class="table-first-column">
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
							<div class="table-middle-column">
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
							<div class="table-last-column">
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

					<div class="hover-icon-container" draggable\$="[[_computeDraggable(disableDrag)]]"></div>
				</iron-collapse>
			</div>
		`;
	}

	static get properties() {
		return {
			_expanded: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			}
		};
	}

	ready() {
		super.ready();
		this._initializeSetupDraggable(this);
	}

	_computeExpandIcon(expanded) {
		return expanded ? "icons:arrow-drop-up" : "icons:arrow-drop-down";
	}

	_toggleCollapse() {
		this.$.collapse.toggle();
		this.dispatchEvent(new CustomEvent("expanded-changed", { bubbles: false, composed: false } ));
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-list/tricomp-task-table-card.js");
	}
}

window.customElements.define(TricompTaskTableCard.is, TricompTaskTableCard);