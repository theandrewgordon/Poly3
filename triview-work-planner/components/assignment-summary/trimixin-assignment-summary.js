import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask } from "../../../@polymer/polymer/lib/utils/async.js";

export const TrimixinAssignmentSummary = (superClass) => class extends superClass {
	static get properties() {
		return {
			_selectedTasks: {
				type: Array
			},

			_selectedPeople: {
				type: Array
			},

			_allocatedPeople: {
				type: Array
			},

			_isSelectedTaskAssigned: {
				type: Boolean
			},

			_canAssign: {
				type: Boolean
			},

			_disableAssignButton: {
				type: Boolean
			}
		};
	}

	static get observers() {
		return [
			"_computeDisableAssignButton(_selectedTasks.*, _selectedPeople.*, _allocatedPeople.*, _canAssign)"
		];
	}

	_computeDisableAssignButton(selectedTasksChange, selectedPeopleChange, allocatedPeopleChange, canAssign) {
		this._debounceDisableAssignButton = Debouncer.debounce(
			this._debounceDisableAssignButton,
			microTask,
			() => {
				if (!canAssign) {
					this._disableAssignButton = true;
					return;
				}
				let taskSize = selectedTasksChange && selectedTasksChange.base ? selectedTasksChange.base.length : 0;
				let peopleSize = selectedPeopleChange && selectedPeopleChange.base ? selectedPeopleChange.base.length : 0;

				if (this._isSelectedTaskAssigned) {
					let selectedUnallocatedPeople = this.$.serviceTaskAssignment.getSelectedUnallocatedPeople(selectedPeopleChange.base, allocatedPeopleChange.base);
					this._disableAssignButton = selectedUnallocatedPeople.length == 0;
				} else {
					this._disableAssignButton = taskSize == 0 || peopleSize == 0;
				}
			}
		);
	}

	_handleAssignTap() {
		if (this._isSelectedTaskAssigned) {
			let selectedUnallocatedPeople = this.$.serviceTaskAssignment.getSelectedUnallocatedPeople(this._selectedPeople, this._allocatedPeople);
			if (selectedUnallocatedPeople.length > 0) return this.$.serviceTaskAssignment.assignTask(this._selectedTasks.slice(), selectedUnallocatedPeople);
		} else {
			return this.$.serviceTaskAssignment.assignTask(this._selectedTasks.slice(), this._selectedPeople.slice());
		}
	}

	_computeSelectedTasksCount(selectedTasksChange) {
		let size = selectedTasksChange && selectedTasksChange.base ? selectedTasksChange.base.length : 0;
		let message;
		if (size > 1) {
			var __dictionary__multipleTasks ="{1} tasks selected";
			message = __dictionary__multipleTasks.replace("{1}", size);
		} else if (size == 1) {
			var __dictionary__multipleTasks = "1 task selected";
			message = __dictionary__multipleTasks;
		} else {
			var __dictionary__noTask = "No task selected";
			message = __dictionary__noTask;
		}
		return message;
	}

	_computeSelectedPeopleCount(selectedPeopleChange) {
		let size = selectedPeopleChange && selectedPeopleChange.base ? selectedPeopleChange.base.length : 0;
		let message;
		if (size > 1) {
			var __dictionary__selectedPeople = "{1} people selected";
			message = __dictionary__selectedPeople.replace("{1}", size);
		} else if (size == 1) {
			var __dictionary__onePerson = "1 person selected";
			message = __dictionary__onePerson;
		} else {
			var __dictionary__noPerson = "No person selected";
			message = __dictionary__noPerson;
		}
		return message;
	}
};