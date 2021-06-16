/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import "../../../@polymer/paper-progress/paper-progress.js";
import { getModuleUrl  } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons.js";
import "../../styles/tristyles-work-planner.js";

class TricompPeopleCapacity extends PolymerElement {
	static get is() { return "tricomp-people-capacity"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles tristyles-theme">
				:host {
					@apply --layout-horizontal;
					@apply --layout-center;
					position: relative;
					min-height: 30px;
				}

				.resource-availability-bar {
					@apply --layout-fit;
					width: auto;
					pointer-events: none;
					@apply --layout-flex;
					z-index: 1;
					--paper-progress-height: 100%;
					--paper-progress-active-color: var(--ibm-teal-70);
					--paper-progress-container-color: var(--tri-secondary-color);
					--paper-progress-transition-duration: 300ms;
					--paper-progress-transition-timing-function: ease-in;
				}

				.availability-text {
					@apply --layout-center-center;
					color: white;
					font-weight: bold;
					padding: 6px 15px 6px 0px;
					z-index: 2;
				}

				:host([_small-or-medium]) .availability-text {
					@apply --layout-vertical;
				}

				:host(:not([_small-or-medium])) .task-quantity {
					padding: 0px 3px;
				}

				.hours {
					text-align: center;
				}

				:host(:not([_small-or-medium])) .hours::after {
					content: ' : '
				}

				.warning-icon {
					color: white;
					height: 22px;
					width: 22px;
					padding: 5px;
					visibility: hidden;
					z-index: 1;
				}

				.warning-icon[over-allocated] {
					visibility: visible;
				}
			</style>

			<paper-progress class="resource-availability-bar transiting" value="[[availability.plannedHours]]" min="0" max="[[_maxAvailability]]"></paper-progress>
			<iron-icon class="warning-icon" icon="ibm:warning" title="over-allocated" noink over-allocated\$="[[_isOverallocated]]"></iron-icon>
			<div class="availability-text">
				<span class="hours">[[availability.plannedHours]] / [[availability.availableHours]] hours</span>
				<span class="task-quantity">[[_computeTaskQuantityText(availability.plannedTasksQty)]]</span>
			</div>
		`;
	}

	static get properties() {
		return {
			availability: {
				type: Object
			},

			smallLayout: {
				type: Boolean
			},

			mediumLayout: {
				type: Boolean
			},

			_maxAvailability: {
				type: Number,
				value: 0,
				computed: "_computeMaxAvailability(availability.plannedHours, availability.availableHours)"
			},

			_isOverallocated: {
				type: Boolean,
				value: false,
				computed: "_computeIsOverallocated(availability.plannedHours, availability.availableHours)"
			},

			_smallOrMedium: {
				type: Boolean,
				computed: "_isSmallOrMedium(smallLayout, mediumLayout)",
				reflectToAttribute: true
			}
		};
	}

	_computeMaxAvailability(plannedHours, availableHours) {
		if (availableHours == 0) {
			return plannedHours == 0 ? 1 : plannedHours;
		}
		return availableHours;
	}

	_computeIsOverallocated(plannedHours, availableHours) {
		return plannedHours > availableHours;
	}

	_isSmallOrMedium(smallLayout, mediumLayout) {
		return smallLayout || mediumLayout;
	}

	_computeTaskQuantityText(plannedTasksQty) {
		var __dictionary__task="task";
		var __dictionary__tasks="tasks";
		return `${plannedTasksQty} ${plannedTasksQty > 1 ? __dictionary__tasks :  __dictionary__task}`;
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/people-capacity/tricomp-people-capacity.js");
	}
}

window.customElements.define(TricompPeopleCapacity.is, TricompPeopleCapacity);