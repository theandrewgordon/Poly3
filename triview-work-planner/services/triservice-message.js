/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { PolymerElement, html } from "../../@polymer/polymer/polymer-element.js";
import "../../triblock-popup/triblock-popup.js";
import "../../triblock-toast/triblock-toast.js";
import "../styles/tristyles-work-planner.js";
import { TrimixinService, getService } from "./trimixin-service.js";

export function getTriserviceMessage() {
	return getService(TriserviceMessage.is);
};

class TriserviceMessage extends TrimixinService(PolymerElement) {
	static get is() { return "triservice-message"; }

	static get template() {
		return html`
			<style include="work-planner-popup-styles tristyles-theme">
			</style>

			<dom-if if="[[_isRootInstance]]">
				<template>
					<triblock-toast id="toastAlert" on-opened-changed="{{_handleToastOpenedChanged}}" allow-click-through></triblock-toast>
					<triblock-popup id="defaultErrorPopup" class="popup-alert" with-backdrop small-screen-max-width="0px">
						<div class="tri-h2 header-warning">Error</div>
						<div class="content">
							<p>An error occurred. Please contact your server administrator.</p>
							<p>You can <a on-tap="_handleRefreshPage">refresh the page</a> or return to the application.</p>
						</div>
						<div class="footer"><paper-button dialog-dismiss>Got it</paper-button></div>
					</triblock-popup>
				</template>
			</dom-if>
		`;
	}

	ready() {
		super.ready();
	}

	openDefaultErrorPopup() {
		if (this._isRootInstance) {
			this.shadowRoot.querySelector("#defaultErrorPopup").open();
		} else {
			this._rootInstance.openDefaultErrorPopup();
		}
	}

	openUnauthorizedAccessToastMessage() {
		if (this._isRootInstance) {
			var __dictionary__unauthorized = "Session timeout or unauthorized access.";
			var __dictionary__title = "Unauthorized";
			this.openToastMessage("error", __dictionary__title, __dictionary__unauthorized);
		} else {
			this._rootInstance.openUnauthorizedAccessToastMessage();
		}
	}

	openChangeNotCompletedToastMessage() {
		if (this._isRootInstance) {
			var __dictionary__error = "The last action is not yet completed so it cannot be undone.";
			var __dictionary__title = "Error";
			this.openToastMessage("error", __dictionary__title, __dictionary__error);
		} else {
			this._rootInstance.openChangeNotCompletedToastMessage();
		}
	}

	openTaskAssignedToastMessage(taskList) {
		if (this._isRootInstance) {
			let message;
			if (taskList.length > 1) {
				var taskLength = taskList.length;
				var __dictionary__multipleTasks = "{1} tasks were assigned.";
				message = __dictionary__multipleTasks.replace("{1}", taskLength);
			} else {
				var taskId=taskList[0].id;
				var __dictionary__oneTask = "Task {1} was assigned.";
				message = __dictionary__oneTask.replace("{1}", taskId);
			}
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openTaskAssignedToastMessage(taskList);
		}
	}

	openUndoTaskAssignmentToastMessage(allocations, taskList) {
		if (this._isRootInstance) {
			let message;
			if (taskList.length > 1) {
				var taskLength = taskList.length;
				var __dictionary__multipleAllocations_multipleTasks = "The assignments were undone for {1} tasks."; 
				var multipleAllocations = __dictionary__multipleAllocations_multipleTasks.replace("{1}", taskLength);
				var __dictionary__singleAllocation_multipleTasks  = "The assignment was undone for {1} tasks.";
				var singleAllocation = __dictionary__singleAllocation_multipleTasks .replace("{1}", taskLength);
				message = allocations.length > 1 ? multipleAllocations : singleAllocation;
			} else {
				var taskId = taskList[0].id;
				var __dictionary__multipleAllocations_singleTask = "The assignments were undone for Task {1}.";
				var multipleAllocations = __dictionary__multipleAllocations_singleTask.replace("{1}",taskId);
				var __dictionary__singleAllocation_singleTask = "The assignment was undone for Task {1}.";
				var singleAllocation = __dictionary__singleAllocation_singleTask.replace("{1}",taskId);
				message = allocations.length > 1 ? multipleAllocations : singleAllocation;
			}
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoTaskAssignmentToastMessage(allocations, taskList);
		}
	}

	openUnassignedPeopleToastMessage(peopleFirstName, taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "{1} was unassigned from Task {2}.";
			var message = __dictionary__message.replace("{1}" ,peopleFirstName).replace("{2}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUnassignedPeopleToastMessage(peopleFirstName, taskID);
		}
	}

