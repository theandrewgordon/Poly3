/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/paper-button/paper-button.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-datetime-picker/triplat-datetime-picker.js";
import { getTriserviceWorkTask } from "../../services/triservice-work-task.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "../../styles/tristyles-work-planner.js";

class TricompDatetimeSelectorDropdown extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-datetime-selector-dropdown"; }

	static get template() {
		return html`
			<style include="work-planner-dropdown-styles tristyles-theme">
				.content {
					overflow: hidden;
				}
			</style>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="24"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]">
				<div class="content" slot="dropdown-content">
					<div>
						<label>[[_label]]:</label>
						<triplat-datetime-picker id="datetimePicker" value="{{_value}}" display-format="[[_currentUser._DateTimeFormat]]" 
							time-zone="[[_currentUser._TimeZoneId]]" no-label-float allow-click-through disable-keyboard-input="[[_disableKeyboardInput]]">
						</triplat-datetime-picker>
					</div>
					<div class="buttons">
						<paper-button primary-outline on-tap="close">Cancel</paper-button>
						<paper-button primary on-tap="_doneChanges" disabled="[[_disableDoneButton(_value)]]">Done</paper-button>
					</div>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
			_label: {
				type: String
			},

			_value: {
				type: String
			},

			_originalValue: {
				type: String
			},

			_task: {
				type: Object
			},

			_currentUser: {
				type: Object
			},

			_plannedStart: {
				type: Boolean,
				value: false
			},

			_plannedEnd: {
				type: Boolean,
				value: false
			},

			_disableKeyboardInput: {
				type: Boolean, 
				value: false
			}
		};
	}

	static get observers() {
		return [
			"_resetData(_opened)"
		]
	}

	toggle(fitInto = window, scrollContainer, targetElement, task, value, currentUser, label, plannedStart, plannedEnd, disableKeyboardInput) {
		if (!this._opened || this._targetElement != targetElement) {
			document.body.appendChild(this);
			this._label = label;
			this._task = task;
			this._currentUser = currentUser;
			this._value = value;
			this._originalValue = value;
			this._plannedStart = plannedStart;
			this._plannedEnd = plannedEnd;
			this._disableKeyboardInput = disableKeyboardInput;
			this._targetElement = targetElement;
			this._fitInto = fitInto;
			this._scrollContainer = scrollContainer;
			this.$.dropdown.open();
		} else {
			this.close();
		}
	}

	close() {
		this.$.dropdown.close();
	}

	_resetData(opened) {
		if (!opened) {
			this.$.datetimePicker.closeCalendar();
		}
	}

	_disableDoneButton(value) {
		return !value || value == "";
	}

	_doneChanges(event) {
		event.stopPropagation();
		if (this._value != this._originalValue) {
			if (this._plannedStart) {
				getTriserviceWorkTask().updatePlannedStart(this._task, this._value, this._originalValue)
					.then(() => {
						this.close();
					});
			}
			if (this._plannedEnd) {
				getTriserviceWorkTask().updatePlannedEnd(this._task, this._value, this._originalValue)
					.then(() => {
						this.close();
					});
			}
		} else {
			this.close();
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/date-selector/tricomp-datetime-selector-dropdown.js");
	}
}

window.customElements.define(TricompDatetimeSelectorDropdown.is, TricompDatetimeSelectorDropdown);