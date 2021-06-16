/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons-glyphs.js";
import "../../styles/tristyles-work-planner.js";

class TricompMemberTaskListHeader extends PolymerElement {
	static get is() { return "tricomp-member-task-list-header"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-horizontal;
					flex-shrink: 0;
				}

				.day {
					font-size: 18px;
					font-weight: 100;
				}

				.capacity-count {
					@apply --layout-flex;
					@apply --layout-horizontal;
					@apply --layout-end-justified;
					@apply --layout-center;
					font-weight: bold;
				}

				.task-count {
					@apply --layout-horizontal;
					@apply --layout-center;
				}

				.task-count::before {
					content: ":";
					padding-left: 2px;
					padding-right: 2px;
				}

				.warning-icon {
					color: black;
					height: 20px;
					width: 20px;
					padding-left: 10px;
					padding-right: 10px;
				}
			</style>

			<div class="day">[[_formatDate(day, currentUser._Locale)]]</div>
			<div class="capacity-count">
				<iron-icon class="warning-icon" icon="ibm-glyphs:warning" title="over-allocated" noink hidden\$="[[!_computeIsOverallocated(_availabilityDay)]]"></iron-icon>
				<span>[[_computeHoursText(_availabilityDay._plannedHours, _availabilityDay._availableHours)]]<span>
			</div>
			<div class="task-count"><span>[[_computeTaskQuantityText(_availabilityDay._plannedTasksQty)]]</span></div>
		`;
	}
	static get properties() {
		return {
			currentUser: {
				type: Object
			},

			day: {
				type: String
			},

			availability: {
				type: Object
			},

			teamAssignmentsRouteActive: {
				type: Boolean
			},

			_availabilityDay: {
				type: Object,
				computed: "_computeAvailabilityDay(day, availability, teamAssignmentsRouteActive)"
			}
		};
	}

	_formatDate(date, locale) {
		return moment(date).locale(locale).format("dddd, MMMM D");
	}

	_computeIsOverallocated(availabilityDay) {
		return availabilityDay._plannedHours > availabilityDay._availableHours;
	}

	get emptyAvailabilityDay() {
		return {
			_availableHours: 0,
			_plannedHours: 0,
			_plannedTasks: [],
			_plannedTasksQty: 0,
			_startWorkingTime: "00:00",
		};
	}

	_computeAvailabilityDay(day, availability, teamAssignmentsRouteActive) {
		if (!day || !availability || !teamAssignmentsRouteActive) {
			return this.emptyAvailabilityDay;
		}
		for (let i = 0; i < availability.days.length; i++) {
			const item = availability.days[i];
			if (moment.parseZone(item._date).format("YYYY-MM-DD") == day) {
				return item;
			}
		}
		return this.emptyAvailabilityDay;
	}

	_computeTaskQuantityText(plannedTasksQty) {
		var __dictionary__task="task";
		var __dictionary__tasks="tasks";
		return `${plannedTasksQty} ${plannedTasksQty > 1 ? __dictionary__tasks :  __dictionary__task}`;
	}

	_computeHoursText(plannedHours, availableHours) {
		var __dictionary__hour="hour";
		var __dictionary__hours="hours";
		var __dictionary__assign="assigned of";
		return `${plannedHours} ${plannedHours > 1 ? __dictionary__hours : __dictionary__hour} ${__dictionary__assign} ${availableHours} ${availableHours > 1 ? __dictionary__hours : __dictionary__hour}`;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/member-task-list/tricomp-member-task-list-header.js");
	}
}

window.customElements.define(TricompMemberTaskListHeader.is, TricompMemberTaskListHeader);