/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-icon/iron-icon.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-icon/ibm-icons.js";

class TricompTaskPriorityItem extends PolymerElement {
	static get is() { return "tricomp-task-priority-item"; }

	static get template() {
		return html`
			<style include="tristyles-theme">
				:host {
					font-size: 14px;
					min-width: 0;
				}
				:host([vertical]) {
					@apply --layout-center-center;
					@apply --layout-vertical;
				}
				:host([horizontal]) {
					@apply --layout-center;
					@apply --layout-horizontal;
				}

				iron-icon {
					--iron-icon-height: var(--priority-icon-height, 18px);
					--iron-icon-width: var(--priority-icon-width, 18px);
					flex-shrink: 0;
				}

				.text-priority {
					max-width: 80px;
					word-wrap: break-word;
				}
				:host([text-overflow]) .text-priority {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				:host([vertical]) > .text-priority {
					margin-top: 2px;
				}
				:host([horizontal]) > .text-priority {
					margin-left: 5px;
				}
			</style>

			<iron-icon icon="[[_computePriorityIconName(priorityEnUs)]]" style$="[[_computePriorityIconColor(priorityColor)]]" aria-label$="[[priority]]" role="img"></iron-icon>
			<div hidden$="[[iconOnly]]" class="text-priority">[[priority]]</div>
		`;
	}

	static get properties() {
		return {
			priority: {
				type: String,
				value: ""
			},

			priorityEnUs: {
				type: String,
				value: ""
			},

			priorityColor: {
				type: String,
				value: ""
			},

			iconOnly: {
				type: Boolean,
				value: false
			},

			vertical: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			horizontal: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			textOverflow: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			}
		};
	}

	static get observers() {
		return [
			"_setPriorityNone(priority, priorityEnUs, priorityColor)",
			"_setLocation(locationPath, locationTypeEnUs)"
		]
	}

	_setPriorityNone(priority, priorityEnUs, priorityColor) {
		let __dictionary__priorityNone = "None";
		this.priority = (!priority || priority == "") ? __dictionary__priorityNone : priority;
		this.priorityEnUs = (!priorityEnUs || priorityEnUs == "") ? "None" : priorityEnUs;
		this.priorityColor = (!priorityColor || priorityColor == "") ? "#AEAEAE" : priorityColor;
	}

	_computePriorityIconName(priority) {
		var className = "priority-";
		if (priority && priority !== "") {
			className += priority.toLowerCase();
		} else {
			className = "";
		}
		return "ibm:" + className;
	}

	_computePriorityIconColor(color) {
		if (color) {
			return "color: " + color;
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/task-priority/tricomp-task-priority-item.js");
	}
}

window.customElements.define(TricompTaskPriorityItem.is, TricompTaskPriorityItem);