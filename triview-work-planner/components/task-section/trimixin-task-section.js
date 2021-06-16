import { getTriserviceWorkTask } from "../../services/triservice-work-task.js";

export const TrimixinTaskSection = (superClass) => class extends superClass {
	static get properties() {
		return {
			_selectedTasks: {
				type: Array
			},

			_currentUser: {
				type: Object
			},

			_taskStartDate: {
				type:String
			},

			_taskEndDate: {
				type:String
			},

			_selectedStatus: {
				type: String
			},

			_taskFilters: {
				type: Array
			},

			_previousSelectedStatus: {
				type: String
			}
		}
	}

	_isOverdueStatus(selectedStatus) {
		return selectedStatus && selectedStatus == "overdue";
	}

	_handleSelectedStatusChanged(e) {
		this._selectedTasks = [];
		setTimeout(() => getTriserviceWorkTask().refreshTasksOfCurrentTab());
	}
}