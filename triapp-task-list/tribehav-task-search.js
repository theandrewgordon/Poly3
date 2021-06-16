/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2019 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */

import { assertParametersAreDefined } from "../tricore-util/tricore-util.js";

export const TriTaskSearchBehavior = {
	properties: {
		_selectedTaskType: {
			type: String
		},

		_currentUserId: {
			type: String
		}
	},

	_modifyNoPriorityForSorting: function(tasks) {
		if (tasks != null) {
			tasks.forEach(function (task) {
				if (!task.priorityRanking || task.priorityRanking == 0 || task.priorityRanking == "")
					task.priorityRanking = 99999;
			});
		}
	},

	_addLocationToTasks: function(tasks) {
		for (var i = 0; i < tasks.length; i++) {
			var locationPath = tasks[i].primaryWorkLocationPath;
			var type = tasks[i].primaryWorkLocationTypeENUS;
			var location = [];
			var taskWithLocation = [];

			if (locationPath && locationPath.value && locationPath.value !== "" && type !== null && type !== "") {
				let locationString = locationPath.value;
				let locationArray = locationString.trim().split("\\");
				location = this._computeLocationPath(locationArray, type);
			}

			taskWithLocation = location.join(", ");
			tasks[i].computedLocation = taskWithLocation;
		}

		return tasks;
	},

	_computeLocationPath(locationArray, type) {
		let length = locationArray.length;
		let location = [];

		if (type === "Building") {
			location.push((locationArray[length - 1]) ? locationArray[length - 1] : "");
		} else if (type === "Floor") {
			location.push((locationArray[length - 2]) ? locationArray[length - 2] : "");
			location.push((locationArray[length - 1]) ? locationArray[length - 1] : "");
		} else if (type === "Space") {
			location.push((locationArray[length - 3]) ? locationArray[length - 3] : "");
			location.push((locationArray[length - 2]) ? locationArray[length - 2] : "");
			location.push((locationArray[length - 1]) ? locationArray[length - 1] : "");
		} else {
			location.push((locationArray[length - 1]) ? locationArray[length - 1] : "");
		}
		return location;
	},

	_handleTaskFilterChanged: function(taskFilter, serviceReady) {
		if (!assertParametersAreDefined(arguments)) {
			return;
		}

		if (!this._isRootInstance || !serviceReady) {
			return;
		}

		var taskFilterParams = {
			selectedTaskType: "",
			currentUser: false
		};

		switch (taskFilter) {
			case "cm":
				taskFilterParams.selectedTaskType = "Corrective";
				break;

			case "pm":
				taskFilterParams.selectedTaskType = "Preventive";
				break;

			case "created":
				taskFilterParams.currentUser = true;
				break;
		}

		this._setTaskFilterParams(taskFilterParams);
	},

	_setTaskFilterParams: function(taskFilterParams) {
		this._selectedTaskType = taskFilterParams.selectedTaskType;
		this._currentUserId = taskFilterParams.currentUser ? this.currentUser._id : "";
	}
};
