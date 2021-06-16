/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../../@polymer/polymer/polymer-element.js";
import "../../../@polymer/iron-dropdown/iron-dropdown.js";
import "../../../@polymer/paper-button/paper-button.js";
import "../../../@polymer/paper-checkbox/paper-checkbox.js";
import { getModuleUrl } from "../../../tricore-util/tricore-util.js";
import "../../../triplat-date-picker/triplat-date-picker.js";
import "../../services/triservice-people.js";
import { getTriserviceTaskAssignment } from "../../services/triservice-task-assignment.js";
import { TrimixinDropdown } from "../dropdown/trimixin-dropdown.js";
import "../../styles/tristyles-work-planner.js";

class TricompDateSelectorDropdown extends TrimixinDropdown(PolymerElement) {
	static get is() { return "tricomp-date-selector-dropdown"; }

	static get template() {
		return html`
			<style include="work-planner-dropdown-styles tristyles-theme">
				.content {
					overflow: visible;
				}

				.checkbox-container {
					margin-bottom: 10px;
					margin-top: 10px;
				}
			</style>

			<triservice-people id="peopleservice" selected-member="{{_selectedMember}}"></triservice-people>
			<triservice-task-assignment id="taskAssignmentService" allocated-people="{{_allocatedPeople}}"></triservice-task-assignment>

			<iron-dropdown id="dropdown" dynamic-align allow-outside-scroll opened="{{_opened}}" vertical-offset="24"
				open-animation-config="[[_openAnimationConfig]]" close-animation-config="[[_closeAnimationConfig]]"
				position-target="[[_targetElement]]" fit-into="[[_fitInto]]" scroll-action="[[_scrollAction]]">
				<div class="content" slot="dropdown-content">
					<div>
						<label>Allocation:</label>
						<triplat-date-picker id="datePicker" value="{{_value}}" display-format="[[_currentUser._DateFormat]]" 
							disable-keyboard-input="[[_disableKeyboardInput]]" no-label-float allow-click-through>
						</triplat-date-picker>
					</div>
					<div class="checkbox-container" hidden\$="[[!_multiAllocatedPeople(_allocatedPeople.*)]]">
						<paper-checkbox checked="{{_multiPeopleChecked}}">Apply change to all assigned people</paper-checkbox>
					</div>
					<div class="buttons">
						<paper-button primary-outline on-tap="close">Cancel</paper-button>
						<paper-button primary on-tap="_doneChanges" disabled="[[_disableDoneButton(_allocatedPeople)]]">Done</paper-button>
					</div>
				</div>
			</iron-dropdown>
		`;
	}

	static get properties() {
		return {
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

			_selectedMember: {
				type: Object
			},

			_allocatedPeople: {
				type: Array
			},

			_multiPeopleChecked: {
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

	toggle(fitInto = window, scrollContainer, targetElement, task, value, currentUser, disableKeyboardInput) {
		if (!this._opened || this._targetElement != targetElement) {
			this._task = task;
			this._currentUser = currentUser;
			this._disableKeyboardInput = disableKeyboardInput;
			this._value = value;
			this._originalValue = value;

			this.$.taskAssignmentService.refreshAllocatedPeople(task._id)
				.then(() => { setTimeout(this.$.dropdown.refit.bind(this.$.dropdown), 400) });

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

	_multiAllocatedPeople(allocatedPeopleChanges) {
		return this._allocatedPeople && this._allocatedPeople .length > 1;
	}

	_resetData(opened) {
		if (!opened) {
			this.set("_multiPeopleChecked", false);
			this.$.datePicker.closeCalendar();
		}
	}

	_disableDoneButton(allocatedPeople) {
		return !allocatedPeople || allocatedPeople.length == 0;
	}

	_doneChanges(event) {
		event.stopPropagation();
		if (this._value != this._originalValue) {
			getTriserviceTaskAssignment().updateAllocatedDate(this._task, this._value, this._selectedMember, this._multiPeopleChecked)
				.then(() => {
					this.close();
				});
		} else {
			this.close();
		}
	}

	static get importMeta() {
		return getModuleUrl("triview-work-planner/components/date-selector/tricomp-date-selector-dropdown.js");
	}
}

window.customElements.define(TricompDateSelectorDropdown.is, TricompDateSelectorDropdown);