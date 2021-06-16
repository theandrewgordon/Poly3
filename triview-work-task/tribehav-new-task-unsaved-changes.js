/* IBM Confidential‌ - OCO Source Materials‌ - (C) COPYRIGHT IBM CORP. 2018 - The source code for this program is not published or otherwise‌ divested of its trade secrets, irrespective of what has been‌ deposited with the U.S. Copyright Office. */
var originalTask;

var unsavedTask = {}

export const TriNewTaskUnsavedChangesBehavior = {
	computeTaskHasUnsavedChanges: function(task) {
		unsavedTask = task;
		if (originalTask && originalTask._id && originalTask._id !== "") {
			return this._computeTaskNameIsChanged() 
				|| this._computePriorityIsChanged()
				|| this._computePrimaryWorkLocationIsChanged()
				|| this._computeRequestClassIsChanged()
				|| this._computeServiceClassIsChanged() 
				|| this._computeDescriptionIsChanged()
		}
		return false;
	},

	isTaskEmpty: function(task,comments) {
		if (task && task._id && task._id !== "") {
			return this._isTaskNameEmpty(task) 
				&& this._isPriorityEmpty(task)
				&& this._isPrimaryWorkLocationEmpty(task)
				&& this._isRequestClassEmpty(task)
				&& this._isServiceClassEmpty(task) 
				&& this._isDescriptionEmpty(task)
				&& this._isCommentEmpty(comments)
		}
		return false;
	},

	setOriginalTask: function(task) {
		var originalTaskString = JSON.stringify(task);
		if (originalTaskString) {
			originalTask = JSON.parse(originalTaskString);
		}
		unsavedTask = {}
	},

	_computeStringWithIdPropertyIsChanged: function(propertyName) {
		var emptyObj = { id: "", value: "" };
		var task = originalTask;

		task[propertyName] = (task[propertyName]) ? task[propertyName] : emptyObj;
		unsavedTask[propertyName] = (unsavedTask[propertyName]) ? unsavedTask[propertyName] : emptyObj
		return (task[propertyName].id !== unsavedTask[propertyName].id) && (task[propertyName].value !== unsavedTask[propertyName].value);
	},

	_computeStringPropertyIsChanged: function(propertyName) {
		var task = originalTask;
		return task[propertyName] !== unsavedTask[propertyName];
	},

	_computeTaskNameIsChanged: function() {
		return this._computeStringPropertyIsChanged("taskName");
	},

	_computePriorityIsChanged: function() {
		return this._computeStringPropertyIsChanged("taskPriority") && this._computeStringPropertyIsChanged("taskPriorityENUS");
	},

	_computePrimaryWorkLocationIsChanged: function() {
		return this._computeStringWithIdPropertyIsChanged("primaryWorkLocationPath");
	},

	_computeRequestClassIsChanged: function() {
		return this._computeStringWithIdPropertyIsChanged("requestClass");
	},

	_computeServiceClassIsChanged: function() {
		return this._computeStringWithIdPropertyIsChanged("serviceClass");
	},

	_computeDescriptionIsChanged: function() {
		return this._computeStringPropertyIsChanged("description");
	},

	_isStringPropertyEmpty: function(property) {
		return property == null || property == "";
	},

	_isStringWithIdPropertyEmpty: function(property) {
		return property == null || this._isStringPropertyEmpty(property.id) || property.id == -1;
	},

	_isTaskNameEmpty: function(task) {
		return this._isStringPropertyEmpty(task.taskName);
	},

	_isPrimaryWorkLocationEmpty: function(task) {
		return this._isStringWithIdPropertyEmpty(task.primaryWorkLocationPath);
	},

	_isRequestClassEmpty: function(task) {
		return this._isStringWithIdPropertyEmpty(task.requestClass);
	},

	_isServiceClassEmpty: function(task) {
		return this._isStringWithIdPropertyEmpty(task.serviceClass);
	},

	_isDescriptionEmpty: function(task) {
		return this._isStringPropertyEmpty(task.description);
	},

	_isPriorityEmpty: function(task) {
		return this._isStringPropertyEmpty(task.taskPriorityENUS);
	},

	_isCommentEmpty: function(comments) {
		return !comments || comments.length == 0;
	},
};