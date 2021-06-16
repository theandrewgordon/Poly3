/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-flex-layout/iron-flex-layout.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import { getModuleUrl, addCustomStyle } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-duration/triplat-duration-period-counter.js";
import { getTriserviceTaskAssignment } from "../../services/triservice-task-assignment.js";
import { getTriserviceWorkTask } from "../../services/triservice-work-task.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "../../styles/tristyles-work-planner.js";

// Enforce text-align on edge browsers. Edge is not accepting the style of text-align using CSS mixins.
if (/Edge/i.test(navigator.userAgent)) addCustomStyle( `
<style>
	triplat-duration-period-counter.tricomp-hours-selector-dropdown input.paper-input {
		text-align: center !important;
	}
</style>
`);

class TricompHoursSelectorDropdown extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-hours-selector-dropdown"; }

	static get template() {
		return html`
			<style include="work-planner-dropdown-styles tristyles-theme">
				triplat-duration-period-counter {
					--triplat-duration-period-counter-icon: {
						height: 30px;
						width: 30px;
					};
				}

				.error {
					color: var(--tri-error-color);
					font-size: 11px;
					white-space: nowrap;
				}
			</style>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="24"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]">
				<div class="content" slot="dropdown-content">
					<label>Hours:</label>
					<triplat-duration-period-counter value="{{_value}}" min="1" max="9999" disable-keyboard-input="[[_disableKeyboardInput]]"></triplat-duration-period-counter>
					<div class="error" hidden\$="[[_isValid]]">[[_errorMessage]]</div>
					<div class="buttons">
						<paper-button primary-outline on-tap="close">Cancel</paper-button>
						<paper-button primary on-tap="_doneChanges" disabled="[[!_isValid]]">Done</paper-button>
					</div>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			_value: {
				type: Number,
			},

			_task: {
				type: Object,
			},

			_originalValue: {
				type: Number,
			},

			_isValid: {
				type: Boolean,
				computed: "_computeIsValid(_value)"
			},

			_errorMessage: {
				type: String,
				computed: "_computeErrorMessage(_value)"
			},

			_workHours: {
				type: Boolean
			},

			_disableKeyboardInput: {
				type: Boolean, 
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_handleIsValidChanged(_isValid)"
		]
	}

	toggle(fitInto = window, scrollContainer, targetElement, task, value, workHours, disableKeyboardInput) {
		if (!this._opened || this._targetElement != targetElement) {
			document.body.appendChild(this);
			this._task = task;
			this._value = value;
			this._originalValue = value;
			this._targetElement = targetElement;
			this._fitInto = fitInto;
			this._scrollContainer = scrollContainer;
			this._workHours = workHours;
			this._disableKeyboardInput= disableKeyboardInput
			this.$.dropdown.open();
		} else {
			this.close();
		}
	}

	close() {
		this.$.dropdown.close();
	}

	_computeIsValid(value) {
		return value > 0 && value < 10000;
	}

	_computeErrorMessage(value) {
		var __dictionary__minErrorMessage =  "Value must be greater than 0.";
		var __dictionary__maxErrorMessage =  "Value must be less than 10000";
		if (value < 1) return __dictionary__minErrorMessage;
		if (value > 9999) return __dictionary__maxErrorMessage;
		return "";
	}

	_doneChanges(event) {
		event.stopPropagation();
		if (this._value != this._originalValue) {
			if (this._workHours) {
				getTriserviceWorkTask().updatePlannedWorkingHours(this._task, this._value, this._originalValue)
					.then(() => this.close());
			} else {
				getTriserviceTaskAssignment().updateAllocatedHours(this._task, this._value, this._originalValue)
					.then(() => this.close());
			}
		} else {
			this.close();
		}
	}

	_handleIsValidChanged(isValid) {
		if (this._opened) {
			this.$.dropdown.notifyResize();
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/hours-selector/tricomp-hours-selector-dropdown.js");
	}
}

window.customElements.define(TricompHoursSelectorDropdown.is, TricompHoursSelectorDropdown);