	openUndoUnassignedPeopleToastMessage(peopleFirstName, taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "{1}'s unassignment was undone for Task {2}.";
			var message = __dictionary__message.replace("{1}", peopleFirstName).replace("{2}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoUnassignedPeopleToastMessage(peopleFirstName, taskID);
		}
	}

	openAllocatedHoursUpdatedToastMessage(peopleFirstName, taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "{1}'s allocation time for task {2} was updated.";
			var message = __dictionary__message.replace("{1}",peopleFirstName).replace("{2}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openAllocatedHoursUpdatedToastMessage(peopleFirstName, taskID);
		}
	}

	openUndoAllocatedHoursUpdatedToastMessage(peopleFirstName, taskID) {
		if (this._isRootInstance) {
			var __dictionary__undoMessage = "{1}'s time change was undone for Task {2}.";
			var message = __dictionary__undoMessage.replace("{1}", peopleFirstName).replace("{2}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoAllocatedHoursUpdatedToastMessage(peopleFirstName, taskID);
		}
	}

	openAllocatedDateUpdatedToastMessage(peopleFirstName, taskID, multiple) {
		if (this._isRootInstance) {
			let message;
			if (multiple) {
				var __dictionary__message = "The allocation date for task {1} was updated for all assigned members.";
				message = __dictionary__message.replace("{1}", taskID);
			} else {
				var __dictionary__message = "{1}'s date for task {2} was updated.";
				message = __dictionary__message.replace("{1}", peopleFirstName).replace("{2}", taskID);
			}
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openAllocatedDateUpdatedToastMessage(peopleFirstName, taskID, multiple);
		}
	}

	openUndoAllocatedDateUpdatedToastMessage(peopleFirstName, taskID, multiple) {
		if (this._isRootInstance) {
			let message;
			if (multiple) {
				var __dictionary__message = "The date change was undone for all assigned members for Task {1}.";
				message = __dictionary__message.replace("{1}", taskID);
			} else {
				var __dictionary__message = "{1}'s date change was undone for Task {2}.";
				message = __dictionary__message.replace("{1}", peopleFirstName).replace("{2}", taskID);
			}
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoAllocatedDateUpdatedToastMessage(peopleFirstName, taskID, multiple);
		}
	}

	openTaskPriorityUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The priority for Task {1} was updated.";
			var message = __dictionary__message.replace("{1}", taskID)
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openTaskPriorityUpdatedToastMessage(taskID);
		}
	}

	openUndoTaskPriorityUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The priority change was undone for Task {1}.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoTaskPriorityUpdatedToastMessage(taskID);
		}
	}

	openPlannedWorkingHoursUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The time for Task {1} was updated.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openPlannedWorkingHoursUpdatedToastMessage(taskID);
		}
	}

	openUndoPlannedWorkingHoursUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The time change was undone for Task {1}.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoPlannedWorkingHoursUpdatedToastMessage(taskID);
		}
	}

	openCannotAssignTaskWithoutTimeEstimateMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "Task {1} has no time estimate.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("error", null, message);
		} else {
			this._rootInstance.openCannotAssignTaskWithoutTimeEstimateMessage(taskID);
		}
	}
	
	openPlannedStartUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The planned start for Task {1} was updated.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openPlannedStartUpdatedToastMessage(taskID);
		}
	}

	openUndoPlannedStartUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The planned start change was undone for Task {1}.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoPlannedStartUpdatedToastMessage(taskID);
		}
	}

	openPlannedEndUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The planned end for Task {1} was updated.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openPlannedEndUpdatedToastMessage(taskID);
		}
	}

	openUndoPlannedEndUpdatedToastMessage(taskID) {
		if (this._isRootInstance) {
			var __dictionary__message = "The planned end change was undone for Task {1}.";
			var message = __dictionary__message.replace("{1}", taskID);
			this.openToastMessage("success", null, message);
		} else {
			this._rootInstance.openUndoPlannedEndUpdatedToastMessage(taskID);
		}
	}

	openToastMessage(type, title, text) {
		if (this._isRootInstance) {
			if (title != "" || text != "") {
				const alertToast = this.shadowRoot.querySelector("#toastAlert");

				if (alertToast.opened) { alertToast.close(); }

				alertToast.setAttribute("role", "alert");
				alertToast.setAttribute("aria-label", title);
				alertToast.type = type;
				alertToast.title = title;
				alertToast.text = text;

				alertToast.open();
			}
		} else {
			this._rootInstance.openToastMessage(type, title, text);
		}
	}

	_handleToastOpenedChanged(event) {
		if (!event.detail.value) {
			this.$.toastAlert.removeAttribute("role");
		}
	}

	_handleRefreshPage() {
		location.reload();
	}
};

window.customElements.define(TriserviceMessage.is, TriserviceMessage);