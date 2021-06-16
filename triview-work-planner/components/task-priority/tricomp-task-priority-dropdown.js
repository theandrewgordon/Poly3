/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../services/triservice-work-task.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "../../styles/tristyles-work-planner.js";
import "./tricomp-task-priority-item.js";

class TricompTaskPriorityDropdown extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-task-priority-dropdown"; }

	static get template() {
		return html`
			<style include="work-planner-shared-styles work-planner-dropdown-styles tristyles-theme">
				.content {
					padding: 1px;
				}

				paper-listbox {
					padding: 0;
				}

				paper-item {
					--paper-item-min-height: 45px;
					--paper-item: {
						padding: 0 10px;
					};
				}
				paper-item:hover {
					background-color: #EEF6FE;
					cursor: pointer;
				}
				paper-item.iron-selected {
					background-color: #F7FBFF;
					font-weight: normal;
				}

				.divider {
					height: 1px;
					width: auto;
				}
			</style>

			<triservice-work-task id="workTaskService" task-priorities="{{_taskPriorities}}"></triservice-work-task>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="24"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]"
				horizontal-align="[[_horizontalAlign]]">
				<div class="content" slot="dropdown-content">
					<paper-listbox attr-for-selected="name" selected="{{_value.priorityENUS}}" fallback-selection="None">
						<dom-repeat items="[[_taskPriorities]]">
							<template>
								<paper-item name="[[item.priorityENUS]]" on-tap="_prioritySelected">
									<tricomp-task-priority-item horizontal priority="[[item.priority]]" priority-en-us="[[item.priorityENUS]]" priority-color="[[item.priorityColor]]" icon-only="[[iconOnly]]"></tricomp-task-priority-item>
								</paper-item>
							</template>
						</dom-repeat>
						<div class="divider"></div>
						<paper-item name="None" on-tap="_prioritySelected">
							<tricomp-task-priority-item horizontal icon-only="[[iconOnly]]"></tricomp-task-priority-item>
						</paper-item>
					</paper-listbox>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			iconOnly: {
				type: Boolean
			},

			_horizontalAlign: {
				type: String
			},

			_task: {
				type: Object,
			},

			_value: {
				type: Number,
			},

			_originalValue: {
				type: Number,
			},

			_taskPriorities: {
				type: Array
			}
		};
	}

	toggle(fitInto = window, scrollContainer, targetElement, task, priorityENUS, horizontalAlign) {
		if (!this._opened || this._targetElement != targetElement) {
			document.body.appendChild(this);
			if (!this._taskPriorities || this._taskPriorities.length == 0) {
				this.$.workTaskService.refreshTaskPriorities()
					.then(() => {
						this._handleOpenDropdown(fitInto, scrollContainer, targetElement, task, priorityENUS, horizontalAlign);
						setTimeout(this.$.dropdown.refit.bind(this.$.dropdown), 400);
					});
			} else {
				this._handleOpenDropdown(fitInto, scrollContainer, targetElement, task, priorityENUS, horizontalAlign);
			}
		} else {
			this.close();
		}
	}

	_handleOpenDropdown(fitInto, scrollContainer, targetElement, task, priorityENUS, horizontalAlign) {
		this._task = task;
		this._value = this._getPriority(priorityENUS);
		this._originalValue = this._getPriority(priorityENUS);
		this._horizontalAlign = horizontalAlign;
		this._targetElement = targetElement;
		this._fitInto = fitInto;
		this._scrollContainer = scrollContainer;
		this.$.dropdown.open();
	}

	_getPriority(priorityENUS) {
		return this._taskPriorities.find((item) => item.priorityENUS == priorityENUS);
	}

	close() {
		this.$.dropdown.close();
	}

	_prioritySelected(e) {
		e.stopPropagation();

		if (!this._task || this._task.priorityENUS == e.currentTarget.name) return;
		let selected = e.currentTarget.name;
		this._value = this._getPriority(selected);
		this.$.workTaskService.updateTaskPriority(this._task, this._value, this._originalValue)
			.then(() => this.close());
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/hours-selector/tricomp-task-priority-dropdown.js");
	}
}

window.customElements.define(TricompTaskPriorityDropdown.is, TricompTaskPriorityDropdown);