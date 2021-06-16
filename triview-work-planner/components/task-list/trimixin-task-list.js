/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { afterNextRender } from "../../../@polymer/polymer/lib/utils/render-status.js";
import { Debouncer } from "../../../@polymer/polymer/lib/utils/debounce.js";
import { microTask, timeOut } from "../../../@polymer/polymer/lib/utils/async.js";

export const TrimixinTaskList = (superClass) => class extends superClass {
	static get properties() {
		return {
			currentUser: {
				type: Object
			},

			taskFilters: {
				type: Array
			},

			active: {
				type: Boolean,
				value: false
			},

			mediumLayout: {
				type: Boolean,
				value: false
			},

			smallLayout: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},

			scrollContainer: {
				type: Object
			},

			cardLayout: {
				type: Boolean,
				reflectToAttribute: true,
				observer: "_handleLayoutChange"
			},

			_filteredTasks: {
				type: Array
			},

			_nonFilteredTasks: {
				type: Array
			},

			_loading: {
				type: Boolean
			},

			_selectedTasks: {
				type: Array,
				value: () => []
			},

			_isNonFilteredTasksEmpty: {
				type: Boolean,
				value: true
			},

			_isNoSearchResults: {
				type: Boolean,
				value: true
			},

			_dragImageElement: {
				type: Object
			},

			_draggingTask: {
				type: Boolean,
				value: false
			},

			_draggingTaskList: {
				type: Array,
				value: () => []
			},

			_sortField: {
				type: String,
				value: ""
			},
	
			_sortDesc: {
				type: Boolean
			},

			_selectAll: {
				type: Boolean,
				value:false
			},

			_canAssign: {
				type: Boolean
			},

			_canUpdateTaskPriority: {
				type: Boolean
			},

			_canUpdateTaskPlannedDate: {
				type: Boolean
			},

			_noTaskFoundMessage: {
				type: String,
				value: () => {
					let __dictionary__message =  "No work tasks are available.";
					return __dictionary__message;
				}
			}
		};
	}

	static get observers() {
		return [
			"_handleNonFilteredTaskChanges(_nonFilteredTasks.*)",
			"_computeIsNoSearchResults(_isNonFilteredTasksEmpty, _filteredTasks.*)",
			"_handleSelectedTasksChange(_selectedTasks.*, active)",
			"_handleFilteredTaskChanges(_filteredTasks.*, active)"
		]
	}

	ready() {
		super.ready();
		if (!this.smallLayout) this._initializeTaskDragImage();
		else this._removeTaskDragImage();

		afterNextRender(this, () => {
			if (!this.scrollContainer) this.scrollContainer = this.shadowRoot.querySelector("#taskIronList");
		});
	}

	_handleNonFilteredTaskChanges(nonFilteredTasksChanges) {
		if (nonFilteredTasksChanges.path == "_nonFilteredTasks.length") return;
		this._resetListData(nonFilteredTasksChanges);
		this._propagateTaskChanges(nonFilteredTasksChanges);
		this._startTaskRemovalAnimation(nonFilteredTasksChanges);
		if (!this._isAnimating && this.$.taskQuery) {
			setTimeout(() => this.$.taskQuery.notifyPath(nonFilteredTasksChanges.path.replace("_nonFilteredTasks", "data"), nonFilteredTasksChanges.value), 100);
		}
	}

	_propagateTaskChanges(nonFilteredTasksChanges) {
		let availabilityMatch = nonFilteredTasksChanges.path.match(/_nonFilteredTasks\.(\d+)\.(.+)/);
		if (availabilityMatch && availabilityMatch.length == 3) {
			let changedTask = nonFilteredTasksChanges.base[availabilityMatch[1]];
			let taskIndex = this._filteredTasks.findIndex(item => item._id == changedTask._id);
			if (taskIndex >= 0) this.notifyPath(`_filteredTasks.${taskIndex}.${availabilityMatch[2]}`);
		}
	}

	_startTaskRemovalAnimation(nonFilteredTasksChanges) {
		const removedId = this._getRemovedId(nonFilteredTasksChanges);
		if (removedId != null) {
			const taskCard = this.shadowRoot.querySelector(`tricomp-task-card[taskid=task-${removedId}]`);
			if (taskCard) {
				taskCard.playAnimation(null, { action: "taskRemoval", change: nonFilteredTasksChanges });
				this._isAnimating = true;
			}
		}
	}

	_initializeTaskDragImage() {
		this._tricompTaskDragImage = document.querySelector("tricomp-task-drag-image");
		if (!this._tricompTaskDragImage) {
			this._tricompTaskDragImage = document.createElement("tricomp-task-drag-image");
			this._tricompTaskDragImage.id = "task-drag-image";
			document.body.appendChild(this._tricompTaskDragImage);
		}
		afterNextRender(this, () => {
			this._tricompTaskDragImage.tasks = this._selectedTasks;
			this._dragImageElement = this._tricompTaskDragImage.getDragImageElement(-500, -500);
		});
	}

	_removeTaskDragImage() {
		let tricompTaskDragImage = document.querySelector("tricomp-task-drag-image");
		if (tricompTaskDragImage) document.body.removeChild(tricompTaskDragImage);
		this._tricompTaskDragImage = null;
		this._dragImageElement = null;
	}

	_isFirst(index) {
		return index == 0;
	}

	_removeSelectedTask(task) {
		let index = this._selectedTasks.findIndex((currentTask) => currentTask._id == task._id);
		if (index >= 0) this.splice("_selectedTasks", index, 1);
	}

	_markTaskRecordsAsSelected(filteredTasks, nonFilteredTasks, selectedTasks) {
		if (!nonFilteredTasks) {
			return false;
		}
		selectedTasks = selectedTasks != null ? selectedTasks : [];
		nonFilteredTasks.forEach((task) => {
			task.selected = selectedTasks.includes(task);
			task._selectedTxt = task.selected ? "Y" : "N";
		});
		if (filteredTasks) {
			filteredTasks.forEach((task, index) => this.notifyPath(`_filteredTasks.${index}.selected`));
		}
	}

	_resetTaskDragImage() {
		if (this._tricompTaskDragImage) {
			this._tricompTaskDragImage.tasks = this._selectedTasks;
			this._tricompTaskDragImage.notifyPath("tasks");
		}
	}

	_handleDragging(event) {
		const taskIndex = event.model.get("index");
		this._draggingTaskList[taskIndex] = event.detail.dragging;
		this._draggingTask = this._draggingTaskList.indexOf(true) >= 0;
	}

	_resetListData(tasksChange) {
		if (tasksChange && (tasksChange.path == "_nonFilteredTasks" || tasksChange.path == "_nonFilteredTasks.splices")) {
			this._draggingTaskList = [];
			this._selectedTasks = [];
			if (this._isAnimating) {
				//wait task removal animation to complete.
				setTimeout(() => this._isNonFilteredTasksEmpty = (!tasksChange.base || tasksChange.base.length == 0) , 500);
			} else {
				this._isNonFilteredTasksEmpty = !tasksChange.base || tasksChange.base.length == 0;
			}
		}
	}

	_getRemovedId(tasksChange) {
		if (tasksChange.path != "_nonFilteredTasks.splices") {
			return null;
		}
		for (let i = 0; i < tasksChange.value.indexSplices.length; i++) {
			const indexSplice = tasksChange.value.indexSplices[i];
			if (indexSplice.removed && indexSplice.removed.length > 0) {
				return indexSplice.removed[0]._id;
			}
		}
		return null;
	}

	_handleAnimationFinish(e) {
		if (!this.$.taskQuery || !e.detail || e.detail.action != "taskRemoval") {
			return;
		}
		this._isAnimating = false;
		const tasksChange = e.detail.change;
		setTimeout(() => this.$.taskQuery.notifyPath(tasksChange.path.replace("_nonFilteredTasks", "data"), tasksChange.value), 100);
	}

	_computeIsNoSearchResults(isNonFilteredTasksEmpty, filteredTasksChanges) {
		this._debounceComputeIsNoSearchResults = Debouncer.debounce(
			this._debounceComputeIsNoSearchResults,
			timeOut.after(100),
			() => {
				this._isNoSearchResults = !isNonFilteredTasksEmpty && (!this._filteredTasks || this._filteredTasks.length == 0);
			}
		);
	}

	_handleSelectAllChanged(e) {
		if (e.detail.selectAll) {
			let selectedTasksSet = new Set(this._selectedTasks);
			this._filteredTasks.forEach(task => selectedTasksSet.add(task));
			this._selectedTasks = Array.from(selectedTasksSet);
		} else {
			this._selectedTasks = this._selectedTasks.filter(selected => !this._filteredTasks.includes(selected));
		}
	}

	_handleSelectedTasksChange(selectedTasksChange, active) {
		if (active) {
			this._markTaskRecordsAsSelected(this._filteredTasks, this._nonFilteredTasks, selectedTasksChange.base)
			this._resetTaskDragImage();
			this._computeSelectAll();
		}
	}

	_computeSelectAll() {
		this._debounceComputeSelectAll = Debouncer.debounce(
			this._debounceComputeSelectAll,
			microTask,
			() => {
				if (!this._filteredTasks || this._filteredTasks.length == 0 || !this._selectedTasks || this._selectedTasks.length == 0) {
					this._selectAll = false;
				} else {
					let selectedTasks = this._selectedTasks;
					let nonSelected = this._filteredTasks.filter(task => !selectedTasks.includes(task));
					this._selectAll = nonSelected.length == 0;
				}
			}
		);
	}

	_handleFilteredTaskChanges(filteredTasksChanges, active) {
		if (active) {
			this._computeSelectAll();
		}
	}
	_computeDisableDrag(canAssign, smallLayout) {
		return !canAssign || smallLayout;
	}

	_computeShowAssignButton(smallLayout, canAssign, assignmentStatus) {
		return smallLayout && (assignmentStatus == "Assigned" || canAssign);
	}

	_listNotifyResize() {
		let taskList = this.shadowRoot.querySelector("#taskIronList");
		if (taskList && taskList.items && taskList.items.length > 0) {
			setTimeout(() => taskList.notifyResize(), 300);
		}
	}

	_handleLayoutChange(newValue, oldValue) {
		this._listNotifyResize();
		let sortHeader = this.shadowRoot.querySelector("#sortHeader");
		if (sortHeader) sortHeader.reset();

		if ((oldValue != null || oldValue != undefined) && newValue != oldValue) {
			setTimeout(() => {
				this.scrollContainer = this.shadowRoot.querySelector("#taskIronList");
			}, 1);
		}
	}

	_displayTaskSortHeader(smallLayout, cardLayout) {
		return smallLayout || !cardLayout;
	}
}